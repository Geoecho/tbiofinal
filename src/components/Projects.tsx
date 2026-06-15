import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useProjects, type ProjectEntry } from "@/lib/adminStore";

function ProjectCard({ card, index }: { card: ProjectEntry; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(card.defaultLikes || 0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <Link href={`/projects/${card.slug}`}>
      <article
        className="border border-foreground/15 bg-background flex flex-col group overflow-hidden h-full cursor-pointer"
      >
        {/* Image */}
        <div className="relative overflow-hidden h-52 shrink-0 border-b border-foreground/15">
          <img
            src={card.img}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 gap-3">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">
            {card.category || card.tag}
          </span>
          <h3 className="font-display text-xl md:text-2xl leading-tight group-hover:text-primary transition-colors text-foreground text-left">
            {card.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {card.excerpt || card.desc}
          </p>

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
      </article>
    </Link>
  );
}

export function Projects({ showHeader = true }: { showHeader?: boolean }) {
  const [projects] = useProjects();
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section
      id="initiatives"
      className="scroll-mt-28 lg:scroll-mt-36 py-20 lg:py-32 border-b border-foreground/15 overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {showHeader && (
          <div className="relative flex items-center justify-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl leading-[1.1] text-center uppercase">
              Our Initiatives
            </h2>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No initiatives published yet.
          </div>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((card, i) => (
                <ProjectCard key={card.slug} card={card} index={i} />
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
                {projects.map((card, i) => (
                  <div key={card.slug} className="snap-center shrink-0 w-[85vw]">
                    <ProjectCard card={card} index={i} />
                  </div>
                ))}
              </div>

              {/* Indicator dots */}
              <div className="flex justify-center gap-2 mt-4">
                {projects.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 transition-all duration-300 ${activeCard === i ? "w-8 bg-primary" : "w-2 bg-foreground/20"}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
