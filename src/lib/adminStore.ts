/**
 * Client-side data store for events, sponsor words, projects, and stories.
 * Reads/writes to localStorage.
 */

import { useState, useEffect } from "react";
import { db, isFirebaseConfigured } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query 
} from "firebase/firestore";

const STORE_UPDATE_EVENT = "tbi_store_update";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventEntry = {
  slug: string;
  title: string;
  date: string;
  venue: string;
  desc: string;
};

export type SponsorWord = {
  text: string;
  cls: string;
};

export type ProjectEntry = {
  slug: string;
  title: string;
  tag: string;
  desc: string;
  color: string;
  status: string;
  longDesc: string;
  goals: string[];
  timeline: { phase: string; status: string }[];
};

export type StoryEntry = {
  slug: string;
  img: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  bodyText: string;
  defaultLikes: number;
  images?: string[];
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_EVENTS: EventEntry[] = [
  {
    slug: "impact-meetup",
    date: "02 June",
    title: "The Marketing Minds",
    venue: "Public Room",
    desc: "The future of marketing is being written right now - and we want you in the room where it happens.\nWe are proud to announce our very first event:\nThe Marketing Minds\nEvery expert was once a beginner. Every breakthrough started with a conversation. We're bringing three compelling and experienced voices from the marketing industry onto one stage — to share the ideas, the turning points, and the hard-won lessons that defined their careers. This is an evening for the curious. The ambitious. The ones who believe that the right conversation at the right time can change everything.\nFirst hand talks. Real stories. Genuine insight.\nEntry is free, seats are limited! Save your spot now!",
  },
];

export const DEFAULT_SPONSOR_WORDS: SponsorWord[] = [
  { text: "MENTOR",    cls: "bg-background text-foreground" },
  { text: "PATRON",    cls: "bg-secondary text-foreground" },
  { text: "SUPPORTER", cls: "bg-background text-foreground" },
  { text: "PARTNER",   cls: "bg-primary text-primary-foreground" },
  { text: "BUILDER",   cls: "bg-background text-foreground" },
  { text: "ALLY",      cls: "bg-accent text-primary-foreground" },
  { text: "PIONEER",   cls: "bg-background text-foreground" },
  { text: "CHAMPION",  cls: "bg-foreground text-background" },
  { text: "ADVOCATE",  cls: "bg-background text-foreground" },
  { text: "LEADER",    cls: "bg-background text-foreground" },
];

export const DEFAULT_PROJECTS: ProjectEntry[] = [
  {
    slug: "youth-storytelling-lab",
    title: "Youth Storytelling Lab",
    tag: "STORYTELLING",
    desc: "A structured space for young people to learn the craft of telling their own story through writing, photography, audio, and film.",
    color: "bg-[#e73e4c]",
    status: "IN PROGRESS",
    longDesc: "The Storytelling Lab is a structured space for young people to learn the craft of telling their own story — through writing, photography, audio, and short film. We believe stories shift culture, and the next chapter of our culture should be written by the people living it.",
    goals: [
      "Recruit a first cohort of 12 youth storytellers (ages 14–22).",
      "Pair each storyteller with a working journalist, filmmaker, or author as a mentor.",
      "Publish a founding-year anthology of stories on our platform and in print."
    ],
    timeline: [
      { phase: "Curriculum Design", status: "IN PROGRESS" },
      { phase: "Mentor Recruitment", status: "OPEN" },
      { phase: "First Cohort Launch", status: "PLANNED" },
      { phase: "Founding Anthology", status: "PLANNED" }
    ]
  },
  {
    slug: "mentorship-circles",
    title: "Mentorship Circles",
    tag: "MENTORSHIP",
    desc: "Small, intentional cohorts pairing young people with mentors who actually show up for real, recurring conversations.",
    color: "bg-[#1783de]",
    status: "OPEN",
    longDesc: "Mentorship Circles are small, intentional cohorts that pair young people with mentors who actually show up. No drive-by advice, no one-off events — real, recurring conversations over months, not minutes.",
    goals: [
      "Build a vetted roster of mentors across creative, technical, and entrepreneurial paths.",
      "Match youth with mentors based on goals, not just demographics.",
      "Facilitate monthly group circles plus 1:1 check-ins for every match."
    ],
    timeline: [
      { phase: "Mentor Application Open", status: "OPEN" },
      { phase: "Youth Application Open", status: "OPENING SOON" },
      { phase: "First Match Round", status: "PLANNED" },
      { phase: "First Circle Convening", status: "PLANNED" }
    ]
  },
  {
    slug: "creative-skills-workshops",
    title: "Creative Skills Workshops",
    tag: "WORKSHOPS",
    desc: "Free weekend workshops covering practical creative and technical skills taught by working practitioners.",
    color: "bg-black",
    status: "IN PROGRESS",
    longDesc: "Free, weekend workshops covering the practical creative skills schools tend to skip — design fundamentals, music production, code basics, and public speaking. Taught by working practitioners. No prior experience required.",
    goals: [
      "Run a rotating monthly workshop calendar across four core disciplines.",
      "Keep every workshop free at the point of access — forever.",
      "Build an alumni network so participants keep teaching each other after."
    ],
    timeline: [
      { phase: "Curriculum Drafting", status: "IN PROGRESS" },
      { phase: "Venue Partnerships", status: "OPEN" },
      { phase: "First Workshop", status: "PLANNED" },
      { phase: "Alumni Network Launch", status: "PLANNED" }
    ]
  },
  {
    slug: "community-projects-fund",
    title: "Community Projects Fund",
    tag: "MUTUAL AID",
    desc: "Micro-grants for youth-led ideas that improve their neighborhood. If a young person has a plan, we help fund the first version.",
    color: "bg-[#e73e4c]",
    status: "IN PROGRESS",
    longDesc: "Micro-grants for youth-led ideas that improve their neighborhood. From mural projects to community gardens to free tutoring co-ops — if a young person has a plan, we want to help fund the first version of it.",
    goals: [
      "Award the first ten micro-grants in our founding year.",
      "Pair every grant with light-touch project mentorship.",
      "Document every funded project so the next round of applicants can learn from it."
    ],
    timeline: [
      { phase: "Sponsor Goal", status: "IN PROGRESS" },
      { phase: "Application Window 1", status: "OPENING SOON" },
      { phase: "First Grants Awarded", status: "PLANNED" },
      { phase: "Impact Report", status: "PLANNED" }
    ]
  }
];

export const DEFAULT_STORIES: StoryEntry[] = [
  {
    slug: "unlocking-youth-potential",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80",
    category: "EMPOWERMENT",
    title: "Unlocking Youth Potential: Inspiring Success Stories",
    excerpt: "A deep dive into how young people across our community are breaking barriers and rewriting what's possible for their generation.",
    author: "TBIO Team",
    date: "MAR 15, 2026",
    bodyText: "This is where the full story of Unlocking Youth Potential will live. We are currently documenting the incredible impact of young people like TBIO Team to bring you deep-dives into their journey.\n\nEvery journey begins with a single step. For the team behind this initiative, it was about creating a platform that amplifies voices that often go unheard. In this detailed account, we explore the initial challenges, the breakthrough moments, and the unwavering commitment to community impact.\n\nAs we continue to build The Big Impact Organization, stories like these serve as the foundation of our mission. Stay tuned for more updates on this journey and how you can get involved.",
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
    bodyText: "This is where the full story of Empowering Tomorrow's Leaders: My Impact Journey will live. We are currently documenting the incredible impact of young people like Sarah J. to bring you deep-dives into their journey.\n\nEvery journey begins with a single step. For the team behind this initiative, it was about creating a platform that amplifies voices that often go unheard. In this detailed account, we explore the initial challenges, the breakthrough moments, and the unwavering commitment to community impact.\n\nAs we continue to build The Big Impact Organization, stories like these serve as the foundation of our mission. Stay tuned for more updates on this journey and how you can get involved.",
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
    bodyText: "This is where the full story of Spotlight on Young Talent: Stories That Inspire will live. We are currently documenting the incredible impact of young people like Marcus D. to bring you deep-dives into their journey.\n\nEvery journey begins with a single step. For the team behind this initiative, it was about creating a platform that amplifies voices that often go unheard. In this detailed account, we explore the initial challenges, the breakthrough moments, and the unwavering commitment to community impact.\n\nAs we continue to build The Big Impact Organization, stories like these serve as the foundation of our mission. Stay tuned for more updates on this journey and how you can get involved.",
    defaultLikes: 17,
  },
];

// ─── Getters / Setters ────────────────────────────────────────────────────────

const DATA_VERSION = "8"; // increment version to enforce defaults reload

export function getEvents(): EventEntry[] {
  try {
    const version = localStorage.getItem("tbi_data_version");
    if (version !== DATA_VERSION) {
      localStorage.removeItem("tbi_events");
      localStorage.setItem("tbi_data_version", DATA_VERSION);
    }
    const raw = localStorage.getItem("tbi_events");
    return raw ? (JSON.parse(raw) as EventEntry[]) : DEFAULT_EVENTS;
  } catch {
    return DEFAULT_EVENTS;
  }
}

export function setEvents(events: EventEntry[]): void {
  localStorage.setItem("tbi_events", JSON.stringify(events));
  window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
}

export function getSponsorWords(): SponsorWord[] {
  try {
    const raw = localStorage.getItem("tbi_sponsors");
    return raw ? (JSON.parse(raw) as SponsorWord[]) : DEFAULT_SPONSOR_WORDS;
  } catch {
    return DEFAULT_SPONSOR_WORDS;
  }
}

export function setSponsorWords(words: SponsorWord[]): void {
  localStorage.setItem("tbi_sponsors", JSON.stringify(words));
  window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
}

export function getProjects(): ProjectEntry[] {
  try {
    const version = localStorage.getItem("tbi_data_version");
    if (version !== DATA_VERSION) {
      localStorage.removeItem("tbi_projects");
      localStorage.setItem("tbi_data_version", DATA_VERSION);
    }
    const raw = localStorage.getItem("tbi_projects");
    return raw ? (JSON.parse(raw) as ProjectEntry[]) : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function setProjects(projects: ProjectEntry[]): void {
  localStorage.setItem("tbi_projects", JSON.stringify(projects));
  window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
}

export function getStories(): StoryEntry[] {
  try {
    const version = localStorage.getItem("tbi_data_version");
    if (version !== DATA_VERSION) {
      localStorage.removeItem("tbi_stories");
      localStorage.setItem("tbi_data_version", DATA_VERSION);
    }
    const raw = localStorage.getItem("tbi_stories");
    return raw ? (JSON.parse(raw) as StoryEntry[]) : DEFAULT_STORIES;
  } catch {
    return DEFAULT_STORIES;
  }
}

export function setStories(stories: StoryEntry[]): void {
  localStorage.setItem("tbi_stories", JSON.stringify(stories));
  window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
}

// ─── Reactive hooks ───────────────────────────────────────────────────────────

export function useEvents(): [EventEntry[], (e: EventEntry[]) => void] {
  const [events, setLocal] = useState<EventEntry[]>(() => isFirebaseConfigured ? [] : getEvents());

  useEffect(() => {
    if (!db) {
      const handler = () => setLocal(getEvents());
      window.addEventListener(STORE_UPDATE_EVENT, handler);
      return () => window.removeEventListener(STORE_UPDATE_EVENT, handler);
    }

    const q = query(collection(db, "events"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: EventEntry[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as EventEntry);
      });
      setLocal(list);
    });
    return unsubscribe;
  }, []);

  const setter = async (evts: EventEntry[]) => {
    if (!db) {
      setEvents(evts);
      setLocal(evts);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const existingSlugs = new Set(evts.map((e) => e.slug));
      for (const docSnap of querySnapshot.docs) {
        if (!existingSlugs.has(docSnap.id)) {
          await deleteDoc(doc(db, "events", docSnap.id));
        }
      }
      for (const evt of evts) {
        await setDoc(doc(db, "events", evt.slug), evt);
      }
    } catch (err) {
      console.error("Error setting events in Firestore:", err);
    }
  };

  return [events, setter];
}

export function useSponsorWords(): [SponsorWord[], (w: SponsorWord[]) => void] {
  const [words, setLocal] = useState<SponsorWord[]>(getSponsorWords);

  useEffect(() => {
    const handler = () => setLocal(getSponsorWords());
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    return () => window.removeEventListener(STORE_UPDATE_EVENT, handler);
  }, []);

  const setter = (ws: SponsorWord[]) => {
    setSponsorWords(ws);
    setLocal(ws);
  };

  return [words, setter];
}

export function useProjects(): [ProjectEntry[], (p: ProjectEntry[]) => void] {
  const [projects, setLocal] = useState<ProjectEntry[]>(() => isFirebaseConfigured ? [] : getProjects());

  useEffect(() => {
    if (!db) {
      const handler = () => setLocal(getProjects());
      window.addEventListener(STORE_UPDATE_EVENT, handler);
      return () => window.removeEventListener(STORE_UPDATE_EVENT, handler);
    }

    const q = query(collection(db, "projects"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ProjectEntry[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as ProjectEntry);
      });
      setLocal(list);
    });
    return unsubscribe;
  }, []);

  const setter = async (prjs: ProjectEntry[]) => {
    if (!db) {
      setProjects(prjs);
      setLocal(prjs);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const existingSlugs = new Set(prjs.map((p) => p.slug));
      for (const docSnap of querySnapshot.docs) {
        if (!existingSlugs.has(docSnap.id)) {
          await deleteDoc(doc(db, "projects", docSnap.id));
        }
      }
      for (const prj of prjs) {
        await setDoc(doc(db, "projects", prj.slug), prj);
      }
    } catch (err) {
      console.error("Error setting projects in Firestore:", err);
    }
  };

  return [projects, setter];
}

