/**
 * Registration store - manages event registrations in localStorage.
 * Generates unique IDs and prevents duplicate email registrations.
 */

export interface Registration {
  id: string;
  name: string;
  email: string;
  eventSlug: string;
  timestamp: number;
}

const STORAGE_KEY = "tbi_registrations";

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TBI-${timestamp}-${random}`;
}

function getRegistrations(): Registration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegistrations(regs: Registration[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(regs));
}

export function isEmailRegistered(email: string, eventSlug: string): boolean {
  const regs = getRegistrations();
  return regs.some(
    (r) => r.email.toLowerCase() === email.toLowerCase() && r.eventSlug === eventSlug
  );
}

export function addRegistration(name: string, email: string, eventSlug: string): string {
  const id = generateId();
  const regs = getRegistrations();
  regs.push({ id, name: name.trim(), email: email.trim().toLowerCase(), eventSlug, timestamp: Date.now() });
  saveRegistrations(regs);
  return id;
}

export function getRegistrationByEmail(email: string, eventSlug: string): Registration | undefined {
  const regs = getRegistrations();
  return regs.find(
    (r) => r.email.toLowerCase() === email.toLowerCase() && r.eventSlug === eventSlug
  );
}
