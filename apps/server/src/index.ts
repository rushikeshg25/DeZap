import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { addUserToWebHook } from './util/addUserToWebHook';
import { pushNotificationInQueue, UserActivityDetailsType } from './queue';
import dotenv from 'dotenv';
import prisma from '@repo/db';
import { Prisma } from '@repo/db/types';
import { getData } from './util/getActivityData';
import cors from 'cors';
import { getMetadata } from './util/getMetaData';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN || 'http://localhost:3002',
  })
);
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Map<string, WebSocket>();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthy', (req: Request, res: Response) => {
  res.send('working');
});

app.get('/get-metadata', async (req, res) => {
  const { mintAddress } = req.body;

  if (!mintAddress) {
    return res.status(400).json({ error: 'mintAddress is required' });
  }

  try {
    const metadata = await getMetadata(mintAddress);
    return res.status(200).json({ metadata });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

app.post('/new-user', async (req: Request, res: Response) => {
  const requestBody = req.body;
  const publicKey = requestBody.publicKey;
  try {
    const userChannel = await addUserToWebHook(publicKey);
    return res.status(200).json({ msg: 'done' });
  } catch (error) {
    return res.status(500).json({ msg: 'Internal Server Error!' });
  }
});

app.post('/webhook', async (req: Request, res: Response) => {
  const requestBody = req.body;

  try {
    const data = await getData(requestBody);
    if (!data) {
      return res.status(500).json({ msg: 'Internal Server Error!' });
    }
    const {
      transactionDataSender,
      transactionDataReciever,
      dbType,
      signature,
      token,
    } = data;

    const senderExists = prisma.user.findUnique({
      where: { publicKey: transactionDataSender.primaryPubKey },
    });
    const receiverExists = prisma.user.findUnique({
      where: { publicKey: transactionDataReciever.primaryPubKey },
    });

    const [sender, receiver] = await Promise.all([
      senderExists,
      receiverExists,
    ]);

    if (sender) {
      await pushNotificationInQueue('email', transactionDataSender);
    }

    if (receiver) {
      await pushNotificationInQueue('email', transactionDataReciever);
    }

    const txnArray = [sender, receiver];
    txnArray.forEach(async (txn) => {
      if (txn) {
        const transaction: Prisma.TransactionHistoryCreateInput = {
          user: {
            connect: { id: txn.id },
          },
          amount: transactionDataSender.transactionData.amount,
          signature,
          transactionType: dbType,
          transactionData:
            txn.publicKey === transactionDataSender.primaryPubKey
              ? transactionDataSender.transactionData
              : transactionDataReciever.transactionData,
          Token: token
            ? {
                create: {
                  name: token.name,
                  symbol: token.symbol,
                  decimals: token.decimals,
                },
              }
            : undefined,
        };

        await prisma.transactionHistory.create({
          data: transaction,
        });
      }
    });

    const senderClient = clients.get(transactionDataSender.primaryPubKey);
    const receiverClient = clients.get(transactionDataReciever.primaryPubKey);
    if (senderClient && senderClient.readyState === WebSocket.OPEN) {
      senderClient.send(JSON.stringify(transactionDataSender.transactionData));
    }
    if (receiverClient && receiverClient.readyState === WebSocket.OPEN) {
      receiverClient.send(
        JSON.stringify(transactionDataReciever.transactionData)
      );
    }

    return res.status(200).json({ msg: 'Webhook processed' });
  } catch (error) {
    return res.status(500).json({ msg: 'Internal Server Error!' });
  }
});

wss.on('connection', (ws, req) => {
  console.log('Client connected');

  const userId = new URLSearchParams(req.url!.substring(1)).get('userId');

  if (userId) {
    clients.set(userId, ws);
    console.log(`Client added for userId: ${userId}`);
  }

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send(`You sent: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (userId) {
      clients.delete(userId);
      console.log(`Client removed for userId: ${userId}`);
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
    ws.send(`Error occurred: ${error}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
