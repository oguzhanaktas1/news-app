import { NextRequest, NextResponse } from "next/server";
import { getEverything as getNewsApiEverything } from "@/lib/newsapi";
import { getEverythingFromGNews } from "@/lib/gnewsapi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    if (!q.trim()) {
      return NextResponse.json({ articles: [], totalResults: 0 });
    }

    // NewsAPI ve GNews API’den paralel sonuçları al
    const [newsApiRes, gnewsRes] = await Promise.all([
      getNewsApiEverything({ q, page, pageSize }),
      getEverythingFromGNews({ q, page, pageSize }),
    ]);

    // newsApiRes ve gnewsRes içinde beklenen format:
    // newsApiRes: { status, totalResults, articles: NewsArticle[] }
    // gnewsRes: { status, totalResults, articles: NewsArticle[] }

    // Haberleri birleştir
    const combinedArticles = [
      ...(newsApiRes.articles || []),
      ...(gnewsRes.articles || []),
    ];

    // Toplam sonuç sayısı (toplam toplam değil ama toplam çekebildiğimiz kadar)
    const totalResults = (newsApiRes.totalResults || 0) + (gnewsRes.totalResults || 0);

    return NextResponse.json({
      status: "ok",
      totalResults,
      articles: combinedArticles,
    });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Unknown error",
        articles: [],
        totalResults: 0,
      },
      { status: 500 }
    );
  }
}
