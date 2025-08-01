'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { pusherClient } from '@/lib/pusher-client'

interface Message {
  id: number
  content: string
  senderId: number
  receiverId: number
  sentAt: string
}

export default function ChatPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const jobId = params?.jobId as string
  const userId = searchParams?.get('userId')
  const peerId = searchParams?.get('peerId')

  const [chatId, setChatId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const fetchChatId = async () => {
      const res = await fetch(`/api/chat/by-job/${jobId}`)
      const data = await res.json()
      if (data.success && data.chatId) setChatId(data.chatId)
    }

    if (jobId) fetchChatId()
  }, [jobId])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return
      const res = await fetch(`/api/chat/${chatId}`)
      const data = await res.json()
      if (data.success) setMessages(data.messages)
    }

    if (chatId) fetchMessages()
  }, [chatId])

  // 🧠 Realtime listener
  useEffect(() => {
    if (!chatId) return

    const channel = pusherClient.subscribe(`chat-${chatId}`)

    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message])
    }

    channel.bind('new-message', handleNewMessage)

    return () => {
      channel.unbind('new-message', handleNewMessage)
      pusherClient.unsubscribe(`chat-${chatId}`)
    }
  }, [chatId])

  const sendMessage = async () => {
    if (!newMessage || !chatId || !userId || !peerId) return

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          senderId: Number(userId),
          receiverId: Number(peerId),
          content: newMessage,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setNewMessage('')
        toast.success('Message sent')
        // No need to manually add message — Pusher will handle it
      } else {
        toast.error('Failed to send message')
      }
    } catch {
      toast.error('Error sending message')
    }
  }

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Job Chat (Job ID: {jobId})</h2>

      <div className="h-80 overflow-y-scroll border rounded p-2 mb-4 space-y-2 bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded w-fit ${
              msg.senderId == Number(userId) ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}
