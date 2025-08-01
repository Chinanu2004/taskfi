// /app/dashboard/freelancer/page.tsx
'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import LogoutButton from '@/components/LogoutButton'
import { useNotifications } from '@/hooks/useNotifications'

export default function FreelancerDashboard() {
  const { publicKey } = useWallet()
  const wallet = publicKey?.toBase58() || ''
  const [checking, setChecking] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const { unread, markAllAsRead } = useNotifications(wallet, userId)

  useEffect(() => {
    const init = async () => {
      if (!wallet) return

      // 1) Profile must exist
      const res = await fetch('/api/user/by-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: wallet }),
      })
      if (res.status === 404) {
        return window.location.href = '/auth/select-role'
      }
      const { user } = await res.json()
      setUserId(user.id)

      // 2) Check chosen categories
      const stored = localStorage.getItem(`${wallet}-categories`)
      if (!stored) {
        return window.location.href = '/dashboard/freelancer/categories'
      }
      setCategories(JSON.parse(stored))

      setChecking(false)
    }
    init()
  }, [wallet])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading your freelancer dashboard…
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white p-6">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      {unread > 0 && (
        <div
          onClick={markAllAsRead}
          className="bg-yellow-600 text-black px-4 py-2 rounded cursor-pointer mb-4"
        >
          You have {unread} unread notification{unread === 1 ? '' : 's'}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">Freelancer Dashboard</h1>
      <p>Your selected categories: {categories.join(', ') || 'None – you can pick on Profile'}</p>
      <p className="mt-2">No jobs assigned yet.</p>
    </div>
  )
}
