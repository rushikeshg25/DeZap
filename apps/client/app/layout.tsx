import './globals.css';
import type { Metadata } from 'next';
import { Roboto_Mono as FontSans } from 'next/font/google';
import Provider from './_provider';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config/siteConfig';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn('min-h-screen font-sans antialiased', fontSans.variable)}
      >
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
