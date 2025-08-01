'use client';

import { useEffect, useState } from 'react';

interface JobsPerDayItem {
  date: string;
  count: number;
}

interface AdminAnalyticsData {
  totalUsers: number;
  activeJobs: number;
  totalFundsReleased: number;
  jobsPerDay: JobsPerDayItem[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      setData(json.data);
    };

    fetchData();
  }, []);

  if (!data) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Admin Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Total Users" value={data.totalUsers} />
        <Card title="Active Jobs" value={data.activeJobs} />
        <Card title="Total Funds Released (SOL)" value={data.totalFundsReleased.toFixed(2)} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">🗓 Jobs Created Per Day (Last 30 days)</h2>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-[600px] w-full text-sm border">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Jobs Created</th>
              </tr>
            </thead>
            <tbody>
              {data.jobsPerDay.map((item) => (
                <tr key={item.date} className="border-t border-gray-700">
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-gray-900 text-white rounded-xl p-6 shadow-md">
      <div className="text-sm opacity-70 mb-2">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
