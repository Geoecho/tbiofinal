import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { ArrowButton } from "./ui/arrow-button";

export const STORIES = [
  {
    slug: "unlocking-youth-potential",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80",
    category: "EMPOWERMENT",
    title: "Unlocking Youth Potential: Inspiring Success Stories",
    excerpt: "A deep dive into how young people across our community are breaking barriers and rewriting what's possible for their generation.",
    author: "TBIO Team",
    date: "MAR 15, 2026",
    accent: "bg-primary",
    textColor: "text-white",
    defaultLikes: 24,
  },
  {
    slug: "empowering-tomorrows-leaders",
    img: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=600&q=80",
    category: "IMPACT",
    title: "Empowering Tomorrow's Leaders: My Impact Journey",
    excerpt: "One young person's account of what it means to step up, take ownership, and lead something bigger than yourself.",
    author: "Sarah J.",
    date: "APR 02, 2026",
    accent: "bg-primary",
    defaultLikes: 41,
  },
  {
    slug: "spotlight-on-young-talent",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
    category: "COMMUNITY",
    title: "Spotlight on Young Talent: Stories That Inspire",
    excerpt: "We shine a light on the young creators, builders, and dreamers who are already making waves — before the world catches up.",
    author: "Marcus D.",
    date: "APR 10, 2026",
    accent: "bg-primary",
    textColor: "text-white",
    defaultLikes: 17,
  },
];

function StoryCard({ card, index }: { card: typeof STORIES[0]; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(card.defaultLikes);
  const [shared, setShared] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

  return (
    <Link href={`/stories/${card.slug}`}>
      <article
        className="border border-foreground/15 bg-background flex flex-col group overflow-hidden h-full cursor-pointer"
      >
        {/* Image */}
        <div className="relative overflow-hidden h-52 shrink-0 border-b border-foreground/15">
          <img
            src={card.img}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 gap-3">
          <h3 className="font-display text-xl md:text-2xl leading-tight group-hover:text-primary transition-colors text-foreground">
            {card.title}
          </h3>

          {/* Engagement row */}
          <div className="flex items-center gap-4 pt-3 border-t-2 border-foreground/10 mt-auto">
            <button
              onClick={handleLike}
              aria-label={liked ? "Unlike" : "Like"}
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${liked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              <Heart
                size={15}
                strokeWidth={2.5}
                className={`transition-all ${liked ? "fill-primary scale-110" : ""}`}
              />
              <span>{likes}</span>
            </button>

            <button
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all duration-200"
              aria-label="Comments"
            >
              <MessageCircle size={15} strokeWidth={2.5} />
              <span>0</span>
            </button>
          </div>
        </div>

        {/* Bottom accent bar removed */}
      </article>
    </Link>
  );
}

export function Stories({ showHeader = true }: { showHeader?: boolean }) {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section
      id="stories"
      className="scroll-mt-28 lg:scroll-mt-36 py-20 lg:py-32 border-b border-foreground/15 overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {showHeader && (
          <div className="relative flex items-center justify-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl leading-[1.1] text-center">
              Inspiring Stories
            </h2>
          </div>
        )}

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {STORIES.map((card, i) => (
            <StoryCard key={card.title} card={card} index={i} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="sm:hidden relative -mx-4 lg:-mx-8">
          <div 
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 px-4"
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.offsetWidth;
              const index = Math.round(scrollLeft / width);
              setActiveCard(index);
            }}
          >
            {STORIES.map((card, i) => (
              <div key={card.title} className="snap-center shrink-0 w-[85vw]">
                <StoryCard card={card} index={i} />
              </div>
            ))}
          </div>
          
          {/* Indicator dots */}
          <div className="flex justify-center gap-2 mt-4">
            {STORIES.map((_, i) => (
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
