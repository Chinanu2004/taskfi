// hooks/useNotifications.ts
import { useEffect, useState } from 'react'

type Notification = {
  id: number
  isRead: boolean
  message: string
  createdAt: string
}

export function useNotifications(walletAddress: string | null, userId: number | null) {
  const [unread, setUnread] = useState<number>(0)

  useEffect(() => {
    const fetchNotifs = async () => {
      if (!walletAddress || !userId) return

      try {
        const res = await fetch(`/api/notifications?userId=${userId}`, {
          headers: { 'x-wallet': walletAddress },
        })

        const data = await res.json()
        if (data.success) {
          const count = (data.notifications as Notification[]).filter((n) => !n.isRead).length
          setUnread(count)
        }
      } catch (err) {
        console.error('Notification fetch failed:', err)
      }
    }

    fetchNotifs()
  }, [walletAddress, userId])

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        Array.from({ length: unread }).map(async (_, i) => {
          await fetch(`/api/notifications/${i + 1}/read`, { method: 'POST' })
        })
      )
      setUnread(0)
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  return { unread, markAllAsRead }
}
