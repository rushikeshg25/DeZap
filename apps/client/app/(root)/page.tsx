'use client';

import { HeaderLayout } from '@/components/header';
import { Logo } from '@/components/Logo';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const panels = [
  { name: 'TVL', count: '$605.5M' },
  { name: 'Streams', count: '120,000' },
  { name: 'Clients', count: '100+' },
];

const overview = [
  {
    title: 'Dashboard',
    desc: 'Get a comprehensive view of your token contracts, connected and enabling community monitoring. Access insights through an intuitive interface, ensuring alignment with real-time data.',
    img: 'dashboard.png',
  },
  {
    title: 'Airdrops',
    desc: `Effortlessly distribute tokens to empower your project's outreach and ensure seamless community engagement. Upload CSV files or select from existing communities of holders with ease.`,
    img: 'airdrop.jpeg',
  },
  {
    title: 'Token Lock',
    desc: 'Safeguard your assets seamlessly with Streamflow. Whether for employee unlocks or securing liquidity pool tokens, our system offers both peace of mind and unparalleled protection.',
    img: 'spltoken.jpeg',
  },
  {
    title: 'Stream Payments',
    desc: 'Streamline your onboarding process and minimize payroll expenses with our programmable payments. Choose from weekly, bi-weekly, or monthly payments, or enable real-time withdrawals for maximum flexibility.',
    img: 'stream.jpeg',
  },
  {
    title: 'Token Mint',
    desc: `Customize token attributes and mint batches quickly and securely. Our intuitive platform ensures seamless integration into your project's ecosystem, empowering you to bring your digital assets to life with ease.`,
    img: 'mint.png',
  },
  {
    title: 'Token Vesting',
    desc: 'Simplify token vesting for scheduled stakeholder distributions with our advanced features like customizable schedules, ,transferable payments, and automated claims.',
    img: 'vesting.png',
  },
];

export default function Landing() {
  return (
    <div className='dark'>
      <Header />
      <main className='bg-base bg-gradient'>
        <Section
          className='pb-0 px-4'
          heading={
            <>
              <Link
                href='https://github.com/praashh/streamchain'
                target='_blank'
                className='flex items-center justify-center justify-self-center gap-3 rounded-full bg-[#1a1d2d] py-3 px-4 flex-wrap flex-row text-center font-bold text-sm'
              >
                <Icon icon='sparkle' color='#ffac30' size={16} />
                Star us on Github
              </Link>
              <h1 className='text-5xl font-semibold'>
                Real-Time Blockchain Alerts
              </h1>
            </>
          }
          description='Monitor blockchain transactions with real-time alerts, track SPL tokens, airdrops, and NFTs, and securely manage your assets.'
        >
          <LaunchApp className='px-5 py-3 text-lg' />
          <div className='flex gap-4 items-center justify-self-center mt-4'>
            <p>Live on</p>
            <Image src={'/solana.svg'} width={42} height={42} alt='Solana' />
            Solana Blockchain
          </div>
          <div>
            <Image
              unoptimized={true}
              src={'/DeZap.gif'}
              alt='Hero'
              width={1280}
              height={568}
              className='mt-[86px] rounded-t-xl  border-t border-l border-r
              '
            />
          </div>
        </Section>
      </main>
      <div className='bg-[#121424] py-6'>
        <div className='grid grid-cols-[auto_max-content_auto_max-content_auto] max-w-screen-md mx-auto py-10'>
          {panels.map((panel, idx) => (
            <Panel
              key={idx}
              name={panel.name}
              count={panel.count}
              lastElem={idx === panels.length - 1}
            />
          ))}
        </div>
      </div>
      <div className='bg-[#1a1d2d]'>
        <Section
          className='pt-32'
          heading={
            <>
              <h2 className='text-brand-secondary text-2xl font-bold text-center'>
                Overview
              </h2>
              <h1 className='text-4xl font-semibold'>
                What Can You Achieve with StreamChain?
              </h1>
            </>
          }
          description={
            "StreamChain offers powerful tools to easily monitor and manage blockchain transactions. Whether you're a crypto enthusiast, NFT collector, or business in Web3, our platform supports SPL tokens, airdrops, and NFTs with real-time alerts and secure, no-code asset management."
          }
        >
          <div className='grid grid-cols-2 gap-16 mt-32'>
            {overview.map((feat) => (
              <Features
                key={feat.title}
                title={feat.title}
                desc={feat.desc}
                img={feat.img}
              />
            ))}
          </div>
          <div className='mt-20 grid gap-4'>
            <h2 className='text-primary font-bold text-2xl text-center'>
              Ready to start using our services?
            </h2>
            <LaunchApp className='px-5 py-3 text-lg' />
          </div>
        </Section>
      </div>
      <footer className='text-primary px-12 pt-20 pb-12 bg-[#050505] grid gap-2 justify-items-center'>
        <p className='flex items-center gap-1 text-xs'>
          Made with <Icon icon='heart' color='#7187FF' size={16} /> for solana community.
        </p>
        <p className='flex items-center gap-1 text-xs'>
          <Icon icon='copyright' size={14} /> 2024 StreamChain.
        </p>
      </footer>
    </div>
  );
}

const Header = () => {
  return (
    <HeaderLayout>
      <LaunchApp />
    </HeaderLayout>
  );
};

const Panel = ({
  name,
  count,
  lastElem,
}: {
  name: string;
  count: string;
  lastElem: boolean;
}) => {
  return (
    <>
      <div>
        <h3 className='text-gray-400 text-center text-lg font-bold pt-8 lg:pt-0'>
          {name}
        </h3>
        <h1 className='text-white text-3xl xl:text-4xl font-bold text-center pt-2'>
          {count}
        </h1>
      </div>
      {!lastElem && <div className='w-0.5 h-full bg-muted' />}
    </>
  );
};

const Features = ({
  title,
  desc,
  img,
}: {
  title: string;
  desc: string;
  img: string;
}) => {
  return (
    <div className='grid justify-items-start'>
      <Image
        src={`/${img}`}
        alt={'vesting'}
        width={550}
        height={550}
        className='rounded-xl'
      />
      <h2 className='text-2xl font-bold pb-4 mt-8 text-primary'>{title}</h2>
      <h3 className='max-w-[360px] text-graylight text-base whitespace-pre-line text-left text-primary/90'>
        {desc}
      </h3>
    </div>
  );
};

const LaunchApp: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  return (
    <Link href={'/app'}>
      <Button
        className={cn(
          'bg-brand hover:bg-brand/90 px-2 py-2 font-semibold text-base items-center rounded hover:opacity-70 text-primary',
          className
        )}
        {...props}
      >
        Launch App
      </Button>
    </Link>
  );
};
