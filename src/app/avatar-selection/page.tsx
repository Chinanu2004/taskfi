'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'

const avatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
]

export default function AvatarSelectionPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!selected) return toast.error('Please select an avatar')
    setLoading(true)

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: selected }),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast.success('Avatar saved!')
      router.push('/dashboard') // Redirect to appropriate dashboard
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Choose Your Avatar</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {avatars.map((src) => (
          <div
            key={src}
            onClick={() => setSelected(src)}
            className={`cursor-pointer border-4 rounded-full p-1 ${
              selected === src ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <Image
              src={src}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={loading || !selected}
        className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save & Continue'}
      </button>
    </div>
  )
}
