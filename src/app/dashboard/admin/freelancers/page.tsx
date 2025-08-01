'use client'

import { useEffect, useState } from 'react'

type Freelancer = {
  id: number
  rating: number
  user: {
    name: string
  }
}

export default function AdminFreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [ratings, setRatings] = useState<Record<number, number>>({})

  useEffect(() => {
  fetch('/api/freelancers')
    .then((res) => res.json())
    .then((data: { success: boolean; data: Freelancer[] }) => {
      console.log('API response:', data)

      const freelancersArray = data.data || []

      setFreelancers(freelancersArray)

      const initialRatings: Record<number, number> = {}
      freelancersArray.forEach((freelancer) => {
        initialRatings[freelancer.id] = freelancer.rating
      })
      setRatings(initialRatings)
    })
}, [])

  const updateRating = async (freelancerId: number) => {
    const newRating = ratings[freelancerId]
    const res = await fetch('/api/admin/update-rating', {
      method: 'POST',
      body: JSON.stringify({ freelancerId, newRating }),
    })

    if (res.ok) {
      alert('Rating updated successfully!')
    } else {
      alert('Error updating rating.')
    }
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Admin: Rate Freelancers</h1>
      <div className="space-y-6">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="bg-gray-800 p-4 rounded shadow">
            <p className="text-lg font-semibold">{freelancer.user.name}</p>
            <div className="flex items-center mt-2">
              <label className="mr-2">Rating:</label>
              <input
                type="number"
                min={1}
                max={5}
                value={ratings[freelancer.id] || 0}
                onChange={(e) =>
                  setRatings({ ...ratings, [freelancer.id]: parseInt(e.target.value) })
                }
                className="w-16 bg-gray-700 text-white p-1 rounded mr-4"
              />
              <button
                onClick={() => updateRating(freelancer.id)}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white text-sm"
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
