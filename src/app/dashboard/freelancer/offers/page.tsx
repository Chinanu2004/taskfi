'use client';

import { useState } from 'react';

type JobOffer = {
  id: string;
  hirerName: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
};

const initialOffers: JobOffer[] = [
  {
    id: '1',
    hirerName: 'CryptoShiller01',
    message: 'Need a full-stack dev to build a crypto landing page.',
    status: 'pending',
  },
  {
    id: '2',
    hirerName: 'Web3HiringBoss',
    message: 'Can you help us write Solana smart contract tests?',
    status: 'pending',
  },
];

export default function FreelancerOffersPage() {
  const [offers, setOffers] = useState<JobOffer[]>(initialOffers);

  const updateStatus = (id: string, newStatus: 'accepted' | 'declined') => {
    const updatedOffers = offers.map((offer) =>
      offer.id === id ? { ...offer, status: newStatus } : offer
    );
    setOffers(updatedOffers);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Job Offers</h1>

      {offers.length === 0 ? (
        <p className="text-gray-400">No job offers available.</p>
      ) : (
        <ul className="space-y-4">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className="border border-gray-700 p-4 rounded bg-gray-900"
            >
              <p className="font-medium text-blue-400">
                From: {offer.hirerName}
              </p>
              <p className="text-gray-300 mb-2">{offer.message}</p>

              <div className="flex items-center space-x-3">
                {offer.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => updateStatus(offer.id, 'accepted')}
                      className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(offer.id, 'declined')}
                      className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <p
                    className={`font-semibold ${
                      offer.status === 'accepted'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {offer.status === 'accepted' ? '✅ Accepted' : '❌ Declined'}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
