'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Image from 'next/image';

type Category = { id: number; name: string };
type UserWithFreelancer = {
  name?: string;
  profilePhoto?: string;
  freelancer?: {
    bio?: string;
    categories: Category[];
  };
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserWithFreelancer | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    bio: '',
    profilePhoto: '',
    selectedCategories: [] as number[],
  });

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await fetch('/api/user/settings');
      const catRes = await fetch('/api/categories');
      const [user, cat] = await Promise.all([userRes.json(), catRes.json()]);
      setUserData(user);
      setCategories(cat);

      setForm({
        name: user.name || '',
        bio: user.freelancer?.bio || '',
        profilePhoto: user.profilePhoto || '',
        selectedCategories: user.freelancer?.categories?.map((c: Category) => c.id) || [],
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCategoryToggle = (id: number) => {
    setForm(prev => {
      const exists = prev.selectedCategories.includes(id);
      if (exists) {
        return { ...prev, selectedCategories: prev.selectedCategories.filter(c => c !== id) };
      } else {
        if (prev.selectedCategories.length >= 3) {
          toast.error('Max 3 categories');
          return prev;
        }
        return { ...prev, selectedCategories: [...prev.selectedCategories, id] };
      }
    });
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/user/settings', {
      method: 'PUT',
      body: JSON.stringify({
        name: form.name,
        bio: form.bio,
        categories: form.selectedCategories,
      }),
    });

    if (res.ok) toast.success('Profile updated');
    else toast.error('Error updating profile');
  };

  if (loading) return <p className="text-white p-8">Loading...</p>;

  const isFreelancer = !!userData?.freelancer;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white px-3 py-2 rounded"
        />
      </div>

      {isFreelancer && (
        <div className="mb-4">
          <label className="block mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Wallet Address</label>
        <input
          type="text"
          value={session?.user?.walletAddress || ''}
          readOnly
          className="w-full bg-gray-900 text-gray-400 px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Profile Photo (URL)</label>
        <input
          type="text"
          name="profilePhoto"
          value={form.profilePhoto}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white px-3 py-2 rounded mb-2"
        />
        {form.profilePhoto && (
          <Image
            src={form.profilePhoto}
            alt="Preview"
            width={80}
            height={80}
            className="rounded"
          />
        )}
      </div>

      {isFreelancer && (
        <div className="mb-6">
          <label className="block mb-2">Categories (max 3)</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: Category) => {
              const selected = form.selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`px-3 py-1 rounded border ${
                    selected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-400'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white"
      >
        Save Settings
      </button>
    </div>
  );
}
