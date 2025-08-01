'use client';

import { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import Link from 'next/link';

interface Notification {
  id: string;
  message: string;
  link: string;
  createdAt: string;
}

export default function BellDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch notifications from backend
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative text-white hover:text-blue-400 focus:outline-none"
      >
        <FaBell className="text-xl" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-20 text-black">
          <div className="p-4 border-b font-bold bg-gray-100">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No new notifications</div>
          ) : (
            <ul className="divide-y">
              {notifications.map((notif) => (
                <li key={notif.id} className="p-4 hover:bg-gray-100">
                  <Link href={notif.link}>
                    <span className="block text-sm">{notif.message}</span>
                    <span className="block text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
