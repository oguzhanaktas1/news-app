"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categoryColors, categoryNames } from "@/lib/categories";
import { getTrendingNews } from "@/lib/newsapi";          // Your current news fetch
import { getTrendingNewsFromGNews } from "@/lib/gnewsapi"; // GNews trending news
import { formatDate } from "@/lib/newsapi";

export default function TrendingNews() {
  const [trendingNews, setTrendingNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        setIsLoading(true);
        const [newsapiArticles, gnewsArticles] = await Promise.all([
          getTrendingNews(),
          getTrendingNewsFromGNews(),
        ]);

        const combined = [...newsapiArticles, ...gnewsArticles];

        // Filter out articles with duplicate titles or URLs
        const uniqueArticles = combined.filter(
          (article, index, self) =>
            index ===
            self.findIndex(
              (a) => a.title === article.title || a.url === article.url
            )
        );

        setTrendingNews(uniqueArticles);
      } catch (err) {
        setError("Failed to load trending news.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrending();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mx-[15%]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trendingNews.map((news, index) => (
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            key={`${news.id ?? news.url}-${index}`} // Add index for guaranteed unique key
            className="group"
          >
            <Card className="overflow-hidden h-full transition-all hover:shadow-md">
              <div className="relative h-[200px] w-full">
                <Image
                  src={news.image || news.urlToImage || "/placeholder.svg"}
                  alt={news.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <Badge
                  className={`absolute top-2 left-2 ${
                    categoryColors[news.category] || "bg-gray-600"
                  } text-white border-none`}
                >
                  {categoryNames[news.category] || news.category || "General"}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {news.title}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <span>{formatDate(news.publishedAt)}</span>
                <span>{news.views?.toLocaleString() || 0} views</span>
              </CardFooter>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
