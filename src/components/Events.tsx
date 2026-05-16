import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { useEvents } from "@/lib/adminStore";

export function Events() {
  const [events] = useEvents();

  return (
    <section
      id="events"
      className="scroll-mt-28 lg:scroll-mt-36 border-b border-foreground/15 py-20 lg:py-32"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h2 className="font-display text-5xl md:text-6xl leading-[1.1] uppercase">
            Upcoming Events
          </h2>
        </div>

        <div className="border-t border-foreground/15">
          {events.map((event, i) => (
            <motion.div
              key={event.slug}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group border-b last:border-b-0 border-foreground/15"
            >
              <Link 
                href={`/register/${event.slug}`} 
                className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 transition-colors hover:bg-foreground/5 gap-6 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-grow">
                  <div className="font-display text-3xl md:text-4xl text-primary md:w-32 shrink-0 group-hover:scale-110 transition-transform origin-left">
                    {event.date}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-display text-2xl md:text-3xl mb-1 leading-tight">
                      {event.title}
                    </h3>
                    <p className="font-bold tracking-widest text-muted-foreground text-sm">
                      {event.venue}
                    </p>
                  </div>
                </div>
                <div className="md:shrink-0 w-full md:w-auto">
                  <button
                    className="w-full md:w-auto font-display tracking-widest text-sm min-h-[44px] px-6 bg-primary text-white btn-primary pointer-events-none"
                    aria-label={`Register interest for ${event.title}`}
                  >
                    Register interest
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
