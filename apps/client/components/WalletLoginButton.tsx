import React from 'react';
import { ReactNode } from 'react';

export type AuthButtonProps = {
  buttonlabel?: string;
  buttonBackground?: string;
  address: string;
  onClick?: () => void;
  customButton?: (buttonlabel: string, onClick?: () => void) => ReactNode;
};

export function WalletLoginButton({
  buttonlabel = 'Connect',
  buttonBackground,
  customButton,
  onClick,
  address,
}: AuthButtonProps) {
  const renderButton = () => {
    return customButton ? (
      customButton(buttonlabel, onClick)
    ) : (
      <button
        style={{ backgroundColor: buttonBackground }}
        className='buttonContainer'
        onClick={onClick}
      >
        {buttonlabel}
      </button>
    );
  };
  const renderAvatar = () => {
    return (
      <div className='avatarContainer'>
        <p className='address' title={address}>
          {address.slice(0, 5)}...
          {address.slice(address.length - 5, address.length)}
        </p>
      </div>
    );
  };
  return (
    <div>{!address || address === '' ? renderButton() : renderAvatar()}</div>
  );
}
