export const newsCategories = [
  { id: "business", name: "Business" },
  { id: "entertainment", name: "Entertainment" },
  { id: "general", name: "General" },
  { id: "health", name: "Health" },
  { id: "science", name: "Science" },
  { id: "sports", name: "Sports" },
  { id: "technology", name: "Technology" },
];

const BASE_URL = process.env.NEWS_API_BASE_URL!;
const API_KEY = process.env.NEWS_API_KEY!;

export type NewsArticle = {
  id: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
  category: string;
  views: number;
  summary: string;
  image?: string;
};

export type NewsResponse = {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
};

export async function getTopHeadlines(params: {
  country?: string;
  category?: string;
  q?: string;
  pageSize?: number;
  page?: number;
}): Promise<NewsResponse> {
  const queryParams = new URLSearchParams();

  queryParams.append("country", params.country || "us");

  if (params.category) {
    queryParams.append("category", params.category);
  }

  if (params.q) {
    queryParams.append("q", params.q);
  }

  queryParams.append("pageSize", (params.pageSize || 20).toString());
  queryParams.append("page", (params.page || 1).toString());

  console.log("API_KEY:", API_KEY);

  const response = await fetch(
    `${BASE_URL}/top-headlines?${queryParams.toString()}`,
    {
      headers: {
        "X-Api-Key": API_KEY || "",
      },
      next: { revalidate: 600 },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Hatası:", response.status, errorText);
    throw new Error(`Failed to fetch news: ${response.status} ${errorText}`);
  }

  return response.json();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function getTrendingNews() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/headlines`
  );
  const data = await res.json();

  return data.articles.map((article: NewsArticle, index: number) => ({
    id: index.toString(),
    title: article.title,
    image: article.urlToImage,
    category: "general",
    publishedAt: article.publishedAt,
    views: Math.floor(Math.random() * 10000),
    url: article.url,
  }));
}

export async function getEverything({
  q = "news",
  pageSize = 10,
  page = 1,
}: {
  q?: string;
  pageSize?: number;
  page?: number;
}) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new Error("API anahtarı bulunamadı.");
  }

  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${q}&pageSize=${pageSize}&page=${page}`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 600 },
    }
  );

  if (!res.ok) {
    const errorText = await res.text(); // hata mesajını al
    console.error("Hata yanıtı:", errorText);
    throw new Error("Haberler alınamadı: " + errorText);
  }

  return res.json();
}
