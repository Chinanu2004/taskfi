'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Chat = {
  id: number
  job: {
    id: number
    title: string
    hirer: {
      user: {
        name: string
      }
    }
    freelancer: {
      user: {
        name: string
      } | null
    } | null
  } | null
}

export default function AdminChatsPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/admin/chats')
        const data = await res.json()
        setChats(data.chats)
      } catch (err) {
        console.error('Failed to fetch chats', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [])

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">All Chat Rooms</h1>

      {loading ? (
        <p>Loading chats...</p>
      ) : chats.length === 0 ? (
        <p>No chats found.</p>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="bg-gray-800 p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Job: {chat.job?.title || 'N/A'} (ID: {chat.job?.id})
                </p>
                <p className="text-sm">
                  Hirer: {chat.job?.hirer?.user?.name || 'N/A'} | Freelancer:{' '}
                  {chat.job?.freelancer?.user?.name || 'Unassigned'}
                </p>
              </div>

              <Link
                href={`/dashboard/admin/chats/${chat.id}`}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
              >
                View Chat
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
