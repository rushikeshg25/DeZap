'use client';
import { shrinkDown } from '@/lib/utils';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { WalletIcon } from '@solana/wallet-adapter-react-ui';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { HeaderLayout } from './header';
import Icon from './ui/icon';
import {useRouter} from "next/navigation";

const Appbar = () => {	 
	const router=useRouter();
  const { walletIcon, walletName } = useWalletMultiButton({
    onSelectWallet() {},
  });
  const session = useSession();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (isCopied) return;
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
    navigator.clipboard.writeText(session.data!.user.publicKey);
  };

  const handleSignout = async () => {
    try {
      localStorage.removeItem('walletName');
       await signOut({ redirect:false}); 
      router.push("/")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HeaderLayout>
      {session && session.data && (
        <div className='flex gap-5'>
          <button
            className='gap-2 items-center  group inline-flex h-10 w-max  justify-center rounded-sm bg-[#1a1d2d] px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 '
            onClick={handleCopy}
          >
            {walletIcon && walletName && (
              <WalletIcon
                className='size-5'
                wallet={{ adapter: { icon: walletIcon, name: walletName } }}
              />
            )}
            {shrinkDown(session.data.user.publicKey)}
            {!isCopied && <Icon icon='copy' className='text-primary/70' />}
            {isCopied && <Icon icon='check' className='text-green-400' />}
          </button>

          <button
            onClick={handleSignout}
            className='group inline-flex h-10 w-max items-center justify-center rounded-sm bg-[#1a1d2d] px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 '
          >
            Disconnect
          </button>
        </div>
      )}
    </HeaderLayout>
  );
};

export { Appbar };
