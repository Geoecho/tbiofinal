import { useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ArrowLeft, Calendar, User, Share2, Heart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { STORIES } from "@/components/Stories";
import NotFound from "@/pages/not-found";

export default function StoryDetail() {
  const [, params] = useRoute("/stories/:slug");
  const slug = params?.slug;
  const story = STORIES.find((s) => s.slug === slug);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, 200]);
  const titleY = useTransform(scrollY, [0, 800], [0, -80]);
  const overlayOpacity = useTransform(scrollY, [0, 600], [0.55, 0.85]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!story) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pb-20">
        {/* Full Width Hero Image with Parallax + Centered Title */}
        <div
          ref={heroRef}
          className="relative w-full h-screen overflow-hidden border-b-2 border-foreground bg-muted/20"
        >
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-0 -top-20 -bottom-20"
          >
            <img
              src={story.img}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Dark overlay */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-foreground"
          />

          {/* Centered title overlay */}
          <motion.div
            style={{ y: titleY }}
            className="relative z-10 h-full w-full flex items-center justify-center px-4"
          >
            <div className="container mx-auto text-center">
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase leading-[0.9] text-white max-w-5xl mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                {story.title}
              </h1>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-bold uppercase tracking-widest text-white/80">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-accent" />
                  <span>{story.author}</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-accent" />
                  <span>{story.date}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 mt-16">
          <div className="flex flex-col gap-4">
            <Link href="/">
              <button
                className="inline-flex items-center gap-2 font-display tracking-widest text-sm mb-12 hover:text-primary transition-colors group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </button>
            </Link>

            <article className="w-full">
              <header className="mb-12">
                <div className="flex flex-wrap items-center gap-6 py-6 border-y-2 border-foreground/10 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    <span>{story.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    <span>{story.date}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <button className="hover:text-primary transition-colors flex items-center gap-2">
                      <Heart size={18} />
                      <span>{story.defaultLikes}</span>
                    </button>
                    <button className="hover:text-primary transition-colors flex items-center gap-2">
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </header>

              <div className="max-w-3xl space-y-8">
                <p className="text-xl md:text-2xl font-medium leading-snug text-foreground">
                  {story.excerpt}
                </p>

                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  This is where the full story of <strong className="text-foreground">{story.title}</strong> will live.
                  We are currently documenting the incredible impact of young people like {story.author}
                  to bring you deep-dives into their journey.
                </p>

                <h2 className="font-display text-2xl md:text-3xl uppercase pt-4">The Vision</h2>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Every journey begins with a single step. For the team behind this initiative,
                  it was about creating a platform that amplifies voices that often go unheard.
                  In this detailed account, we explore the initial challenges, the breakthrough moments,
                  and the unwavering commitment to community impact.
                </p>

                <h2 className="font-display text-2xl md:text-3xl uppercase pt-4">Looking Ahead</h2>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  As we continue to build <strong className="text-foreground">The Big Impact Organization</strong>,
                  stories like these serve as the foundation of our mission. Stay tuned for more
                  updates on this journey and how you can get involved.
                </p>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
