// app/dashboard/hirer/select-category/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SelectCategoryPage() {
  type Category = {
  id: number
  name: string
}

const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (data.success) {
          setCategories(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch categories', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Select a Category</h1>

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/dashboard/hirer/category/${category.id}`}
              className="block p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="text-sm text-gray-300">View freelancers in this category</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
