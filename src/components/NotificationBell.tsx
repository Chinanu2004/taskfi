'use client'

import { useEffect, useState } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUserContext } from '@/context/UserContext'

interface Notification {
  id: number
  message: string
  jobId: number | null
  chatId: number | null
  isRead: boolean
  createdAt: string
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const { userId, walletAddress } = useUserContext()
  const router = useRouter()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId || !walletAddress) return

      try {
        const res = await axios.get(`/api/notifications?userId=${userId}`, {
          headers: { 'x-wallet': walletAddress },
        })
        if (res.data.success) {
          setNotifications(res.data.notifications)
        }
      } catch (err) {
        console.error('Notification fetch failed', err)
      }
    }

    fetchNotifications()
  }, [userId, walletAddress])

  const handleMarkAsRead = async (id: number, jobId: number | null, chatId: number | null) => {
    try {
      await axios.post(`/api/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )

      if (chatId) {
        router.push(`/dashboard/chat/${chatId}?userId=${userId}`)
      } else if (jobId) {
        router.push('/dashboard/freelancer/hirings')
      }
    } catch (err) {
      console.error('Failed to mark notification as read', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/mark-all-read', {
        userId,
      }, {
        headers: { 'x-wallet': walletAddress },
      })

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Failed to mark all notifications as read', err)
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2">
        <BellIcon className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-md rounded-md z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-300">No notifications</p>
          ) : (
            <>
              <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>
              <ul className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id, notif.jobId, notif.chatId)}
                    className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      !notif.isRead ? 'bg-blue-50 dark:bg-gray-900 font-semibold' : ''
                    }`}
                  >
                    <div className="text-sm">{notif.message}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
