// /app/dashboard/freelancer/profile.tsx
'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import WalletVerifyButton from '@//components/WalletVerifyButton'

type Review = {
  id: number
  rating: number
  comment: string
  job: { title: string }
  hirer: { user: { name: string } }
}

export default function FreelancerProfilePage() {
  const { publicKey } = useWallet()
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (!publicKey) return

    const fetchReviews = async () => {
      const res = await fetch(`/api/freelancer/reviews`, {
        method: 'POST',
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      })

      const data = await res.json()
      if (res.ok) {
        setReviews(data)
      }
    }

    fetchReviews()
  }, [publicKey])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Freelancer Profile Settings</h1>
      <WalletVerifyButton />

      <h2 className="text-xl font-semibold mt-8 mb-4">⭐ Reviews Received</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map(review => (
            <li key={review.id} className="border p-4 rounded bg-gray-800 text-white">
              <div className="text-yellow-400 font-semibold">Rating: {review.rating} ★</div>
              <p className="text-sm text-gray-200 mt-1">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                From {review.hirer.user.name} (Job: {review.job.title})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
