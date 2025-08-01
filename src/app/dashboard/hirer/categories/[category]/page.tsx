'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import freelancers from '@/data/freelancers';

export default function CategoryPage() {
  const params = useParams<{ category: string }>() ?? { category: '' };
  const selectedCategory = decodeURIComponent(params.category || '');

  const filteredFreelancers = freelancers.filter((freelancer) =>
    freelancer.categories.includes(selectedCategory)
  );

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        {selectedCategory} Freelancers
      </h1>

      {filteredFreelancers.length === 0 ? (
        <p>No freelancers found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition duration-200"
            >
              <h2 className="text-xl font-semibold">{freelancer.name}</h2>
              <p className="text-sm text-gray-300 mt-1">
                {freelancer.description}
              </p>
              <p className="mt-2 text-yellow-400 font-medium">
                ⭐ {freelancer.rating}/5
              </p>

              {freelancer.reviews && freelancer.reviews.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-gray-400">
                    Recent Reviews:
                  </h3>
                  {freelancer.reviews.map((review, index) => (
                    <p key={index} className="text-sm italic text-gray-400">
                      {review.user}: &quot;{review.comment}&quot;
                    </p>
                  ))}
                </div>
              )}

              <Link
                href={`/dashboard/hirer/hire/${freelancer.id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Hire
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
