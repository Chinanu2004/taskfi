'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Job = {
  id: number
  freelancerName: string
  category: string
  status: string
  isReleased: boolean
  dateHired: string
}

export default function HirerHiringsPage() {
  const [myHirings, setMyHirings] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      const walletAddress = localStorage.getItem('walletAddress')
      if (!walletAddress) {
        toast.error('Wallet not connected')
        return
      }

      try {
        const res = await fetch(`/api/jobs/hirer?wallet=${walletAddress}`)
        const data = await res.json()
        if (data.success) {
          setMyHirings(data.jobs)
        } else {
          toast.error(data.error || 'Failed to fetch jobs')
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
        toast.error('Fetch error')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleCancel = async (jobId: number) => {
    const confirmed = confirm("Are you sure you want to cancel this job?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/job/${jobId}/cancel`, { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        toast.success('Job cancelled')
        setMyHirings(prev =>
          prev.map(j => j.id === jobId ? { ...j, status: 'cancelled' } : j)
        )
      } else {
        toast.error('Cancel failed')
      }
    } catch (err) {
      console.error('Cancel error:', err)
      toast.error('Cancel failed')
    }
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">My Hirings</h1>

      {loading ? (
        <p>Loading...</p>
      ) : myHirings.length === 0 ? (
        <p>No hirings found.</p>
      ) : (
        myHirings.map((job) => (
          <div
            key={job.id}
            className="p-4 mb-4 bg-gray-900 border border-gray-700 rounded"
          >
            <h2 className="text-lg font-semibold">{job.freelancerName}</h2>
            <p className="text-sm text-gray-400">Category: {job.category}</p>
            <p className="text-sm text-yellow-400">Status: {job.status}</p>
            <p className="text-sm text-gray-500">Date: {job.dateHired}</p>

            {job.status === 'active' && !job.isReleased && (
              <button
                onClick={() => handleCancel(job.id)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded mt-2"
              >
                Cancel Job
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )
}
