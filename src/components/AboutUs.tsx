import { motion } from "framer-motion";

export function AboutUs() {
  return (
    <section
      id="about"
      className="scroll-mt-28 lg:scroll-mt-36 py-20 lg:py-32 border-b border-foreground/15"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-sans text-5xl md:text-6xl font-bold leading-[1.1] mb-8">
            About Us
          </h2>
          <p className="font-sans text-lg md:text-xl font-medium leading-relaxed text-muted-foreground">
            The Big Impact Organization is a youth-focused non-profit dedicated to
            empowering young people through mentorship, community programs, and
            real-world opportunities. We believe every young person deserves the
            right platform to grow, create, and lead. From local events to lasting
            partnerships, we're building a movement that puts youth at the center
            of positive change.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
