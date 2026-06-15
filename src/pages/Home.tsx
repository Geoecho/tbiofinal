import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pillars } from "@/components/Pillars";
import { AboutUs } from "@/components/AboutUs";
import { JoinMovement } from "@/components/JoinMovement";
import { Events } from "@/components/Events";
import { Quote } from "@/components/Quote";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Stories } from "@/components/Stories";
import { useEvents, useStories } from "@/lib/adminStore";

export default function Home() {
  const [events] = useEvents();
  const [stories] = useStories();

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main id="main-content">
        <Hero />
        <Pillars />
        <AboutUs />
        <div className="bg-background">
          <Quote />
        </div>

        {stories.length > 0 && (
          <>
            <Stories 
              sectionId="stories" 
              sectionTitle="Youth Success Stories" 
              filterFn={(s) => s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS")} 
            />
            <Stories 
              sectionId="initiatives" 
              sectionTitle="Our Initiatives" 
              filterFn={(s) => !(s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS"))} 
            />
          </>
        )}
       
        {events.length > 0 && <Events />}
        <JoinMovement />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <ScrollProgress />
    </div>
  );
}
