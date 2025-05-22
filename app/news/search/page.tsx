'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { HomeHeader } from "@/components/home/home-header"; // HomeHeader dosyanın yolu doğruysa bu şekilde import edin

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function NewsSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const page = 1;
        const pageSize = 10;

        const res = await fetch(`/api/news/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();

        const articles = data.articles || [];

        const mappedResults = articles.map((item: any) => ({
          id: item.id || item.url || Math.random().toString(),
          title: item.title,
          description: item.description || item.summary || item.content || "",
          url: item.url,
        }));

        setResults(mappedResults);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <>
      <HomeHeader />

      <main className="max-w-4xl mx-auto p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">Search results for: "{query}"</h1>

        {loading && <p>Loading...</p>}

        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && results.length === 0 && (
          <p>No results found.</p>
        )}

        <ul className="space-y-4">
          {results.map(({ id, title, description, url }) => (
            <li key={id} className="border rounded p-4 hover:shadow">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 hover:underline">
                {title}
              </a>
              <p className="text-sm text-gray-600">{description}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
