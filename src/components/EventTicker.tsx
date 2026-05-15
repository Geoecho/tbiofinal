import { useEvents } from "@/lib/adminStore";
import { Link } from "wouter";

export function EventTicker() {
  const [events] = useEvents();
  // Multiply items to ensure the line is long enough for any screen size
  const baseItems = events.length > 0 ? events : [{ title: "The Big Impact Organization", slug: "about", status: "Est. 2026" }];
  const items = Array(15).fill(baseItems).flat();

  return (
    <div className="w-full bg-background text-foreground border-b border-foreground/15 overflow-hidden shrink-0 flex items-stretch group/ticker relative z-10">
      <style>{`
        @keyframes event-ticker-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-animate {
          animation: event-ticker-infinite 60s linear infinite;
        }
        .group\\/ticker:hover .ticker-animate {
          animation-play-state: paused;
        }
      `}</style>

      {/* Scrolling ticker */}
      <div className="flex-1 flex items-center py-3 relative overflow-hidden">
        <div
          className="flex whitespace-nowrap ticker-animate"
          style={{ width: "max-content", minWidth: "200%" }}
        >
          {items.map((event, i) => (
            <Link 
              key={`${event.slug}-${i}`} 
              href={`/register/${event.slug}`} 
              className="inline-flex items-center gap-5 px-6 hover:bg-foreground/10 transition-colors shrink-0"
            >
              <div className="flex items-center py-2 transition-colors cursor-pointer group/item h-full">
                <span className="font-sans text-sm tracking-widest flex items-center gap-3">
                  <span className="text-foreground/40 shrink-0">◆</span>
                  <span className="text-foreground font-normal whitespace-nowrap">{event.title}</span>
                  {event.status && (
                    <span className="bg-foreground text-background px-2 py-0.5 text-[10px] font-medium shrink-0">
                      {event.status}
                    </span>
                  )}
                  {event.date && (
                    <span className="text-foreground/80 text-[10px] font-normal shrink-0 border-l border-foreground/20 pl-3">
                      {event.date}
                    </span>
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
