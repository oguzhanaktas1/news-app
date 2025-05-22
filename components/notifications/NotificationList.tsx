"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("news_notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Incoming Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((item, idx) => (
            <li key={idx} className="p-4 bg-white shadow rounded">
              <Link href={item.url} target="_blank" className="text-blue-600 hover:underline">
                {item.title}
              </Link>
              <p className="text-sm text-gray-500">{new Date(item.publishedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
