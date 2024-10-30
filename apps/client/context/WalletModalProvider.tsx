import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';
import { WalletModalContext } from '@/hooks/useWalletModal';
import { WalletModal } from '@/components/WalletModal';

export interface WalletModalProviderProps {
  children: ReactNode;
}

export const WalletModalProvider: FC<WalletModalProviderProps> = ({
  children,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <WalletModalContext.Provider
      value={{
        visible,
        setVisible,
        loading,
        setLoading,
      }}
    >
      {children}
      {visible && <WalletModal {...props} />}
    </WalletModalContext.Provider>
  );
};
