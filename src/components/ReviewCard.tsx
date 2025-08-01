// components/ReviewCard.tsx
import React from 'react'

type ReviewCardProps = {
  rating: number
  comment: string
  hirerName?: string
}

export default function ReviewCard({ rating, comment, hirerName }: ReviewCardProps) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold">{hirerName || 'Anonymous'}</span>
        <span className="text-yellow-400">⭐ {rating}</span>
      </div>
      <p className="text-sm text-gray-300">{comment}</p>
    </div>
  )
}
