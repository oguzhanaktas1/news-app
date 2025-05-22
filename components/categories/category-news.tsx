"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getTopHeadlines,
  formatDate,
  NewsArticle,
} from "@/lib/newsapi";
import { getGNewsByCategory } from "@/lib/gnewsapi";

export default function CategoryNewsPage() {
  const params = useParams();
  const categoryId = (params?.categoryId as string) || "general";

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const categoryMap: Record<string, string> = {
    business: "Business",
    entertainment: "Entertainment",
    general: "General",
    health: "Health",
    science: "Science",
    sports: "Sports",
    technology: "Technology",
    "breaking-news": "Breaking News",
    world: "World",
    nation: "Nation",
  };

  const categoryName: string = categoryMap[categoryId] || "News";

  useEffect(() => {
    setNews([]);
    setPage(1);
    setHasMore(true);
    fetchNews(1);
  }, [categoryId]);

  async function fetchNews(pageToFetch: number) {
    try {
      setLoading(true);
      setError(null);

      const newsapiResponse = await getTopHeadlines({
        category: categoryId,
        pageSize: 5,
        page: pageToFetch,
      });

      const gnewsResponse = await getGNewsByCategory(categoryId);
      const gnewsArticles = gnewsResponse.slice(0, 5);

      const combined = [...newsapiResponse.articles, ...gnewsArticles];

      setNews((current) => {
        const currentTitles = new Set(current.map((a) => a.title));
        const newArticles = combined.filter(
          (article) =>
            article.title && !currentTitles.has(article.title)
        );
        return [...current, ...newArticles];
      });

      setHasMore(combined.length > 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load news for the category.");
    } finally {
      setLoading(false);
    }
  }

  function loadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  }

  function createSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 60);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 ">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {categoryName} News
        </h1>
      </div>

      {loading && news.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-300"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {news.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              key={`${createSlug(article.title)}-${index}`}
              className="block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {article.urlToImage ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-lg">
                      No Image Available
                    </span>
                  </div>
                )}
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {article.description || "No description available."}
                  </p>
                  <div className="mt-auto flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{article.source?.name || "No source"}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {hasMore && news.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {!loading && news.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No news articles found for this category.
          </p>
          <p className="mt-2 dark:text-gray-400">Try selecting a different category.</p>
        </div>
      )}
    </div>
  );
}
