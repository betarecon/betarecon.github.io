import { useCallback, useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

type Particle = { id: number; dx: number; dy: number; size: number; dur: number; hue: string };
type Ring = { id: number; x: number; y: number };

interface Props {
  onActivate: (origin: { x: number; y: number }) => void;
  label?: string;
  size?: "sm" | "lg";
}

const PARTICLE_COLORS = ["#a855f7", "#6366f1", "#fcd34d", "#ffffff"];

/**
 * The primary call to action.
 *
 * It is built to be hard to leave alone:
 *   - it leans toward the cursor, a few pixels, which reads as "alive"
 *   - a soft gradient glow breathes behind it even at rest
 *   - a band of light sweeps across it on a loop
 *   - the glow follows the pointer once you are over it
 *   - clicking fires an expanding ring and a burst of particles from the
 *     exact point you pressed
 *
 * All of it is decoration. The real work is `onActivate`.
 */
export default function DownloadButton({ onActivate, label, size = "lg" }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [rings, setRings] = useState<Ring[]>([]);
  const [glowAt, setGlowAt] = useState<{ x: number; y: number } | null>(null);
  const [pressed, setPressed] = useState(false);
  const timers = useRef<number[]>([]);

  // clear any pending cleanup if the component goes away mid-burst
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const handleMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const relX = e.clientX - r.left;
    const relY = e.clientY - r.top;

    // lean toward the cursor, capped so it never looks broken
    const nx = (relX - r.width / 2) / (r.width / 2);
    const ny = (relY - r.height / 2) / (r.height / 2);
    el.style.transform = `translate3d(${nx * 7}px, ${ny * 5}px, 0) scale(1.035)`;

    setGlowAt({ x: relX, y: relY });
  }, []);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    setGlowAt(null);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const ringId = Date.now();
      setRings((prev) => [...prev, { id: ringId, x, y }]);

      const burst: Particle[] = Array.from({ length: 26 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 26 + Math.random() * 0.35;
        const distance = 46 + Math.random() * 62;
        return {
          id: ringId + i + 1,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          size: 3 + Math.random() * 5,
          dur: 700 + Math.random() * 500,
          hue: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        };
      });
      setParticles((prev) => [...prev, ...burst]);

      timers.current.push(
        window.setTimeout(() => {
          setRings((prev) => prev.filter((r2) => r2.id !== ringId));
          setParticles((prev) => prev.filter((p) => p.id <= ringId || p.id > ringId + 26));
        }, 1300)
      );

      onActivate({ x: e.clientX, y: e.clientY });
    },
    [onActivate]
  );

  const pad = size === "lg" ? "px-[29px] py-[24px] text-base" : "px-5 py-2.5 text-sm";

  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={handleClick}
      style={{ transition: "transform 220ms cubic-bezier(0.22,1,0.36,1)" }}
      className={`group relative isolate rounded-full font-semibold text-black
                  bg-white ${pad}
                  shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_10px_40px_-8px_rgba(168,85,247,0.55)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                  ${pressed ? "scale-[0.97]" : ""}`}
    >
      {/* breathing gradient glow behind the button */}
      <span
        aria-hidden
        className="cta-breathe pointer-events-none absolute -inset-[3px] -z-10 rounded-full blur-lg
                   bg-[linear-gradient(90deg,#6366f1,#a855f7,#fcd34d)]"
      />

      {/* glow that follows the pointer */}
      {glowAt && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-70 blur-xl
                     bg-[radial-gradient(circle_at_var(--gx)_var(--gy),#a855f7,transparent_60%)]"
          style={{ ["--gx" as string]: `${glowAt.x}px`, ["--gy" as string]: `${glowAt.y}px` }}
        />
      )}

      {/* looping sheen band */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span className="cta-sheen absolute inset-y-0 -left-1/3 w-1/3 bg-white/45 blur-md" />
      </span>

      {/* click feedback */}
      {rings.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="cta-ring pointer-events-none absolute h-16 w-16 rounded-full border-2 border-white/70"
          style={{ left: r.x, top: r.y, translate: "-50% -50%" }}
        />
      ))}
      {particles.map((p) => (
        <span
          key={p.id}
          aria-hidden
          className="cta-particle pointer-events-none absolute rounded-full"
          style={
            {
              left: "50%",
              top: "50%",
              width: p.size,
              height: p.size,
              background: p.hue,
              ["--dx" as string]: `${p.dx}px`,
              ["--dy" as string]: `${p.dy}px`,
              ["--dur" as string]: `${p.dur}ms`,
            } as React.CSSProperties
          }
        />
      ))}

      <span className="relative z-10 inline-flex items-center gap-2">
        <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
        {label ?? "Download for Windows"}
      </span>
    </button>
  );
}
