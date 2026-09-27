import { useState } from "react";
import {
  Zap,
  Monitor,
  Gauge,
  Play,
  Share2,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import Reveal from "./Reveal";
import DownloadButton from "./DownloadButton";
import logo from "@/assets/logo.svg";

/* ── shared bits ───────────────────────────────────────────────── */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-foreground/60">
        <Sparkles className="h-3 w-3" />
        {eyebrow}
      </span>
      <h2 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-7 text-hero-sub/70">{subtitle}</p>
      )}
    </div>
  );
}

/* ── features ──────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Zap,
    title: "Auto-capture",
    body: "Recon watches your matches and saves the moments worth keeping. No hotkey, no thinking about it.",
  },
  {
    icon: Monitor,
    title: "4K at 60fps",
    body: "Crisp footage that still looks good after it has been through a compressor. Your clips, not mush.",
  },
  {
    icon: Gauge,
    title: "Hardware accelerated",
    body: "Encoding runs on your GPU through NVENC, AMF or QuickSync. We detect the right one for you.",
  },
  {
    icon: Play,
    title: "Instant replay",
    body: "Something happened thirty seconds ago? It is already on disk. Pull it up and trim it.",
  },
  {
    icon: Share2,
    title: "One-click share",
    body: "Trim, then send straight to Discord, YouTube or wherever your friends actually are.",
  },
  {
    icon: ShieldCheck,
    title: "Stays out of the way",
    body: "A few frames of overhead in the background. It should never be the reason you lost a fight.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 px-8 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title={
              <>
                Everything you need,
                <br />
                nothing you have to think about
              </>
            }
            subtitle="Recon sits in the background and captures the good parts. You just play."
          />
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 70}>
              <div
                className="liquid-glass group h-full rounded-2xl p-6 transition-all duration-300
                           hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <div className="relative z-10">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover:bg-white/[0.1]">
                    <f.icon className="h-5 w-5 text-foreground/90" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/60">{f.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── clips showcase ────────────────────────────────────────────── */

const STATS = [
  { value: "4K", label: "Max resolution" },
  { value: "60", label: "Frames per second" },
  { value: "<1%", label: "Typical CPU cost" },
  { value: "∞", label: "Clips stored" },
];

const MOCK_CLIPS = [
  { name: "Ranked — 1v3 clutch", len: "0:24", tag: "Victory Royale" },
  { name: "Sniper — 214m", len: "0:11", tag: "Highlight" },
  { name: "Build fight", len: "0:38", tag: "Clip" },
];

