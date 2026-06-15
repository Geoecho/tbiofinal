import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { Stories } from "@/components/Stories";
import { motion } from "framer-motion";

export default function StoriesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mt-[9rem] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 border-b-2 border-foreground pb-3"
          >
            <h1 className="font-display text-5xl md:text-6xl leading-none">
              Stories & <span className="text-primary">Initiatives</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl font-medium text-muted-foreground max-w-2xl pl-0">
              Explore the full collection of youth-led stories, initiatives, journeys, and impacts from our community.
            </p>
          </motion.div>
          
          <Stories 
            sectionId="stories" 
            sectionTitle="Youth Success Stories" 
            filterFn={(s) => s.type === "story" || (!s.type && (s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS")))} 
          />
          <Stories 
            sectionId="initiatives" 
            sectionTitle="Our Initiatives" 
            filterFn={(s) => s.type === "initiative" || (!s.type && !(s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS")))} 
          />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
