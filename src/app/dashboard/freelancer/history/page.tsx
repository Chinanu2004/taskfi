'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-hot-toast'

type Job = {
  id: number
  title: string
  description: string
  createdAt: string
  category: { name: string }
  hirer: { user: { name: string } }
}

export default function FreelancerHistoryPage() {
  const { publicKey } = useWallet()
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    if (!publicKey) return
    const fetchHistory = async () => {
      const res = await fetch('/api/freelancer/history', {
        method: 'POST',
        body: JSON.stringify({ walletAddress: publicKey.toString() })
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
      <h1 className="text-2xl font-bold mb-4">Freelancer Job History</h1>
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job.id} className="border p-4 rounded-lg bg-gray-900">
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p>Category: {job.category.name}</p>
            <p>Client: {job.hirer.user.name}</p>
            <p>Date: {new Date(job.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-400">Mock review ⭐⭐⭐⭐</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
