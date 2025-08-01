// /app/freelancer/[walletAddress]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReviewCard from '@/components/ReviewCard'
import FreelancerProfileCard from '@/components/FreelancerProfileCard'

type Gig = {
  id: number
  title: string
  priceTiers: { name: string; price: number }[]
}

type Review = {
  id: number
  rating: number
  comment: string
  hirer: { name: string }
}

type Profile = {
  name?: string
  walletAddress?: string
  imageUrl?: string
  freelancer?: {
    bio?: string
  }
}

export default function PublicFreelancerPage() {
  const params = useParams()
  const walletAddress = Array.isArray(params?.walletAddress)
    ? params.walletAddress[0]
    : params?.walletAddress

  const [profile, setProfile] = useState<Profile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!walletAddress) return

    const fetchData = async () => {
      try {
        const [profileRes, reviewRes, gigRes] = await Promise.all([
          fetch(`/api/freelancers/${walletAddress}`),
          fetch(`/api/freelancers/reviews?wallet=${walletAddress}`),
          fetch(`/api/freelancers/gigs?wallet=${walletAddress}`)
        ])

        const profileData = await profileRes.json()
        const reviewData = await reviewRes.json()
        const gigData = await gigRes.json()

        if (profileData.success) setProfile(profileData.data)
        if (reviewData.success) setReviews(reviewData.reviews)
        if (gigData.success) setGigs(gigData.gigs)

        setLoading(false)
      } catch (err) {
        console.error('Error loading freelancer data:', err)
      }
    }

    fetchData()
  }, [walletAddress])

  if (loading) return <div className="p-6 text-white">Loading...</div>
  if (!profile) return <div className="p-6 text-white">Freelancer not found.</div>

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : undefined

  return (
    <div className="p-6 text-white space-y-8">
      <FreelancerProfileCard
        name={profile.name}
        walletAddress={walletAddress}
        imageUrl={profile.imageUrl}
        bio={profile.freelancer?.bio}
        avgRating={avgRating ? parseFloat(avgRating) : undefined}
        totalReviews={reviews.length}
      />

      {/* Gigs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Gigs</h2>
        {gigs.length === 0 ? (
          <p className="text-gray-500">No gigs available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="border border-gray-700 rounded-lg p-4 bg-gray-900"
              >
                <h3 className="font-semibold text-lg">{gig.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  From ${Math.min(...gig.priceTiers.map((t) => t.price))}
                </p>
                <Link
                  href={`/gig/${gig.id}`}
                  className="text-blue-400 text-sm mt-2 inline-block"
                >
                  View Gig →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id}>
                <ReviewCard
                  rating={review.rating}
                  comment={review.comment}
                  hirerName={review.hirer?.name}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
