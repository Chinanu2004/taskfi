'use client'

import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ConnectWallet from '@/components/ConnectWallet'
import WalletVerifyButton from '@/components/WalletVerifyButton'

export default function Home() {
  const { publicKey } = useWallet()
  const { status, data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated') return

    const wallet = session?.user?.walletAddress

    if (!wallet) return

    const role = localStorage.getItem(wallet)

    ;(async () => {
      const res = await fetch('/api/user/by-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: wallet }),
      })

      if (res.status === 404) {
        return router.replace('/auth/select-role')
      }

      const { user } = await res.json()

      if (!user.profileImage) {
        return router.replace('/avatar-selection')
      }

      if (role === 'hirer') {
        router.replace('/dashboard/hirer')
      } else if (role === 'freelancer') {
        router.replace('/dashboard/freelancer')
      } else {
        router.replace('/auth/select-role')
      }
    })()
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>🔄 Checking profile…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-6">
      <h1 className="text-4xl font-bold">Welcome to TaskFi</h1>
      <p>Connect your wallet to get started.</p>

      <ConnectWallet />
      {publicKey && <WalletVerifyButton />}
    </main>
  )
}
