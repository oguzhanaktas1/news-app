import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-muted py-20 md:py-32 flex items-center justify-center">
      <div className="container flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Stay Updated with OA News</h1>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl">
          Stay current on topics that interest you with a personalized news experience. Sports, economy, technology, and more at OA News!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg">
            <Link href="/auth/signup">Get Started Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg">
            <Link href="/news/all">Explore News</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
