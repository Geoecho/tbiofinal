import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = "tbi_messages";

let cachedMessages: ContactMessage[] = [];

/**
 * Live-subscribe to the messages list and invoke `onChange` whenever it
 * updates.
 */
export function subscribeToMessages(
  onChange: (msgs: ContactMessage[]) => void
): () => void {
  if (!db) {
    onChange(getMessages());
    const handler = () => onChange(getMessages());
    window.addEventListener("tbi_messages_update", handler);
    return () => window.removeEventListener("tbi_messages_update", handler);
  }

  return onSnapshot(
    query(collection(db, "messages"), orderBy("timestamp", "desc")),
    (snapshot) => {
      const list: ContactMessage[] = [];
      snapshot.forEach((docSnap) => list.push(docSnap.data() as ContactMessage));
      cachedMessages = list;
      onChange(list);
    },
    (err) => console.error("Messages subscription error:", err)
  );
}

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return `MSG-${timestamp}-${random}`;
}

export function getMessages(): ContactMessage[] {
  if (db) {
    return cachedMessages;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs: ContactMessage[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  window.dispatchEvent(new Event("tbi_messages_update"));
}

export async function addMessage(name: string, email: string, subject: string, message: string): Promise<string> {
  const id = generateId();
  const msg: ContactMessage = { 
    id, 
    name: name.trim(), 
    email: email.trim().toLowerCase(), 
    subject: subject.trim(),
    message: message.trim(),
    timestamp: Date.now(),
    read: false
  };
  
  if (db) {
    await setDoc(doc(db, "messages", id), msg);
  } else {
    const msgs = getMessages();
    msgs.unshift(msg); // Add to beginning (descending order)
    saveMessages(msgs);
  }
  return id;
}

export async function deleteMessage(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, "messages", id));
  } else {
    const msgs = getMessages();
    const filtered = msgs.filter((m) => m.id !== id);
    saveMessages(filtered);
  }
}

export async function markMessageRead(id: string, read: boolean = true): Promise<void> {
  if (db) {
    await updateDoc(doc(db, "messages", id), { read });
  } else {
    const msgs = getMessages();
    const msg = msgs.find(m => m.id === id);
    if (msg) {
      msg.read = read;
      saveMessages(msgs);
    }
  }
}
