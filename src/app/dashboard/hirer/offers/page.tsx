'use client';

type JobOffer = {
  id: string;
  freelancerName: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
};

const mockOffers: JobOffer[] = [
  {
    id: '1',
    freelancerName: 'PixelDev',
    message: 'Build me a landing page for my Web3 token.',
    status: 'accepted',
  },
  {
    id: '2',
    freelancerName: 'SolanaKing',
    message: 'Write a contract for our staking dApp.',
    status: 'pending',
  },
  {
    id: '3',
    freelancerName: 'ShillMasterX',
    message: 'Promote my token to 50,000 people.',
    status: 'declined',
  },
];

export default function HirerOffersPage() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Sent Job Offers</h1>

      {mockOffers.length === 0 ? (
        <p className="text-gray-400">You haven’t sent any job offers yet.</p>
      ) : (
        <ul className="space-y-4">
          {mockOffers.map((offer) => (
            <li
              key={offer.id}
              className="border border-gray-700 p-4 rounded bg-gray-900"
            >
              <p className="font-medium text-blue-400">
                To: {offer.freelancerName}
              </p>
              <p className="text-gray-300 mb-2">{offer.message}</p>
              <p
                className={`font-semibold ${
                  offer.status === 'accepted'
                    ? 'text-green-400'
                    : offer.status === 'declined'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }`}
              >
                {offer.status === 'accepted'
                  ? '✅ Accepted'
                  : offer.status === 'declined'
                  ? '❌ Declined'
                  : '⏳ Pending'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
