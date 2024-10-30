import { TransactionType } from '@repo/db/types';
import { UserActivityDetailsType } from '../queue';
import { getMetadata } from './getMetaData';
import { lamportsToSol } from './convertoSOL';

type getDataTypeProps = {
  type: string;
  source: string;
  token?: boolean;
};

function getDbType({ type, source, token = false }: getDataTypeProps) {
  if (type === 'TRANSFER' && !token) return TransactionType.AIRDROP;
  else if (type === 'TRANSFER' && token && source === 'SOLANA_PROGRAM_LIBRARY')
    return TransactionType.SPL_TOKEN;
  else if (type.startsWith('NFT') && token) {
    return TransactionType.NFT;
  } else {
    return TransactionType.PAYMENT;
  }
}

function getActivityDataForSOL(data: any) {
  const { signature, fee, source, feePayer, type } = data;
  const accountDataTrans = data.accountData;
  const totalSentLamp = accountDataTrans[0].nativeBalanceChange;
  const sentLamp = totalSentLamp + fee;

  const senderAdd = accountDataTrans[0].account;
  const receiverAdd = accountDataTrans[1].account;

  const transactionDataSender: UserActivityDetailsType = {
    primaryPubKey: feePayer,
    transactionData: {
      amount: Math.abs(sentLamp),
      secondaryPubkey: receiverAdd,
      TransferType: type,
      transactionLink: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      message: `You ${type} ${lamportsToSol(Math.abs(sentLamp))} SOL to ${receiverAdd}`,
    },
  };

  const transactionDataReciever: UserActivityDetailsType = {
    primaryPubKey: receiverAdd,
    transactionData: {
      amount: Math.abs(sentLamp),
      secondaryPubkey: feePayer,
      TransferType: type,
      transactionLink: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      message: `${feePayer} ${type} ${lamportsToSol(Math.abs(sentLamp))} SOL to you`,
    },
  };

  const dbType = getDbType({ type, source });
  return {
    transactionDataReciever,
    transactionDataSender,
    dbType,
    signature,
    token: null,
  };
}

async function getActivityDataForToken(data: any) {
  const {
    signature,
    fromUserAccount,
    toUserAccount,
    tokenAmount,
    source,
    type,
  } = data;

  const {
    symbol,
    name,
    mint: { decimals },
  } = await getMetadata(data.mint);
  const token = { symbol, name, decimals };
  const transactionDataSender: UserActivityDetailsType = {
    primaryPubKey: fromUserAccount,
    transactionData: {
      amount: Math.abs(tokenAmount),
      secondaryPubkey: toUserAccount,
      TransferType: type,
      transactionLink: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      message: `You ${type} ${Math.abs(tokenAmount)} ${symbol} to ${toUserAccount}`,
    },
  };

  const transactionDataReciever: UserActivityDetailsType = {
    primaryPubKey: toUserAccount,
    transactionData: {
      amount: Math.abs(tokenAmount),
      secondaryPubkey: fromUserAccount,
      TransferType: type,
      transactionLink: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      message: `${fromUserAccount} ${type} ${Math.abs(tokenAmount)} ${symbol} to you`,
    },
  };
  const dbType = getDbType({ type, source, token: true });

  return {
    transactionDataReciever,
    transactionDataSender,
    dbType,
    signature,
    token,
  };
}

export async function getData(requestBody: any) {
  try {
    if (requestBody[0].tokenTransfers.length > 0) {
      let data = {
        ...requestBody[0],
        ...requestBody[0].tokenTransfers[0],
      };

      return await getActivityDataForToken(data);
    } else {
      return getActivityDataForSOL(requestBody[0]);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
