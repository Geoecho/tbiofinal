import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ArrowLeft, Calendar, User, Heart } from "lucide-react";
import { useStories } from "@/lib/adminStore";
import NotFound from "@/pages/not-found";

export default function StoryDetail() {
  const [, params] = useRoute("/initiatives/:slug");
  const slug = params?.slug;
  const [stories] = useStories();
  const story = stories.find((s) => s.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!story) {
    return <NotFound />;
  }

  // Deduplicate images list if thumbnail and first index are same
  const allImages = story.images && story.images.length > 0 
    ? story.images 
    : [story.img];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 lg:pt-40 pb-20 border-b-2 border-foreground text-left">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Link href="/#initiatives">
            <button
              className="inline-flex items-center gap-2 font-display tracking-widest text-xs mb-8 hover:text-primary transition-colors group uppercase font-bold cursor-pointer"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Initiatives
            </button>
          </Link>

          <div className="mb-10">
            <span className="inline-block bg-foreground text-background font-display uppercase tracking-widest text-xs px-3 py-1 mb-6 border-2 border-foreground">
              {story.category}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-[1.05] mb-6 text-foreground">
              {story.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-foreground/15 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-2">
                <User size={16} className="text-primary" />
                <span>{story.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>{story.date}</span>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <button className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
                  <Heart size={16} />
                  <span>{story.defaultLikes}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Simplified Image Showcase (supports multiple images) */}
          {allImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {allImages.map((img, i) => (
                <div 
                  key={i} 
                  className="aspect-video relative overflow-hidden border-2 border-foreground/15 bg-muted/10 group rounded-none"
                >
                  <img
                    src={img}
                    alt={`${story.title} - view ${i + 1}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Article Body */}
          <div className="max-w-3xl space-y-8">
            <p className="text-xl md:text-2xl font-medium leading-snug text-foreground">
              {story.excerpt}
            </p>

            {story.bodyText ? (
              story.bodyText.split("\n\n").map((para, idx) => (
                <p key={idx} className="text-base md:text-lg leading-relaxed text-foreground/85">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                No content published for this initiative yet.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
