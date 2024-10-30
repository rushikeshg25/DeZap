import { TransactionReturnType } from '@/actions/transaction';
import { Copy } from '@/components/Copy';
import { RefreshButton } from '@/components/RefreshButton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

interface DashboardProps {
  title: string;
  emptySateMessage: string;
  txn: TransactionReturnType;
}
const Dashboard = ({ title, emptySateMessage, txn }: DashboardProps) => {
  const tableHeader = [
    {
      value: 'Signature',
      minWidth: '100px',
      width: 'unset',
    },
    {
      value: 'Transfer Type',
      minWidth: '150px',
      width: '150px',
    },
    {
      value: 'Description',
      minWidth: '150px',
      width: 'unset',
    },
    {
      value: 'Link',
      minWidth: '40px',
      width: '80px',
    },
    {
      value: 'Result',
      minWidth: '100px',
      width: '100px',
    },
  ];
  return (
    <div className='flex flex-1'>
      <div className='p-2 md:p-10 flex flex-col flex-1 w-full h-full'>
        <div className='flex justify-between my-2'>
          <p>{title}</p>
          <RefreshButton />
        </div>
        <Table className='border-spacing-0 border'>
          {txn.length === 0 && <TableCaption>{emptySateMessage}</TableCaption>}
          <TableHeader className='sticky top-0 bg-white/10 text-cyan-400'>
            <TableRow>
              {tableHeader.map((thead) => (
                <TableHead
                  key={thead.value}
                  className={`h-12 px-2 py-[10px] text-left align-middle font-bold text-[14px] leading-[24px] min-w-[${thead.minWidth}] w-[${thead.width}]`}
                >
                  <div className='flex gap-1 flex-row items-center justify-start flex-nowrap'>
                    {thead.value}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {txn.map((t: any) => {
              const transaction =
                typeof t.transactionData === 'string'
                  ? JSON.parse(t.transactionData)
                  : t.transactionData;
              return (
                <TableRow key={t.id}>
                  <TableCell className='h-12 px-2 py-[10px] align-middle text-[14px] leading-[24px] font-normal'>
                    <div className='flex gap-1 flex-row items-center justify-start flex-nowrap'>
                      <div className='grid gap-1 items-center grid-flow-col'>
                        <Copy value={t.signature} />
                        <p className='inline-block text-center truncate'>
                          {t.signature}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='h-12 px-2 py-[10px] align-middle text-[14px] leading-[24px] font-normal'>
                    {transaction.TransferType}
                  </TableCell>
                  <TableCell className='h-12 px-2 py-[10px] align-middle text-[14px] leading-[24px] font-normal'>
                    {transaction.message}
                  </TableCell>
                  <TableCell className='h-12 px-2 py-[10px] align-middle text-[14px] leading-[24px] font-normal'>
                    <Link
                      href={transaction.transactionLink}
                      className='text-blue-400 underline'
                    >
                      view
                    </Link>
                  </TableCell>
                  <TableCell className='h-12 px-2 py-[10px] align-middle text-[14px] leading-[24px] font-normal'>
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
    </div>
  );
};

export default Dashboard;
