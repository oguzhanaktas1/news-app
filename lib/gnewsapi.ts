import { NewsArticle } from "./newsapi";

// Categories supported by the GNews API
export const gnewsCategories = [
  { id: "breaking-news", name: "Breaking News" },
  { id: "world", name: "World" },
  { id: "nation", name: "Nation" },
  { id: "business", name: "Business" },
  { id: "technology", name: "Technology" },
  { id: "entertainment", name: "Entertainment" },
  { id: "sports", name: "Sports" },
  { id: "science", name: "Science" },
  { id: "health", name: "Health" },
];


async function fetchFromGNewsAPI({
  topic,
  q,
  page = 1,
  pageSize = 10,
}: {
  topic?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) throw new Error("GNews API key not found.");

  const queryParams = new URLSearchParams({
    lang: "en",
    max: pageSize.toString(),
    page: page.toString(),
    token: apiKey,
  });

  if (topic) queryParams.append("topic", topic);
  if (q) queryParams.append("q", q);

  const response = await fetch(
    `https://gnews.io/api/v4/top-headlines?${queryParams.toString()}`
  );

  const text = await response.text();
  console.log("GNews API Response:", text);

  if (!response.ok) {
    
    console.error("GNews API Error:", text);
    throw new Error("Failed to fetch GNews data: " + text);
  }
  
  const data = JSON.parse(text);

  return data.articles.map(
    (item: any): NewsArticle => ({
      source: {
        id: null,
        name: item.source?.name || "GNews",
      },
      author: item.source?.name || null,
      title: item.title,
      description: item.description || "",
      url: item.url,
      urlToImage: item.image || null,
      publishedAt: item.publishedAt,
      content: item.content || "",
      category: topic || "general",
      views: Math.floor(Math.random() * 10000),
      summary: item.description || "",
      image: item.image || "",
      id: "",
    })
  );
}

// Fetches the most read (trending) news (breaking-news category)
export async function getTrendingFromGNews(): Promise<NewsArticle[]> {
  const articles = await fetchFromGNewsAPI({ topic: "breaking-news" });

  return articles.map((article) => ({
    ...article,
    id: article.url,
    category: "breaking-news",
  }));
}

export async function getGNewsByCategory(category: string) {
  try {
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) throw new Error("GNews API key not found.");

    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?topic=${category}&token=${apiKey}&lang=tr`
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GNews API error: ${errText}`);
    }

    const data = await res.json();

    // Map news from GNews API to NewsArticle format
    return data.articles.map((item: any) => ({
      title: item.title,
      description: item.description,
      url: item.url,
      urlToImage: item.image,
      publishedAt: item.publishedAt,
      source: { name: item.source.name },
      id: item.url,
    }));
  } catch (error) {
    console.error("getGNewsByCategory error:", error);
    return [];
  }
}

// Featured headlines for the homepage
export async function getTopHeadlinesFromGNews(params: {
  topic?: string;
  q?: string;
  pageSize?: number;
  page?: number;
}): Promise<{ articles: NewsArticle[]; totalResults: number }> {
  const articles = await fetchFromGNewsAPI(params);

  return {
    articles,
    totalResults: articles.length, // GNews API doesn't provide 'totalResults'
  };
}

// Full search from GNews (equivalent of "everything")
export async function getEverythingFromGNews({
  q = "news",
  pageSize = 10,
  page = 1,
}: {
  q?: string;
  pageSize?: number;
  page?: number;
}) {
  const articles = await fetchFromGNewsAPI({ q, pageSize, page });

  return {
    status: "ok",
    totalResults: articles.length,
    articles,
  };
}

// Returns featured trending news from GNews for the homepage
export async function getTrendingNewsFromGNews() {
  const articles = await getTrendingFromGNews();

  return articles.map((article, index) => ({
    id: index.toString(),
    title: article.title,
    image: article.urlToImage,
    category: "breaking-news",
    publishedAt: article.publishedAt,
    views: article.views,
    url: article.url,
  }));
}
