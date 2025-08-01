'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type FreelancerData = {
  wallet: string;
  freelancerProfile?: {
    displayName?: string;
    bio?: string;
  };
  jobApplications: {
    id: number;
    job: {
      title: string;
      description: string;
      category: {
        name: string;
      };
    };
  }[];
};

export default function FreelancerDetails() {
  const params = useParams();
  const wallet = params && typeof params.wallet === 'string'
    ? params.wallet
    : Array.isArray(params?.wallet)
      ? params.wallet[0]
      : '';

  const [freelancer, setFreelancer] = useState<FreelancerData | null>(null);

  useEffect(() => {
    const fetchFreelancer = async () => {
      if (!wallet) return;
      const res = await fetch(`/api/freelancers/${wallet}`);
      const data = await res.json();
      if (data.success) setFreelancer(data.data);
    };
    fetchFreelancer();
  }, [wallet]);

  if (!wallet) return <div className="text-white p-8">Invalid wallet address</div>;
  if (!freelancer) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">{freelancer.freelancerProfile?.displayName || 'Unnamed'}</h1>
      <p className="mb-4">{freelancer.freelancerProfile?.bio}</p>
      <p className="mb-2">Wallet: {freelancer.wallet}</p>

      <h2 className="text-xl mt-6 font-semibold">Completed Jobs</h2>
      <ul className="mt-2 space-y-2">
        {freelancer.jobApplications.map((jobApp) => (
          <li key={jobApp.id} className="border border-gray-700 p-3 rounded">
            <p className="font-bold">{jobApp.job.title}</p>
            <p className="text-sm">{jobApp.job.description}</p>
            <p className="text-xs text-gray-400">Category: {jobApp.job.category.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
