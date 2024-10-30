import { Appbar } from '@/components/Appbar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-base bg-gradient flex flex-col min-h-screen">
      <Appbar />
      {children}
    </div>
  );
}
