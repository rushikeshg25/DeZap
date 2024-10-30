import { getTransactionByType } from '@/actions/transaction';
import Dashboard from '@/components/Transactions';
import { auth } from '@/lib/auth';

const Page = async () => {
  const session = await auth();
  const txn = await getTransactionByType('AIRDROP', session?.user.id!);

  return (
    <Dashboard
      title='Sol Transfer'
      emptySateMessage='No SOL transaction yet'
      txn={txn}
    />
  )
};

export default Page;
