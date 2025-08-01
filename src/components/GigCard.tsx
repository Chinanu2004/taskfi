// components/GigCard.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

type GigCardProps = {
  id: number
  title: string
  description: string
  freelancer: {
    name: string
    walletAddress: string
    profileImage?: string
    rating: number
  }
  priceTiers: {
    price: number
    currency: 'SOL' | 'USDC'
  }[]
}

export default function GigCard({ id, title, description, freelancer, priceTiers }: GigCardProps) {
  const router = useRouter()

  return (
    <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-800 hover:border-purple-600 transition">
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={freelancer.profileImage || '/default-avatar.png'}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">{freelancer.name}</p>
          <p className="text-xs text-gray-400">⭐ {freelancer.rating}/5</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-400 line-clamp-3 mb-3">{description}</p>

      {priceTiers.length > 0 && (
        <div className="text-sm text-purple-400 font-semibold">
          From {priceTiers[0].price} {priceTiers[0].currency}
        </div>
      )}

      <button
        onClick={() => router.push(`/gig/${id}`)}
        className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
      >
        View Gig
      </button>
    </div>
  )
}
