import { NextResponse } from "next/server";
import { getTopHeadlines } from "@/lib/newsapi";
import { getGNewsByCategory } from "@/lib/gnewsapi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";
    const page = Number(searchParams.get("page")) || 1;

    // NewsAPI'den haberleri çek
    const newsApiResponse = await getTopHeadlines({ category, page, pageSize: 20 });

    // GNews API'den haberleri çek
    const gNewsArticles = await getGNewsByCategory(category);

    // NewsAPI makaleleri (articles array)
    const newsApiArticles = newsApiResponse.articles;

    // Haberleri başlığa göre filtreleyerek birleştir
    const combinedArticles = [
      ...newsApiArticles,
      ...gNewsArticles.filter(
        (gArticle: { title: string; }) =>
          !newsApiArticles.some((nArticle) => nArticle.title === gArticle.title)
      ),
    ];

    return NextResponse.json({ articles: combinedArticles });
  } catch (error: any) {
    console.error("News pulling error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while loading the news." },
      { status: 500 }
    );
  }
}
