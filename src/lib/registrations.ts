import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query
} from "firebase/firestore";

export interface Registration {
  id: string;
  name: string;
  email: string;
  eventSlug: string;
  timestamp: number;
}

const STORAGE_KEY = "tbi_registrations";

let cachedRegistrations: Registration[] = [];

/**
 * Live-subscribe to the registrations list and invoke `onChange` whenever it
 * updates. Registrations hold attendee PII and are admin-only per Firestore
 * rules, so the caller must only subscribe once an admin is authenticated
 * (the AdminPanel does this, keyed on its auth state). Returns an unsubscribe
 * function. Works in both Firestore and local (no-db) mode.
 */
export function subscribeToRegistrations(
  onChange: (regs: Registration[]) => void
): () => void {
  if (!db) {
    onChange(getRegistrations());
    const handler = () => onChange(getRegistrations());
    window.addEventListener("tbi_store_update", handler);
    return () => window.removeEventListener("tbi_store_update", handler);
  }

  return onSnapshot(
    query(collection(db, "registrations")),
    (snapshot) => {
      const list: Registration[] = [];
      snapshot.forEach((docSnap) => list.push(docSnap.data() as Registration));
      cachedRegistrations = list;
      onChange(list);
    },
    (err) => console.error("Registrations subscription error:", err)
  );
}

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TBI-${timestamp}-${random}`;
}

export function getRegistrations(): Registration[] {
  if (db) {
    return cachedRegistrations;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegistrations(regs: Registration[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(regs));
  // Notify local-mode subscribers (no-db mode) so the admin list refreshes.
  window.dispatchEvent(new Event("tbi_store_update"));
}

export function isEmailRegistered(email: string, eventSlug: string): boolean {
  const regs = getRegistrations();
  return regs.some(
    (r) => r.email.toLowerCase() === email.toLowerCase() && r.eventSlug === eventSlug
  );
}

export async function addRegistration(name: string, email: string, eventSlug: string): Promise<string> {
  const id = generateId();
  const reg: Registration = { 
    id, 
    name: name.trim(), 
    email: email.trim().toLowerCase(), 
    eventSlug, 
    timestamp: Date.now() 
  };
  
  if (db) {
    await setDoc(doc(db, "registrations", id), reg);
  } else {
    const regs = getRegistrations();
    regs.push(reg);
    saveRegistrations(regs);
  }
  return id;
}

export function getRegistrationByEmail(email: string, eventSlug: string): Registration | undefined {
  const regs = getRegistrations();
  return regs.find(
    (r) => r.email.toLowerCase() === email.toLowerCase() && r.eventSlug === eventSlug
  );
}

export async function deleteRegistration(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, "registrations", id));
  } else {
    const regs = getRegistrations();
    const filtered = regs.filter((r) => r.id !== id);
    saveRegistrations(filtered);
  }
}
