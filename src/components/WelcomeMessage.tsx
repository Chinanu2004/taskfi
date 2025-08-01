// /components/WelcomeMessage.tsx
'use client'

import { useSession } from 'next-auth/react'

export default function WelcomeMessage() {
  const { data: session } = useSession()

  if (!session?.user?.walletAddress) return null

  const shortWallet = `${session.user.walletAddress.slice(0, 4)}...${session.user.walletAddress.slice(-4)}`

  return (
    <span className="text-sm text-green-400">
      👋 Welcome {shortWallet}
    </span>
  )
}
