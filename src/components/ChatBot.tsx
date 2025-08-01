'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Message = {
  id: number;
  chatId: number;
  senderAddress: string;
  content: string;
  sentAt: string;
};

export default function ChatBox({
  chatId,
  walletAddress,
}: {
  chatId: number;
  walletAddress: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post('/api/messages', {
        chatId,
        senderAddress: walletAddress,
        content: newMessage,
      });
      setNewMessage('');
      setTimeout(() => fetchMessages(chatId), 200);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      const res = await axios.get(`/api/messages?chatId=${chatId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startPolling = () => {
      fetchMessages(chatId); // Initial load
      interval = setInterval(() => fetchMessages(chatId), 5000); // Poll every 5s
    };

    startPolling();

    return () => clearInterval(interval); // Cleanup on unmount
  }, [chatId]); // ✅ safe: chatId is a primitive

  return (
    <div className="p-4 space-y-4 border rounded bg-black text-white max-w-xl mx-auto">
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.senderAddress === walletAddress
                ? 'bg-blue-600 text-right'
                : 'bg-gray-700'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(msg.sentAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 text-black rounded"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
