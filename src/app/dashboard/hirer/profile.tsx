// /app/dashboard/freelancer/profile.tsx
'use client'

import WalletVerifyButton from '@//components/WalletVerifyButton'

export default function HirerProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hirer Profile Settings</h1>
      
      {/* Add this component */}
      <WalletVerifyButton />
    </div>
  )
}
