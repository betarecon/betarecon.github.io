import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import logo from "@/assets/logo.svg";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; hint?: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Features",
    children: [
      { label: "Auto-capture", href: "#features", hint: "Highlights saved for you" },
      { label: "4K Recording", href: "#features", hint: "Crisp, 60fps output" },
      { label: "Instant Replay", href: "#features", hint: "Never miss a play" },
      { label: "Performance", href: "#features", hint: "Built to stay out of the way" },
    ],
  },
  { label: "Clips", href: "#clips" },
  { label: "Pricing", href: "#pricing" },
  {
    label: "Support",
    children: [
      { label: "FAQ", href: "#faq", hint: "Common questions" },
      { label: "System requirements", href: "#faq", hint: "Windows 10 and 11" },
      { label: "Contact", href: "#footer", hint: "Talk to a human" },
    ],
  },
];

interface Props {
  onDownload: () => void;
}

export default function Navbar({ onDownload }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // solid-ish bar once you leave the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close an open dropdown on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(null);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={navRef}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-xl" : ""
      }`}
    >
      <nav className="w-full py-5 px-8 flex flex-row items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <img src={logo} alt="" className="h-8 w-8" />
          <span className="font-display text-[17px] font-semibold tracking-[-0.01em]">
            RECON
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setOpen(open === item.label ? null : item.label)}
                  aria-expanded={open === item.label}
                  className="flex items-center gap-1 rounded text-sm font-medium text-foreground/90
                             transition-colors duration-200 hover:text-foreground
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 opacity-70 transition-transform duration-200 ${
                      open === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open === item.label && (
                  <div className="animate-modal-in absolute left-1/2 top-[calc(100%+14px)] w-64 -translate-x-1/2">
                    <div className="liquid-glass rounded-2xl p-2">
                      {item.children.map((child) => (
                        <button
                          key={child.label}
                          onClick={() => go(child.href)}
                          className="relative z-10 flex w-full flex-col items-start rounded-xl px-3 py-2.5 text-left
                                     transition-colors hover:bg-white/[0.07]
                                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                          <span className="text-sm font-medium">{child.label}</span>
                          {child.hint && (
                            <span className="text-xs text-foreground/50">{child.hint}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.label}
                onClick={() => go(item.href!)}
                className="rounded text-sm font-medium text-foreground/90 transition-colors duration-200
                           hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {item.label}
              </button>
            )
          )}
        </div>

        <button
          onClick={onDownload}
          className="liquid-glass shrink-0 rounded-full px-4 py-2 text-sm font-medium text-foreground
                     transition-all duration-200 hover:bg-white/[0.08] hover:scale-[1.03]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <span className="relative z-10">Download</span>
        </button>
      </nav>

      {/* 1px divider under the navbar */}
      <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </div>
  );
}
