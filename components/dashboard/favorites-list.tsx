"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Bookmark, Trash2 } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryColors, categoryNames } from "@/lib/categories";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/use-favorites";

interface NewsItem {
  url: string;
  title: string;
  summary: string;
  image?: string;
  category: string;
  publishedAt: string;
  views: number;
}

export function FavoritesList() {
  const { toast } = useToast();
  const { favorites, removeFromFavorites } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFavorite = (newsUrl: string) => {
    removeFromFavorites(newsUrl);
    toast({
      title: "Removed from favorites",
      description: "The news has been removed from your favorites.",
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-[200px] bg-muted animate-pulse" />
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-full" />
            </CardHeader>
            <CardFooter>
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">No Favorite News Yet</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Add news to your favorites to see them here.
        </p>
        <Button asChild>
          <a href="/news/all">Browse News</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((news: NewsItem) => (
        <Card key={news.url} className="overflow-hidden h-full group relative">
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveFavorite(news.url)}
              aria-label={`Remove ${news.title} from favorites`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col h-full"
          >
            <div className="relative h-[200px] w-full">
              <Image
                src={news.image || "/placeholder.svg"}
                alt={news.title}
                fill
                className="object-cover"
              />
              <Badge
                className={`absolute top-2 left-2 ${
                  categoryColors[news.category]
                } text-white border-none`}
              >
                {categoryNames[news.category]}
              </Badge>
            </div>
            <CardHeader className="flex-grow">
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                {news.title}
              </CardTitle>
              <p className="text-muted-foreground line-clamp-2 mt-2">
                {news.summary}
              </p>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <span>
                  {formatDistanceToNow(new Date(news.publishedAt), {
                    addSuffix: true,
                    locale: enUS,
                  })}
                </span>
                <span>{typeof news.views === "number" ? news.views.toLocaleString() : "0"} views</span>

              </div>
            </CardFooter>
          </a>
        </Card>
      ))}
    </div>
  );
}
