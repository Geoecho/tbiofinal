import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowButton } from "@/components/ui/arrow-button";
import { useProjects } from "@/lib/adminStore";
import NotFound from "@/pages/not-found";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug;
  const [projects] = useProjects();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 lg:pt-36 pb-20 border-b-2 border-foreground text-left">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
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

          <div className="grid lg:grid-cols-3 gap-12 mb-12">
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl md:text-4xl uppercase mb-4 border-b-4 border-foreground pb-2">
                The Idea
              </h2>
              <p className="text-lg md:text-xl leading-relaxed font-medium">
                {project.longDesc}
              </p>
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl uppercase mb-4 border-b-4 border-foreground pb-2">
                Goals
              </h2>
              <ul className="space-y-4">
                {project.goals?.map((goal) => (
                  <li key={goal} className="flex items-start gap-3 font-medium">
                    <CheckCircle2
                      size={22}
                      strokeWidth={3}
                      className="text-primary shrink-0 mt-1"
                    />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {project.timeline && project.timeline.length > 0 && (
            <div className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl uppercase mb-6 border-b-4 border-foreground pb-2">
                Roadmap
              </h2>
              <div className="border-4 border-foreground bg-background">
                {project.timeline.map((step, i) => (
                  <div
                    key={step.phase}
                    className={`flex items-center justify-between p-5 md:p-6 ${
                      i < project.timeline.length - 1
                        ? "border-b-4 border-foreground"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="font-display text-2xl md:text-3xl text-primary w-10 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="font-display text-lg md:text-2xl uppercase">
                        {step.phase}
                      </div>
                    </div>
                    <div className="font-bold uppercase tracking-widest text-xs md:text-sm bg-foreground text-background px-3 py-1.5 border-2 border-foreground">
                      {step.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-4 border-foreground bg-secondary p-8 md:p-12 text-white">
            <h2 className="font-display text-3xl md:text-5xl uppercase mb-4 leading-none">
              Want in on this one?
            </h2>
            <p className="text-lg font-medium mb-8">
              Apply to take part, mentor, sponsor, or just hear when this
              initiative officially opens.
            </p>
            <Link href="/#contact">
              <ArrowButton
                size="lg"
                className="w-full text-xl md:text-2xl py-7"
              >
                REGISTER INTEREST
              </ArrowButton>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
