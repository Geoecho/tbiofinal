import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProjects } from "@/lib/adminStore";
import NotFound from "@/pages/not-found";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug;
  const [projects] = useProjects();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 lg:pt-36 pb-20 border-b-2 border-foreground text-left">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <Link href="/">
            <button className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm mb-8 hover:text-primary transition-colors">
              <ArrowLeft size={18} strokeWidth={3} /> Back to Home
            </button>
          </Link>

          <div className="mb-10">
            <div className="inline-block bg-foreground text-background font-display uppercase tracking-widest text-sm px-3 py-1 mb-6 border-2 border-foreground">
              {project.tag}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9] mb-6">
              {project.title}
            </h1>
            <div className="w-full h-2 bg-foreground"></div>
          </div>

          <div
            className={`${project.color || "bg-primary"} border-4 border-foreground p-8 md:p-12 mb-12 text-white`}
          >
            <div className="font-display text-4xl md:text-6xl uppercase leading-none">
              STATUS — {project.status}
            </div>
          </div>

          <div className="max-w-6xl space-y-8 mt-10">
            <p className="text-xl md:text-2xl font-medium leading-snug text-foreground">
              {project.desc}
            </p>

            <p className="text-base md:text-lg leading-relaxed text-foreground/85">
              {project.longDesc}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
