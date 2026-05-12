export function Logo() {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="shrink-0 flex flex-col border-2 border-foreground overflow-hidden">
        <div className="h-2.5 w-10 bg-secondary"></div>
        <div className="h-2.5 w-10 bg-primary"></div>
        <div className="h-2.5 w-10 bg-foreground flex items-center justify-center">
          <span className="font-display text-[7px] font-black text-background tracking-widest leading-none">TBI</span>
        </div>
      </div>
      <span className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider">
        THE BIG <span className="text-primary">IMPACT</span> ORG
      </span>
    </div>
  );
}
