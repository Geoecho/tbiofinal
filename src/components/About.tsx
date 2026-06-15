import { motion } from "framer-motion";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-28 lg:scroll-mt-36 py-20 lg:py-32 border-b-2 border-foreground bg-muted/20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-foreground text-background font-display uppercase tracking-widest text-sm px-3 py-1 mb-6 border-2 border-foreground">
                ABOUT US
              </div>
              <h2
                id="about-heading"
                className="font-display text-5xl md:text-7xl uppercase mb-6 leading-[1.05] border-b-4 border-foreground pb-4"
              >
                A NEW{" "}
                <span className="text-primary">NON-PROFIT</span>{" "}
                BUILT TO AMPLIFY YOUTH.
              </h2>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center gap-6"
          >
            <p className="text-lg font-medium leading-relaxed">
              The Big Impact Organization is a youth-focused non-profit just
              getting off the ground. Our mission is simple: empower young
              people and share their initiatives with the world.
            </p>
            <p className="text-lg font-medium leading-relaxed text-muted-foreground">
              We are in our founding chapter. Everything you see on this site
              — programs, events, sponsors — represents what we are actively
              building. We're inviting youth, mentors, partners, and patrons
              to help shape it from day one.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
