export interface NavLink {
  name: string;
  href: string;
  id: string;
}

export const NAV_LINKS: NavLink[] = [
  { name: "About Us",     href: "/#about",   id: "about" },
  { name: "Initiatives",  href: "/#initiatives", id: "initiatives" },
  { name: "Contact",      href: "/#contact", id: "contact" },
];

export type NavId = "about" | "initiatives" | "stories" | "events" | "contact";

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
