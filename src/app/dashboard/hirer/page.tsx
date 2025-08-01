// /app/dashboard/hirer/page.tsx
'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import LogoutButton from '@/components/LogoutButton'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/useNotifications'

export default function HirerDashboard() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [userId, setUserId] = useState<number | null>(null)
  const walletAddress = publicKey?.toBase58() ?? ''

  const { unread, markAllAsRead } = useNotifications(walletAddress, userId)

  useEffect(() => {
    const checkAuth = async () => {
      if (!walletAddress) {
        // no wallet → send home
        return router.replace('/')
      }

      // only proceed if localStorage says “hirer”
      const role = localStorage.getItem(walletAddress)
      if (role !== 'hirer') {
        return router.replace('/')
      }

      // verify user exists & get their ID
      try {
        const res = await fetch('/api/user/by-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress }),
        })

        if (!res.ok) {
          // 404 or other error → send to role selection
          return router.replace('/auth/select-role')
        }

        const { user } = await res.json()
        setUserId(user.id)
      } catch (e) {
        console.error(e)
        return router.replace('/')
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [walletAddress, router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Checking authorization…
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white p-8">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      {unread > 0 && (
        <div
          onClick={markAllAsRead}
          className="bg-yellow-600 text-black px-4 py-2 rounded cursor-pointer mb-4"
        >
          You have {unread} unread notification{unread === 1 ? '' : 's'} — click to mark as read
        </div>
      )}

      <h1 className="text-3xl font-bold">Hirer Dashboard</h1>
      <p className="mt-4">Welcome, Hirer! Your wallet is authorized.</p>
    </div>
  )
}
