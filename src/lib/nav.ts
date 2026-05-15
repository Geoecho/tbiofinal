export const NAV_LINKS = [
  { name: "About Us",  href: "/#about",   id: "about" },
  { name: "Events",    href: "/#events",  id: "events" },
  { name: "Contact",   href: "/#contact", id: "contact" },
] as const;

export type NavId = typeof NAV_LINKS[number]["id"];

export function navigateToSection(
  id: string,
  currentLocation: string,
  setLocation: (path: string) => void,
) {
  if (currentLocation === "/" || currentLocation === "") {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } else {
    setLocation("/");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  }
}
