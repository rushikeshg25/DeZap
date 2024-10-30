import { Logo } from '@/components/Logo';
import { ReactNode } from 'react';

export const HeaderLayout: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <header className="flex z-10  justify-between bg-[#000109] p-5 gap-5 border-b border-b-[#1A1D2D]">
      <Logo />
      {children}
    </header>
  );
};
