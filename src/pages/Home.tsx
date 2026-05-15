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

export default function Home() {
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
        <AboutUs />
        <Pillars />
        <div className="bg-background">
          <Quote />
        </div>
       
        <Events />
        {/* <Projects /> — temporarily hidden, may bring back later */}
         <JoinMovement />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <ScrollProgress />
    </div>
  );
}