export function useStories(): [StoryEntry[], (s: StoryEntry[]) => void] {
  const [stories, setLocal] = useState<StoryEntry[]>(() => isFirebaseConfigured ? [] : getStories());

  useEffect(() => {
    if (!db) {
      const handler = () => setLocal(getStories());
      window.addEventListener(STORE_UPDATE_EVENT, handler);
      return () => window.removeEventListener(STORE_UPDATE_EVENT, handler);
    }

    const q = query(collection(db, "stories"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: StoryEntry[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as StoryEntry);
      });
      setLocal(list);
    });
    return unsubscribe;
  }, []);

  const setter = async (strs: StoryEntry[]) => {
    if (!db) {
      setStories(strs);
      setLocal(strs);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, "stories"));
      const existingSlugs = new Set(strs.map((s) => s.slug));
      for (const docSnap of querySnapshot.docs) {
        if (!existingSlugs.has(docSnap.id)) {
          await deleteDoc(doc(db, "stories", docSnap.id));
        }
      }
      for (const story of strs) {
        await setDoc(doc(db, "stories", story.slug), story);
      }
    } catch (err) {
      console.error("Error setting stories in Firestore:", err);
    }
  };

  return [stories, setter];
}

// ─── Auto-seeding logic ───────────────────────────────────────────────────────

export async function autoSeedFirebase() {
  if (!isFirebaseConfigured || !db) return;

  try {
    const configSnap = await getDocs(collection(db, "admin_config"));
    if (!configSnap.empty) {
      console.log("Firebase already initialized (admin_config is not empty). Skipping auto-seeding.");
      return;
    }

    console.log("First-time setup: Seeding admin configurations...");

    // Seed default passcode configurations
    await setDoc(doc(db, "admin_config", "passcode"), {
      validPasscodes: ["admin", "tbio2026"]
    });

    // Mark database as seeded
    await setDoc(doc(db, "admin_config", "seeding"), { seeded: true });
    console.log("Seeding complete. Default content seeding is disabled for a clean start.");
  } catch (err) {
    console.error("Error seeding Firebase:", err);
  }
}

if (isFirebaseConfigured) {
  autoSeedFirebase();
}
