import { SideNav } from '@/components/SideNav';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-base bg-gradient flex-1 grid grid-cols-[max-content_1fr] w-full overflow-hidden">
      <SideNav />
      {children}
    </div>
  );
}