export function Clips() {
  return (
    <section id="clips" className="scroll-mt-24 px-8 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-foreground/60">
                <Play className="h-3 w-3" />
                Your library
              </span>
              <h2 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
                Every good moment,
                <br />
                already saved
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-hero-sub/70">
                Clips land in a tidy library the moment they happen — named,
                trimmed to the interesting part, and ready to send. No scrubbing
                through an hour of raw footage to find the one fight you cared
                about.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-3xl font-semibold tracking-[-0.02em]">
                      {s.value}
                    </div>
                    <div className="mt-1 text-xs text-foreground/50">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* mock app window */}
          <Reveal delay={120}>
            <div className="relative">
              <div
                aria-hidden
                className="animate-float-slow pointer-events-none absolute -inset-6 rounded-[32px] opacity-40 blur-2xl
                           bg-[linear-gradient(120deg,#6366f1,#a855f7,#fcd34d)]"
              />
              <div className="liquid-glass relative rounded-2xl p-3">
                <div className="relative z-10 rounded-xl bg-[hsl(260_87%_4%)]/80 p-4 backdrop-blur">
                  {/* title bar */}
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="ml-3 text-xs text-foreground/40">
                      Recon — Library
                    </span>
                  </div>

                  {/* rows */}
                  <div className="space-y-2.5">
                    {MOCK_CLIPS.map((c) => (
                      <div
                        key={c.name}
                        className="group flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.05]"
                      >
                        <div className="relative flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-amber-400/20">
                          <Play className="h-3.5 w-3.5 fill-white/80 text-white/80 transition-transform duration-300 group-hover:scale-125" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-foreground/90">
                            {c.name}
                          </div>
                          <div className="mt-0.5 text-[10px] text-foreground/40">
                            {c.tag}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-foreground/40">
                          {c.len}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                    <span className="text-[10px] text-foreground/40">
                      3 clips · 42 MB
                    </span>
                    <span className="text-[10px] font-medium text-emerald-400/80">
                      Capturing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── pricing ───────────────────────────────────────────────────── */

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "For getting started and seeing if it fits how you play.",
    features: ["1080p at 60fps", "30 clips stored", "Auto-capture", "Basic trimming"],
    cta: "Download free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    blurb: "For people who actually post. Everything unlocked, no ceiling.",
    features: [
      "4K at 60fps",
      "Unlimited clips",
      "Instant replay buffer",
      "One-click sharing",
      "Priority support",
    ],
    cta: "Get Pro",
    featured: true,
  },
  {
    name: "Squad",
    price: "$29",
    period: "per month",
    blurb: "For teams, orgs and anyone sharing a library across machines.",
    features: [
      "Everything in Pro",
      "Up to 10 seats",
      "Shared clip library",
      "Team analytics",
      "Dedicated support",
    ],
    cta: "Get Squad",
    featured: false,
  },
];

export function Pricing({ onDownload }: { onDownload: () => void }) {
  return (
    <section id="pricing" className="scroll-mt-24 px-8 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Start free. Upgrade when you outgrow it."
            subtitle="No credit card to try it. Cancel whenever — nothing is locked behind a call."
          />
        </Reveal>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div
                className={`relative h-full rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                  p.featured
                    ? "bg-white/[0.05] ring-1 ring-inset ring-white/20"
                    : "liquid-glass"
                }`}
              >
                {p.featured && (
                  <>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -inset-[2px] -z-10 rounded-2xl opacity-50 blur-lg
                                 bg-[linear-gradient(120deg,#6366f1,#a855f7,#fcd34d)]"
                    />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black">
                      Most popular
                    </span>
                  </>
                )}

                <div className="relative z-10">
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-semibold tracking-[-0.02em]">
                      {p.price}
                    </span>
                    <span className="text-xs text-foreground/50">{p.period}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-foreground/60">{p.blurb}</p>

                  <ul className="mt-6 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/80" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={onDownload}
                    className={`mt-7 w-full rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                                  p.featured
                                    ? "bg-white text-black"
                                    : "bg-white/[0.08] text-foreground hover:bg-white/[0.14]"
                                }`}
                  >
                    {p.cta}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── faq ───────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "What do I need to run it?",
    a: "Windows 10 or 11, a GPU from roughly the last six years, and about 400 MB of disk. Integrated graphics work — Recon will fall back to a software encoder if it has to, it just costs more CPU.",
  },
  {
    q: "Will it cost me frames?",
    a: "Hardware encoding runs on a dedicated part of the GPU, so the cost is usually under one percent. If Recon ever measures a real hit, it lowers the bitrate on its own rather than letting you drop frames.",
  },
  {
    q: "Which games does it work with?",
    a: "Anything that renders to a window, not just Fortnite. Auto-capture is tuned for Fortnite first because that is what most people use it for, but recording, replay and the library work everywhere.",
  },
  {
    q: "Where do my clips go?",
    a: "Onto your own disk, in a folder you choose. Nothing is uploaded unless you press share, and there is no account required for the free tier.",
  },
  {
    q: "Can I cancel?",
    a: "Any time, in one click, without talking to anyone. Your clips stay on your machine either way — cancelling never takes your footage.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 px-8 py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="Support"
            title="Questions people actually ask"
            subtitle="If yours is not here, the contact link at the bottom reaches a real person."
          />
        </Reveal>

        <div className="mt-14 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
                <div className="liquid-glass overflow-hidden rounded-2xl">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="relative z-10 flex w-full items-center justify-between gap-4 px-5 py-4 text-left
                               transition-colors hover:bg-white/[0.04]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <span className="font-display text-base font-medium">{f.q}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.07]">
                      {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  <div
                    className="relative z-10 grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-6 text-foreground/60">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── final CTA + footer ────────────────────────────────────────── */

export function FinalCta({ onDownload }: { onDownload: () => void }) {
  return (
    <section className="px-8 py-28">
      <Reveal>
        <div className="relative mx-auto max-w-4xl text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[90px]
                       bg-[linear-gradient(90deg,#6366f1,#a855f7,#fcd34d)]"
          />
          <div className="relative">
            <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-6xl">
              Stop losing your
              <br />
              best moments
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-hero-sub/70">
              Free to try, takes about a minute to set up, and it starts
              capturing the next match you play.
            </p>
            <div className="mt-9 flex justify-center">
              <DownloadButton onActivate={onDownload} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="footer" className="scroll-mt-24 border-t border-white/[0.07] px-8 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-7 w-7" />
          <span className="font-display text-sm font-semibold tracking-[-0.01em]">RECON</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-foreground/50">
          {[
            { label: "Features", href: "#features" },
            { label: "Clips", href: "#clips" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((l) => (
            <button
              key={l.label}
              onClick={() =>
                document
                  .querySelector(l.href)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <p className="text-xs text-foreground/35">
          © {new Date().getFullYear()} Recon Clips. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
