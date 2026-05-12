import { useState } from "react";
import { useLocation } from "wouter";
import {
  useEvents,
  useSponsorWords,
  adminLogout,
  isAdminLoggedIn,
  DEFAULT_EVENTS,
  DEFAULT_SPONSOR_WORDS,
  type EventEntry,
  type SponsorWord,
} from "@/lib/adminStore";
import {
  useAdminStorySubmissions,
  useApproveSubmission,
  useRejectSubmission,
  useCreatePublishedStoryApi,
  useDeletePublishedStoryApi,
  useGetPublishedStories,
} from "@/lib/useStories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, LogOut, Calendar, Tag, BookOpen, Mic, Camera, Check, X, Eye } from "lucide-react";
import logoImg from "@/assets/logo.png";

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="border-b-2 border-foreground pb-4 mb-6">
      <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-1">
        {sub}
      </p>
      <h2 className="font-display text-3xl md:text-4xl uppercase">{title}</h2>
    </div>
  );
}

// ─── Events editor ────────────────────────────────────────────────────────────

function EventsEditor() {
  const [events, setEvents] = useEvents();
  const [draft, setDraft] = useState<EventEntry[]>(
    JSON.parse(JSON.stringify(events))
  );

  const update = (i: number, field: keyof EventEntry, val: string) => {
    setDraft((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, [field]: val } : e))
    );
  };

  const addEvent = () => {
    setDraft((prev) => [
      ...prev,
      {
        slug: `event-${Date.now()}`,
        title: "NEW EVENT",
        date: "TBA",
        venue: "VENUE TBD",
        desc: "Event description goes here.",
      },
    ]);
  };

  const removeEvent = (i: number) => {
    setDraft((prev) => prev.filter((_, idx) => idx !== i));
  };

  const save = () => {
    setEvents(draft);
    toast.success("Events saved", {
      style: {
        borderRadius: "0",
        border: "4px solid hsl(var(--secondary))",
        background: "hsl(var(--foreground))",
        color: "hsl(var(--background))",
      },
    });
  };

  const reset = () => {
    setDraft(JSON.parse(JSON.stringify(DEFAULT_EVENTS)));
  };

  return (
    <div>
      <SectionHeader title="Upcoming Agenda" sub="Events" />
      <div className="space-y-6 mb-6">
        {draft.map((event, i) => (
          <div
            key={i}
            className="border-2 border-foreground p-5 space-y-4 relative"
          >
            <button
              onClick={() => removeEvent(i)}
              className="absolute top-3 right-3 p-1.5 hover:bg-primary hover:text-white transition-colors border border-foreground"
              aria-label="Remove event"
            >
              <Trash2 size={16} />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">
                  Title
                </label>
                <Input
                  value={event.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  className="rounded-none border-2 border-foreground h-11 font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">
                  Date
                </label>
                <Input
                  value={event.date}
                  onChange={(e) => update(i, "date", e.target.value)}
                  className="rounded-none border-2 border-foreground h-11"
                  placeholder="e.g. TBA or June 15"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">
                Venue
              </label>
              <Input
                value={event.venue}
                onChange={(e) => update(i, "venue", e.target.value)}
                className="rounded-none border-2 border-foreground h-11 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">
                Description
              </label>
              <Textarea
                value={event.desc}
                onChange={(e) => update(i, "desc", e.target.value)}
                className="rounded-none border-2 border-foreground min-h-[80px] resize-none"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={addEvent}
          variant="outline"
          className="font-display uppercase tracking-widest border-2 border-foreground rounded-none"
        >
          <Plus size={16} className="mr-2" /> Add Event
        </Button>
        <Button
          onClick={save}
          className="font-display uppercase tracking-widest border-2 border-foreground rounded-none"
        >
          Save Changes
        </Button>
        <button
          onClick={reset}
          className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

// ─── Sponsors editor ──────────────────────────────────────────────────────────

const CLS_OPTIONS = [
  { label: "Lime",    value: "bg-secondary text-foreground" },
  { label: "Red",     value: "bg-primary text-primary-foreground" },
  { label: "Orange",  value: "bg-accent text-primary-foreground" },
  { label: "Black",   value: "bg-foreground text-background" },
  { label: "Neutral", value: "bg-background text-foreground" },
];

function SponsorsEditor() {
  const [words, setWords] = useSponsorWords();
  const [draft, setDraft] = useState<SponsorWord[]>(
    JSON.parse(JSON.stringify(words))
  );

  const update = (i: number, field: keyof SponsorWord, val: string) => {
    setDraft((prev) =>
      prev.map((w, idx) => (idx === i ? { ...w, [field]: val } : w))
    );
  };

  const addWord = () => {
    setDraft((prev) => [
      ...prev,
      { text: "NEW WORD", cls: "bg-background text-foreground" },
    ]);
  };

  const removeWord = (i: number) => {
    setDraft((prev) => prev.filter((_, idx) => idx !== i));
  };

  const save = () => {
    setWords(draft);
    toast.success("Sponsor words saved", {
      style: {
        borderRadius: "0",
        border: "4px solid hsl(var(--secondary))",
        background: "hsl(var(--foreground))",
        color: "hsl(var(--background))",
      },
    });
  };

  const reset = () => {
    setDraft(JSON.parse(JSON.stringify(DEFAULT_SPONSOR_WORDS)));
  };

  return (
    <div>
      <SectionHeader title="Sponsor Marquee Words" sub="Sponsors" />
      <p className="text-sm font-medium text-muted-foreground mb-6">
        These words cycle through the two animated strips in the Sponsors section.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {draft.map((word, i) => (
          <div
            key={i}
            className="border-2 border-foreground p-3 flex gap-2 items-center"
          >
            <Input
              value={word.text}
              onChange={(e) =>
                update(i, "text", e.target.value.toUpperCase())
              }
              className="rounded-none border-2 border-foreground h-9 font-bold uppercase text-sm flex-grow"
            />
            <select
              value={word.cls}
              onChange={(e) => update(i, "cls", e.target.value)}
              className="border-2 border-foreground bg-background text-foreground text-xs font-bold rounded-none h-9 px-2 cursor-pointer"
            >
              {CLS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => removeWord(i)}
              className="p-1.5 hover:bg-primary hover:text-white border border-foreground transition-colors shrink-0"
              aria-label="Remove word"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={addWord}
          variant="outline"
          className="font-display uppercase tracking-widest border-2 border-foreground rounded-none"
        >
          <Plus size={16} className="mr-2" /> Add Word
        </Button>
        <Button
          onClick={save}
          className="font-display uppercase tracking-widest border-2 border-foreground rounded-none"
        >
          Save Changes
        </Button>
        <button
          onClick={reset}
          className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

// ─── Stories manager ──────────────────────────────────────────────────────────

const FORMAT_META: Record<string, { icon: typeof Mic; label: string; color: string }> = {
  speak: { icon: Mic,      label: "Audio",   color: "bg-primary text-white" },
  show:  { icon: Camera,   label: "Images",  color: "bg-secondary text-foreground" },
  write: { icon: BookOpen, label: "Written", color: "bg-accent text-white" },
};

type StoryView = "submissions" | "published" | "add";

function StoriesViewer() {
  const [view, setView] = useState<StoryView>("submissions");
  const { data: submissions = [], isLoading: loadingSubs, refetch: refetchSubs } = useAdminStorySubmissions();
  const { data: published = [], isLoading: loadingPub, refetch: refetchPub } = useGetPublishedStories();
  const { mutateAsync: approve, isPending: approving } = useApproveSubmission();
  const { mutateAsync: reject, isPending: rejecting } = useRejectSubmission();
  const { mutateAsync: createStory, isPending: creating } = useCreatePublishedStoryApi();
  const { mutateAsync: deleteStory } = useDeletePublishedStoryApi();

  const [addForm, setAddForm] = useState({ name: "", age: "", title: "", format: "write" as "speak"|"show"|"write", storyText: "" });
  const pending = submissions.filter(s => s.status === "pending");

  const toastStyle = {
    borderRadius: "0",
    border: "4px solid hsl(var(--secondary))",
    background: "hsl(var(--foreground))",
    color: "hsl(var(--background))",
  };

  const handleApprove = async (id: number) => {
    try {
      await approve({ id });
      toast.success("Story approved & published!", { style: toastStyle });
    } catch { toast.error("Failed to approve"); }
  };

  const handleReject = async (id: number) => {
    try {
      await reject({ id });
      toast.success("Submission rejected", { style: toastStyle });
    } catch { toast.error("Failed to reject"); }
  };

  const handleAdd = async () => {
    if (!addForm.name || !addForm.title) { toast.error("Name and title are required"); return; }
    try {
      await createStory({ data: { ...addForm, storyText: addForm.storyText || undefined, age: addForm.age || undefined } });
      toast.success("Story published!", { style: toastStyle });
      setAddForm({ name: "", age: "", title: "", format: "write", storyText: "" });
      setView("published");
    } catch { toast.error("Failed to publish story"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this published story?")) return;
    try {
      await deleteStory({ id });
      toast.success("Story removed", { style: toastStyle });
    } catch { toast.error("Failed to delete"); }
  };

  const dateStr = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <SectionHeader title="Stories" sub="Content" />

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-foreground pb-4 flex-wrap">
        {[
          { id: "submissions" as StoryView, label: `Submissions (${pending.length})` },
          { id: "published" as StoryView, label: `Published (${published.length})` },
          { id: "add" as StoryView, label: "+ Add Story" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`font-display text-sm uppercase tracking-widest px-4 py-2 border-2 transition-colors ${view === id ? "bg-foreground text-background border-foreground" : "border-foreground/30 hover:border-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Submissions list */}
      {view === "submissions" && (
        <div>
          {loadingSubs ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : submissions.length === 0 ? (
            <div className="border-2 border-dashed border-foreground p-12 text-center">
              <BookOpen size={36} className="mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="font-display text-2xl uppercase text-muted-foreground">No submissions yet</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Story form submissions will appear here for review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((story) => {
                const meta = FORMAT_META[story.format] ?? FORMAT_META.write;
                const Icon = meta.icon;
                const isPending = story.status === "pending";
                return (
                  <div key={story.id} className={`border-2 p-5 relative ${isPending ? "border-foreground" : "border-foreground/30 opacity-60"}`}>
                    <div className="flex items-start gap-3 flex-wrap mb-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1 font-display uppercase tracking-widest text-xs border border-current ${meta.color}`}>
                        <Icon size={12} /> {meta.label}
                      </span>
                      <span className={`px-3 py-1 font-display uppercase tracking-widest text-xs border ${story.status === "pending" ? "border-foreground bg-background" : story.status === "approved" ? "border-secondary bg-secondary/20" : "border-primary/50 bg-primary/10"}`}>
                        {story.status}
                      </span>
                    </div>
                    <p className="font-display text-lg uppercase leading-tight">{story.title}</p>
                    <p className="text-xs font-bold text-muted-foreground mt-0.5 mb-3">
                      {story.name}{story.age ? `, ${story.age}` : ""} · {dateStr(story.submittedAt)}
                    </p>
                    {story.storyText && (
                      <p className="text-sm font-medium text-foreground/70 leading-relaxed line-clamp-3 mb-3">{story.storyText}</p>
                    )}
                    {isPending && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleApprove(story.id)}
                          disabled={approving}
                          className="flex items-center gap-1.5 px-4 py-2 bg-secondary border-2 border-foreground font-display text-xs uppercase tracking-widest hover:bg-secondary/80 transition-colors disabled:opacity-50"
                        >
                          <Check size={13} /> Approve & Publish
                        </button>
                        <button
                          onClick={() => handleReject(story.id)}
                          disabled={rejecting}
                          className="flex items-center gap-1.5 px-4 py-2 border-2 border-foreground font-display text-xs uppercase tracking-widest hover:bg-muted/30 transition-colors disabled:opacity-50"
                        >
                          <X size={13} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <button onClick={() => void refetchSubs()} className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">↻ Refresh</button>
        </div>
      )}

      {/* Published stories list */}
      {view === "published" && (
        <div>
          {loadingPub ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : published.length === 0 ? (
            <div className="border-2 border-dashed border-foreground p-12 text-center">
              <Eye size={36} className="mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="font-display text-2xl uppercase text-muted-foreground">No published stories</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Approve a submission or add a story manually.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {published.map((story) => {
                const meta = FORMAT_META[story.format] ?? FORMAT_META.write;
                const Icon = meta.icon;
                return (
                  <div key={story.id} className="border-2 border-foreground p-5 relative group">
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="absolute top-3 right-3 p-1.5 border border-foreground opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white transition-all"
                      aria-label="Delete story"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center gap-2 mb-2 pr-10">
                      <span className={`flex items-center gap-1 px-2 py-0.5 font-display uppercase tracking-widest text-xs ${meta.color}`}>
                        <Icon size={11} /> {meta.label}
                      </span>
                    </div>
                    <p className="font-display text-lg uppercase leading-tight">{story.title}</p>
                    <p className="text-xs font-bold text-muted-foreground mt-0.5">{story.name}{story.age ? `, ${story.age}` : ""} · Published {dateStr(story.publishedAt)}</p>
                    {story.excerpt && <p className="text-sm font-medium text-foreground/70 leading-relaxed line-clamp-2 mt-2">{story.excerpt}</p>}
                  </div>
                );
              })}
            </div>
          )}
          <button onClick={() => void refetchPub()} className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">↻ Refresh</button>
        </div>
      )}

      {/* Add story form */}
      {view === "add" && (
        <div className="space-y-5 max-w-xl">
          <p className="text-sm font-medium text-muted-foreground">Add a story directly to the public Stories section without needing a submission.</p>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">Author Name *</label>
            <Input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" className="border-2 border-foreground h-11 rounded-none focus-visible:ring-0 focus-visible:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">Age (optional)</label>
            <Input value={addForm.age} onChange={e => setAddForm(f => ({ ...f, age: e.target.value }))} placeholder="e.g. 17" className="border-2 border-foreground h-11 rounded-none focus-visible:ring-0 focus-visible:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">Story Title *</label>
            <Input value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} placeholder="Story headline" className="border-2 border-foreground h-11 rounded-none focus-visible:ring-0 focus-visible:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">Format</label>
            <select
              value={addForm.format}
              onChange={e => setAddForm(f => ({ ...f, format: e.target.value as "speak"|"show"|"write" }))}
              className="w-full h-11 border-2 border-foreground bg-background font-medium px-3 focus:outline-none focus:border-primary"
            >
              <option value="write">Write It</option>
              <option value="speak">Speak It</option>
              <option value="show">Show It</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">Story Text</label>
            <Textarea value={addForm.storyText} onChange={e => setAddForm(f => ({ ...f, storyText: e.target.value }))} placeholder="The story content (shown on site)…" className="resize-none border-2 border-foreground min-h-[160px] rounded-none focus-visible:ring-0 focus-visible:border-primary" />
          </div>
          <Button
            onClick={handleAdd}
            disabled={creating}
            className="font-display text-sm uppercase tracking-widest border-2 border-foreground rounded-none px-8 h-12 disabled:opacity-60"
          >
            {creating ? "Publishing…" : "Publish Story"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

type Tab = "events" | "sponsors" | "stories";

const TABS: { id: Tab; label: string; icon: typeof Calendar }[] = [
  { id: "events",   label: "Events",   icon: Calendar },
  { id: "sponsors", label: "Sponsors", icon: Tag },
  { id: "stories",  label: "Stories",  icon: BookOpen },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("events");
  const { data: submissions = [] } = useAdminStorySubmissions();
  const pendingCount = submissions.filter(s => s.status === "pending").length;

  if (!isAdminLoggedIn()) {
    setLocation("/admin");
    return null;
  }

  const logout = () => {
    adminLogout();
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-foreground text-background border-b-4 border-foreground flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <img
            src={logoImg}
            alt="The Big Impact Organization"
            className="h-9 brightness-0 invert"
          />
          <span className="font-display text-base uppercase tracking-widest text-background/60">
            / Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="font-bold uppercase tracking-widest text-xs text-background/60 hover:text-background transition-colors"
          >
            ← View Site
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-background/60 hover:text-primary transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="pt-20 min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r-2 border-foreground p-6 hidden md:block">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 font-display uppercase tracking-widest text-base text-left transition-colors border-2 ${
                  tab === id
                    ? "bg-foreground text-background border-foreground"
                    : "border-transparent hover:border-foreground hover:bg-muted/30"
                }`}
              >
                <Icon size={18} />
                {label}
                {id === "stories" && pendingCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 min-w-[22px] text-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t-2 border-foreground flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 font-display uppercase tracking-widest text-xs transition-colors relative ${
                tab === id ? "bg-foreground text-background" : "hover:bg-muted/30"
              }`}
            >
              <Icon size={20} />
              {label}
              {id === "stories" && pendingCount > 0 && (
                <span className="absolute top-1.5 right-1/4 bg-primary text-white text-[9px] font-bold px-1 min-w-[16px] text-center leading-4">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 max-w-3xl">
          {tab === "events"   && <EventsEditor />}
          {tab === "sponsors" && <SponsorsEditor />}
          {tab === "stories"  && <StoriesViewer />}
        </main>
      </div>
    </div>
  );
}
