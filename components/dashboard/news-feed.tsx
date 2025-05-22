"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark } from "lucide-react";
import { Button } from "../ui/button";
import { useFavorites } from "@/hooks/use-favorites";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

const categories = [
  { key: "general", label: "General" },
  { key: "business", label: "Business" },
  { key: "technology", label: "Technology" },
  { key: "sports", label: "Sports" },
  { key: "health", label: "Health" },
  { key: "science", label: "Science" },
  { key: "entertainment", label: "Entertainment" },
];

// API functions
const fetchNewsAPI = async (category: string) => {
  const query = category === "general" ? "news" : category;
  const url = `https://newsapi.org/v2/everything?q=${query}&language=en&apiKey=${NEWS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.articles || [];
};

const fetchGNewsByCategory = async (category: string) => {
  const topicMap: Record<string, string> = {
    general: "breaking-news",
    business: "business",
    technology: "technology",
    sports: "sports",
    health: "health",
    science: "science",
    entertainment: "entertainment",
  };
  const topic = topicMap[category] || "breaking-news";
  const url = `https://gnews.io/api/v4/top-headlines?lang=en&topic=${topic}&token=${GNEWS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.articles || [];
};

// Fetch combined news from one category
const fetchCombinedNews = async (category: string) => {
  const [newsapiArticles, gnewsArticles] = await Promise.all([
    fetchNewsAPI(category),
    fetchGNewsByCategory(category),
  ]);
  return [...newsapiArticles, ...gnewsArticles];
};

// Fetch preferred news by selected categories
const fetchPreferredNews = async (selectedCategories: string[]) => {
  const allPromises = selectedCategories.map(fetchCombinedNews);
  const allResults = await Promise.all(allPromises);
  return allResults.flat();
};
// shuffle fonksiyonu ekle
function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

interface NewsFeedProps {
  selectedCategories: string[];
}

// Main component
export function NewsFeed({ selectedCategories }: NewsFeedProps) {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [tabMode, setTabMode] = useState<"preferences" | "categories">("preferences");
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);

      try {
        let articles: any[] = [];

        if (tabMode === "preferences") {
          articles = await fetchPreferredNews(selectedCategories);
          articles = shuffleArray(articles);
        } else {
          articles = await fetchCombinedNews(activeCategory);
        }

        setNews(articles);
      } catch (err) {
        setError("An error occurred while loading news.");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [tabMode, activeCategory, selectedCategories]);

  useEffect(() => {
    setVisibleCount(20);
  }, [tabMode, activeCategory, selectedCategories]);

  return (
    <Tabs
      value={tabMode}
      onValueChange={(value) => setTabMode(value as "preferences" | "categories")}
      className="space-y-6"
    >
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="categories">News</TabsTrigger>
      </TabsList>

      <TabsContent value="preferences">
        <NewsGrid loading={loading} error={error} news={news.slice(0, visibleCount)} />
        {visibleCount < news.length && !loading && !error && (
          <div className="flex justify-center mt-6">
            <Button onClick={() => setVisibleCount((prev) => prev + 20)}>
              Load More
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="categories">
        <div className="space-y-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-8">
              {categories.map((cat) => (
                <TabsTrigger key={cat.key} value={cat.key}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <NewsGrid loading={loading} error={error} news={news.slice(0, visibleCount)} />
          {visibleCount < news.length && !loading && !error && (
            <div className="flex justify-center mt-6">
              <Button onClick={() => setVisibleCount((prev) => prev + 20)}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}


// NewsGrid component for displaying news cards
function NewsGrid({
  loading,
  error,
  news,
}: {
  loading: boolean;
  error: string | null;
  news: any[];
}) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden relative">
            <Skeleton className="h-[200px] w-full" />
            <CardHeader>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-3 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No News Found</h3>
        <p className="text-muted-foreground mt-2">
          There are currently no news articles in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item, index) => (
        <Card key={index} className="overflow-hidden relative">
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(item)}
              aria-label={
                isFavorite(item.url)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              className={`text-primary ${
                isFavorite(item.url)
                  ? "opacity-100"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isFavorite(item.url) ? "fill-current text-yellow-500" : ""
                }`}
              />
            </Button>
          </div>

          <div className="relative h-[200px] w-full">
            {item.image || item.urlToImage ? (
              <Image
                src={item.image || item.urlToImage}
                alt={item.title || "News image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 h-full w-full" />
            )}
          </div>

          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {item.publishedAt
              ? new Date(item.publishedAt).toLocaleString("en-US")
              : "No date information"}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
