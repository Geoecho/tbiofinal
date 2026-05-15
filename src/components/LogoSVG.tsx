import logoImg from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LogoSVG({ className = "", size = "md" }: LogoProps) {
  const heights = {
    sm: "h-9 md:h-8",
    md: "h-10 md:h-10",
    lg: "h-16 md:h-20",
  };

  return (
    <div className={`flex items-center ${heights[size]} ${className}`}>
      <img 
        src={logoImg} 
        alt="The Big Impact Organization" 
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
