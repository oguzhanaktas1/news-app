// pages/api/news.ts
import { NextRequest, NextResponse } from "next/server";
import { getTopHeadlines } from "@/lib/newsapi";
import { getTopHeadlinesFromGNews } from "@/lib/gnewsapi";
import { NewsArticle } from "@/lib/newsapi";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "general";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  try {
    // NewsAPI ve GNews'ten eş zamanlı veri çek
    const [newsApiResponse, gnewsResponse] = await Promise.all([
      getTopHeadlines({ category, page, pageSize }),
      getTopHeadlinesFromGNews({ topic: category, page, pageSize }),
    ]);

    const allArticles: NewsArticle[] = [
      ...newsApiResponse.articles,
      ...gnewsResponse.articles,
    ];

    // Aynı başlığa sahip haberleri filtrele (benzersizleştirme)
    const uniqueArticles = allArticles.filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.title === article.title)
    );

    return NextResponse.json({
      status: "ok",
      totalResults: uniqueArticles.length,
      articles: uniqueArticles,
    });
  } catch (error) {
    console.error("Error while retrieving news data:", error);
    return NextResponse.json(
      { status: "error", message: "No news could be brought." },
      { status: 500 }
    );
  }
}
