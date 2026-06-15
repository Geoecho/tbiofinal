import { useEffect, useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ArrowLeft, Calendar, User, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useStories } from "@/lib/adminStore";
import NotFound from "@/pages/not-found";

export default function StoryDetail() {
  const [, params] = useRoute("/stories-initiatives/:slug");
  const slug = params?.slug;
  const [stories] = useStories();
  const story = stories.find((s) => s.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [liked, setLiked] = useState(() => {
    return localStorage.getItem(`tbi_liked_${slug}`) === "true";
  });
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (story) {
      setLikes(story.defaultLikes || 0);
    }
  }, [story?.defaultLikes]);

  const handleLike = () => {
    if (!liked && story) {
      setLiked(true);
      setLikes((prev) => prev + 1);
      localStorage.setItem(`tbi_liked_${story.slug}`, "true");
      import("@/lib/adminStore").then(({ incrementStoryLikes }) => incrementStoryLikes(story.slug));
    }
  };

  const scrollCarousel = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  if (!story) {
    if (stories.length === 0) {
      return <div className="min-h-screen bg-background" />;
    }
    return <NotFound />;
  }

  // Deduplicate images list if thumbnail and first gallery image are same
  const allImages = story.images && story.images.length > 0 
    ? [story.img, ...story.images.filter(img => img !== story.img)]
    : [story.img];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 lg:pt-40 pb-20 border-b-2 border-foreground text-left">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <Link href="/#stories-initiatives">
            <button
              className="inline-flex items-center gap-2 font-display tracking-widest text-xs mb-8 hover:text-primary transition-colors group uppercase font-bold cursor-pointer"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Stories & Initiatives
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
                <Calendar size={16} className="text-primary" />
                <span>{story.date}</span>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <button 
                  onClick={handleLike}
                  className={`transition-colors flex items-center gap-2 cursor-pointer ${liked ? "text-primary" : "hover:text-primary"}`}
                >
                  <Heart size={16} className={`transition-all ${liked ? "fill-primary scale-110" : ""}`} />
                  <span>{likes}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Single Image Showcase with Buttons */}
          {allImages.length > 0 && (
            <div className="mb-12 space-y-4 relative group/carousel">
              <div 
                ref={carouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full border-2 border-foreground/15 bg-muted/10 group rounded-none"
              >
                {allImages.map((img, idx) => (
                  <div key={idx} className="relative w-full shrink-0 snap-center aspect-square md:aspect-[16/9] bg-muted/20">
                    <img
                      src={img}
                      alt={`${story.title} - view ${idx + 1}`}
                      loading="lazy"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-contain md:object-cover transition-all duration-500 pointer-events-none select-none"
                    />
                    {/* Invisible Overlay to block right-click downloading */}
                    <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                  </div>
                ))}
              </div>

              {allImages.length > 1 && (
                <>
                  <div className="flex justify-center items-center py-2 border-b border-foreground/10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Swipe to view more images
                  </div>
                  
                  {/* Desktop navigation buttons */}
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                    <button 
                      onClick={() => scrollCarousel("left")}
                      className="p-2 bg-background/80 backdrop-blur border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                      aria-label="Scroll Left"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  </div>
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-4 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                    <button 
                      onClick={() => scrollCarousel("right")}
                      className="p-2 bg-background/80 backdrop-blur border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                      aria-label="Scroll Right"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Article Body */}
          <div className="max-w-6xl space-y-8">
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
