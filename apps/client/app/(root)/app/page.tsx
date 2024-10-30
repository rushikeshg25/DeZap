'use client';
import { Feature } from '@/components/Fearture';
import LoadingScreen from '@/components/LoadingScreen';
import Flow from '@/components/Lottie-flow';
import { Section } from '@/components/Section';
import { HoverBorderGradient } from '@/components/ui/animated-button';
import { WalletLoginButton } from '@/components/WalletLoginButton';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';
import styles from './header.module.css';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { SigninMessage } from '@/lib/SigninMessage';
import bs58 from 'bs58';
import { useEffect } from 'react';
import axios from 'axios';

const features: { bold: string; normal: string; boldFirst: boolean }[] = [
  { bold: 'Free forever', normal: 'for core features', boldFirst: true },
  { bold: 'More apps', normal: 'than any other platform', boldFirst: true },
  { bold: 'AI features', normal: 'Cutting-edge', boldFirst: false },
];
const WalletConnect = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const walletModal = useWalletModal();

  const walletConnect = useCallback(async () => {
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
      }

      const csrf = await getCsrfToken();
      if (!wallet.publicKey || !csrf || !wallet.signMessage) return;

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await wallet.signMessage(data);
      const serializedSignature = bs58.encode(signature);

      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
    } catch (error) {
      console.log(error);
    }
  }, [wallet, walletModal]);

  useEffect(() => {
    const authHelper = async () => {
      if (session?.user.publicKey) {
        setLoading(true);
        const reponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/new-user`,
          {
            publicKey: session.user.publicKey,
          }
        );
        if (reponse.statusText === 'OK') {
          console.log(reponse);
          router.push('/app/dashboard');
        } else {
          toast({ title: 'Error signing in. Please try again.' });
        }
        setLoading(false);
      }
    };
    authHelper();
  }, [router, session?.user.publicKey, toast]);

  useEffect(() => {
    if (wallet.connected) {
      walletConnect();
    }
  }, [wallet.connected, walletConnect]);

  const handleSignIn = useCallback(async () => {
    if (!wallet.connected) {
      console.log('first');
      walletModal.setVisible(true);
    }
  }, [wallet, walletModal]);

  return (
    <>
      <main className='grid bg-pattern contain-layout grow '>
        <Image
          src={'/pattern.png'}
          alt='background pattern'
          width={700}
          height={626}
          className='absolute -z-10 left-1/2 -top-14 md:left-[60%]'
        />
        <Section
          className='flex flex-col gap-4 pb-10'
          heading={
            <>
              <div className='flex items-center justify-center justify-self-center gap-1 rounded-lg md:rounded-full bg-[#1a1d2d] py-2 px-3 flex-wrap flex-col md:flex-row text-center text-xs w-fit mx-auto'>
                Supported network:{' '}
                <Image src='/solana.svg' alt='Solana' width={20} height={20} />
                Solana
              </div>
              <h1 className='text-3xl font-semibold'>Connect Crypto Wallet</h1>
            </>
          }
          description={
            <p className='px-8 mx-auto text-base text-primary/60'>
              Connect your crypto wallet to start using the app.
            </p>
          }
        >
          <div className='grid w-4/5 grid-flow-col grid-cols-3 mx-auto'>
            <HoverBorderGradient
              containerClassName='rounded-full w-full col-start-2'
              as='div'
              className='bg-button  text-white flex items-center justify-center py-1.5 px-6 h-auto text-lg w-full'
            >
              <WalletLoginButton
                onClick={walletConnect}
                buttonlabel='Connect Wallet'
                //@ts-ignore
                address={session?.user.publicKey || ''}
              />
            </HoverBorderGradient>
          </div>
          <Flow />
          <div className='flex gap-4 mx-auto mt-auto'>
            {features.map((feat) => (
              <Feature
                key={feat.bold}
                bold={feat.bold}
                normal={feat.normal}
                boldFirst={feat.boldFirst}
              />
            ))}
          </div>
        </Section>
      </main>
      <LoadingScreen isLoading={loading} />
    </>
  );
};

export default WalletConnect;
