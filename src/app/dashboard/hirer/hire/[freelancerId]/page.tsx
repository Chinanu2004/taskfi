// app/dashboard/hirer/hire/[freelancerId]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Freelancer = {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews?: { user: string; comment: string }[];
};

export default function HireFreelancerPage() {
  const params = useParams<{ freelancerId: string }>();
  const freelancerId = params?.freelancerId || '';

  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function fetchFreelancer() {
      try {
        const res = await fetch(`/api/freelancers/${freelancerId}`);
        const data = await res.json();
        setFreelancer(data);
      } catch (err) {
        console.error('Failed to fetch freelancer:', err);
      }
    }

    if (freelancerId) {
      fetchFreelancer();
    }
  }, [freelancerId]);

  const handleSendOffer = () => {
    const isVerified = localStorage.getItem('isWalletVerified') === 'true';
    if (!isVerified) {
      alert('Please verify your wallet before sending offers.');
      return;
    }

    if (!message.trim()) {
      alert('Please enter a project description.');
      return;
    }

    console.log('Job offer sent:', {
      freelancerId: freelancer?.id,
      message,
    });

    setSent(true);
  };

  if (!freelancer) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Freelancer Not Found</h1>
        <Link
          href="/dashboard/hirer/categories"
          className="text-blue-400 underline"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Hire {freelancer.name}</h1>
      <p className="text-gray-300 mb-2">{freelancer.description}</p>
      <p className="text-yellow-400 mb-4 font-medium">⭐ {freelancer.rating}/5</p>

      {Array.isArray(freelancer.reviews) && freelancer.reviews.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Recent Reviews</h2>
          <ul className="space-y-1 text-sm italic text-gray-400">
            {freelancer.reviews.map((review, index) => (
              <li key={index}>
                {review.user}: “{review.comment}”
              </li>
            ))}
          </ul>
        </div>
      )}

      {sent ? (
        <div className="bg-green-600 p-4 rounded text-white font-medium">
          ✅ Offer sent to {freelancer.name}!
        </div>
      ) : (
        <>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 mb-4"
            placeholder="Describe the project or service you need..."
          />

          <button
            onClick={handleSendOffer}
            className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Send Job Offer
          </button>
        </>
      )}
    </div>
  );
}
