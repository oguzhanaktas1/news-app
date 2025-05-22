import { HomeHeader } from "@/components/home/home-header";
import NewsAssistant from "@/components/home/NewsAssistant";

export default function NewsAssistantPage() {
  return (
    <div className="flex flex-col h-screen">
      <HomeHeader />
      <div className="flex-1">
        <NewsAssistant fullPage />
      </div>
    </div>
  );
}
