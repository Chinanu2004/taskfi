// /components/AuthButton.tsx
'use client'

import { signOut, useSession } from 'next-auth/react'

export default function AuthButton() {
  const { data: session } = useSession()

  if (session?.user?.walletAddress) {
    return (
      <button
        onClick={() => signOut()}
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
      >
        Logout
      </button>
    )
  }

  return (
    <div className="text-sm text-gray-400">Not Signed In</div>
  )
}
