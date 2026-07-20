import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zodResolver";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Mic,
  Camera,
  BookOpen,
  Play,
  Upload,
  X,
  StopCircle,
  Info,
} from "lucide-react";
import { ArrowButton } from "@/components/ui/arrow-button";
import { useSubmitStoryApi } from "@/lib/useStories";

// ── Limits ────────────────────────────────────────────────────────────────────
const MAX_RECORDING_SECONDS = 180; // 3 min
const MAX_AUDIO_MB = 25;
const MAX_IMAGE_MB = 25;
const MAX_IMAGES = 3;
const MAX_STORY_CHARS = 2500;
const MIN_STORY_CHARS = 30;

const baseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.string().optional(),
  storyTitle: z.string().min(2, "Story title is required"),
  format: z.enum(["speak", "show", "write"] as const, {
    message: "Choose a format",
  }),
  story: z.string().optional(),
});

type FormValues = z.infer<typeof baseSchema>;

const FORMAT_OPTIONS = [
  {
    value: "speak" as const,
    icon: Mic,
    label: "SPEAK IT",
    desc: "Record or upload audio",
    accent: "bg-primary text-primary-foreground",
    accentHex: "hsl(355 78% 56%)",
    limit: `Max ${MAX_RECORDING_SECONDS / 60} min recording · ${MAX_AUDIO_MB} MB upload`,
  },
  {
    value: "show" as const,
    icon: Camera,
    label: "SHOW IT",
    desc: "Images + caption",
    accent: "bg-secondary text-secondary-foreground",
    accentHex: "var(--color-secondary)",
    limit: `Up to ${MAX_IMAGES} images · ${MAX_IMAGE_MB} MB each`,
  },
  {
    value: "write" as const,
    icon: BookOpen,
    label: "WRITE IT",
    desc: "Tell it in your own words",
    accent: "bg-accent text-primary-foreground",
    accentHex: "hsl(20 95% 64%)",
    limit: `${MIN_STORY_CHARS}–${MAX_STORY_CHARS.toLocaleString()} characters`,
  },
];

function RulesBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <Info size={13} className="shrink-0 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">{text}</span>
    </div>
  );
}

