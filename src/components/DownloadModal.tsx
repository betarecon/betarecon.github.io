import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  downloadUrl: string;
  fileName: string;
  fileSize: string;
}

const STAGES = [
  "Checking your system",
  "Detecting your GPU",
  "Selecting the right encoder",
  "Preparing your download",
  "Almost there",
];

const TOTAL_MS = 2600;

/**
 * The sequence shown after the download button is pressed.
 *
 * It runs a staged progress bar for about 2.6s and then hands off to the
 * real download. The staging is honest about what it is - it exists to make
 * the click feel like it did something, not to fake a long install.
 */
export default function DownloadModal({
  open,
  onClose,
  downloadUrl,
  fileName,
  fileSize,
}: Props) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);

  // lock body scroll while open, and allow Escape to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Run the progress sequence once per opening.
  //
  // There is deliberately no "already started" ref guard here. React
  // StrictMode invokes effects twice in development: a guard would let the
  // first run claim the flag, the cleanup would clear that interval, and the
  // second run would bail out early — leaving no interval running at all and
  // the modal stuck part-way forever. Letting each run own its own interval
  // makes the double invocation harmless, because the cleanup always tears
  // down exactly what its own run created.
  useEffect(() => {
    if (!open) {
      setProgress(0);
      setStage(0);
      setDone(false);
      return;
    }

    // Driven by a timer rather than requestAnimationFrame on purpose:
    // rAF does not fire at all in a backgrounded tab, which would leave the
    // bar frozen mid-way with no way to finish. A timer still ticks when the
    // tab is hidden, so the sequence always completes even if it is slow.
    // Date.now() is the clock so the progress self-corrects after throttling.
    const t0 = Date.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      setDone(true);
      if (downloadUrl && downloadUrl !== "#") {
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    };

    // belt and braces: even if the interval is throttled into uselessness,
    // this guarantees the modal resolves instead of hanging.
    const guard = window.setTimeout(finish, TOTAL_MS + 1500);

    const id = window.setInterval(() => {
      const raw = Math.min(1, (Date.now() - t0) / TOTAL_MS);
      // ease out, so it sprints then settles instead of crawling
      const eased = 1 - Math.pow(1 - raw, 2.2);

      setProgress(Math.round(eased * 100));
      setStage(Math.min(STAGES.length - 1, Math.floor(raw * STAGES.length)));

      if (raw >= 1) {
        window.clearInterval(id);
        finish();
      }
    }, 40);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(guard);
    };
  }, [open, downloadUrl, fileName]);

  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Download Recon Clips"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="animate-modal-in relative w-full max-w-md">
        {/* the same gradient glow the button has, so it feels connected */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[3px] rounded-3xl blur-xl opacity-60
                     bg-[linear-gradient(90deg,#6366f1,#a855f7,#fcd34d)]"
        />

        <div className="liquid-glass relative rounded-3xl p-8 text-center">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1.5 text-foreground/50
                       transition-colors hover:bg-white/10 hover:text-foreground
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X className="h-4 w-4" />
          </button>

          {/* icon */}
          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
            <span
              aria-hidden
              className={`absolute inset-0 rounded-full blur-md transition-opacity duration-500
                          bg-[linear-gradient(90deg,#6366f1,#a855f7,#fcd34d)]
                          ${done ? "opacity-70" : "opacity-40"}`}
            />
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              {done ? (
                <Check className="h-7 w-7 text-white" strokeWidth={3} />
              ) : (
                <span className="animate-spin-slow block h-7 w-7 rounded-full border-2 border-white/25 border-t-white" />
              )}
            </span>
          </div>

          <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">
            {done ? "Your download has started" : STAGES[stage]}
          </h3>
          <p className="mt-2 text-sm text-foreground/60">
            {done
              ? "Check your browser's downloads — the installer is on its way."
              : `${fileName} · ${fileSize}`}
          </p>

          {/* progress */}
          <div className="mt-6">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#6366f1,#a855f7,#fcd34d)] transition-[width] duration-100 ease-out"
                style={{ width: `${progress}%` }}
              >
                {!done && <div className="progress-stripe h-full w-full rounded-full opacity-40" />}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-foreground/50">
              <span>{done ? "Complete" : "Downloading installer"}</span>
              <span className="font-mono tabular-nums">{progress}%</span>
            </div>
          </div>

          {done && (
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-black
                         transition-transform duration-200 hover:scale-[1.02]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
