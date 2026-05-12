import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowButton } from "@/components/ui/arrow-button";
import { useEffect } from "react";

export default function BrandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const colors = [
    { name: "Background", hex: "#F3F1E9", var: "--background", desc: "Main canvas color" },
    { name: "Foreground / Primary", hex: "#0A0A0A", var: "--foreground / --primary", desc: "Text, borders, and main dark elements" },
    { name: "Accent (Neon Green)", hex: "#C1FF72", var: "N/A", desc: "Used in event ticker background and specific highlights" },
    { name: "Secondary (Orange-Red)", hex: "#F16032", var: "--secondary", desc: "Action items, active nav links, and buttons" },
    { name: "Impact Blue", hex: "#399AF0", var: "N/A", desc: "Used in hero 'IMPACT' background and specific accents" },
    { name: "Muted", hex: "#D9D9D9", var: "--muted", desc: "Subtle backgrounds and separators" },
  ];

  const typography = [
    { label: "Display", font: "Anton", style: "Uppercase, Tracking Wide", usage: "Headings (H1, H2)" },
    { label: "Sans / Body", font: "Space Grotesk", style: "Normal / Bold", usage: "Paragraphs, UI Labels, Buttons" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-44 pb-20 lg:pt-52 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 border-b-4 border-foreground pb-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-none uppercase">
              BRAND <span className="text-secondary">SYSTEM.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl font-bold max-w-2xl border-l-4 border-secondary pl-6 leading-tight">
              The visual identity and core assets of The Big Impact Organization.
              A brutalist design framework built for high-contrast storytelling.
            </p>
          </motion.div>

          {/* Color Palette */}
          <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <span className="bg-foreground text-background font-display text-2xl px-3 py-1">01</span>
              <h2 className="text-4xl md:text-5xl uppercase">COLORS</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {colors.map((color) => (
                <div key={color.name} className="border-4 border-foreground p-0 bg-white group">
                  <div 
                    className="w-full h-48 border-b-4 border-foreground transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" 
                    style={{ backgroundColor: color.hex.includes('var') ? `hsl(${color.hex})` : color.hex }}
                  />
                  <div className="p-6">
                    <h3 className="text-2xl mb-1">{color.name}</h3>
                    <p className="font-mono text-sm mb-2 font-bold">{color.hex}</p>
                    <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-[0.2em] font-bold">{color.var}</p>
                    <p className="text-sm font-medium leading-relaxed">{color.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <span className="bg-foreground text-background font-display text-2xl px-3 py-1">02</span>
              <h2 className="text-4xl md:text-5xl uppercase">TYPOGRAPHY</h2>
            </div>
            
            <div className="mb-12 border-4 border-foreground p-8 bg-foreground text-background overflow-x-auto">
              <table className="w-full text-left font-display uppercase tracking-widest text-sm md:text-base border-collapse">
                <thead>
                  <tr className="border-b-2 border-background/20">
                    <th className="py-4 px-2">Role</th>
                    <th className="py-4 px-2">Font</th>
                    <th className="py-4 px-2">Size (Desktop)</th>
                    <th className="py-4 px-2">Size (Mobile)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-2 border-background/10">
                    <td className="py-4 px-2 text-secondary">H1 / Hero Title</td>
                    <td className="py-4 px-2">Anton</td>
                    <td className="py-4 px-2">8rem / 128px</td>
                    <td className="py-4 px-2">4.5rem / 72px</td>
                  </tr>
                  <tr className="border-b-2 border-background/10">
                    <td className="py-4 px-2 text-secondary">H2 / Section Title</td>
                    <td className="py-4 px-2">Anton</td>
                    <td className="py-4 px-2">4.5rem / 72px</td>
                    <td className="py-4 px-2">3rem / 48px</td>
                  </tr>
                  <tr className="border-b-2 border-background/10">
                    <td className="py-4 px-2 text-secondary">H3 / Subtitles</td>
                    <td className="py-4 px-2">Anton</td>
                    <td className="py-4 px-2">2.25rem / 36px</td>
                    <td className="py-4 px-2">1.875rem / 30px</td>
                  </tr>
                  <tr className="border-b-2 border-background/10">
                    <td className="py-4 px-2 text-secondary">Body / Large</td>
                    <td className="py-4 px-2">Space Grotesk</td>
                    <td className="py-4 px-2">1.25rem / 20px</td>
                    <td className="py-4 px-2">1.125rem / 18px</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-2 text-secondary">Body / UI / Label</td>
                    <td className="py-4 px-2">Space Grotesk</td>
                    <td className="py-4 px-2">1rem / 16px</td>
                    <td className="py-4 px-2">0.875rem / 14px</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-16">
              {typography.map((type) => (
                <div key={type.label} className="border-4 border-foreground p-8 md:p-12 bg-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1 font-display uppercase tracking-widest text-sm border-l-4 border-b-4 border-foreground">
                    {type.label}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground block mb-6">
                    {type.font} FAMILY
                  </span>
                  <div className="mb-12">
                    <p className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl break-words leading-[0.9] ${type.font === 'Anton' ? 'font-display' : 'font-sans font-bold'}`}>
                      THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
                    </p>
                    <p className={`mt-6 text-2xl sm:text-3xl md:text-4xl break-words opacity-60 ${type.font === 'Anton' ? 'font-display' : 'font-sans'}`}>
                      abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%^&*
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 pt-8 border-t-2 border-foreground/10">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Style Rules</span>
                      <p className="text-sm md:text-base font-bold uppercase border-l-4 border-secondary pl-4">{type.style}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Implementation</span>
                      <p className="text-sm md:text-base font-bold uppercase border-l-4 border-secondary pl-4">{type.usage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* UI Components */}
          <section className="mb-24">
            <h2 className="text-4xl mb-8 border-b-2 border-foreground pb-2 inline-block">03. UI COMPONENTS</h2>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Buttons */}
              <div className="space-y-8">
                <h3 className="text-2xl uppercase border-l-4 border-foreground pl-4">Buttons</h3>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Primary / Default</span>
                    <Button size="lg" className="w-full">ACTION BUTTON</Button>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Outline</span>
                    <Button variant="outline" size="lg" className="w-full">OUTLINE BUTTON</Button>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Arrow Action (Custom)</span>
                    <ArrowButton size="lg" className="w-full py-6 text-xl">
                      GET STARTED
                    </ArrowButton>
                  </div>
                </div>
              </div>

              {/* Badges & Elements */}
              <div className="space-y-8">
                <h3 className="text-2xl uppercase border-l-4 border-foreground pl-4">Stickers & Labels</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-foreground text-background font-display uppercase tracking-widest text-xs px-3 py-1 border-2 border-foreground">
                    COMMUNITY VOICES
                  </div>
                  <div className="bg-secondary text-white font-display uppercase tracking-widest text-xs px-3 py-1 border-2 border-foreground">
                    FEATURED
                  </div>
                  <div className="bg-white text-foreground font-display uppercase tracking-widest text-xs px-3 py-1 border-2 border-foreground">
                    2026
                  </div>
                </div>
                <div className="border-l-8 border-secondary pl-6 py-4 bg-white border-2 border-foreground border-l-8">
                  <p className="text-lg font-bold italic uppercase">
                    "This is the impact quote style used across the site."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Brutalist Guidelines */}
          <section className="mb-24">
            <h2 className="text-4xl mb-8 border-b-2 border-foreground pb-2 inline-block">04. BRUTALIST RULES</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "ZERO BORDER RADIUS (ALWAYS 0px)",
                "THICK BLACK BORDERS (2px-4px)",
                "HIGH CONTRAST (NEON GREEN/ORANGE-RED/BLUE)",
                "UPPERCASE DISPLAY HEADINGS",
                "HEAVY USE OF STROKES/DIVIDERS",
                "SHARP DROPSHADOWS (HARD EDGES)",
                "GRID-BASED LAYOUTS",
                "VISIBLE UI SKELETONS"
              ].map((rule, i) => (
                <div key={i} className="bg-foreground text-background p-4 flex items-center justify-center text-center font-display text-sm tracking-widest h-24 border-2 border-foreground">
                  {rule}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
