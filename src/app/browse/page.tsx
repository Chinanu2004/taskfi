'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Gig = {
  id: number
  title: string
  description: string
  freelancer: {
    user: {
      name: string
      walletAddress: string
      profileImage?: string
    }
    rating: number
  }
  priceTiers: {
    id: number
    name: string
    price: number
    currency: 'SOL' | 'USDC'
    deliveryTimeDays: number
  }[]
}

export default function BrowseGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/gigs')
      .then(res => res.json())
      .then(data => setGigs(data.gigs))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Gigs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {gigs.map(gig => (
          <div key={gig.id} className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-800 hover:border-purple-600 transition">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={gig.freelancer.user.profileImage || '/default-avatar.png'}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{gig.freelancer.user.name}</p>
                <p className="text-xs text-gray-400">⭐ {gig.freelancer.rating}/5</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-1">{gig.title}</h2>
            <p className="text-sm text-gray-400 line-clamp-3 mb-3">{gig.description}</p>

            {gig.priceTiers.length > 0 && (
              <div className="text-sm text-purple-400 font-semibold">
                From {gig.priceTiers[0].price} {gig.priceTiers[0].currency}
              </div>
            )}

            <button
              onClick={() => router.push(`/freelancer/${gig.freelancer.user.walletAddress}`)}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              View Gig
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
