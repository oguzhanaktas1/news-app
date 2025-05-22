import TrendingNews from "@/components/home/trending-news";
import { HeroSection } from "@/components/home/hero-section";
import { HomeHeader } from "@/components/home/home-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { newsCategories, NewsArticle } from "@/lib/newsapi";
import Image from "next/image";
import FloatingChatAssistant from "@/components/home/FloatingChatAssistant";

async function getTopNews() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/headlines?pageSize=10`,
    {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  return res.json();
}

export default async function HomePage() {
  const newsData = await getTopNews();
  const featuredArticle = newsData.articles[0];
  const otherArticles = newsData.articles.slice(1);

  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader />
      <main>
        <section className="w-full h-screen-.8">
          <HeroSection />
        </section>

        {/* Featured Section and Categories */}
        <section className="container-custom py-12">
          {/* Categories Navigation */}
          <h2 className="text-5xl font-semibold mb-6 text-center">Top News</h2>

          {/* Featured Article */}
          {featuredArticle && (
            <Link
              href={featuredArticle.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="mb-10 rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800">
                {featuredArticle.urlToImage && (
                  <div className="relative h-80 w-full">
                    <Image
                      src={featuredArticle.urlToImage}
                      alt={featuredArticle.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 dark:text-white">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2 dark:text-gray-300">
                    {new Date(featuredArticle.publishedAt).toLocaleDateString()}{" "}
                    · {featuredArticle.source.name}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    {featuredArticle.description}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Other Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article: NewsArticle, index: number) => (
              <Link
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition bg-white dark:bg-gray-800"
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
                  <h3 className="font-semibold mb-2 hover:text-blue-600 dark:text-white">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-2 dark:text-gray-300">
                    {new Date(article.publishedAt).toLocaleDateString()} ·{" "}
                    {article.source.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending News Section */}
        <section className="container-custom py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending News</h2>
            <Button asChild variant="ghost" className="gap-1">
              <Link href="/news/all">
                See All News
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <TrendingNews />
        </section>
      </main>
      <FloatingChatAssistant />

    </div>
  );
}
