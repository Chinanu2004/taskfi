// /components/WalletVerifyButton.tsx
'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import bs58 from 'bs58'

export default function WalletVerifyButton() {
  const { publicKey, signMessage } = useWallet()
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    const message = `Sign in to TaskFi - ${new Date().toISOString()}`

    const signed = await signMessage!(new TextEncoder().encode(message))
    const signature = bs58.encode(signed)
    const address = publicKey!.toBase58()

    const res = await signIn('credentials', {
      redirect: false,
      walletAddress: address,
      message,
      signature,
    })

    setLoading(false)

    if (res?.ok) {
      toast.success('✅ Verified & Logged In')
    } else {
      toast.error('❌ Verification failed')
    }
  }

  return (
    <button
      onClick={handleVerify}
      disabled={loading}
      className={`px-4 py-2 rounded text-white ${
        loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {loading ? 'Verifying…' : 'Verify & Sign In'}
    </button>
  )
}
