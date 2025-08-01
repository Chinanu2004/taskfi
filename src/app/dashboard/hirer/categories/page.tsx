'use client';

import { useRouter } from 'next/navigation';
import categories from '@/data/categories';

export default function HirerCategoriesPage() {
  const router = useRouter();

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Select a Freelancer Category</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => router.push(`/dashboard/hirer/${encodeURIComponent(category)}`)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-gray-300"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
