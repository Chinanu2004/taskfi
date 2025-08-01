'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

type Job = {
  id: number
  title: string
  description: string
  status: string
  createdAt: string
  category: { name: string }
  freelancer: { user: { name: string } } | null
  review: { id: number } | null
}

export default function HirerHistoryPage() {
  const { publicKey } = useWallet()
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    if (!publicKey) return
    const fetchHistory = async () => {
      const res = await fetch('/api/hirer/history', {
        method: 'POST',
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      })

      const data = await res.json()
      if (res.ok) {
        setJobs(data)
      } else {
        toast.error(data.error || 'Failed to load job history')
      }
    }

    fetchHistory()
  }, [publicKey])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hirer Job History</h1>
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job.id} className="border p-4 rounded-lg bg-gray-900">
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p>Category: {job.category.name}</p>
            <p>Freelancer: {job.freelancer?.user.name || 'Not hired yet'}</p>
            <p>Status: <span className="capitalize">{job.status}</span></p>
            <p>Date: {new Date(job.createdAt).toLocaleDateString()}</p>

            {job.status === 'completed' && !job.review && (
              <Link href={`/dashboard/hirer/review/${job.id}`}>
                <button className="mt-2 bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600">
                  Leave Review
                </button>
              </Link>
            )}

            {job.review && (
              <p className="text-sm text-green-400 mt-2">✅ Review submitted</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
