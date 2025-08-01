'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useWallet } from '@solana/wallet-adapter-react'

type Freelancer = {
  id: number
  user: {
    name: string
    walletAddress: string
  }
  rating: number
}

export default function CategoryFreelancersPage() {
  const params = useParams()
  const categoryId = params?.id
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const { publicKey } = useWallet()
  const walletAddress = publicKey?.toBase58()

  const handleHire = async (freelancerId: number) => {
    const price = prompt('Enter price in SOL or USDC:')
    const token = prompt('Enter token (SOL or USDC):')?.toUpperCase()

    if (!price || !token || !['SOL', 'USDC'].includes(token)) {
      toast.error('Invalid price or token')
      return
    }

    if (!walletAddress) {
      toast.error('Wallet not connected')
      return
    }

    const res = await fetch('/api/hire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Custom Job',
        description: 'Generated from prompt',
        categoryId,
        price,
        token,
        freelancerId,
        walletAddress,
      }),
    })

    const data = await res.json()
    if (data.success) {
      toast.success('Freelancer hired!')
    } else {
      toast.error('Failed to hire')
    }
  }

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await fetch(`/api/freelancers/category/${categoryId}`)
        const data = await res.json()
        if (data.success) setFreelancers(data.data)
      } catch (err) {
        console.error('Error fetching freelancers:', err)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) fetchFreelancers()
  }, [categoryId])

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Freelancers in this Category</h1>

      {loading ? (
        <p>Loading...</p>
      ) : freelancers.length === 0 ? (
        <p>No freelancers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {freelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold mb-1">{freelancer.user.name}</h2>
              <p className="text-sm text-gray-300 mb-1">
                Wallet: {freelancer.user.walletAddress}
              </p>
              <p className="text-sm text-yellow-400 mb-3">Rating: {freelancer.rating}/5</p>
              <button
                onClick={() => handleHire(freelancer.id)}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Hire
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
