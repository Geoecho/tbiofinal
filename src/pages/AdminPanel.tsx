import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard,
  Calendar,
  Rocket,
  BookOpen,
  Users,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Download,
  AlertCircle,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  X,
  Image as ImageIcon,
  Star,
  Loader2,
  EyeOff,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { maskImageUrl } from "@/lib/utils";
import {
  useEvents,
  useStories,
  type EventEntry,
  type StoryEntry,
  type StoryBlock
} from "@/lib/adminStore";
import { deleteRegistration, subscribeToRegistrations, type Registration } from "@/lib/registrations";
import { toast } from "sonner";
import { db, auth, isFirebaseConfigured } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";

/* ────────────────────────────────────────────────────────────────
   Reusable UI Primitives
   ──────────────────────────────────────────────────────────────── */

const inputClass = "w-full bg-background border border-foreground/20 px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/50";
const labelClass = "text-[11px] font-bold uppercase tracking-widest block mb-1.5 text-muted-foreground";
const btnPrimary = "inline-flex items-center justify-center gap-2 font-display tracking-widest text-xs px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-all uppercase font-bold cursor-pointer min-h-[44px]";
const btnSecondary = "inline-flex items-center justify-center gap-2 font-display tracking-widest text-xs px-6 py-3 border border-foreground/15 hover:bg-foreground/5 transition-all uppercase font-bold text-foreground bg-transparent cursor-pointer min-h-[44px]";
const btnDanger = "inline-flex items-center justify-center gap-2 font-display tracking-widest text-xs px-4 py-2 border border-destructive/30 hover:bg-destructive/10 text-destructive transition-all uppercase font-bold cursor-pointer min-h-[44px]";
const btnIcon = "inline-flex items-center justify-center w-10 h-10 border border-foreground/10 hover:bg-foreground/5 transition-colors cursor-pointer text-foreground";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-foreground/15 bg-background ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-5 py-4 border-b border-foreground/10 ${className}`}>{children}</div>
);

const CardBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-5 py-5 ${className}`}>{children}</div>
);

const StatCard = ({ label, value, icon: Icon, accent = false, onClick }: { label: string; value: number; icon: any; accent?: boolean; onClick?: () => void }) => {
  const Tag: any = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`text-left w-full border border-foreground/15 p-5 sm:p-6 ${accent ? 'bg-primary/[0.03] hover:bg-primary/[0.06]' : 'bg-secondary/[0.03] hover:bg-secondary/[0.06]'} hover:border-foreground/25 transition-all duration-300 group ${onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40' : ''}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">{label}</span>
        <Icon size={16} className={`${accent ? 'text-primary/50 group-hover:text-primary' : 'text-secondary/50 group-hover:text-secondary'} transition-colors`} />
      </div>
      <div className={`font-display text-4xl font-extrabold mt-3 ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</div>
    </Tag>
  );
};

const EmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="text-center py-12 sm:py-16 space-y-3">
    <Icon className="mx-auto text-muted-foreground/40" size={40} />
    <p className="text-muted-foreground text-sm">{message}</p>
  </div>
);

type ConfirmConfig = {
  title: string;
  message: string;
  confirmLabel: string;
  resolve: (value: boolean) => void;
};

