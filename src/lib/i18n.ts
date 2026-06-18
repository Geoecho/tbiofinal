/**
 * Lightweight i18n for stories & initiatives posts.
 *
 * Only the *content* of posts is translatable (title, excerpt, category, body).
 * The rest of the site stays in English. Translations are admin-entered and
 * stored on each StoryEntry under `translations[lang]`; any missing field
 * gracefully falls back to the original English content.
 */

import { useState, useEffect } from "react";
import type { StoryEntry, StoryBlock } from "./adminStore";

export type LangCode = "en" | "mk";

export type Lang = {
  code: LangCode;
  /** Short label for the toggle pill, e.g. "EN". */
  label: string;
  /** Full name in its own language, e.g. "Македонски". */
  name: string;
};

// English is always the original. Add more entries here to support more
// languages — the admin form and toggle adapt automatically.
export const LANGS: Lang[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "mk", label: "МК", name: "Македонски" },
];

/** Languages that can hold a translation (everything except the original). */
export const TRANSLATABLE_LANGS: Lang[] = LANGS.filter((l) => l.code !== "en");

const STORAGE_KEY = "tbi_lang";
const LANG_UPDATE_EVENT = "tbi_lang_update";

function readStoredLang(): LangCode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && LANGS.some((l) => l.code === raw)) return raw as LangCode;
  } catch {
    /* localStorage unavailable */
  }
  return "en";
}

/**
 * Reactive language preference, shared across every component on the page and
 * persisted to localStorage so it survives navigation and reloads.
 */
export function useLang(): [LangCode, (lang: LangCode) => void] {
  const [lang, setLocal] = useState<LangCode>(readStoredLang);

  useEffect(() => {
    const handler = () => setLocal(readStoredLang());
    window.addEventListener(LANG_UPDATE_EVENT, handler);
    // Sync across tabs too.
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(LANG_UPDATE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setLang = (next: LangCode) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setLocal(next);
    window.dispatchEvent(new Event(LANG_UPDATE_EVENT));
  };

  return [lang, setLang];
}

const isFilled = (v?: string) => typeof v === "string" && v.trim().length > 0;

/**
 * Does this post have any usable translation for the given language?
 * Used to decide whether to surface the language toggle at all.
 */
export function hasTranslation(story: StoryEntry, lang: LangCode): boolean {
  if (lang === "en") return false;
  const t = story.translations?.[lang];
  if (!t) return false;
  return (
    isFilled(t.title) ||
    isFilled(t.excerpt) ||
    isFilled(t.category) ||
    (t.blocks?.some((b) => isFilled(b.text)) ?? false)
  );
}

/** The list of languages this specific post can be shown in (always incl. EN). */
export function availableLangs(story: StoryEntry): Lang[] {
  return LANGS.filter((l) => l.code === "en" || hasTranslation(story, l.code));
}

/**
 * Returns a copy of the story with its text fields swapped to the requested
 * language. Any field without a (non-empty) translation keeps the English
 * original. Block structure follows the English blocks so inline image
 * positioning stays aligned; only the text of each block is localized.
 */
export function localizeStory(story: StoryEntry, lang: LangCode): StoryEntry {
  if (lang === "en") return story;
  const t = story.translations?.[lang];
  if (!t) return story;

  // Build English block list the same way the renderer does, so we can merge
  // per-block translated text by id (falling back to index, then English).
  const baseBlocks: StoryBlock[] =
    story.blocks && story.blocks.length > 0
      ? story.blocks
      : (story.bodyText
          ? story.bodyText.split("\n\n").filter((p) => p.trim().length > 0)
          : []
        ).map((p, i) => ({ id: `legacy-${i}`, type: "paragraph" as const, text: p.trim() }));

  let blocks = story.blocks;
  let bodyText = story.bodyText;

  if (t.blocks && t.blocks.length > 0) {
    const byId = new Map(t.blocks.map((b) => [b.id, b]));
    const localizedBlocks = baseBlocks.map((b, i) => {
      const tb = byId.get(b.id) ?? t.blocks![i];
      return isFilled(tb?.text) ? { ...b, text: tb!.text } : b;
    });
    blocks = localizedBlocks;
    bodyText = localizedBlocks.map((b) => b.text.trim()).join("\n\n");
  }

  return {
    ...story,
    title: isFilled(t.title) ? t.title! : story.title,
    excerpt: isFilled(t.excerpt) ? t.excerpt! : story.excerpt,
    category: isFilled(t.category) ? t.category! : story.category,
    blocks,
    bodyText,
  };
}
