import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowButton } from "@/components/ui/arrow-button";
const PROJECTS: { slug: string; title: string; tag: string; desc: string; color: string; status: string }[] = [];
import NotFound from "@/pages/not-found";

const PROJECT_DETAILS: Record<
  string,
  {
    longDesc: string;
    goals: string[];
    timeline: { phase: string; status: string }[];
  }
> = {
  "youth-storytelling-lab": {
    longDesc:
      "The Storytelling Lab is a structured space for young people to learn the craft of telling their own story — through writing, photography, audio, and short film. We believe stories shift culture, and the next chapter of our culture should be written by the people living it.",
    goals: [
      "Recruit a first cohort of 12 youth storytellers (ages 14–22).",
      "Pair each storyteller with a working journalist, filmmaker, or author as a mentor.",
      "Publish a founding-year anthology of stories on our platform and in print.",
    ],
    timeline: [
      { phase: "Curriculum Design", status: "IN PROGRESS" },
      { phase: "Mentor Recruitment", status: "OPEN" },
      { phase: "First Cohort Launch", status: "PLANNED" },
      { phase: "Founding Anthology", status: "PLANNED" },
    ],
  },
  "mentorship-circles": {
    longDesc:
      "Mentorship Circles are small, intentional cohorts that pair young people with mentors who actually show up. No drive-by advice, no one-off events — real, recurring conversations over months, not minutes.",
    goals: [
      "Build a vetted roster of mentors across creative, technical, and entrepreneurial paths.",
      "Match youth with mentors based on goals, not just demographics.",
      "Facilitate monthly group circles plus 1:1 check-ins for every match.",
    ],
    timeline: [
      { phase: "Mentor Application Open", status: "OPEN" },
      { phase: "Youth Application Open", status: "OPENING SOON" },
      { phase: "First Match Round", status: "PLANNED" },
      { phase: "First Circle Convening", status: "PLANNED" },
    ],
  },
  "creative-skills-workshops": {
    longDesc:
      "Free, weekend workshops covering the practical creative skills schools tend to skip — design fundamentals, music production, code basics, and public speaking. Taught by working practitioners. No prior experience required.",
    goals: [
      "Run a rotating monthly workshop calendar across four core disciplines.",
      "Keep every workshop free at the point of access — forever.",
      "Build an alumni network so participants keep teaching each other after.",
    ],
    timeline: [
      { phase: "Curriculum Drafting", status: "IN PROGRESS" },
      { phase: "Venue Partnerships", status: "OPEN" },
      { phase: "First Workshop", status: "PLANNED" },
      { phase: "Alumni Network Launch", status: "PLANNED" },
    ],
  },
  "community-projects-fund": {
    longDesc:
      "Micro-grants for youth-led ideas that improve their neighborhood. From mural projects to community gardens to free tutoring co-ops — if a young person has a plan, we want to help fund the first version of it.",
    goals: [
      "Award the first ten micro-grants in our founding year.",
      "Pair every grant with light-touch project mentorship.",
      "Document every funded project so the next round of applicants can learn from it.",
    ],
    timeline: [
      { phase: "Sponsor Goal", status: "IN PROGRESS" },
      { phase: "Application Window 1", status: "OPENING SOON" },
      { phase: "First Grants Awarded", status: "PLANNED" },
      { phase: "Impact Report", status: "PLANNED" },
    ],
  },
};

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug;
  const project = PROJECTS.find((p) => p.slug === slug);
  const details = slug ? PROJECT_DETAILS[slug] : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!project || !details) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 lg:pt-36 pb-20 border-b-2 border-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <Link href="/#projects">
            <button className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm mb-8 hover:text-primary transition-colors">
              <ArrowLeft size={18} strokeWidth={3} /> Back to Initiatives
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
            className={`${project.color} border-4 border-foreground p-8 md:p-12 mb-12`}
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
                {details.longDesc}
              </p>
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl uppercase mb-4 border-b-4 border-foreground pb-2">
                Goals
              </h2>
              <ul className="space-y-4">
                {details.goals.map((goal) => (
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

          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl uppercase mb-6 border-b-4 border-foreground pb-2">
              Roadmap
            </h2>
            <div className="border-4 border-foreground bg-background">
              {details.timeline.map((step, i) => (
                <div
                  key={step.phase}
                  className={`flex items-center justify-between p-5 md:p-6 ${
                    i < details.timeline.length - 1
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

          <div className="border-4 border-foreground bg-secondary p-8 md:p-12">
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
