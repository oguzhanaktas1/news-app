"use client";

import { newsCategories, NewsArticle } from "@/lib/newsapi";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function CategoryTabs() {
  const [selectedCategory, setSelectedCategory] = useState(newsCategories[0].id);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategoryNews() {
      setLoading(true);
      try {
        const res = await fetch(`/api/news/category/${selectedCategory}?pageSize=9`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        setArticles(data.articles);
      } catch (error) {
        console.error(error);
        setArticles([]);
      }
      setLoading(false);
    }

    fetchCategoryNews();
  }, [selectedCategory]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {newsCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* News Articles */}
      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {article.urlToImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.urlToImage}
                    alt={article.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold mb-2 hover:text-blue-600">{article.title}</h3>
                <p className="text-gray-600 text-xs mb-2">
                  {new Date(article.publishedAt).toLocaleDateString()} · {article.source.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