function formatTimer(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function ShareStory() {
  const [, setLocation] = useLocation();
  const { mutateAsync: submitStory, isPending: isSubmitting } = useSubmitStoryApi();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: { name: "", age: "", storyTitle: "", story: "" },
  });

  const selectedFormat = form.watch("format");
  const storyText = form.watch("story") ?? "";

  // ── Audio state ─────────────────────────────────────────────
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [recSeconds, setRecSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      setRecSeconds(0);
      timerRef.current = setInterval(() => {
        setRecSeconds((s) => {
          if (s + 1 >= MAX_RECORDING_SECONDS) {
            mr.stop();
            return s + 1;
          }
          return s + 1;
        });
      }, 1000);
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        clearInterval(timerRef.current!);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        setAudioFileName("recorded-message.webm");
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
      };
      mr.start();
      setRecording(true);
    } catch {
      toast.error("Microphone access denied", {
        description: "Please allow microphone access in your browser.",
      });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AUDIO_MB * 1024 * 1024) {
      toast.error(`Audio file too large`, {
        description: `Maximum size is ${MAX_AUDIO_MB} MB. Please compress or trim your file.`,
      });
      e.target.value = "";
      return;
    }
    setAudioUrl(URL.createObjectURL(file));
    setAudioFileName(file.name);
  };

  const clearAudio = () => {
    setAudioUrl(null);
    setAudioFileName(null);
    setRecSeconds(0);
  };

  // ── Image state ─────────────────────────────────────────────
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const oversized = files.filter((f) => f.size > MAX_IMAGE_MB * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`Image too large`, {
        description: `Each image must be under ${MAX_IMAGE_MB} MB. ${oversized.map((f) => f.name).join(", ")} ${oversized.length === 1 ? "exceeds" : "exceed"} the limit.`,
      });
    }
    const valid = files.filter((f) => f.size <= MAX_IMAGE_MB * 1024 * 1024);
    const remaining = MAX_IMAGES - images.length;
    const toAdd = valid.slice(0, remaining).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ── Submit ──────────────────────────────────────────────────
  async function onSubmit(values: FormValues) {
    if (values.format === "speak" && !audioUrl) {
      toast.error("No audio", {
        description: "Please record or upload an audio message.",
      });
      return;
    }
    if (values.format === "show" && images.length === 0) {
      toast.error("No images", {
        description: "Please upload at least one image.",
      });
      return;
    }
    if (
      values.format === "write" &&
      (!values.story || values.story.length < MIN_STORY_CHARS)
    ) {
      form.setError("story", {
        message: `Tell us more — at least ${MIN_STORY_CHARS} characters`,
      });
      return;
    }

    try {
      await submitStory({
        data: {
          name: values.name,
          age: values.age || undefined,
          title: values.storyTitle,
          format: values.format,
          storyText:
            values.format === "write" || values.format === "show"
              ? values.story || undefined
              : undefined,
          audioFileName:
            values.format === "speak" ? (audioFileName ?? undefined) : undefined,
          imageCount: values.format === "show" ? images.length : undefined,
        },
      });

      toast.success("STORY RECEIVED", {
        description: "We'll be in touch soon. Your voice matters.",
        style: {
          borderRadius: "0px",
          border: "4px solid hsl(var(--secondary))",
          background: "hsl(var(--foreground))",
          color: "hsl(var(--background))",
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: "bold",
        },
        classNames: { description: "!text-background/80 !font-medium" },
      });
      form.reset();
      setAudioUrl(null);
      setAudioFileName(null);
      setRecSeconds(0);
      setImages([]);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main className="pt-36 pb-20 lg:pt-44 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 font-display uppercase tracking-widest text-sm mb-10 hover:text-primary transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to home
          </button>

          <div className="inline-block bg-foreground text-background font-display uppercase tracking-widest text-sm px-3 py-1 mb-6 border-2 border-foreground">
            FIRST CHAPTER
          </div>
          <h1 className="font-display text-5xl md:text-7xl uppercase mb-4 leading-[1.05] border-b-4 border-foreground pb-4">
            YOUR <span className="text-primary">STORY</span> GOES HERE.
          </h1>
          <p className="text-lg font-medium leading-relaxed mb-12">
            We haven't published our first story yet — because you haven't told
            it to us. Pick how you want to share it.
          </p>

          <div className="bg-background border-4 border-foreground p-6 md:p-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Name + Age */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold uppercase tracking-widest text-sm">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            className="border-2 border-foreground h-14 font-medium rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold uppercase tracking-widest text-sm">
                          Age (optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your age"
                            {...field}
                            className="border-2 border-foreground h-14 font-medium rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Story title */}
                <FormField
                  control={form.control}
                  name="storyTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase tracking-widest text-sm">
                        Story Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Give your story a title"
                          {...field}
                          className="border-2 border-foreground h-14 font-medium rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Format selector */}
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase tracking-widest text-sm">
                        How do you want to share it?
                      </FormLabel>
                      <div
                        role="radiogroup"
                        className="grid sm:grid-cols-3 gap-4 mt-3"
                      >
                        {FORMAT_OPTIONS.map(
                          (
                            { value, icon: Icon, label, desc, accent, accentHex, limit },
                            idx
                          ) => {
                            const selected = field.value === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => {
                                  field.onChange(value);
                                  clearAudio();
                                  setImages([]);
                                }}
                                className={`group relative flex flex-col items-start gap-3 border-2 border-foreground bg-background p-5 text-left transition-all focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${
                                  selected ? "!border-primary" : "hover:bg-muted/20"
                                }`}
                                style={
                                  selected
                                    ? { boxShadow: `inset 0 0 0 4px var(--primary)` }
                                    : undefined
                                }
                              >
                                <span className="absolute -top-3 -left-3 bg-foreground text-background w-8 h-8 flex items-center justify-center font-display text-base border-2 border-foreground">
                                  0{idx + 1}
                                </span>
                                <span
                                  className={`flex items-center justify-center w-14 h-14 border-2 border-foreground ${accent}`}
                                >
                                  <Icon size={26} strokeWidth={2.5} />
                                </span>
                                <span className="font-display text-2xl uppercase tracking-wide leading-none">
                                  {label}
                                </span>
                                <span className="text-sm font-medium text-muted-foreground leading-snug">
                                  {desc}
                                </span>
                                <RulesBadge text={limit} />
                                {selected && (
                                  <span
                                    className="absolute top-3 right-3 font-display text-xs uppercase tracking-widest px-2 py-0.5 border-2 border-foreground bg-primary text-white"
                                  >
                                    Picked
                                  </span>
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ── Speak section ── */}
                {selectedFormat === "speak" && (
                  <div className="border-2 border-foreground p-6 space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
                      <p className="font-bold text-sm uppercase tracking-widest">
                        Record a message
                      </p>
                      <span className="text-xs font-medium text-muted-foreground">
                        Max {MAX_RECORDING_SECONDS / 60} min · {MAX_AUDIO_MB} MB upload
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {!recording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          disabled={!!audioUrl}
                          className="flex items-center gap-2 font-display uppercase tracking-widest text-sm px-5 py-3 bg-foreground text-background border-2 border-foreground hover:bg-primary disabled:opacity-40 transition-colors"
                        >
                          <Mic size={16} /> Start Recording
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="flex items-center gap-2 font-display uppercase tracking-widest text-sm px-5 py-3 bg-primary text-white border-2 border-foreground animate-pulse transition-colors"
                        >
                          <StopCircle size={16} /> Stop
                          <span className="ml-2 tabular-nums font-mono text-base">
                            {formatTimer(recSeconds)}
                          </span>
                          {recSeconds >= MAX_RECORDING_SECONDS - 10 && (
                            <span className="text-secondary text-xs ml-1">
                              (limit soon)
                            </span>
                          )}
                        </button>
                      )}
                    </div>

                    {audioUrl && (
                      <div className="flex items-center gap-4 border-2 border-foreground p-4 bg-secondary/10">
                        <Play size={20} className="shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">
                            {audioFileName}
                          </p>
                          <audio
                            controls
                            src={audioUrl}
                            className="mt-2 w-full h-8"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={clearAudio}
                          aria-label="Remove audio"
                          className="shrink-0 hover:text-primary transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}

                    <div className="border-t-2 border-foreground pt-5">
                      <p className="font-bold text-sm uppercase tracking-widest mb-1">
                        Or upload an audio file
                      </p>
                      <p className="text-xs text-muted-foreground font-medium mb-3">
                        Accepted: MP3, M4A, WAV, WEBM · Max {MAX_AUDIO_MB} MB
                      </p>
                      <label className="flex items-center gap-3 border-2 border-dashed border-foreground p-4 cursor-pointer hover:bg-muted/20 transition-colors">
                        <Upload size={20} className="shrink-0" />
                        <span className="text-base font-medium">
                          Choose audio file
                        </span>
                        <input
                          type="file"
                          accept="audio/mp3,audio/mpeg,audio/mp4,audio/m4a,audio/wav,audio/webm,audio/*"
                          className="hidden"
                          onChange={handleAudioUpload}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Show section ── */}
                {selectedFormat === "show" && (
                  <div className="border-2 border-foreground p-6 space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
                      <p className="font-bold text-sm uppercase tracking-widest">
                        Upload images
                      </p>
                      <span className="text-xs font-medium text-muted-foreground">
                        Up to {MAX_IMAGES} · Max {MAX_IMAGE_MB} MB each
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className="relative border-2 border-foreground aspect-square overflow-hidden group"
                        >
                          <img
                            src={img.preview}
                            alt={`Uploaded image ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            aria-label={`Remove image ${i + 1}`}
                            className="absolute top-2 right-2 bg-foreground text-background p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {images.length < MAX_IMAGES && (
                        <label className="border-2 border-dashed border-foreground aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/20 transition-colors">
                          <Upload size={24} />
                          <span className="text-xs font-bold uppercase tracking-widest text-center">
                            Add image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {images.length} / {MAX_IMAGES} images added
                    </p>

                    <div className="border-t-2 border-foreground pt-5 space-y-2">
                      <p className="font-bold text-sm uppercase tracking-widest">
                        Caption or context (optional)
                      </p>
                      <Textarea
                        placeholder="Describe what's in the photos, or what they mean to you…"
                        className="resize-none border-2 border-foreground min-h-[100px] font-medium rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all text-base"
                        {...form.register("story")}
                        maxLength={MAX_STORY_CHARS}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {storyText.length} / {MAX_STORY_CHARS.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Write section ── */}
                {selectedFormat === "write" && (
                  <FormField
                    control={form.control}
                    name="story"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-1">
                          <FormLabel className="font-bold uppercase tracking-widest text-sm">
                            Your Story
                          </FormLabel>
                          <span
                            className={`text-xs font-medium tabular-nums ${
                              storyText.length > MAX_STORY_CHARS * 0.9
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {storyText.length} / {MAX_STORY_CHARS.toLocaleString()}
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Start here. No rules, no judgment. Tell us what happened, what you felt, what changed."
                            className="resize-none border-2 border-foreground min-h-[220px] font-medium rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all text-base"
                            maxLength={MAX_STORY_CHARS}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-1">
                          Minimum {MIN_STORY_CHARS} characters
                        </p>
                      </FormItem>
                    )}
                  />
                )}

                {/* Submit */}
                <ArrowButton
                  type="submit"
                  size="lg"
                  disabled={!selectedFormat || isSubmitting}
                  className="font-display text-lg md:text-xl py-6 uppercase tracking-widest border-2 border-foreground transition-all disabled:opacity-40"
                >
                  {isSubmitting ? "Submitting…" : "Submit Your Story"}
                </ArrowButton>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
