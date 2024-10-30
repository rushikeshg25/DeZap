import type { Wallet } from '@solana/wallet-adapter-react';
import { WalletIcon } from '@/components/WalletIcon';
import type {
  MouseEventHandler,
  CSSProperties,
  FC,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
} from 'react';
import React from 'react';

export interface WalletListItemProps {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  wallet: Wallet;
}

export const WalletMenuItem: FC<WalletListItemProps> = ({
  handleClick,
  tabIndex,
  wallet,
}) => {
  return (
    <li>
      <Button
        onClick={handleClick}
        startIcon={<WalletIcon wallet={wallet} />}
        tabIndex={tabIndex}
      >
        {wallet.adapter.name}
      </Button>
    </li>
  );
};

export type ButtonProps = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  endIcon?: ReactElement;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  startIcon?: ReactElement;
  style?: CSSProperties;
  tabIndex?: number;
}>;

export const Button: FC<ButtonProps> = (props) => {
  return (
    <button
      className={`wallet-adapter-button ${props.className || ''}`}
      disabled={props.disabled}
      style={props.style}
      onClick={props.onClick}
      tabIndex={props.tabIndex || 0}
      type='button'
    >
      {props.startIcon && (
        <i className='wallet-adapter-button-start-icon'>{props.startIcon}</i>
      )}
      {props.children}
      {props.endIcon && (
        <i className='wallet-adapter-button-end-icon'>{props.endIcon}</i>
      )}
    </button>
  );
};
