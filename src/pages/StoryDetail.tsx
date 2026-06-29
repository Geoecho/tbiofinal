import { useEffect, useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ArrowLeft, Calendar, User, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useStories } from "@/lib/adminStore";
import NotFound from "@/pages/not-found";
import { maskImageUrl } from "@/lib/utils";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang, localizeStory, availableLangs } from "@/lib/i18n";

export default function StoryDetail() {
  const [, params] = useRoute("/stories-initiatives/:slug");
  const [, pubParams] = useRoute("/publications/:slug");
  const slug = params?.slug ?? pubParams?.slug;
  const [stories] = useStories();
  const [lang] = useLang();
  const rawStory = stories.find((s) => s.slug === slug);
  const story = rawStory ? localizeStory(rawStory, lang) : undefined;
  const langs = rawStory ? availableLangs(rawStory) : [];

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

  // Deduplicate images list if thumbnail and first gallery image are same.
  // Posts can be published without any image, so drop empty entries.
  const allImages = (story.images && story.images.length > 0
    ? [story.img, ...story.images.filter(img => img !== story.img)]
    : [story.img]).filter(img => !!img).map(maskImageUrl);

  const backTarget = story.type === "story"
    ? { href: "/#stories", label: "Stories" }
    : story.type === "publication"
    ? { href: "/#publications", label: "Publications" }
    : { href: "/#initiatives", label: "Initiatives" };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 lg:pt-40 pb-20 border-b-2 border-foreground text-left">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link href={backTarget.href}>
              <button
                className="inline-flex items-center gap-2 font-display tracking-widest text-xs hover:text-primary transition-colors group uppercase font-bold cursor-pointer"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to {backTarget.label}
              </button>
            </Link>
            {langs.length > 1 && <LanguageToggle langs={langs} className="shrink-0" />}
          </div>

          <div className="mb-10">
            <span className="inline-block bg-foreground text-background font-display uppercase tracking-widest text-xs px-3 py-1 mb-6 border-2 border-foreground">
              {story.category}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.02] mb-6 text-foreground">
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

          {/* Cover Image */}
          {allImages.length > 0 && (
            <div className="mb-12 relative w-full overflow-hidden rounded-none border-2 border-foreground/15" style={{ aspectRatio: "21/9" }}>
              <img
                src={allImages[0]}
                alt={story.title}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover pointer-events-none select-none"
                style={{ objectPosition: `center ${story.imgPosition ?? 50}%` }}
              />
              <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
            </div>
          )}

          {/* Article Body */}
          <div>
            <p className="text-xl md:text-2xl font-medium leading-snug text-foreground mb-12 border-l-4 border-primary pl-6 py-2">
              {story.excerpt}
            </p>

            {(() => {
              const blocks = story.blocks && story.blocks.length > 0 
                ? story.blocks 
                : (story.bodyText ? story.bodyText.split("\n\n").filter(p => p.trim().length > 0) : []).map((p, i) => ({
                    id: `legacy-${i}`,
                    type: "paragraph" as const,
                    text: p.trim()
                  }));
              const galleryImages = allImages.slice(1);

              // Get images assigned to a specific block index (0-based)
              const getImagesForBlock = (blockIdx: number) => {
                return galleryImages.filter((_, i) => {
                  const targetPara = story.imagePositions && story.imagePositions[i] !== undefined 
                    ? story.imagePositions[i] 
                    : i; // Default to index-matching fallback
                  return targetPara === blockIdx;
                });
              };

              // Get images assigned to out-of-bounds indices or explicitly set to bottom (-1 or >= blocks.length)
              const getUnplacedImages = () => {
                return galleryImages.filter((_, i) => {
                  const targetPara = story.imagePositions && story.imagePositions[i] !== undefined 
                    ? story.imagePositions[i] 
                    : i;
                  return targetPara >= blocks.length || targetPara < 0;
                });
              };

              return blocks.length > 0 ? (
                <>
                  {blocks.map((block, idx) => {
                    const paragraphImages = getImagesForBlock(idx);
                    return (
                      <div key={block.id}>
                        {block.type === "heading" ? (
                          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase mt-12 mb-6 text-foreground font-bold leading-tight border-b border-foreground/10 pb-2">
                            {block.text}
                          </h2>
                        ) : block.type === "subheading" ? (
                          <h3 className="font-display text-xl sm:text-2xl mt-8 mb-4 text-primary font-bold">
                            {block.text}
                          </h3>
                        ) : (
                          <p className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-10 font-medium font-sans">
                            {block.text}
                          </p>
                        )}
                        {paragraphImages.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="my-16 relative w-full bg-muted/10 border-2 border-foreground/15 overflow-hidden flex items-center justify-center">
                            <img
                              src={imgUrl}
                              alt={`${story.title} - image under block ${idx + 1}`}
                              loading="lazy"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                              className="w-full h-auto max-h-[75vh] object-contain pointer-events-none select-none mx-auto block"
                            />
                            <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  
                  {/* Render any unplaced or bottom images */}
                  {getUnplacedImages().map((imgUrl, imgIdx) => (
                    <div key={`extra-${imgIdx}`} className="my-16 relative w-full bg-muted/10 border-2 border-foreground/15 overflow-hidden flex items-center justify-center">
                      <img
                        src={imgUrl}
                        alt={`${story.title} - extra image`}
                        loading="lazy"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-auto max-h-[75vh] object-contain pointer-events-none select-none mx-auto block"
                      />
                      <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  No content published for this post yet.
                </p>
              );
            })()}
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
