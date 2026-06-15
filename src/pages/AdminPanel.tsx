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
  Heart,
  MessageCircle,
  ArrowLeft
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  useEvents,
  useStories,
  type EventEntry,
  type StoryEntry
} from "@/lib/adminStore";
import { getRegistrations, deleteRegistration, type Registration } from "@/lib/registrations";
import { toast } from "sonner";
import { db, auth, isFirebaseConfigured } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "events" | "stories" | "registrations">("dashboard");

  // Load store hooks
  const [events, setEventsHook] = useEvents();
  const [stories, setStoriesHook] = useStories();
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // Form states
  const [editingEvent, setEditingEvent] = useState<EventEntry | null>(null);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editingStory, setEditingStory] = useState<StoryEntry | null>(null);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDesc, setEventDesc] = useState("");

  // New Project Form State
  const [projectTitle, setProjectTitle] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [projectTag, setProjectTag] = useState("IMPACT");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [projectImg, setProjectImg] = useState("");
  const [projectBodyText, setProjectBodyText] = useState("");
  const [projectImages, setProjectImages] = useState("");
  const [isUploadingProjectImages, setIsUploadingProjectImages] = useState(false);

  // New Story Form State
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

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuthenticated(!!user);
      });
      
      setRegistrations(getRegistrations());
      const handler = () => {
        setRegistrations(getRegistrations());
      };
      window.addEventListener("tbi_store_update", handler);
      
      return () => {
        unsubscribe();
        window.removeEventListener("tbi_store_update", handler);
      };
    } else {
      // Fallback for local dev if firebase is not configured
      const authed = sessionStorage.getItem("tbi_admin_authed");
      if (authed === "true") {
        setIsAuthenticated(true);
      }
      setRegistrations(getRegistrations());
      const handler = () => setRegistrations(getRegistrations());
      window.addEventListener("tbi_store_update", handler);
      return () => window.removeEventListener("tbi_store_update", handler);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back, Admin!");
        setEmail("");
        setPassword("");
      } catch (err: any) {
        console.error("Login failed:", err);
        toast.error("Invalid email or password. Try again.");
      }
    } else {
      // Local fallback for testing without firebase config
      if (password === "admin") {
        setIsAuthenticated(true);
        sessionStorage.setItem("tbi_admin_authed", "true");
        toast.success("Welcome back, Admin (Local mode)!");
      } else {
        toast.error("Incorrect local password.");
      }
    }
  };

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        toast.success("Logged out successfully.");
      } catch (err) {
        console.error("Error signing out", err);
      }
    } else {
      setIsAuthenticated(false);
      sessionStorage.removeItem("tbi_admin_authed");
      toast.success("Logged out successfully.");
    }
  };

  // Helper to generate slugs
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  // --- Events actions ---
  const saveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventVenue || !eventDesc) {
      toast.error("Please fill in all fields");
      return;
    }
    const finalSlug = eventSlug || slugify(eventTitle);
    const newEvent: EventEntry = {
      title: eventTitle,
      slug: finalSlug,
      date: eventDate,
      venue: eventVenue,
      desc: eventDesc,
    };

    let updatedEvents = [...events];
    if (editingEvent) {
      updatedEvents = updatedEvents.map((evt) => (evt.slug === editingEvent.slug ? newEvent : evt));
      toast.success("Event updated successfully!");
    } else {
      if (events.some((evt) => evt.slug === finalSlug)) {
        toast.error("An event with this slug already exists.");
        return;
      }
      updatedEvents.push(newEvent);
      toast.success("Event created successfully!");
    }

    setEventsHook(updatedEvents);
    clearEventForm();
  };

  const startEditEvent = (evt: EventEntry) => {
    setEditingEvent(evt);
    setEventTitle(evt.title);
    setEventSlug(evt.slug);
    setEventDate(evt.date);
    setEventVenue(evt.venue);
    setEventDesc(evt.desc);
  };

  const deleteEvent = async (slug: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "events", slug));
          toast.success("Event deleted.");
        } catch (err) {
          console.error("Error deleting event:", err);
          toast.error("Failed to delete event from database.");
        }
      } else {
        const updated = events.filter((evt) => evt.slug !== slug);
        setEventsHook(updated);
        toast.success("Event deleted.");
      }
    }
  };

  const clearEventForm = () => {
    setEditingEvent(null);
    setEventTitle("");
    setEventSlug("");
    setEventDate("");
    setEventVenue("");
    setEventDesc("");
  };

  // --- Blog Posts/Stories actions ---
  const saveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle || !storyExcerpt || !storyBodyText) {
      toast.error("Please fill in core fields");
      return;
    }
    const finalSlug = storySlug || slugify(storyTitle);
    const imagesArray = storyImages.split(/[\n, ]+/).map(img => img.trim()).filter(img => img.length > 0 && img.startsWith("http"));
    
    // Construct the image positions array
    const imagePositions = imagesArray.map((_, idx) => 
      storyImagePositions[idx] !== undefined ? storyImagePositions[idx] : idx
    );

    const newStory: StoryEntry = {
      slug: finalSlug,
      title: storyTitle,
      category: storyCategory.toUpperCase(),
      tagColor: storyTagColor,
      excerpt: storyExcerpt,
      author: "",
      date: storyDate || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase(),
      img: storyImg || imagesArray[0] || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80",
      bodyText: storyBodyText,
      defaultLikes: editingStory?.defaultLikes || 0,
      images: imagesArray,
      type: storyType,
      imagePositions: imagePositions,
    };

    let updatedStories = [...stories];
    if (editingStory) {
      updatedStories = updatedStories.map((s) => (s.slug === editingStory.slug ? newStory : s));
      toast.success("Blog post updated successfully!");
    } else {
      if (stories.some((s) => s.slug === finalSlug)) {
        toast.error("A story with this slug already exists.");
        return;
      }
      updatedStories.push(newStory);
      toast.success("Blog post published successfully!");
    }

    setStoriesHook(updatedStories);
    clearStoryForm();
  };

  const startEditStory = (s: StoryEntry) => {
    setEditingStory(s);
    setStoryTitle(s.title);
    setStorySlug(s.slug);
    setStoryCategory(s.category);
    setStoryTagColor(s.tagColor || "primary");
    setStoryExcerpt(s.excerpt);
    setStoryAuthor(s.author);
    setStoryDate(s.date);
    setStoryImg(s.img);
    setStoryImages(s.images ? s.images.join("\n") : s.img);
    setStoryBodyText(s.bodyText);
    setStoryType(s.type || (s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS") ? "story" : "initiative"));
    setStoryImagePositions(s.imagePositions || []);
  };

  const deleteStory = async (slug: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "stories", slug));
          toast.success("Story deleted.");
        } catch (err) {
          console.error("Error deleting story:", err);
          toast.error("Failed to delete story from database.");
        }
      } else {
        const updated = stories.filter((s) => s.slug !== slug);
        setStoriesHook(updated);
        toast.success("Story deleted.");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!isFirebaseConfigured || !db) {
      toast.error("Firebase is not connected. Uploads are disabled.");
      return;
    }

    setIsUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
      const { storage } = await import("@/lib/firebase");

      if (!storage) {
        throw new Error("Firebase Storage is not initialized.");
      }

      toast.loading("Compressing & uploading...", { id: "upload-toast" });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Compress WebP using Canvas
        const webpBlob = await new Promise<Blob>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const MAX_WIDTH = 1200;
              const MAX_HEIGHT = 1200;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext("2d");
              if (!ctx) {
                reject(new Error("Failed context"));
                return;
              }
              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob(
                (blob) => {
                  if (blob) resolve(blob);
                  else reject(new Error("Failed compression"));
                },
                "image/webp",
                0.8
              );
            };
            img.onerror = (err) => reject(err);
          };
          reader.onerror = (err) => reject(err);
        });

        const fileRef = ref(storage, `initiatives/${Date.now()}_${i}.webp`);
        const snapshot = await uploadBytes(fileRef, webpBlob);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(downloadUrl);
      }

      const existing = storyImages.trim();
      const newImagesString = existing 
        ? `${existing}\n${uploadedUrls.join("\n")}`
        : uploadedUrls.join("\n");

      setStoryImages(newImagesString);

      if (!storyImg && uploadedUrls.length > 0) {
        setStoryImg(uploadedUrls[0]);
      }

      toast.success("Images uploaded and compressed to WebP!", { id: "upload-toast" });
    } catch (error: any) {
      console.error("Upload error details:", error);
      toast.error(`Failed to upload images: ${error?.message || "Storage error"}`, { id: "upload-toast" });
    } finally {
      setIsUploadingImages(false);
      e.target.value = "";
    }
  };

  const clearStoryForm = () => {
    setEditingStory(null);
    setStoryTitle("");
    setStorySlug("");
    setStoryCategory("IMPACT");
    setStoryTagColor("primary");
    setStoryExcerpt("");
    setStoryAuthor("");
    setStoryDate("");
    setStoryImg("");
    setStoryImages("");
    setStoryBodyText("");
    setStoryType("story");
    setStoryImagePositions([]);
  };

  const handlePositionChange = (imageIndex: number, paragraphIndex: number) => {
    setStoryImagePositions((prev) => {
      const copy = [...prev];
      while (copy.length <= imageIndex) {
        copy.push(copy.length);
      }
      copy[imageIndex] = paragraphIndex;
      return copy;
    });
  };

  // --- Registrations actions ---
  const removeRegistration = async (id: string) => {
    if (confirm("Cancel this registration?")) {
      await deleteRegistration(id);
      setRegistrations(getRegistrations());
      toast.success("Registration cancelled.");
    }
  };

  const downloadRegistrationsCSV = () => {
    if (registrations.length === 0) {
      toast.error("No registrations to export");
      return;
    }
    const headers = "ID,Name,Email,Event,Date\n";
    const rows = registrations
      .map((r) => {
        const eventTitle = events.find((e) => e.slug === r.eventSlug)?.title || r.eventSlug;
        const formattedDate = new Date(r.timestamp).toLocaleString();
        return `"${r.id}","${r.name}","${r.email}","${eventTitle}","${formattedDate}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tbio_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        {/* Back Link */}
        <div className="p-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group cursor-pointer bg-transparent border-none outline-none">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Website
            </button>
          </Link>
        </div>

        <main className="flex-grow flex items-center justify-center px-4 relative z-10">
          <div className="w-full max-w-md bg-secondary/5 backdrop-blur-xl border border-foreground/15 p-8 md:p-12 text-center rounded-none shadow-2xl relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            <h1 className="font-display text-4xl mb-6 uppercase tracking-wider text-foreground">
              ADMIN GATEWAY
            </h1>
            <p className="text-sm font-medium text-muted-foreground mb-8">
              Authenticate to manage events, projects, and initiatives.
            </p>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm rounded-none focus:outline-none focus:border-primary transition-all text-foreground"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm rounded-none focus:outline-none focus:border-primary transition-all text-foreground"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full font-display tracking-widest text-sm min-h-[44px] px-6 bg-primary text-white btn-primary uppercase font-bold cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        </main>
        
        <footer className="py-8 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/45 relative z-10">
          © {new Date().getFullYear()} THE BIG IMPACT ORGANISATION. SECURE PANEL.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Standalone Admin Header */}
      <header className="sticky top-0 z-40 w-full bg-background border-b border-foreground/15 py-4 px-6 md:px-12 flex justify-between items-center backdrop-blur-md bg-background/90">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-display text-sm md:text-base tracking-widest uppercase font-bold text-foreground">
            TBIO // Admin Portal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/">
            <a className="inline-flex items-center gap-1.5 font-display tracking-widest text-[10px] md:text-xs px-3 py-1.5 border border-foreground/25 hover:bg-foreground/5 transition-all uppercase font-bold cursor-pointer text-foreground">
              View Website
            </a>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 font-display tracking-widest text-[10px] md:text-xs px-3 py-1.5 bg-primary text-white border border-primary hover:bg-primary/90 transition-all uppercase font-bold cursor-pointer"
          >
            <LogOut size={12} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 pt-12 pb-16 flex-grow flex flex-col lg:flex-row gap-8 text-left">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none">
          <div className="hidden lg:block border border-foreground/15 p-6 bg-secondary/10 mb-4">
            <h2 className="font-display text-xl uppercase tracking-wider mb-1 text-foreground">TBIO Admin</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${isFirebaseConfigured && db ? "bg-green-500" : "bg-amber-500 animate-pulse"}`}></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {isFirebaseConfigured && db ? "Firestore Configured" : "LocalStorage Mode"}
              </span>
            </div>
          </div>

           <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-primary text-white border-primary"
                : "border-foreground/10 hover:bg-foreground/5"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              activeTab === "events"
                ? "bg-primary text-white border-primary"
                : "border-foreground/10 hover:bg-foreground/5"
            }`}
          >
            <Calendar size={18} />
            Events ({events.length})
          </button>

          

          <button
            onClick={() => setActiveTab("stories")}
            className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              activeTab === "stories"
                ? "bg-primary text-white border-primary"
                : "border-foreground/10 hover:bg-foreground/5"
            }`}
          >
            <BookOpen size={18} />
            Stories & Initiatives ({stories.length})
          </button>

          <button
            onClick={() => setActiveTab("registrations")}
            className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              activeTab === "registrations"
                ? "bg-primary text-white border-primary"
                : "border-foreground/10 hover:bg-foreground/5"
            }`}
          >
            <Users size={18} />
            Registrations ({registrations.length})
          </button>

          <hr className="hidden lg:block border-foreground/10 my-4" />

          <button
            onClick={handleLogout}
            className="flex-shrink-0 flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider border border-red-500/35 hover:bg-red-500/10 transition-colors text-red-400 cursor-pointer"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </aside>

        {/* Workspace Content */}
        <main className="flex-grow border border-foreground/15 p-6 md:p-8 bg-background relative overflow-x-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h1 className="font-display text-4xl uppercase mb-2 text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Overview of organization operations.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="border border-foreground/15 p-6 bg-secondary/[0.03] hover:bg-secondary/[0.06] hover:border-foreground/30 transition-all duration-300 relative group">
                  <div className="flex justify-between items-start">
                    <div className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Events</div>
                    <Calendar size={16} className="text-secondary/60 group-hover:text-secondary transition-colors" />
                  </div>
                  <div className="font-display text-4xl font-extrabold text-foreground mt-4">{events.length}</div>
                </div>
                
                <div className="border border-foreground/15 p-6 bg-secondary/[0.03] hover:bg-secondary/[0.06] hover:border-foreground/30 transition-all duration-300 relative group">
                  <div className="flex justify-between items-start">
                    <div className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Stories</div>
                    <BookOpen size={16} className="text-secondary/60 group-hover:text-secondary transition-colors" />
                  </div>
                  <div className="font-display text-4xl font-extrabold text-foreground mt-4">{stories.length}</div>
                </div>
                
                <div className="border border-foreground/15 p-6 bg-primary/[0.02] hover:bg-primary/[0.05] hover:border-primary/30 border-l-primary/45 transition-all duration-300 relative group">
                  <div className="flex justify-between items-start">
                    <div className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Registrations</div>
                    <Users size={16} className="text-primary/60 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="font-display text-4xl font-extrabold text-primary mt-4">{registrations.length}</div>
                </div>
              </div>

              {/* Recent Signups */}
              <div className="border border-foreground/15 p-6 bg-background">
                <h2 className="font-display text-xl uppercase mb-4 text-foreground">Recent Registrations</h2>
                {registrations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No registrations found yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-foreground/15 text-muted-foreground text-xs uppercase font-bold">
                          <th className="pb-3 pr-4">ID</th>
                          <th className="pb-3 pr-4">Name</th>
                          <th className="pb-3 pr-4">Email</th>
                          <th className="pb-3">Event</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.slice(-5).reverse().map((reg) => (
                          <tr key={reg.id} className="border-b border-foreground/5 last:border-b-0">
                            <td className="py-3 pr-4 font-mono text-xs">{reg.id}</td>
                            <td className="py-3 pr-4 font-bold text-foreground">{reg.name}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{reg.email}</td>
                            <td className="py-3 text-primary font-bold">
                              {events.find((e) => e.slug === reg.eventSlug)?.title || reg.eventSlug}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === "events" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-display text-4xl uppercase mb-2 text-foreground">Events Manager</h1>
                  <p className="text-sm text-muted-foreground">Manage and preview organization schedule.</p>
                </div>
                {!editingEvent && (
                  <button
                    onClick={clearEventForm}
                    className="flex items-center gap-2 font-display tracking-widest text-xs px-4 py-2 border border-foreground/15 hover:bg-foreground/5 transition-colors uppercase font-bold cursor-pointer text-foreground"
                  >
                    <Plus size={14} /> New Event
                  </button>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Form column */}
                <div className="border border-foreground/15 p-6 bg-secondary/5 space-y-6">
                  <h2 className="font-display text-2xl uppercase border-b border-foreground/15 pb-2 text-foreground">
                    {editingEvent ? "Edit Event" : "Create Event"}
                  </h2>
                  <form onSubmit={saveEvent} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Event Title</label>
                      <input
                        type="text"
                        value={eventTitle}
                        onChange={(e) => {
                          setEventTitle(e.target.value);
                          if (!editingEvent) setEventSlug(slugify(e.target.value));
                        }}
                        placeholder="e.g. The Marketing Minds"
                        className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Slug</label>
                        <input
                          type="text"
                          value={eventSlug}
                          onChange={(e) => setEventSlug(slugify(e.target.value))}
                          placeholder="impact-meetup"
                          className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Date Display</label>
                        <input
                          type="text"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          placeholder="e.g. 02 June"
                          className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Venue</label>
                      <input
                        type="text"
                        value={eventVenue}
                        onChange={(e) => setEventVenue(e.target.value)}
                        placeholder="e.g. Public Room, Amsterdam"
                        className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Description (multiline)</label>
                      <textarea
                        value={eventDesc}
                        onChange={(e) => setEventDesc(e.target.value)}
                        placeholder="Detailed details for registrations page..."
                        rows={6}
                        className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground font-sans"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="font-display tracking-widest text-xs px-6 py-3 bg-primary text-white btn-primary uppercase font-bold cursor-pointer"
                      >
                        {editingEvent ? "Update Event" : "Create Event"}
                      </button>
                      <button
                        type="button"
                        onClick={clearEventForm}
                        className="font-display tracking-widest text-xs px-6 py-3 border border-foreground/15 hover:bg-foreground/5 uppercase font-bold text-foreground bg-transparent cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>

                {/* Previews & List column */}
                <div className="space-y-8">
                  {/* Live Preview card */}
                  <div className="border border-foreground/15 p-6 bg-background">
                    <h3 className="font-display text-sm uppercase text-muted-foreground mb-4 flex items-center gap-2">
                      <Eye size={14} /> Live Component Preview
                    </h3>
                    <div className="border border-foreground/15 p-6 hover:bg-foreground/5 transition-colors flex flex-col md:flex-row justify-between items-center gap-6 bg-background pointer-events-none">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-grow text-left">
                        <div className="font-display text-3xl md:text-4xl text-primary md:w-32 shrink-0">
                          {eventDate || "02 June"}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-display text-2xl mb-1 leading-tight text-foreground">
                            {eventTitle || "The Marketing Minds"}
                          </h4>
                          <p className="font-bold tracking-widest text-muted-foreground text-sm uppercase">
                            {eventVenue || "Public Room"}
                          </p>
                        </div>
                      </div>
                      <button className="font-display tracking-widest text-xs px-6 py-3 bg-primary text-white uppercase font-bold">
                        Register
                      </button>
                    </div>
                  </div>

                  {/* List of existing events */}
                  <div className="border border-foreground/15 p-6 bg-background space-y-4">
                    <h3 className="font-display text-xl uppercase border-b border-foreground/15 pb-2 text-foreground">Published Schedule</h3>
                    {events.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No events created yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {events.map((evt) => (
                          <div key={evt.slug} className="border border-foreground/10 p-4 flex justify-between items-center bg-secondary/5">
                            <div>
                              <h4 className="font-bold text-foreground">{evt.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {evt.date} • {evt.venue}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditEvent(evt)}
                                className="p-2 border border-foreground/10 hover:bg-foreground/5 hover:text-primary transition-colors cursor-pointer text-foreground"
                                title="Edit"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => deleteEvent(evt.slug)}
                                className="p-2 border border-foreground/10 hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer text-foreground"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STORIES & INITIATIVES TAB */}
          {/* INITIATIVES TAB */}
          {activeTab === "stories" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-display text-4xl uppercase mb-2 text-foreground">Stories & Initiatives Manager</h1>
                  <p className="text-sm text-muted-foreground">Publish and edit youth stories, initiatives, & success features.</p>
                </div>
                {!editingStory && (
                  <button
                    onClick={clearStoryForm}
                    className="flex items-center gap-2 font-display tracking-widest text-xs px-4 py-2 border border-foreground/15 hover:bg-foreground/5 transition-colors uppercase font-bold cursor-pointer text-foreground"
                  >
                    <Plus size={14} /> New Story
                  </button>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Form card */}
                <div className="border border-foreground/15 p-6 bg-secondary/5 space-y-6">
                  <h2 className="font-display text-2xl uppercase border-b border-foreground/15 pb-2 text-foreground">
                    {editingStory ? "Edit Story" : "Publish Story"}
                  </h2>
                  <form onSubmit={saveStory} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Story Title</label>
                        <input
                          type="text"
                          value={storyTitle}
                          onChange={(e) => {
                            setStoryTitle(e.target.value);
                            if (!editingStory) setStorySlug(slugify(e.target.value));
                          }}
                          placeholder="Spotlight on Young Leaders"
                          className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Slug</label>
                        <input
                          type="text"
                          value={storySlug}
                          onChange={(e) => setStorySlug(slugify(e.target.value))}
                          placeholder="spotlight-young-leaders"
                          className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Type</label>
                        <select
                          value={storyType}
                          onChange={(e) => setStoryType(e.target.value as "story" | "initiative")}
                          className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground uppercase tracking-widest"
                        >
                          <option value="story">Youth Success Story</option>
                          <option value="initiative">Our Initiative</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Category & Tag Color</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={storyCategory}
                            onChange={(e) => setStoryCategory(e.target.value)}
                            placeholder="e.g. IMPACT"
                            className="w-1/2 bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                          />
                          <select
                            value={storyTagColor}
                            onChange={(e) => setStoryTagColor(e.target.value)}
                            className="w-1/2 bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground uppercase tracking-widest"
                          >
                            <option value="primary">Primary (Green)</option>
                            <option value="secondary">Secondary (Blue)</option>
                            <option value="accent">Accent</option>
                            <option value="destructive">Destructive (Red)</option>
                            <option value="foreground">Foreground (Black)</option>
                            <option value="background">Background (White)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Date</label>
                      <input
                        type="text"
                        value={storyDate}
                        onChange={(e) => setStoryDate(e.target.value)}
                        placeholder="e.g. JUN 15, 2026"
                        className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Excerpt / Brief Summary</label>
                      <input
                        type="text"
                        value={storyExcerpt}
                        onChange={(e) => setStoryExcerpt(e.target.value)}
                        placeholder="A short hook for the initiatives grid listing..."
                        className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold uppercase tracking-widest block text-muted-foreground">Images (one URL per line, first is thumbnail)</label>
                        {isFirebaseConfigured && db && (
                          <div>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              id="story-image-upload"
                              onChange={handleImageUpload}
                            />
                            <label
                              htmlFor="story-image-upload"
                              className="inline-flex items-center gap-1.5 font-display tracking-widest text-[10px] px-2.5 py-1 border border-primary text-primary hover:bg-primary/5 transition-colors uppercase font-bold cursor-pointer"
                            >
                              {isUploadingImages ? "Uploading..." : "Upload & Compress"}
                            </label>
                          </div>
                        )}
                      </div>
                      <textarea
                        value={storyImages}
                        onChange={(e) => {
                          setStoryImages(e.target.value);
                          const first = e.target.value.split("\n")[0]?.trim();
                          setStoryImg(first || "");
                        }}
                        placeholder="e.g. https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                        rows={3}
                        className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground font-sans"
                      />
                    </div>

                    {/* Image Placement selectors */}
                    {(() => {
                      const urls = storyImages.split(/[\n, ]+/).map(img => img.trim()).filter(img => img.length > 0 && img.startsWith("http"));
                      const paragraphs = storyBodyText.split("\n\n").filter(p => p.trim().length > 0);
                      const galleryUrls = urls.slice(1);
                      
                      if (galleryUrls.length === 0) return null;
                      
                      return (
                        <div className="border border-foreground/10 p-4 bg-background/50 space-y-3">
                          <label className="text-xs font-bold uppercase tracking-widest block text-muted-foreground">
                            Interleaved Image Placement (Under Paragraphs)
                          </label>
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                            Specify where each gallery image should appear within the article.
                          </p>
                          <div className="space-y-2">
                            {galleryUrls.map((url, index) => {
                              const globalIdx = index + 1;
                              const currentPos = storyImagePositions[index] !== undefined ? storyImagePositions[index] : index;
                              
                              return (
                                <div key={globalIdx} className="flex items-center gap-3 text-xs border-b border-foreground/5 pb-2 last:border-b-0">
                                  <div className="w-12 h-12 border border-foreground/10 shrink-0 bg-muted/20">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-grow truncate text-muted-foreground">
                                    {url.substring(url.lastIndexOf('/') + 1) || `Image ${globalIdx}`}
                                  </div>
                                  <select
                                    value={currentPos}
                                    onChange={(e) => handlePositionChange(index, parseInt(e.target.value))}
                                    className="bg-background border border-foreground/20 px-2 py-1 text-xs focus:outline-none text-foreground uppercase tracking-widest shrink-0"
                                  >
                                    {paragraphs.map((_, pIdx) => (
                                      <option key={pIdx} value={pIdx}>
                                        After Paragraph {pIdx + 1}
                                      </option>
                                    ))}
                                    <option value={-1}>At the bottom</option>
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest block mb-1 text-muted-foreground">Article Body Content (paragraphs split by double enter)</label>
                      <textarea
                        value={storyBodyText}
                        onChange={(e) => setStoryBodyText(e.target.value)}
                        placeholder="Write article paragraphs here..."
                        rows={8}
                        className="w-full bg-background border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground font-sans"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="font-display tracking-widest text-xs px-6 py-3 bg-primary text-white btn-primary uppercase font-bold cursor-pointer"
                      >
                        {editingStory ? "Update Initiative" : "Publish Initiative"}
                      </button>
                      <button
                        type="button"
                        onClick={clearStoryForm}
                        className="font-display tracking-widest text-xs px-6 py-3 border border-foreground/15 hover:bg-foreground/5 uppercase font-bold text-foreground bg-transparent cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>

                {/* Previews and List */}
                <div className="space-y-8">
                  {/* Live article preview */}
                  <div className="border border-foreground/15 p-6 bg-background space-y-4">
                    <h3 className="font-display text-sm uppercase text-muted-foreground flex items-center gap-2">
                      <Eye size={14} /> Grid Card Preview
                    </h3>
                    <div className="border border-foreground/15 bg-background flex flex-col group overflow-hidden max-w-sm mx-auto text-left pointer-events-none">
                      <div className="relative overflow-hidden h-44 border-b border-foreground/15">
                        <img
                          src={storyImg || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80"}
                          alt=""
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <div className="flex flex-col p-6 gap-3">
                        <span className="text-xs font-bold tracking-widest text-primary uppercase">{storyCategory || "CATEGORY"}</span>
                        <h4 className="font-display text-xl leading-tight text-foreground">{storyTitle || "Article Title"}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{storyExcerpt || "Short summary text here..."}</p>
                      </div>
                    </div>
                           {/* List of articles */}
                  <div className="space-y-6">
                    {/* Youth Success Stories */}
                    <div className="border border-foreground/15 p-6 bg-background space-y-4">
                      <h3 className="font-display text-xl uppercase border-b border-foreground/15 pb-2 text-foreground">Youth Success Stories</h3>
                      {stories.filter((s) => s.type === "story" || (!s.type && (s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS")))).length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No success stories published yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {stories.filter((s) => s.type === "story" || (!s.type && (s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS")))).map((s) => (
                            <div key={s.slug} className="border border-foreground/10 p-4 flex justify-between items-center bg-secondary/5">
                              <div>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                  {s.category}
                                </span>
                                <h4 className="font-bold mt-1 text-foreground">{s.title}</h4>
                                <p className="text-xs text-muted-foreground">{s.date}</p>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/stories-initiatives/${s.slug}`}>
                                  <a target="_blank" className="p-2 border border-foreground/10 hover:bg-foreground/5 text-muted-foreground hover:text-foreground" title="View Story">
                                    <Eye size={14} />
                                  </a>
                                </Link>
                                <button
                                  onClick={() => startEditStory(s)}
                                  className="p-2 border border-foreground/10 hover:bg-foreground/5 hover:text-primary transition-colors cursor-pointer text-foreground"
                                  title="Edit"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => deleteStory(s.slug)}
                                  className="p-2 border border-foreground/10 hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer text-foreground"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Our Initiatives */}
                    <div className="border border-foreground/15 p-6 bg-background space-y-4">
                      <h3 className="font-display text-xl uppercase border-b border-foreground/15 pb-2 text-foreground">Our Initiatives</h3>
                      {stories.filter((s) => s.type === "initiative" || (!s.type && !(s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS")))).length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No initiatives published yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {stories.filter((s) => s.type === "initiative" || (!s.type && !(s.category.toUpperCase().includes("STORY") || s.category.toUpperCase().includes("SUCCESS")))).map((s) => (
                            <div key={s.slug} className="border border-foreground/10 p-4 flex justify-between items-center bg-secondary/5">
                              <div>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                  {s.category}
                                </span>
                                <h4 className="font-bold mt-1 text-foreground">{s.title}</h4>
                                <p className="text-xs text-muted-foreground">{s.date}</p>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/stories-initiatives/${s.slug}`}>
                                  <a target="_blank" className="p-2 border border-foreground/10 hover:bg-foreground/5 text-muted-foreground hover:text-foreground" title="View Initiative">
                                    <Eye size={14} />
                                  </a>
                                </Link>
                                <button
                                  onClick={() => startEditStory(s)}
                                  className="p-2 border border-foreground/10 hover:bg-foreground/5 hover:text-primary transition-colors cursor-pointer text-foreground"
                                  title="Edit"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => deleteStory(s.slug)}
                                  className="p-2 border border-foreground/10 hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer text-foreground"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>             </div>
                </div>
              </div>
            </div>
          )}

          {/* REGISTRATIONS TAB */}
          {activeTab === "registrations" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-display text-4xl uppercase mb-2 text-foreground">Event Registrations</h1>
                  <p className="text-sm text-muted-foreground">View interest and registered attendees.</p>
                </div>
                <button
                  onClick={downloadRegistrationsCSV}
                  className="flex items-center gap-2 font-display tracking-widest text-xs px-4 py-2 border border-primary hover:bg-primary/10 transition-all uppercase font-bold text-primary cursor-pointer"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>

              <div className="border border-foreground/15 p-6 bg-background">
                {registrations.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <AlertCircle className="mx-auto text-muted-foreground" size={36} />
                    <p className="text-muted-foreground text-sm">No registrations recorded on this device yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-foreground/15 text-muted-foreground text-xs uppercase font-bold">
                          <th className="pb-3 pr-4">Ticket ID</th>
                          <th className="pb-3 pr-4">Attendee Name</th>
                          <th className="pb-3 pr-4">Email Address</th>
                          <th className="pb-3 pr-4">Event Target</th>
                          <th className="pb-3 pr-4">Signed Up</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((reg) => (
                          <tr key={reg.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                            <td className="py-4 pr-4 font-mono text-xs font-bold text-primary">{reg.id}</td>
                            <td className="py-4 pr-4 font-bold text-foreground">{reg.name}</td>
                            <td className="py-4 pr-4 text-muted-foreground">{reg.email}</td>
                            <td className="py-4 pr-4 font-semibold text-foreground">
                              {events.find((e) => e.slug === reg.eventSlug)?.title || reg.eventSlug}
                            </td>
                            <td className="py-4 pr-4 text-xs text-muted-foreground">
                              {new Date(reg.timestamp).toLocaleString()}
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => removeRegistration(reg.id)}
                                className="text-red-400 hover:text-red-500 p-1 hover:bg-red-500/15 cursor-pointer"
                                title="Cancel Ticket"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="border-t border-foreground/15 py-6 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 bg-background/50">
        © {new Date().getFullYear()} THE BIG IMPACT ORGANISATION. SECURE PANEL.
      </footer>
    </div>
  );
}
