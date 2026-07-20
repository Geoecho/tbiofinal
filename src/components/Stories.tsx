import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useStories, incrementStoryLikes, storyHref, type StoryEntry } from "@/lib/adminStore";
import { maskImageUrl } from "@/lib/utils";
import { useLang, localizeStory } from "@/lib/i18n";

function StoryCard({ card, index }: { card: StoryEntry; index: number }) {
  const [liked, setLiked] = useState(() => {
    return localStorage.getItem(`tbi_liked_${card.slug}`) === "true";
  });
  const [likes, setLikes] = useState(card.defaultLikes || 0);

  useEffect(() => {
    // If the database has a higher like count than our local state, update it
    setLikes(card.defaultLikes || 0);
  }, [card.defaultLikes]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      setLikes((prev) => prev + 1);
      localStorage.setItem(`tbi_liked_${card.slug}`, "true");
      incrementStoryLikes(card.slug);
    }
  };

  const tagColorClass = card.tagColor === "primary" ? "bg-primary text-primary-foreground" :
                        card.tagColor === "secondary" ? "bg-secondary text-secondary-foreground" :
                        card.tagColor === "accent" ? "bg-accent text-accent-foreground" :
                        card.tagColor === "destructive" ? "bg-destructive text-destructive-foreground" :
                        card.tagColor === "foreground" ? "bg-foreground text-background" :
                        "bg-background/90 text-foreground backdrop-blur";

  return (
    <Link href={storyHref(card)}>
      <article
        className="border border-foreground/15 bg-background flex flex-col group overflow-hidden h-full cursor-pointer"
      >
        {/* Image (optional — posts can be published without one) */}
        {card.img ? (
          <div className="relative overflow-hidden aspect-square sm:aspect-[16/10] shrink-0 border-b border-foreground/15 bg-muted/20">
            <img
              src={maskImageUrl(card.img)}
              alt="" aria-hidden="true"
              aria-hidden="true"
              loading="lazy"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 pointer-events-none select-none"
              style={{ objectPosition: `center ${card.imgPosition ?? 50}%` }}
            />
            {/* Invisible Overlay to block right-click downloading */}
            <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
            {card.category && (
              <div className={`absolute top-4 right-4 font-display text-xs font-bold uppercase tracking-widest px-3 py-1 border border-foreground/15 ${tagColorClass}`}>
                {card.category}
              </div>
            )}
          </div>
        ) : (
          card.category && (
            <div className="border-b border-foreground/15 px-5 pt-5 pb-4">
              <span className={`inline-block font-display text-xs font-bold uppercase tracking-widest px-3 py-1 border border-foreground/15 ${tagColorClass}`}>
                {card.category}
              </span>
            </div>
          )
        )}

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-2.5">
          <h3 className="font-display text-lg md:text-xl leading-tight group-hover:text-primary transition-colors text-foreground text-left">
            {card.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {card.excerpt || card.bodyText}
          </p>

          {/* Engagement row */}
          <div className="flex items-center gap-4 pt-3 border-t-2 border-foreground/10 mt-auto">
              <button
                onClick={handleLike}
                aria-label={liked ? "Liked" : "Like"}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${liked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                <Heart
                  size={15}
                  strokeWidth={2.5}
                  className={`transition-all ${liked ? "fill-primary scale-110" : ""}`}
                />
                <span>{likes}</span>
              </button>
            </div>
        </div>
      </article>
    </Link>
  );
}

export function Stories({ 
  sectionId = "stories", 
  sectionTitle = "Stories", 
  filterFn = () => true 
}: { 
  sectionId?: string; 
  sectionTitle?: string; 
  filterFn?: (story: StoryEntry) => boolean 
}) {
  const [allStories] = useStories();
  const [lang] = useLang();
  // Filter on the original (English) fields, then localize the survivors so the
  // type/category-based filtering above keeps working regardless of language.
  const stories = allStories.filter(filterFn).map((s) => localizeStory(s, lang));
  const [activeCard, setActiveCard] = useState(0);

  if (stories.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="scroll-mt-28 lg:scroll-mt-36 py-20 lg:py-32 border-b border-foreground/15 overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative flex items-center justify-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl leading-[1.1] text-center uppercase">
            {sectionTitle}
          </h2>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.map((card, i) => (
            <StoryCard key={card.slug} card={card} index={i} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="sm:hidden relative">
          <div
            className={`flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 ${stories.length === 1 ? "justify-center" : ""}`}
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.offsetWidth;
              const index = Math.round(scrollLeft / width);
              setActiveCard(index);
            }}
          >
            {stories.map((card, i) => (
              <div key={card.slug} className={`snap-center shrink-0 ${stories.length === 1 ? "w-full" : "w-[calc(100%-2rem)]"}`}>
                <StoryCard card={card} index={i} />
              </div>
            ))}
          </div>

          {/* Indicator dots */}
          <div className="flex justify-center gap-2 mt-4">
            {stories.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 transition-all duration-300 ${activeCard === i ? "w-8 bg-primary" : "w-2 bg-foreground/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
