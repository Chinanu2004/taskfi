'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Job = {
  id: number
  title: string
  hirer: {
    user: {
      name: string
    }
  }
  applications: {
    id: number
    freelancer: {
      user: {
        name: string
        walletAddress: string
      }
    }
    status: string
    completionStatus: string
  }[]
}

export default function AdminJobPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch('/api/admin/jobs')
      const data = await res.json()
      setJobs(data)
    }

    fetchJobs()
  }, [])

  const resolveDispute = async (jobApplicationId: number, newStatus: string) => {
    const res = await fetch('/api/admin/resolve-dispute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobApplicationId, newStatus }),
    })

    if (res.ok) {
      toast.success('Dispute resolved')
      router.refresh()
    } else {
      toast.error('Failed to resolve dispute')
    }
  }

  const releaseFunds = async (jobApplicationId: number) => {
  const res = await fetch('/api/admin/release-funds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobApplicationId }),
  })

  const data = await res.json()

  if (res.ok && data.walletAddress) {
    // Copy wallet address to clipboard
    await navigator.clipboard.writeText(data.walletAddress)

    toast.success(`Wallet copied: ${data.walletAddress}`)

    router.refresh()
  } else {
    toast.error(data.error || 'Failed to get wallet')
  }
}

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Disputed Jobs</h1>

      {jobs.map((job) => (
        <div key={job.id} className="border border-gray-700 rounded p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
          <p className="text-sm mb-4 text-gray-400">Hirer: {job.hirer.user.name}</p>

          {job.applications
            .filter((app) => app.completionStatus === 'pending')
            .map((app) => (
              <div key={app.id} className="bg-gray-800 rounded p-4 mb-4">
                <p className="mb-2">Freelancer: {app.freelancer.user.name}</p>
                <p className="mb-2">Status: {app.status}</p>
                <p className="mb-2">Completion Status: {app.completionStatus}</p>

                <div className="flex gap-4">
                  <button
                    onClick={() => resolveDispute(app.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => resolveDispute(app.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => releaseFunds(app.id)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    Release Funds
                  </button>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
