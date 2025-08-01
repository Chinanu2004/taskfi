'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Job = {
  id: number
  title: string
  description: string
  freelancer: {
    user: {
      name: string
    }
  } | null
  chatId: number | null
}

export default function HiredJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const fetchHiredJobs = async () => {
      const res = await fetch('/api/hirer/hired-jobs')
      const data = await res.json()
      setJobs(data.jobs)
    }

    fetchHiredJobs()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hired Jobs</h1>
      {jobs.length === 0 ? (
        <p>No hired jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-400 mb-2">{job.description}</p>
              <p className="mb-3">
                Assigned to:{' '}
                <span className="font-medium">
                  {job.freelancer?.user?.name || 'Not assigned'}
                </span>
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