const ConfirmDialog = ({ config }: { config: ConfirmConfig | null }) => {
  // Allow Escape / Enter keyboard control
  useEffect(() => {
    if (!config) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") config.resolve(false);
      if (e.key === "Enter") config.resolve(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [config]);

  if (!config) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={() => config.resolve(false)}
      />
      <div className="relative w-full sm:max-w-md bg-background border border-foreground/15 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-11 h-11 flex items-center justify-center bg-destructive/10 text-destructive">
              <AlertTriangle size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 id="confirm-title" className="font-display text-lg uppercase tracking-wide text-foreground leading-tight">
                {config.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{config.message}</p>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 mt-6">
            <button
              onClick={() => config.resolve(false)}
              className="inline-flex items-center justify-center gap-2 font-display tracking-widest text-xs px-5 py-3 border border-foreground/15 hover:bg-foreground/5 transition-all uppercase font-bold text-foreground cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>
            <button
              autoFocus
              onClick={() => config.resolve(true)}
              className="inline-flex items-center justify-center gap-2 font-display tracking-widest text-xs px-5 py-3 bg-destructive text-white hover:bg-destructive/90 transition-all uppercase font-bold cursor-pointer min-h-[44px]"
            >
              <Trash2 size={14} /> {config.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────────── */

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "events" | "youth-stories" | "initiatives" | "registrations">("dashboard");

  // Accessible confirm dialog (replaces native window.confirm)
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig | null>(null);
  const askConfirm = (opts: Omit<ConfirmConfig, "resolve">) =>
    new Promise<boolean>(resolve => {
      setConfirmConfig({ ...opts, resolve: (v) => { setConfirmConfig(null); resolve(v); } });
    });

  const [events, setEventsHook] = useEvents();
  const [stories, setStoriesHook] = useStories();
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const [editingEvent, setEditingEvent] = useState<EventEntry | null>(null);
  const [editingStory, setEditingStory] = useState<StoryEntry | null>(null);

  // Event form
  const [eventTitle, setEventTitle] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [isUploadingEventImage, setIsUploadingEventImage] = useState(false);

  // Story form
  const [storyTitle, setStoryTitle] = useState("");
  const [storySlug, setStorySlug] = useState("");
  const [storyCategory, setStoryCategory] = useState("IMPACT");
  const [storyTagColor, setStoryTagColor] = useState("primary");
  const [storyExcerpt, setStoryExcerpt] = useState("");
  const [storyAuthor, setStoryAuthor] = useState("");
  const [storyDate, setStoryDate] = useState("");
  const [storyImg, setStoryImg] = useState("");
  const [storyBodyText, setStoryBodyText] = useState("");
  const [storyImages, setStoryImages] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [storyType, setStoryType] = useState<"story" | "initiative">("story");
  const [storyImagePositions, setStoryImagePositions] = useState<number[]>([]);
  const [storyBlocks, setStoryBlocks] = useState<StoryBlock[]>(() => [
    { id: `block-${Date.now()}`, type: "paragraph", text: "" }
  ]);
  const [storyImgPosition, setStoryImgPosition] = useState<number>(50);

  // Drag-and-drop reordering of gallery images
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  /* ── Auth ───────────────────────────────────────────────── */

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuthenticated(!!user);
      });
      return () => unsubscribe();
    } else {
      const authed = sessionStorage.getItem("tbi_admin_authed");
      if (authed === "true") setIsAuthenticated(true);
    }
  }, []);

  // Subscribe to the (admin-only) registrations list only once authenticated,
  // so the listener carries the admin's auth and Firestore rules permit the read.
  useEffect(() => {
    if (!isAuthenticated) { setRegistrations([]); return; }
    const unsubscribe = subscribeToRegistrations(setRegistrations);
    return unsubscribe;
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!email.trim() || !password) {
      setLoginError("Please enter your email and password.");
      return;
    }
    setIsLoggingIn(true);
    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back, Admin!");
        setEmail(""); setPassword("");
      } catch (err: any) {
        setLoginError("Invalid email or password. Please try again.");
      }
    } else {
      if (password === "admin") {
        setIsAuthenticated(true);
        sessionStorage.setItem("tbi_admin_authed", "true");
        toast.success("Welcome back (Local mode)!");
      } else {
        setLoginError("Incorrect password.");
      }
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    if (auth) {
      try { await signOut(auth); toast.success("Signed out."); } catch (err) { console.error(err); }
    } else {
      setIsAuthenticated(false);
      sessionStorage.removeItem("tbi_admin_authed");
      toast.success("Signed out.");
    }
  };

  /* ── Helpers ────────────────────────────────────────────── */

  const slugify = (text: string) =>
    text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");

  const youthStories = stories.filter(s => s.type === "story" || (!s.type && (s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS"))));
  const initiativeStories = stories.filter(s => s.type === "initiative" || (!s.type && !(s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS"))));

  /* ── Event Actions ─────────────────────────────────────── */

  const saveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventVenue || !eventDesc) { toast.error("Please fill in all fields"); return; }
    const finalSlug = eventSlug || slugify(eventTitle);
    const newEvent: EventEntry = { title: eventTitle, slug: finalSlug, date: eventDate, venue: eventVenue, desc: eventDesc, image: eventImage.trim() };
    let updatedEvents = [...events];
    if (editingEvent) {
      updatedEvents = updatedEvents.map(evt => evt.slug === editingEvent.slug ? newEvent : evt);
      toast.success("Event updated!");
    } else {
      if (events.some(evt => evt.slug === finalSlug)) { toast.error("Slug already exists."); return; }
      updatedEvents.push(newEvent);
      toast.success("Event created!");
    }
    setEventsHook(updatedEvents);
    clearEventForm();
  };

  const startEditEvent = (evt: EventEntry) => {
    setEditingEvent(evt); setEventTitle(evt.title); setEventSlug(evt.slug);
    setEventDate(evt.date); setEventVenue(evt.venue); setEventDesc(evt.desc);
    setEventImage(evt.image || "");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEvent = async (slug: string) => {
    const ok = await askConfirm({ title: "Delete event?", message: "This event will be permanently removed and can't be recovered.", confirmLabel: "Delete event" });
    if (ok) {
      if (isFirebaseConfigured && db) {
        try { await deleteDoc(doc(db, "events", slug)); toast.success("Event deleted."); }
        catch (err) { toast.error("Failed to delete."); }
      } else {
        setEventsHook(events.filter(evt => evt.slug !== slug));
        toast.success("Event deleted.");
      }
    }
  };

  const clearEventForm = () => {
    setEditingEvent(null); setEventTitle(""); setEventSlug("");
    setEventDate(""); setEventVenue(""); setEventDesc(""); setEventImage("");
  };

  /* ── Story Actions ─────────────────────────────────────── */

  const saveStory = (e: React.FormEvent) => {
    e.preventDefault();
    const hasContent = storyBlocks.some(b => b.text.trim().length > 0);
    if (!storyTitle || !storyExcerpt || !hasContent) { toast.error("Fill in Title, Excerpt, and Content"); return; }
    const finalSlug = storySlug || slugify(storyTitle);
    const imagesArray = storyImages.split(/[\n, ]+/).map(img => img.trim()).filter(img => img.length > 0 && (img.startsWith("http") || img.startsWith("/cdn-image/")));
    const coverImage = imagesArray[0] || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80";
    const galleryImages = imagesArray.slice(1);
    const imagePositions = galleryImages.map((_, idx) => storyImagePositions[idx] !== undefined ? storyImagePositions[idx] : idx);

    const newStory: StoryEntry = {
      slug: finalSlug, title: storyTitle, category: storyCategory.toUpperCase(),
      tagColor: storyTagColor, excerpt: storyExcerpt, author: "",
      date: storyDate || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase(),
      img: coverImage, bodyText: storyBlocks.map(b => b.text.trim()).join("\n\n"),
      defaultLikes: editingStory?.defaultLikes || 0, images: galleryImages,
      type: storyType, imagePositions, blocks: storyBlocks, imgPosition: storyImgPosition,
    };

    let updatedStories = [...stories];
    if (editingStory) {
      updatedStories = updatedStories.map(s => s.slug === editingStory.slug ? newStory : s);
      toast.success("Post updated!");
    } else {
      if (stories.some(s => s.slug === finalSlug)) { toast.error("Slug already exists."); return; }
      updatedStories.push(newStory);
      toast.success("Post published!");
    }
    setStoriesHook(updatedStories);
    clearStoryForm();
  };

  const startEditStory = (s: StoryEntry) => {
    setEditingStory(s); setStoryTitle(s.title); setStorySlug(s.slug);
    setStoryCategory(s.category); setStoryTagColor(s.tagColor || "primary");
    setStoryExcerpt(s.excerpt); setStoryAuthor(s.author); setStoryDate(s.date);
    setStoryImg(s.img); setStoryImages([s.img, ...(s.images || [])].join("\n"));
    setStoryBodyText(s.bodyText);
    setStoryType(s.type || (s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS") ? "story" : "initiative"));
    setStoryImagePositions(s.imagePositions || []);
    setStoryImgPosition(s.imgPosition ?? 50);
    if (s.blocks && s.blocks.length > 0) { setStoryBlocks(s.blocks); }
    else {
      const paragraphs = s.bodyText ? s.bodyText.split("\n\n").filter(p => p.trim().length > 0) : [];
      const parsedBlocks = paragraphs.map((p, idx) => ({
        id: `block-${Date.now()}-${idx}-${Math.random()}`, type: "paragraph" as const, text: p.trim()
      }));
      setStoryBlocks(parsedBlocks.length > 0 ? parsedBlocks : [{ id: `block-${Date.now()}`, type: "paragraph", text: "" }]);
    }
  };

  const deleteStory = async (slug: string) => {
    const ok = await askConfirm({ title: "Delete post?", message: "This post will be permanently removed and can't be recovered.", confirmLabel: "Delete post" });
    if (ok) {
      if (isFirebaseConfigured && db) {
        try { await deleteDoc(doc(db, "stories", slug)); toast.success("Post deleted."); }
        catch (err) { toast.error("Failed to delete."); }
      } else {
        setStoriesHook(stories.filter(s => s.slug !== slug));
        toast.success("Post deleted.");
      }
    }
  };

  const clearStoryForm = () => {
    setEditingStory(null); setStoryTitle(""); setStorySlug("");
    setStoryCategory("IMPACT"); setStoryTagColor("primary"); setStoryExcerpt("");
    setStoryAuthor(""); setStoryDate(""); setStoryImg(""); setStoryImages("");
    setStoryBodyText(""); setStoryType("story"); setStoryImagePositions([]);
    setStoryBlocks([{ id: `block-${Date.now()}`, type: "paragraph", text: "" }]);
    setStoryImgPosition(50);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!isFirebaseConfigured || !db) { toast.error("Firebase not connected."); return; }
    setIsUploadingImages(true);
    const uploadedUrls: string[] = [];
    try {
      const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
      const { storage } = await import("@/lib/firebase");
      if (!storage) throw new Error("Storage not initialized.");
      toast.loading("Compressing & uploading...", { id: "upload-toast" });
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const webpBlob = await new Promise<Blob>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let w = img.width, h = img.height;
              if (w > h) { if (w > 1200) { h *= 1200 / w; w = 1200; } }
              else { if (h > 1200) { w *= 1200 / h; h = 1200; } }
              canvas.width = w; canvas.height = h;
              const ctx = canvas.getContext("2d");
              if (!ctx) { reject(new Error("No context")); return; }
              ctx.drawImage(img, 0, 0, w, h);
              canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Compression failed")), "image/webp", 0.8);
            };
            img.onerror = err => reject(err);
          };
          reader.onerror = err => reject(err);
        });
        const fileRef = ref(storage, `initiatives/${Date.now()}_${i}.webp`);
        const snapshot = await uploadBytes(fileRef, webpBlob);
        uploadedUrls.push(await getDownloadURL(snapshot.ref));
      }
      const existing = storyImages.trim();
      setStoryImages(existing ? `${existing}\n${uploadedUrls.join("\n")}` : uploadedUrls.join("\n"));
      if (!storyImg && uploadedUrls.length > 0) setStoryImg(uploadedUrls[0]);
      toast.success("Images uploaded!", { id: "upload-toast" });
    } catch (error: any) {
      toast.error(`Upload failed: ${error?.message || "Error"}`, { id: "upload-toast" });
    } finally { setIsUploadingImages(false); e.target.value = ""; }
  };

  const handleEventImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isFirebaseConfigured || !db) { toast.error("Firebase not connected."); return; }
    setIsUploadingEventImage(true);
    try {
      const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
      const { storage } = await import("@/lib/firebase");
      if (!storage) throw new Error("Storage not initialized.");
      toast.loading("Compressing & uploading...", { id: "event-upload-toast" });
      const webpBlob = await new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let w = img.width, h = img.height;
            if (w > h) { if (w > 1400) { h *= 1400 / w; w = 1400; } }
            else { if (h > 1400) { w *= 1400 / h; h = 1400; } }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext("2d");
            if (!ctx) { reject(new Error("No context")); return; }
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Compression failed")), "image/webp", 0.85);
          };
          img.onerror = err => reject(err);
        };
        reader.onerror = err => reject(err);
      });
      const fileRef = ref(storage, `events/${Date.now()}.webp`);
      const snapshot = await uploadBytes(fileRef, webpBlob);
      setEventImage(await getDownloadURL(snapshot.ref));
      toast.success("Cover image uploaded!", { id: "event-upload-toast" });
    } catch (error: any) {
      toast.error(`Upload failed: ${error?.message || "Error"}`, { id: "event-upload-toast" });
    } finally { setIsUploadingEventImage(false); e.target.value = ""; }
  };

  const handlePositionChange = (imageIndex: number, paragraphIndex: number) => {
    setStoryImagePositions(prev => {
      const copy = [...prev];
      while (copy.length <= imageIndex) copy.push(copy.length);
      copy[imageIndex] = paragraphIndex;
      return copy;
    });
  };

  /* ── Registrations ─────────────────────────────────────── */

  const removeRegistration = async (id: string) => {
    const ok = await askConfirm({ title: "Cancel registration?", message: "This attendee's registration will be removed. This can't be undone.", confirmLabel: "Cancel registration" });
    if (ok) {
      await deleteRegistration(id);
      // The live subscription refreshes the list automatically.
      toast.success("Registration cancelled.");
    }
  };

  const downloadRegistrationsCSV = () => {
    if (registrations.length === 0) { toast.error("No data to export"); return; }
    const headers = "ID,Name,Email,Event,Date\n";
    const rows = registrations.map(r => {
      const eventTitle = events.find(e => e.slug === r.eventSlug)?.title || r.eventSlug;
      return `"${r.id}","${r.name}","${r.email}","${eventTitle}","${new Date(r.timestamp).toLocaleString()}"`;
    }).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url); link.setAttribute("download", `tbio_registrations_${Date.now()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  /* ── Navigation config ─────────────────────────────────── */

  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard, count: null },
    { id: "events" as const, label: "Events", icon: Calendar, count: events.length },
    { id: "youth-stories" as const, label: "Stories", icon: BookOpen, count: youthStories.length },
    { id: "initiatives" as const, label: "Initiatives", icon: Rocket, count: initiativeStories.length },
    { id: "registrations" as const, label: "Registrations", icon: Users, count: registrations.length },
  ];

  const goTab = (id: typeof activeTab) => {
    setActiveTab(id);
    if (id === "youth-stories") { clearStoryForm(); setStoryType("story"); }
    if (id === "initiatives") { clearStoryForm(); setStoryType("initiative"); }
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ════════════════════════════════════════════════════════════
     LOGIN SCREEN
     ════════════════════════════════════════════════════════════ */

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="p-6 sm:p-8 relative z-10">
          <Link href="/">
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group cursor-pointer bg-transparent border-none outline-none">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Website
            </button>
          </Link>
        </div>

        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 relative z-10">
          <div className="w-full max-w-sm sm:max-w-md">
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Secure Portal</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-foreground mb-3">
                Admin
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to manage your organization.
              </p>
            </div>

            <div className="border border-foreground/15 bg-background/50 backdrop-blur-sm p-6 sm:p-8 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="admin-email" className={labelClass}>Email</label>
                  <input
                    id="admin-email" type="email" value={email}
                    onChange={e => { setEmail(e.target.value); if (loginError) setLoginError(""); }}
                    placeholder="you@example.com" className={inputClass} autoFocus autoComplete="email"
                    aria-invalid={!!loginError}
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      id="admin-password" type={showPassword ? "text" : "password"} value={password}
                      onChange={e => { setPassword(e.target.value); if (loginError) setLoginError(""); }}
                      placeholder="••••••••" className={`${inputClass} pr-12`} autoComplete="current-password"
                      aria-invalid={!!loginError}
                    />
                    <button
                      type="button" onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-0 top-0 h-full px-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div role="alert" className="flex items-start gap-2.5 bg-destructive/[0.06] border border-destructive/20 px-3.5 py-3 text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                    <span className="text-xs font-medium leading-relaxed">{loginError}</span>
                  </div>
                )}

                <button type="submit" disabled={isLoggingIn} className={`${btnPrimary} w-full disabled:opacity-60`}>
                  {isLoggingIn ? <><Loader2 size={14} className="animate-spin" /> Signing in...</> : "Sign In"}
                </button>
              </form>

              <div className="flex items-center justify-center gap-1.5 mt-5 pt-5 border-t border-foreground/10">
                <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConfigured ? "bg-green-500" : "bg-amber-500"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  {isFirebaseConfigured ? "Secure connection active" : "Local mode"}
                </span>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 relative z-10">
          © {new Date().getFullYear()} THE BIG IMPACT ORGANISATION
        </footer>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     ADMIN DASHBOARD (Authenticated)
     ════════════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Top Header Bar ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-foreground/15 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5" title={isFirebaseConfigured && db ? "Firebase connected" : "Local mode"}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFirebaseConfigured && db ? "bg-green-400" : "bg-amber-400"}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isFirebaseConfigured && db ? "bg-green-500" : "bg-amber-500"}`} />
            </span>
            <span className="font-display text-sm tracking-widest uppercase font-bold text-foreground hidden sm:inline">
              TBIO Admin
            </span>
            <span className="font-display text-sm tracking-widest uppercase font-bold text-foreground sm:hidden">
              TBIO
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/">
              <a className="hidden sm:inline-flex items-center gap-1.5 font-display tracking-widest text-[10px] sm:text-xs px-3 py-1.5 border border-foreground/20 hover:bg-foreground/5 transition-all uppercase font-bold cursor-pointer text-foreground">
                View Site
              </a>
            </Link>
            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 font-display tracking-widest text-[10px] sm:text-xs px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 border border-foreground/15 transition-all uppercase font-bold cursor-pointer text-foreground min-h-[36px]">
              <LogOut size={12} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row">
        {/* ── Desktop Sidebar ──────────────────────────────── */}
        <aside className="hidden lg:flex lg:flex-col lg:w-60 xl:w-64 border-r border-foreground/15 bg-background shrink-0">
          <div className="p-5 border-b border-foreground/10">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured && db ? "bg-green-500" : "bg-amber-500 animate-pulse"}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {isFirebaseConfigured && db ? "Firebase Connected" : "Local Mode"}
              </span>
            </div>
          </div>
          <nav className="flex-1 py-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => goTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                <span className="flex-1">{item.label}</span>
                {item.count !== null && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 ${activeTab === item.id ? 'bg-primary/20 text-primary' : 'bg-foreground/5 text-muted-foreground'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-foreground/10">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-destructive/70 hover:bg-destructive/5 hover:text-destructive transition-all cursor-pointer">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content Area ────────────────────────────── */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 xl:p-10 overflow-x-hidden pb-28 lg:pb-10">
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">

            {/* ═══ DASHBOARD TAB ═══════════════════════════════ */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl uppercase mb-1 text-foreground">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Overview of your organization.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                  <StatCard label="Events" value={events.length} icon={Calendar} onClick={() => setActiveTab("events")} />
                  <StatCard label="Posts" value={stories.length} icon={BookOpen} onClick={() => setActiveTab("youth-stories")} />
                  <StatCard label="Registrations" value={registrations.length} icon={Users} accent onClick={() => setActiveTab("registrations")} />
                </div>

                <Card>
                  <CardHeader>
                    <h2 className="font-display text-lg uppercase text-foreground">Recent Registrations</h2>
                  </CardHeader>
                  <CardBody className="p-0 sm:p-0">
                    {registrations.length === 0 ? (
                      <EmptyState icon={Users} message="No registrations yet." />
                    ) : (
                      <>
                        {/* Desktop table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b border-foreground/10 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Event</th>
                              </tr>
                            </thead>
                            <tbody>
                              {registrations.slice(-5).reverse().map(reg => (
                                <tr key={reg.id} className="border-b border-foreground/5 last:border-0">
                                  <td className="px-5 py-3.5 font-bold text-foreground">{reg.name}</td>
                                  <td className="px-5 py-3.5 text-muted-foreground">{reg.email}</td>
                                  <td className="px-5 py-3.5 text-primary font-bold text-xs uppercase">
                                    {events.find(e => e.slug === reg.eventSlug)?.title || reg.eventSlug}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* Mobile cards */}
                        <div className="sm:hidden divide-y divide-foreground/5">
                          {registrations.slice(-5).reverse().map(reg => (
                            <div key={reg.id} className="px-5 py-4 space-y-1">
                              <div className="font-bold text-foreground text-sm">{reg.name}</div>
                              <div className="text-xs text-muted-foreground">{reg.email}</div>
                              <div className="text-xs text-primary font-bold uppercase">
                                {events.find(e => e.slug === reg.eventSlug)?.title || reg.eventSlug}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </div>
            )}

            {/* ═══ EVENTS TAB ══════════════════════════════════ */}
            {activeTab === "events" && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h1 className="font-display text-3xl sm:text-4xl uppercase mb-1 text-foreground">Events</h1>
                    <p className="text-sm text-muted-foreground">Manage your event schedule.</p>
                  </div>
                  {!editingEvent && (
                    <button onClick={clearEventForm} className={btnSecondary}>
                      <Plus size={14} /> New Event
                    </button>
                  )}
                </div>

                {/* Event Form */}
                <Card>
                  <CardHeader>
                    <h2 className="font-display text-lg uppercase text-foreground">
                      {editingEvent ? "Edit Event" : "Create Event"}
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={saveEvent} className="space-y-4">
                      <div>
                        <label className={labelClass}>Event Title</label>
                        <input type="text" value={eventTitle} onChange={e => { setEventTitle(e.target.value); if (!editingEvent) setEventSlug(slugify(e.target.value)); }}
                          placeholder="e.g. The Marketing Minds" className={inputClass} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Slug</label>
                          <input type="text" value={eventSlug} onChange={e => setEventSlug(slugify(e.target.value))}
                            placeholder="auto-generated" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Date Display</label>
                          <input type="text" value={eventDate} onChange={e => setEventDate(e.target.value)}
                            placeholder="e.g. 02 June" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Venue</label>
                        <input type="text" value={eventVenue} onChange={e => setEventVenue(e.target.value)}
                          placeholder="e.g. Public Room, Amsterdam" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Description</label>
                        <textarea value={eventDesc} onChange={e => setEventDesc(e.target.value)}
                          placeholder="Event details..." rows={5} className={`${inputClass} resize-y`} />
                      </div>

                      {/* ── Cover Image (shown at top of event page) ── */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={labelClass + " mb-0"}>Cover Image</label>
                          {isFirebaseConfigured && db && (
                            <div>
                              <input type="file" accept="image/*" className="hidden" id="event-image-upload" onChange={handleEventImageUpload} />
                              <label htmlFor="event-image-upload" className="inline-flex items-center gap-1.5 font-display tracking-widest text-[10px] px-3 py-1.5 border border-primary text-primary hover:bg-primary/5 transition-colors uppercase font-bold cursor-pointer min-h-[32px]">
                                {isUploadingEventImage ? <><Loader2 size={12} className="animate-spin" /> Uploading...</> : <><ImageIcon size={12} /> Upload</>}
                              </label>
                            </div>
                          )}
                        </div>
                        <input type="text" value={eventImage} onChange={e => setEventImage(e.target.value)}
                          placeholder="Paste an image URL, or use Upload" className={`${inputClass} font-mono text-xs`} />
                        {eventImage.trim() ? (
                          <div className="relative mt-3 border border-foreground/10 overflow-hidden bg-foreground/[0.01] group">
                            <img src={maskImageUrl(eventImage)} alt="" className="w-full h-44 sm:h-52 object-contain" />
                            <button type="button" onClick={() => setEventImage("")}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/70 text-white transition-colors cursor-pointer" title="Remove image">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-[11px] text-muted-foreground/70 mt-2">Optional — if left empty, the default event artwork is used.</p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="submit" className={btnPrimary}>
                          {editingEvent ? "Update Event" : "Create Event"}
                        </button>
                        <button type="button" onClick={clearEventForm} className={btnSecondary}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </CardBody>
                </Card>

                {/* Events List */}
                <Card>
                  <CardHeader>
                    <h2 className="font-display text-lg uppercase text-foreground">Published Events</h2>
                  </CardHeader>
                  <CardBody className="p-0 sm:p-0">
                    {events.length === 0 ? (
                      <EmptyState icon={Calendar} message="No events created yet." />
                    ) : (
                      <div className="divide-y divide-foreground/5">
                        {events.map(evt => (
                          <div key={evt.slug} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-foreground/[0.02] transition-colors">
                            <div className="min-w-0">
                              <h4 className="font-bold text-foreground truncate">{evt.title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{evt.date} · {evt.venue}</p>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => startEditEvent(evt)} className={btnIcon} title="Edit">
                                <Edit3 size={14} />
                              </button>
                              <button onClick={() => deleteEvent(evt.slug)} className={`${btnIcon} hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20`} title="Delete">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            )}

            {/* ═══ STORIES & INITIATIVES TAB ═══════════════════ */}
            {(activeTab === "youth-stories" || activeTab === "initiatives") && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h1 className="font-display text-3xl sm:text-4xl uppercase mb-1 text-foreground">
                      {activeTab === "youth-stories" ? "Youth Stories" : "Initiatives"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === "youth-stories" ? "Publish and edit success stories." : "Publish and edit initiatives."}
                    </p>
                  </div>
                  {!editingStory && (
                    <button onClick={clearStoryForm} className={btnSecondary}>
                      <Plus size={14} /> New Post
                    </button>
                  )}
                </div>

                {/* Story Form */}
                <Card>
                  <CardHeader>
                    <h2 className="font-display text-lg uppercase text-foreground">
                      {editingStory ? "Edit Post" : "New Post"}
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={saveStory} className="space-y-5">
                      {/* Title & Slug */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Title</label>
                          <input type="text" value={storyTitle} onChange={e => { setStoryTitle(e.target.value); if (!editingStory) setStorySlug(slugify(e.target.value)); }}
                            placeholder="Post title..." className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Slug</label>
                          <input type="text" value={storySlug} onChange={e => setStorySlug(slugify(e.target.value))}
                            placeholder="auto-generated" className={inputClass} />
                        </div>
                      </div>

                      {/* Category, Color, Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={labelClass}>Category Tag</label>
                          <input type="text" value={storyCategory} onChange={e => setStoryCategory(e.target.value)}
                            placeholder="e.g. IMPACT" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Tag Color</label>
                          <select value={storyTagColor} onChange={e => setStoryTagColor(e.target.value)} className={inputClass}>
                            <option value="primary">Primary (Green)</option>
                            <option value="secondary">Secondary (Blue)</option>
                            <option value="accent">Accent</option>
                            <option value="destructive">Destructive (Red)</option>
                            <option value="foreground">Foreground (Black)</option>
                            <option value="background">Background (White)</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Date</label>
                          <input type="text" value={storyDate} onChange={e => setStoryDate(e.target.value)}
                            placeholder="e.g. JUN 15, 2026" className={inputClass} />
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className={labelClass}>Excerpt / Brief Summary</label>
                        <input type="text" value={storyExcerpt} onChange={e => setStoryExcerpt(e.target.value)}
                          placeholder="A short hook for the listing grid..." className={inputClass} />
                      </div>

                      {/* ── Image Gallery ─────────────────── */}
                      {(() => {
                        const urls = storyImages.split(/[\n, ]+/).map(i => i.trim()).filter(i => i.length > 0 && (i.startsWith("http") || i.startsWith("/cdn-image/")));

                        const setThumbnail = (url: string) => {
                          const newList = [url, ...urls.filter(u => u !== url)];
                          setStoryImages(newList.join("\n")); setStoryImg(url);
                        };
                        const removeUrl = (url: string) => {
                          const newList = urls.filter(u => u !== url);
                          setStoryImages(newList.join("\n"));
                          if (storyImg === url) setStoryImg(newList[0] || "");
                        };
                        const moveUrl = (idx: number, dir: "up" | "down") => {
                          const target = dir === "up" ? idx - 1 : idx + 1;
                          if (target < 0 || target >= urls.length) return;
                          const copy = [...urls]; [copy[idx], copy[target]] = [copy[target], copy[idx]];
                          setStoryImages(copy.join("\n"));
                          if (target === 0 || idx === 0) setStoryImg(copy[0] || "");
                        };
                        const reorderUrls = (from: number, to: number) => {
                          if (from === to || from < 0 || to < 0 || from >= urls.length || to >= urls.length) return;
                          const copy = [...urls];
                          const [moved] = copy.splice(from, 1);
                          copy.splice(to, 0, moved);
                          setStoryImages(copy.join("\n"));
                          setStoryImg(copy[0] || "");
                        };

                        return (
                          <div className="space-y-4">
                            {/* Upload + URL input */}
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <label className={labelClass + " mb-0"}>Images</label>
                                {isFirebaseConfigured && db && (
                                  <div>
                                    <input type="file" multiple accept="image/*" className="hidden" id="story-image-upload" onChange={handleImageUpload} />
                                    <label htmlFor="story-image-upload" className="inline-flex items-center gap-1.5 font-display tracking-widest text-[10px] px-3 py-1.5 border border-primary text-primary hover:bg-primary/5 transition-colors uppercase font-bold cursor-pointer min-h-[32px]">
                                      {isUploadingImages ? <><Loader2 size={12} className="animate-spin" /> Uploading...</> : <><ImageIcon size={12} /> Upload</>}
                                    </label>
                                  </div>
                                )}
                              </div>
                              <textarea value={storyImages} onChange={e => { setStoryImages(e.target.value); setStoryImg(e.target.value.split("\n")[0]?.trim() || ""); }}
                                placeholder={"Paste image URLs, one per line\nFirst = cover thumbnail"} rows={2}
                                className={`${inputClass} font-mono text-xs`} />
                            </div>

                            {/* Visual gallery */}
                            {urls.length > 0 && (
                              <div className="border border-foreground/10 bg-foreground/[0.01] p-3 sm:p-4 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {urls.length} image{urls.length !== 1 ? "s" : ""} · First = Cover
                                  </span>
                                  {urls.length > 1 && (
                                    <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                      Drag to reorder
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                                  {urls.map((url, idx) => {
                                    const isCover = idx === 0;
                                    const isDragging = dragIndex === idx;
                                    const isDropTarget = dragOverIndex === idx && dragIndex !== null && dragIndex !== idx;
                                    return (
                                      <div
                                        key={`${url}-${idx}`}
                                        draggable
                                        onDragStart={(e) => { setDragIndex(idx); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(idx)); }}
                                        onDragEnter={() => setDragOverIndex(idx)}
                                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                                        onDrop={(e) => { e.preventDefault(); if (dragIndex !== null) reorderUrls(dragIndex, idx); setDragIndex(null); setDragOverIndex(null); }}
                                        onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                                        className={`relative group border overflow-hidden cursor-grab active:cursor-grabbing transition-all ${isCover ? "border-primary/50 ring-2 ring-primary/20" : "border-foreground/10"} ${isDragging ? "opacity-40" : ""} ${isDropTarget ? "ring-2 ring-primary scale-[1.03]" : ""}`}
                                      >
                                        <div className="aspect-square relative">
                                          <img src={maskImageUrl(url)} alt="" draggable={false} className="w-full h-full object-cover"
                                            style={{ objectPosition: `center ${storyImgPosition}%` }} />
                                          {isCover && (
                                            <div className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 flex items-center gap-1">
                                              <Star size={8} fill="white" /> Cover
                                            </div>
                                          )}
                                          {/* Hover overlay with actions */}
                                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            {!isCover && (
                                              <button type="button" onClick={() => setThumbnail(url)}
                                                className="p-2 bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer" title="Set as cover">
                                                <Star size={14} />
                                              </button>
                                            )}
                                            <button type="button" onClick={() => moveUrl(idx, "up")} disabled={idx === 0}
                                              className="p-2 bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer disabled:opacity-30" title="Move left">
                                              <ChevronUp size={14} />
                                            </button>
                                            <button type="button" onClick={() => moveUrl(idx, "down")} disabled={idx === urls.length - 1}
                                              className="p-2 bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer disabled:opacity-30" title="Move right">
                                              <ChevronDown size={14} />
                                            </button>
                                            <button type="button" onClick={() => removeUrl(url)}
                                              className="p-2 bg-red-500/40 hover:bg-red-500/60 text-white transition-colors cursor-pointer" title="Remove">
                                              <X size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Cover crop slider */}
                            {storyImg && (
                              <div className="border border-foreground/10 p-3 sm:p-4 space-y-3">
                                <label className={labelClass + " mb-0"}>Cover Crop Position</label>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-muted-foreground shrink-0">Top</span>
                                  <input type="range" min={0} max={100} value={storyImgPosition}
                                    onChange={e => setStoryImgPosition(Number(e.target.value))}
                                    className="flex-1 accent-primary cursor-pointer h-2" />
                                  <span className="text-[10px] font-bold text-muted-foreground shrink-0">Bottom</span>
                                  <span className="text-[10px] font-mono bg-foreground/5 border border-foreground/10 px-2 py-0.5 shrink-0">{storyImgPosition}%</span>
                                </div>
                                <div className="relative overflow-hidden h-24 sm:h-32 border border-foreground/10">
                                  <img src={maskImageUrl(storyImg)} alt="" className="w-full h-full object-cover"
                                    style={{ objectPosition: `center ${storyImgPosition}%` }} />
                                  <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-black/50 px-1.5 py-0.5">Preview</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* ── Block Editor ──────────────────── */}
                      <div>
                        <label className={labelClass}>Article Content</label>
                        <div className="space-y-3 border border-foreground/10 p-3 sm:p-4 bg-foreground/[0.01]">
                          {storyBlocks.map((block, index) => (
                            <div key={block.id} className="border border-foreground/10 bg-background overflow-hidden">
                              {/* Block header */}
                              <div className="flex items-center justify-between gap-2 px-3 py-2 bg-foreground/[0.02] border-b border-foreground/10">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-bold uppercase tracking-widest bg-foreground/5 text-muted-foreground px-2 py-0.5">{index + 1}</span>
                                  <select value={block.type} onChange={e => {
                                    const newType = e.target.value as "heading" | "subheading" | "paragraph";
                                    setStoryBlocks(prev => prev.map(b => b.id === block.id ? { ...b, type: newType } : b));
                                  }} className="bg-transparent border border-foreground/15 px-2 py-1 text-[10px] text-foreground font-bold cursor-pointer">
                                    <option value="paragraph">Paragraph</option>
                                    <option value="heading">Heading</option>
                                    <option value="subheading">Subheading</option>
                                  </select>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button type="button" disabled={index === 0} onClick={() => {
                                    setStoryBlocks(prev => { const c = [...prev]; [c[index], c[index-1]] = [c[index-1], c[index]]; return c; });
                                  }} className="w-7 h-7 flex items-center justify-center hover:bg-foreground/5 disabled:opacity-30 cursor-pointer text-muted-foreground">
                                    <ChevronUp size={14} />
                                  </button>
                                  <button type="button" disabled={index === storyBlocks.length - 1} onClick={() => {
                                    setStoryBlocks(prev => { const c = [...prev]; [c[index], c[index+1]] = [c[index+1], c[index]]; return c; });
                                  }} className="w-7 h-7 flex items-center justify-center hover:bg-foreground/5 disabled:opacity-30 cursor-pointer text-muted-foreground">
                                    <ChevronDown size={14} />
                                  </button>
                                  <button type="button" disabled={storyBlocks.length === 1} onClick={() => {
                                    setStoryBlocks(prev => prev.filter(b => b.id !== block.id));
                                  }} className="w-7 h-7 flex items-center justify-center hover:bg-destructive/10 text-destructive/50 hover:text-destructive disabled:opacity-30 cursor-pointer">
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                              {/* Block textarea */}
                              <textarea value={block.text} onChange={e => {
                                setStoryBlocks(prev => prev.map(b => b.id === block.id ? { ...b, text: e.target.value } : b));
                              }} placeholder={
                                block.type === "heading" ? "Section title..." :
                                block.type === "subheading" ? "Subsection title..." : "Write paragraph..."
                              } rows={block.type === "paragraph" ? 4 : 2}
                                className={`w-full border-0 px-3 py-3 text-sm focus:outline-none text-foreground resize-y ${
                                  block.type === "heading" ? "font-bold text-base uppercase font-display" :
                                  block.type === "subheading" ? "font-semibold text-sm text-primary" : ""
                                }`} />
                            </div>
                          ))}
                          {/* Add block buttons */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            <button type="button" onClick={() => setStoryBlocks(prev => [...prev, { id: `block-${Date.now()}`, type: "paragraph", text: "" }])}
                              className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 border border-foreground/15 hover:bg-foreground/5 text-foreground cursor-pointer transition-colors">
                              + Paragraph
                            </button>
                            <button type="button" onClick={() => setStoryBlocks(prev => [...prev, { id: `block-${Date.now()}`, type: "heading", text: "" }])}
                              className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 border border-foreground/15 hover:bg-foreground/5 text-foreground cursor-pointer transition-colors">
                              + Heading
                            </button>
                            <button type="button" onClick={() => setStoryBlocks(prev => [...prev, { id: `block-${Date.now()}`, type: "subheading", text: "" }])}
                              className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 border border-foreground/15 hover:bg-foreground/5 text-foreground cursor-pointer transition-colors">
                              + Subheading
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Save / Cancel */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-3">
                        <button type="submit" className={btnPrimary}>
                          {editingStory ? "Update Post" : "Publish Post"}
                        </button>
                        <button type="button" onClick={clearStoryForm} className={btnSecondary}>Cancel</button>
                      </div>
                    </form>
                  </CardBody>
                </Card>

                {/* Card Preview */}
                <Card>
                  <CardHeader>
                    <h2 className="font-display text-sm uppercase text-muted-foreground flex items-center gap-2">
                      <Eye size={14} /> Card Preview
                    </h2>
                  </CardHeader>
                  <CardBody className="flex justify-center">
                    <div className="border border-foreground/15 bg-background flex flex-col overflow-hidden w-full max-w-xs pointer-events-none">
                      <div className="relative overflow-hidden h-44 border-b border-foreground/15 bg-muted/20">
                        <img src={maskImageUrl(storyImg) || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80"} alt=""
                          className="w-full h-full object-cover" style={{ objectPosition: `center ${storyImgPosition}%` }} />
                      </div>
                      <div className="flex flex-col p-5 gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">{storyCategory || "CATEGORY"}</span>
                        <h4 className="font-display text-lg leading-tight text-foreground">{storyTitle || "Article Title"}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{storyExcerpt || "Short summary..."}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Published Posts List */}
                <Card>
                  <CardHeader>
                    <h2 className="font-display text-lg uppercase text-foreground">
                      {activeTab === "youth-stories" ? "Published Stories" : "Published Initiatives"}
                    </h2>
                  </CardHeader>
                  <CardBody className="p-0 sm:p-0">
                    {(() => {
                      const filtered = activeTab === "youth-stories" ? youthStories : initiativeStories;
                      if (filtered.length === 0) return <EmptyState icon={BookOpen} message="No posts published yet." />;
                      return (
                        <div className="divide-y divide-foreground/5">
                          {filtered.map(s => (
                            <div key={s.slug} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-foreground/[0.02] transition-colors">
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{s.category}</span>
                                <h4 className="font-bold mt-0.5 text-foreground truncate">{s.title}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">{s.date}</p>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                <Link href={`/stories-initiatives/${s.slug}`}>
                                  <a target="_blank" className={btnIcon} title="View">
                                    <Eye size={14} />
                                  </a>
                                </Link>
                                <button onClick={() => startEditStory(s)} className={btnIcon} title="Edit">
                                  <Edit3 size={14} />
                                </button>
                                <button onClick={() => deleteStory(s.slug)} className={`${btnIcon} hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20`} title="Delete">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </CardBody>
                </Card>
              </div>
            )}

            {/* ═══ REGISTRATIONS TAB ═══════════════════════════ */}
            {activeTab === "registrations" && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h1 className="font-display text-3xl sm:text-4xl uppercase mb-1 text-foreground">Registrations</h1>
                    <p className="text-sm text-muted-foreground">View registered attendees.</p>
                  </div>
                  <button onClick={downloadRegistrationsCSV} className={btnSecondary}>
                    <Download size={14} /> Export CSV
                  </button>
                </div>

                <Card>
                  <CardBody className="p-0 sm:p-0">
                    {registrations.length === 0 ? (
                      <EmptyState icon={AlertCircle} message="No registrations recorded yet." />
                    ) : (
                      <>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b border-foreground/10 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                                <th className="px-5 py-3">ID</th>
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Event</th>
                                <th className="px-5 py-3">Date</th>
                                <th className="px-5 py-3 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {registrations.map(reg => (
                                <tr key={reg.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                                  <td className="px-5 py-3.5 font-mono text-xs text-primary font-bold">{reg.id}</td>
                                  <td className="px-5 py-3.5 font-bold text-foreground">{reg.name}</td>
                                  <td className="px-5 py-3.5 text-muted-foreground">{reg.email}</td>
                                  <td className="px-5 py-3.5 font-semibold text-foreground">
                                    {events.find(e => e.slug === reg.eventSlug)?.title || reg.eventSlug}
                                  </td>
                                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(reg.timestamp).toLocaleString()}</td>
                                  <td className="px-5 py-3.5 text-right">
                                    <button onClick={() => removeRegistration(reg.id)}
                                      className="p-2 hover:bg-destructive/10 text-destructive/50 hover:text-destructive cursor-pointer transition-colors" title="Cancel">
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* Mobile card view */}
                        <div className="md:hidden divide-y divide-foreground/5">
                          {registrations.map(reg => (
                            <div key={reg.id} className="px-5 py-4 space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-bold text-foreground">{reg.name}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">{reg.email}</div>
                                </div>
                                <button onClick={() => removeRegistration(reg.id)}
                                  className="p-2 hover:bg-destructive/10 text-destructive/50 hover:text-destructive cursor-pointer transition-colors shrink-0" title="Cancel">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-primary uppercase">
                                  {events.find(e => e.slug === reg.eventSlug)?.title || reg.eventSlug}
                                </span>
                                <span className="text-[10px] text-muted-foreground">{new Date(reg.timestamp).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </div>
            )}

          </div>
        </main>
      </div>

      <footer className="border-t border-foreground/15 py-5 pb-24 lg:pb-5 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
        © {new Date().getFullYear()} THE BIG IMPACT ORGANISATION
      </footer>

      {/* ── Mobile Bottom Tab Navigation ─────────────────────── */}
      <nav
        aria-label="Admin sections"
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-t border-foreground/15 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5">
          {navItems.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => goTab(item.id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center justify-center gap-1 py-2.5 min-h-[58px] transition-colors cursor-pointer ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && <span className="absolute top-0 inset-x-3 h-0.5 bg-primary" />}
                <div className="relative">
                  <item.icon size={20} />
                  {item.count !== null && item.count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold rounded-full bg-primary text-white">
                      {item.count > 99 ? "99+" : item.count}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wide leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <ConfirmDialog config={confirmConfig} />
    </div>
  );
}
