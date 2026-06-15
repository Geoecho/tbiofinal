import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ArrowLeft, Calendar, User, Heart } from "lucide-react";
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

  if (!story) {
    if (stories.length === 0) {
      return <div className="min-h-screen bg-background" />;
    }
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
                <button className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
                  <Heart size={16} />
                  <span>{story.defaultLikes}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Single Image Showcase with Buttons */}
          {allImages.length > 0 && (
            <div className="mb-12 space-y-4">
              <div className="aspect-[21/9] w-full relative overflow-hidden border-2 border-foreground/15 bg-muted/10 group rounded-none">
                <img
                  src={allImages[currentImgIndex]}
                  alt={`${story.title} - view ${currentImgIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {allImages.length > 1 && (
                <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Image {currentImgIndex + 1} of {allImages.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                      className="font-display tracking-widest text-xs px-4 py-2 border border-foreground/15 hover:bg-foreground/5 uppercase font-bold cursor-pointer text-foreground bg-transparent"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setCurrentImgIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                      className="font-display tracking-widest text-xs px-4 py-2 border border-foreground/15 hover:bg-foreground/5 uppercase font-bold cursor-pointer text-foreground bg-transparent"
                    >
                      Next
                    </button>
                  </div>
                </div>
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
