import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletButton: React.FC = () => {
  const { wallet } = useWallet();

  return (
    <div className="wallet-adapter-button-wrapper">
      <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600 !rounded-lg" />
    </div>
  );
};