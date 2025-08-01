'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Message = {
  id: number
  content: string
  senderRole: 'HIRER' | 'FREELANCER'
  createdAt: string
}

export default function AdminChatRoom() {
  const params = useParams()
  const chatId = params?.id
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/admin/chats/${chatId}`)
        const data = await res.json()
        setMessages(data.messages)
      } catch (err) {
        console.error('Failed to fetch messages', err)
      } finally {
        setLoading(false)
      }
    }

    if (chatId) {
      fetchMessages()
    }
  }, [chatId])

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Chat View (Chat ID: {chatId})</h1>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found in this chat.</p>
      ) : (
        <div className="space-y-4 bg-gray-900 p-4 rounded-md max-h-[70vh] overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <span className="text-xs text-gray-400">
                [{msg.senderRole}] – {new Date(msg.createdAt).toLocaleString()}
              </span>
              <p className="bg-gray-700 p-2 rounded">{msg.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
