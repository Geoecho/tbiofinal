import { motion } from "framer-motion";
import heroVision from "@/assets/Gemini_Generated_Image_z8l1edz8l1edz8l1.png";

export function HeroArt() {
  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-[450px] lg:min-h-[650px] overflow-visible">
      {/* Base Canvas */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-square"
        >
          {/* Main Image Container (Perfect Square) */}
          <div className="absolute inset-0 z-10 overflow-hidden border-2 border-foreground bg-muted/20">
            {/* Pop Art Image */}
            <img 
              src={heroVision} 
              alt="The Big Impact Vision"
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
              style={{ objectPosition: 'center 20%' }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

