'use client';

import freelancers, { Freelancer } from '@/data/freelancers';
import { useEffect, useState } from 'react';

export default function HirerFreelancersPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([]);

  useEffect(() => {
    const category = localStorage.getItem('selectedCategory') || '';
    setSelectedCategory(category);

    const filtered = freelancers.filter((freelancer) =>
      freelancer.categories.includes(category)
    );

    setFilteredFreelancers(filtered);
  }, []);

  const handleHire = (freelancer: Freelancer) => {
    alert(`You hired ${freelancer.name} for ${selectedCategory}`);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Freelancers in: {selectedCategory || 'All'}
      </h1>

      {filteredFreelancers.length === 0 ? (
        <p className="text-gray-400">
          No freelancers available in this category.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFreelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="p-4 bg-gray-900 border border-gray-700 rounded"
            >
              <h2 className="text-lg font-semibold">{freelancer.name}</h2>
              <p className="text-sm text-gray-400">{freelancer.description}</p>
              <p className="text-sm text-yellow-400">
                Rating: {freelancer.rating}/5
              </p>
              <button
                onClick={() => handleHire(freelancer)}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Hire
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
