"use client";

import { useEffect, useState } from "react";
import { formatDate, NewsArticle } from "@/lib/newsapi";
import { getGNewsByCategory } from "@/lib/gnewsapi";
import { HomeHeader } from "@/components/home/home-header";

export default function AllNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  const fetchArticles = async (page: number) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/news?category=business&page=${page}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch news");
      }

      const data = await res.json();
      const combined = data.articles;

      setArticles((prev) => [
        ...prev,
        ...combined.filter(
          (article: NewsArticle) => !prev.some((p) => p.title === article.title)
        ),
      ]);

      setHasMore(combined.length > 0);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading all news.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <HomeHeader />
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">All News</h1>

        {loading && articles.length === 0 && (
          <div className="text-center p-8">
            <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto" />
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <a
              href={article.url}
              key={article.id || article.url || index}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-shadow flex flex-col h-full">
                {article.urlToImage ? (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                    No Image
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-black dark:text-white">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {article.description || "No description available."}
                  </p>
                  <div className="mt-auto flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{article.source?.name || "Unknown Source"}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
