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

// Real-time registrations cache sync from Firestore
if (db) {
  onSnapshot(query(collection(db, "registrations")), (snapshot) => {
    const list: Registration[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Registration);
    });
    cachedRegistrations = list;
    // Dispatch local update notification event
    window.dispatchEvent(new Event("tbi_store_update"));
  });
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
