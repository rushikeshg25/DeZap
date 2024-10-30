'use server';

import { TransactionType } from '@repo/db/types';
import prisma from '@repo/db';

export type Transaction = TransactionType | "ALL";

export const getTransactionByType = async (type:Transaction, userId:string) => {
  try {
    
    const txn = await prisma.transactionHistory.findMany({
      where: {
        transactionType: type === "ALL" ? undefined :type,
        userId
      },
    });
    return txn;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export type TransactionReturnType = Awaited<ReturnType<typeof getTransactionByType>>;