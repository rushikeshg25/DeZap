'use client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSocket } from '@/hooks/useSokcet';
import { LuTv } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export const UserRealTimeUpdate = () => {
  const { data } = useSession();
  const [isLive, setIsLive] = useState(false);

  const { transactionActivity, connect, disconnect, isConnected } = useSocket(
    data?.user.publicKey!
  );
  const handleConnect = () => {
    connect();
    setIsLive(true);
  };
  const handleDisconnect = () => {
    disconnect();
    setIsLive(false);
  };

  return (
    <div className='p-5'>
      <div className='flex justify-around items-center w-full mb-10'>
        <h1 className='md:text-lg'>Stream Your Transaction</h1>
        <div>
          {isLive && isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className='bg-red-600 text-white flex items-center justify-center gap-2 px-2 py-1 text-center font-bold text-md w-44 rounded-full'
            >
              <LuTv />
              <span>STREAMING</span>
            </motion.div>
          )}
        </div>
        <div>
          {!isConnected ? (
            <Button
              variant={'outline'}
              onClick={handleConnect}
              className='w-48'
            >
              Connect
            </Button>
          ) : (
            <Button
              variant={'destructive'}
              className='w-48'
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          )}
        </div>
      </div>
      <Table className='border-spacing-0 border'>
        <TableHeader className='sticky top-0 bg-white/10 text-cyan-400'>
          <TableRow>
            <TableHead className='h-12 px-2 py-[10px] text-left align-middle font-bold text-[14px] leading-[24px] min-w-[100px] w-[unset]'>
              <div className='flex gap-1 flex-row items-center justify-start flex-nowrap'>
                Message
              </div>
            </TableHead>
            <TableHead className='h-12 px-2 py-[10px] text-left align-middle font-bold text-[14px] leading-[24px] min-w-[150px] w-[150px]'>
              <div className='flex gap-1 flex-row items-center justify-start flex-nowrap'>
                Transer Type
              </div>
            </TableHead>
            <TableHead className='h-12 px-2 py-[10px] text-left align-middle font-bold text-[14px] leading-[24px] min-w-[40px] w-[80px]'>
              <div className='flex gap-1 flex-row items-center justify-start flex-nowrap'>
                Link
              </div>
            </TableHead>
            <TableHead className='h-12 px-2 py-[10px] text-left align-middle font-bold text-[14px] leading-[24px] min-w-[100px] w-[100px]'>
              <div className='flex gap-1 flex-row items-center justify-start flex-nowrap'>
                Result
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionActivity.map((data: any, index: any) => {
            console.log('Processing message:', data);
            let transactionData;
            try {
              // If msg is a string, parse it
              transactionData =
                typeof data === 'string' ? JSON.parse(data) : data;
              console.log('transactionData', transactionData);
            } catch (error) {
              console.error('Error parsing transaction data:', error);
              return <li key={index}>Error parsing message</li>;
            }
            return (
              <TableRow key={index}>
                <TableCell className=' h-12 px-2 py-[10px] align-middle text-[14px] leading-[24px] font-normal'>
                  {transactionData.message}
                </TableCell>
                <TableCell className=' h-12 px-2 py-[10px] align-middle text-[14px] leading-[24px] font-normal'>
                  {transactionData.TransferType}
                </TableCell>
                <TableCell className=' h-12 px-2 py-[10px] align-middle text-[14px] leading-[24px] font-normal'>
                  <Link
                    href={transactionData.transactionLink}
                    className='text-blue-400 underline'
                  >
                    view
                  </Link>
                </TableCell>
                <TableCell className=' h-12 px-2 py-[10px] align-middle text-[14px] leading-[24px] font-normal'>
                  <span className='bg-green-800 rounded-lg p-0.5 px-1.5'>
                    success
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
