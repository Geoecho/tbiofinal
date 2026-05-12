type Props = {
  color?: string;
  variant?: "a" | "b" | "c";
};

/**
 * Thin hand-painted brushstroke separator.
 * Positioned as a standalone element between sections.
 * Much thinner than a full-width band — reads as a single mark.
 */
export function SectionDivider({ color = "#111111", variant = "a" }: Props) {
  const path =
    variant === "a"
      ? "M-10,14 C160,4 360,20 580,12 C800,4 1020,18 1290,10 L1290,20 C1020,28 800,14 580,22 C360,30 160,16 -10,26 Z"
      : variant === "b"
      ? "M-10,16 C200,6 420,22 640,14 C860,6 1060,20 1290,12 L1290,22 C1080,30 860,16 640,24 C420,32 200,18 -10,28 Z"
      : "M-10,12 C140,4 340,18 560,12 C800,6 1060,16 1290,8 L1290,18 C1080,26 800,18 560,22 C340,30 140,18 -10,24 Z";

  const filterId = `bs-${variant}`;

  return (
    <div
      className="relative w-full overflow-hidden leading-none"
      style={{ height: 36 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1280 36"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <filter id={filterId} x="-2%" y="-60%" width="104%" height="220%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed={variant === "a" ? 5 : variant === "b" ? 11 : 17} />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
        </defs>
        <path d={path} fill={color} filter={`url(#${filterId})`} />
      </svg>
    </div>
  );
}
