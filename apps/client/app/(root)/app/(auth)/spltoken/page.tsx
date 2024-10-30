import { getTransactionByType } from '@/actions/transaction';
import Dashboard from '@/components/Transactions';
import { auth } from '@/lib/auth';

const Page = async () => {
  const session = await auth();
  const txn = await getTransactionByType('SPL_TOKEN', session?.user.id!);

  return (
    <Dashboard
      title='SPL Transfer'
      emptySateMessage='No SPL transaction yet'
      txn={txn}
    />
  );
};

export default Page;

