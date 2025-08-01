'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';
import type { UserRole } from '@/context/UserContext';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setUserRole } = useUserContext();

  const handleRoleSelect = (role: Exclude<UserRole, null>) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    router.push(role === 'hirer' ? '/dashboard/hirer' : '/dashboard/freelancer');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Select Your Role</h1>
      <p className="text-gray-400 mb-6">Are you here to hire or freelance?</p>
      <div className="space-y-4">
        <button
          onClick={() => handleRoleSelect('hirer')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
        >
          I&apos;m a Hirer
        </button>
        <button
          onClick={() => handleRoleSelect('freelancer')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
        >
          I&apos;m a Freelancer
        </button>
      </div>
    </main>
  );
}
