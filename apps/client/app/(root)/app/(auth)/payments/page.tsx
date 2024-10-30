import { getTransactionByType } from '@/actions/transaction';
import Dashboard from '@/components/Transactions';
import { auth } from '@/lib/auth';

const Page = async () => {
  const session = await auth();
  const txn = await getTransactionByType('ALL', session?.user.id!);

  return (
    <Dashboard
      title='Transfer'
      emptySateMessage='No transaction yet'
      txn={txn}
    />
  );
};

export default Page;


