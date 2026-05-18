/**
 * Client-side data store for events and sponsor words.
 * Reads/writes to localStorage.
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

// ─── Getters / Setters ────────────────────────────────────────────────────────

const EVENTS_DATA_VERSION = "7";

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
