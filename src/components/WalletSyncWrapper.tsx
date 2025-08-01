'use client';

import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { syncWalletVerification } from '@/lib/walletVerificationSync';

export function WalletSyncWrapper({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();

  useEffect(() => {
    if (wallet?.publicKey) {
      const address = wallet.publicKey.toBase58();
      syncWalletVerification(address);
    }
  }, [wallet?.publicKey]);

  return <>{children}</>;
}
