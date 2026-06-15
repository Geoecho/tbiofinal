import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function maskImageUrl(url: string): string {
  if (!url) return "";
  const firebaseDomain = "https://firebasestorage.googleapis.com/v0/b/thebigimpact-c76e7.firebasestorage.app/o/";
  if (url.startsWith(firebaseDomain)) {
    return url.replace(firebaseDomain, "/cdn-image/");
  }
  return url;
}
