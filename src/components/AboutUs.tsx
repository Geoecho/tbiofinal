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
            We created The Big Impact platform with a lot of devotion towards support and recgonition of the youth. We aim to make a meaningful impact across every dimension of youth life, from education and leadership to culture,art,  innovation, and personal growth. In a time where uncertainty defines the present we stand as a platform that provides direction,recognition, opportunity, and transformation.We give young people exactly what they need most - the right platform to rise. Our goal is to shape the present by building a youth empowering platform where young people grow, lead, and create meaningful impact.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
