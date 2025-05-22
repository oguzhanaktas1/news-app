"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";

const categories = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];

export default function NotificationPreferences() {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("news_notify_preferences");
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("news_notify_preferences", JSON.stringify(selected));
  }, [selected]);

  const toggleCategory = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="my-4">
      <h3 className="text-lg font-semibold mb-2">Categories You Want to Receive Notifications From</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selected.includes(cat) ? "default" : "outline"}
            onClick={() => toggleCategory(cat)}
            size="sm"
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
