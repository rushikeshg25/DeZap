import { Metadata } from 'next';

const TITLE = 'StreamChain - Stream your transaction with notification';
const DESCRIPTION =
  'StreamChain is a platform that allows you to airdrop and streamflow on Solana. It is a web3 application that allows you to airdrop and Stream on Solana.';

const BASE_URL = '';

export const siteConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
  },
  applicationName: 'StreamChain',
  creator: '100XEngineers',

  category: 'Blockchain',
  alternates: {
    canonical: BASE_URL,
  },
  keywords: [
    'StreamChain',
    'Solana',
    'Airdrop',
    'StreamFlow',
    'solana transaction',
    'solana airdrop',
    'solana streamflow',
    'web3',
  ],
  metadataBase: new URL(BASE_URL),
};
