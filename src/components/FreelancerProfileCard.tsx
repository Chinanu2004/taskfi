// components/FreelancerProfileCard.tsx
'use client'

import Image from 'next/image'
import React from 'react'

type FreelancerProfileCardProps = {
  name?: string
  walletAddress?: string
  bio?: string
  avgRating?: number
  totalReviews?: number
  imageUrl?: string
}

export default function FreelancerProfileCard({
  name = 'Unnamed Freelancer',
  walletAddress,
  bio = 'No bio provided.',
  avgRating,
  totalReviews,
  imageUrl
}: FreelancerProfileCardProps) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900 flex gap-4 items-center">
      <Image
        src={imageUrl || '/default-avatar.png'}
        alt="Profile"
        width={56}
        height={56}
        className="rounded-full object-cover"
      />
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-400 text-sm mb-1">@{walletAddress}</p>
        <p className="text-sm text-gray-500 mb-1">{bio}</p>
        {avgRating !== undefined && (
          <p className="text-yellow-400 text-sm">
            ⭐ {avgRating} {totalReviews !== undefined && `(${totalReviews} reviews)`}
          </p>
        )}
      </div>
    </div>
  )
}
