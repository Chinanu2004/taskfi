'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Job = {
  id: number
  title: string
  description: string
  chatId: number | null
  hirer: {
    user: {
      name: string
    }
  }
}

export default function FreelancerHiringsPage() {
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const fetchFreelancerJobs = async () => {
      try {
        const res = await fetch('/api/freelancer/hirings')
        const data = await res.json()
        setJobs(data.jobs)
      } catch {
        toast.error('Failed to load jobs')
      }
    }

    fetchFreelancerJobs()
  }, [])

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Hirings</h1>
      {jobs.length === 0 ? (
        <p>No jobs assigned yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-400 mb-2">{job.description}</p>
              <p className="mb-3">
                Hired by:{' '}
                <span className="font-medium">{job.hirer?.user?.name || 'Unknown'}</span>
              </p>
              {job.chatId ? (
                <Link
                  href={`/dashboard/chat/${job.chatId}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Open Chat
                </Link>
              ) : (
                <p className="text-sm text-gray-500 italic">Chat not available</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
