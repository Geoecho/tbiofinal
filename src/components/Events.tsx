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
          <h2 className="font-display text-5xl md:text-6xl leading-[1.1]">
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
              className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border-b last:border-b-0 border-foreground/15 transition-colors group gap-6"
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
              <Link href={`/register/${event.slug}`} className="md:shrink-0">
                <button
                  className="w-full md:w-auto font-display tracking-widest text-sm h-10 px-6 bg-primary text-white hover:bg-[#c0334d] transition-colors"
                >
                  Register interest
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
