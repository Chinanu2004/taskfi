// src/components/LogoutButton.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { disconnect } = useWallet();
  const router = useRouter();

  const handleLogout = async () => {
    await disconnect();
    localStorage.clear();
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
