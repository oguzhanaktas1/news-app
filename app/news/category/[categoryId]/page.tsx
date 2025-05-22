import { Metadata } from "next";
import CategoryNewsPage from "@/components/categories/category-news";
import { HomeHeader } from "@/components/home/home-header";

type Props = {
  params: {
    categoryId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryMap: Record<string, string> = {
    business: "Business",
    entertainment: "Entertainment",
    general: "General",
    health: "Health",
    science: "Science",
    sports: "Sports",
    technology: "Technology",
  };

  const categoryName = categoryMap[params.categoryId] || "News";

  return {
    title: `${categoryName} News`,
  };
}

export default function CategoryNews({ params }: Props) {
  return (
    <>
      <HomeHeader />
      <CategoryNewsPage />
    </>
  );
}
