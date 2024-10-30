import { getTransactionByType } from '@/actions/transaction';
import Dashboard from '@/components/Transactions';
import { auth } from '@/lib/auth';

const Page = async () => {
  const session = await auth();
  const txn = await getTransactionByType('NFT', session?.user.id!);

  return (
    <Dashboard
      title='NFT Transfer'
      emptySateMessage='No NFT transaction yet'
      txn={txn}
    />
  );
};

export default Page;


