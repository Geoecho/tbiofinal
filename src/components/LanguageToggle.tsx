import { Globe } from "lucide-react";
import { useLang, LANGS, type Lang } from "@/lib/i18n";

/**
 * Compact language switch for stories & initiatives posts (e.g. EN | МК).
 *
 * Pass `langs` to limit the choices (e.g. only the languages a given post has
 * been translated into). Defaults to every supported language.
 */
export function LanguageToggle({
  langs = LANGS,
  className = "",
}: {
  langs?: Lang[];
  className?: string;
}) {
  const [lang, setLang] = useLang();

  // Nothing to switch between — don't render an empty control.
  if (langs.length < 2) return null;

  return (
    <div
      className={`inline-flex items-center border-2 border-foreground ${className}`}
      role="group"
      aria-label="Choose language"
    >
      <span className="flex items-center px-2 self-stretch border-r-2 border-foreground text-foreground/70">
        <Globe size={14} aria-hidden="true" />
      </span>
      {langs.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            title={l.name}
            className={`font-display font-bold uppercase tracking-widest text-xs px-3 py-1.5 transition-colors cursor-pointer ${
              active
                ? "bg-foreground text-background"
                : "bg-background text-foreground hover:bg-foreground/10"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
