/**
 * Client-side data store for events, sponsor words, projects, and stories.
 * Reads/writes to localStorage.
 */

import { useState, useEffect } from "react";
import { db, isFirebaseConfigured } from "./firebase";
import { toast } from "sonner";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query,
  increment,
  updateDoc
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
  tagColor?: string;
  type?: "story" | "initiative";
  imagePositions?: number[];
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
    type: "story",
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
    type: "initiative",
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
    type: "story",
  },
];

// ─── Getters / Setters ────────────────────────────────────────────────────────

const DATA_VERSION = "9"; // increment version to enforce defaults reload

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
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: EventEntry[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as EventEntry);
        });
        setLocal(list);
      },
      (err) => {
        console.error("Firestore events subscription error:", err);
        toast.error(`Database Read Error (Events): ${err.message}`);
      }
    );
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
    } catch (err: any) {
      console.error("Error setting events in Firestore:", err);
      toast.error(`Database Write Error (Events): ${err.message}`);
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

export function useStories(): [StoryEntry[], (s: StoryEntry[]) => void] {
  const [stories, setLocal] = useState<StoryEntry[]>(() => isFirebaseConfigured ? [] : getStories());

  useEffect(() => {
    if (!db) {
      const handler = () => setLocal(getStories());
      window.addEventListener(STORE_UPDATE_EVENT, handler);
      return () => window.removeEventListener(STORE_UPDATE_EVENT, handler);
    }

    const q = query(collection(db, "stories"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: StoryEntry[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as StoryEntry);
        });
        setLocal(list);
      },
      (err) => {
        console.error("Firestore stories subscription error:", err);
        toast.error(`Database Read Error (Initiatives): ${err.message}`);
      }
    );
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
    } catch (err: any) {
      console.error("Error setting stories in Firestore:", err);
      toast.error(`Database Write Error (Initiatives): ${err.message}`);
    }
  };

  return [stories, setter];
}

export async function incrementStoryLikes(slug: string) {
  if (!isFirebaseConfigured) {
    const stories = getStories();
    const idx = stories.findIndex((s) => s.slug === slug);
    if (idx >= 0) {
      stories[idx].defaultLikes += 1;
      setStories(stories);
    }
    return;
  }
  
  try {
    const docRef = doc(db!, "stories", slug);
    await updateDoc(docRef, {
      defaultLikes: increment(1)
    });
  } catch (err) {
    console.error("Failed to increment likes", err);
  }
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
  } catch (err: any) {
    console.error("Error seeding Firebase:", err);
    toast.error(`Firebase Seeding Failed: ${err.message}`);
  }
}

if (isFirebaseConfigured) {
  autoSeedFirebase();
}
