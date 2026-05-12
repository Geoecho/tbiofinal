/**
 * Client-side admin data store.
 * Reads/writes to localStorage so admins can manage events, sponsor words,
 * and view story submissions without a backend.
 */

import { useState, useEffect } from "react";

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

export type StorySubmission = {
  id: string;
  name: string;
  age?: string;
  title: string;
  format: "speak" | "show" | "write";
  text?: string;
  audioFileName?: string;
  imageCount?: number;
  submittedAt: string;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_EVENTS: EventEntry[] = [
  {
    slug: "founding-meetup",
    date: "15 May",
    title: "Founding Meet-up",
    venue: "Limak Luxury Hotel",
    desc: "Our very first community gathering. Meet the team, hear the vision, and help shape what we build first.",
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

// ─── Getters / Setters ────────────────────────────────────────────────────────

const EVENTS_DATA_VERSION = "2";

export function getEvents(): EventEntry[] {
  try {
    const version = localStorage.getItem("tbi_events_version");
    if (version !== EVENTS_DATA_VERSION) {
      localStorage.removeItem("tbi_events");
      localStorage.setItem("tbi_events_version", EVENTS_DATA_VERSION);
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

export function getStories(): StorySubmission[] {
  try {
    const raw = localStorage.getItem("tbi_stories");
    return raw ? (JSON.parse(raw) as StorySubmission[]) : [];
  } catch {
    return [];
  }
}

export function addStory(story: StorySubmission): void {
  const current = getStories();
  localStorage.setItem("tbi_stories", JSON.stringify([story, ...current]));
  window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
}

export function removeStory(id: string): void {
  const current = getStories().filter((s) => s.id !== id);
  localStorage.setItem("tbi_stories", JSON.stringify(current));
  window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD =
  (import.meta as unknown as { env: Record<string, string> }).env
    .VITE_ADMIN_PASSWORD || "impact2026";

export function checkAdminPassword(pw: string): boolean {
  return pw === ADMIN_PASSWORD;
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem("tbi_admin") === "1";
}

export function adminLogin(pw: string): boolean {
  if (checkAdminPassword(pw)) {
    sessionStorage.setItem("tbi_admin", "1");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem("tbi_admin");
}

// ─── Reactive hooks ───────────────────────────────────────────────────────────

export function useEvents(): [EventEntry[], (e: EventEntry[]) => void] {
  const [events, setLocal] = useState<EventEntry[]>(getEvents);

  useEffect(() => {
    const handler = () => setLocal(getEvents());
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    return () => window.removeEventListener(STORE_UPDATE_EVENT, handler);
  }, []);

  const setter = (evts: EventEntry[]) => {
    setEvents(evts);
    setLocal(evts);
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

export function useStories(): [StorySubmission[], (id: string) => void] {
  const [stories, setLocal] = useState<StorySubmission[]>(getStories);

  useEffect(() => {
    const handler = () => setLocal(getStories());
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    return () => window.removeEventListener(STORE_UPDATE_EVENT, handler);
  }, []);

  const remove = (id: string) => {
    removeStory(id);
    setLocal((prev) => prev.filter((s) => s.id !== id));
  };

  return [stories, remove];
}
