'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

export default function WalletInfo() {
  const { publicKey } = useWallet();

  const shortAddress = useMemo(() => {
    if (!publicKey) return null;
    const base58 = publicKey.toBase58();
    return `${base58.slice(0, 4)}...${base58.slice(-4)}`;
  }, [publicKey]);

  return (
    <div className="text-sm text-gray-300 mt-4">
      {publicKey ? (
        <p>Connected Wallet: <span className="font-mono text-white">{shortAddress}</span></p>
      ) : (
        <p>No wallet connected</p>
      )}
    </div>
  );
}
