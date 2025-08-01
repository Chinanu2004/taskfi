'use client';

import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';

export default function SelectRole() {
  const router = useRouter();
  const { publicKey } = useWallet();

  const handleSelect = (role: string) => {
    if (publicKey) {
      localStorage.setItem(publicKey.toString(), role);
      router.push(role === 'hirer' ? '/dashboard/hirer' : '/dashboard/freelancer');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
      <div className="space-x-4">
        <button
          onClick={() => handleSelect('hirer')}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          I’m a Hirer
        </button>
        <button
          onClick={() => handleSelect('freelancer')}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          I’m a Freelancer
        </button>
      </div>
    </div>
  );
}
