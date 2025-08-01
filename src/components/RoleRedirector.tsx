'use client';

import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

const hirers = ['D3kA2sEg7F2U5wkjN5wQ4zwdE3g4F2UtgqKD5q211LZb'];
const freelancers = ['vM6Xvy4XBZyLNWK9kBLgiRf4YaEQsFu2XDiWJ4PRkqJ'];

export default function RoleRedirector() {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) return;

    const wallet = publicKey.toBase58();

    if (hirers.includes(wallet)) {
      router.push('/dashboard/hirer');
    } else if (freelancers.includes(wallet)) {
      router.push('/dashboard/freelancer');
    } else {
      alert('Wallet not registered. Please contact admin.');
    }
  }, [publicKey, router]);

  return null;
}
