'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'

const ALL_CATEGORIES = [
  'Shiller',
  'Developer',
  'Designer',
  'Content Creator',
  'Community Manager',
  'Web3 Marketer',
]

export default function FreelancerCategories() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  // redirect if not logged in
  useEffect(() => {
    if (!publicKey) {
      router.replace('/')
    }
  }, [publicKey, router])

  const toggle = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : prev.length < 3
        ? [...prev, cat]
        : prev
    )
  }

  const handleSubmit = () => {
    if (!publicKey) return

    const wallet = publicKey.toBase58()
    localStorage.setItem(`${wallet}-categories`, JSON.stringify(selected))
    router.push('/dashboard/freelancer')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Pick Up To 3 Categories</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className={`px-4 py-2 rounded border ${
              selected.includes(cat)
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-800 border-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Submit always enabled (0–3 picks allowed) */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-green-600 rounded hover:bg-green-700"
      >
        Continue to Dashboard
      </button>
    </div>
  )
}
