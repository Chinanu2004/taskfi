'use client';

import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Freelancer {
  address: string;
  categories: string[];
}

const ALL_CATEGORIES = [
  'Shiller',
  'Developer',
  'Designer',
  'Content Creator',
  'Community Manager',
  'Web3 Marketer',
];

export default function AdminDashboard() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hirerAddress, setHirerAddress] = useState<string>('');

  useEffect(() => {
    const allData = Object.entries(localStorage)
      .filter(([key]) => key.endsWith('-categories'))
      .map(([key, value]) => ({
        address: key.replace('-categories', ''),
        categories: JSON.parse(value as string),
      }));
    setFreelancers(allData);
  }, []);

  const assignJob = (freelancerAddr: string) => {
    if (!hirerAddress) return alert('Enter a valid Hirer address');

    const job = { hirer: hirerAddress, status: 'Assigned' };
    localStorage.setItem(`${freelancerAddr}-job`, JSON.stringify(job));
    alert(`Job assigned to ${freelancerAddr.slice(0, 6)}...`);
  };

  const filtered = selectedCategory
    ? freelancers.filter((f) => f.categories.includes(selectedCategory))
    : freelancers;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <Link
        href="/dashboard/admin/analytics"
        className="inline-block mt-4 text-blue-400 hover:underline"
      >
        📊 View Platform Analytics
      </Link>

      <input
        type="text"
        placeholder="Enter Hirer Address"
        value={hirerAddress}
        onChange={(e) => setHirerAddress(e.target.value)}
        className="mt-6 mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 w-full"
      />

      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 border rounded ${
            selectedCategory === ''
              ? 'bg-blue-600 border-blue-400'
              : 'bg-gray-800 border-gray-600'
          }`}
        >
          All
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 border rounded ${
              selectedCategory === cat
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-800 border-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        filtered.map((f) => (
          <div
            key={f.address}
            className="mb-4 p-4 border rounded bg-gray-800 border-gray-600 flex items-center justify-between"
          >
            <div>
              <p className="font-bold">
                {f.address.slice(0, 8)}...{f.address.slice(-6)}
              </p>
              <p className="text-sm text-gray-400">
                Categories: {f.categories.join(', ')}
              </p>
            </div>
            <button
              onClick={() => assignJob(f.address)}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              Assign Job
            </button>
          </div>
        ))
      ) : (
        <p>No freelancers found in this category.</p>
      )}
    </div>
  );
}
