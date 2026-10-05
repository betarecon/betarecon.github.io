import { useEffect, useRef } from "react";
import DownloadButton from "./DownloadButton";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4";

/** Fade length at each end of the video, in ms. */
const FADE_MS = 500;

/** Gap between the fade-out finishing and the replay, in ms. */
const REPLAY_DELAY_MS = 100;

const BRANDS = ["Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn"];

export default function Hero({ onDownload }: { onDownload: (o: { x: number; y: number }) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── video fade loop ─────────────────────────────────────────────
     The element fades in over the first 500ms and out over the last
     500ms of every playthrough. Opacity is driven from currentTime on
     each frame rather than with CSS transitions, so seeking or a
     dropped frame can never leave it stuck mid-fade.

     `loop` is deliberately NOT set: the replay has to go through the
     `ended` handler, which resets opacity to 0, waits 100ms, seeks
     back to the start and plays again.                          */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frame = 0;

    const tick = () => {
      const duration = video.duration;

      if (Number.isFinite(duration) && duration > 0) {
        const elapsed = video.currentTime * 1000;
        const total = duration * 1000;
        const remaining = total - elapsed;

        let opacity = 1;
        if (elapsed < FADE_MS) opacity = elapsed / FADE_MS;
        else if (remaining < FADE_MS) opacity = Math.max(0, remaining / FADE_MS);

        video.style.opacity = String(opacity);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    // Autoplay can be refused before any interaction; retrying on the
    // first pointer or key event is enough to get it going.
    const kick = () => video.play().catch(() => {});
    kick();
    window.addEventListener("pointerdown", kick, { once: true });
    window.addEventListener("keydown", kick, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
  }, []);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = "0";

    window.setTimeout(() => {
      video.currentTime = 0;
      video.play().catch(() => {});
    }, REPLAY_DELAY_MS);
  };

  return (
    <section className="relative flex min-h-[calc(100svh-4.6rem)] flex-col overflow-visible">
      {/* ── background video ── */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        className="hero-video absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
      />

      {/* blurred shape, centered behind the content */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[527px] w-[984px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2
                   bg-gray-950 opacity-90 blur-[82px]"
      />

      {/* ── hero content ── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-8 py-10">
        <div className="flex flex-col items-center text-center">
          <h1
            className="font-display font-normal leading-[1.02] tracking-[-0.024em]
                       text-[72px] sm:text-[110px] lg:text-[150px] xl:text-[220px]"
          >
            <span className="text-foreground">Recon </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)",
              }}
            >
              Clips
            </span>
          </h1>

          <p className="mt-[9px] max-w-md text-lg leading-8 text-hero-sub opacity-80">
            The fastest way to capture and share
            <br />
            your best moments in almost any game
          </p>

          <div className="mt-[25px]">
            <DownloadButton onActivate={onDownload} />
          </div>

          <p className="mt-4 text-xs text-foreground/40">
            Free to try · Windows 10 &amp; 11 · No account needed
          </p>
        </div>
      </div>

      {/* ── logo marquee, pinned to the bottom of the hero ── */}
      <div className="relative z-10 pb-10">
        <div className="mx-auto flex max-w-5xl items-center gap-12 px-8">
          <p className="hidden shrink-0 text-sm leading-5 text-foreground/50 sm:block">
            Trusted by creators
            <br />
            across the globe
          </p>

          {/* Each item carries its own right padding instead of the track
              carrying a gap. With a uniform gap the track is not exactly
              twice one half, so translating -50% lands half a gap short and
              the loop visibly jumps. Padding inside the items makes the two
              halves identical and the loop seamless. */}
          <div className="flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee">
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <div
                  key={`${brand}-${i}`}
                  className="flex shrink-0 items-center gap-3 pr-16"
                  aria-hidden={i >= BRANDS.length}
                >
                  <div className="liquid-glass flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
                    <span className="relative z-10 text-[11px] font-semibold text-foreground">
                      {brand[0]}
                    </span>
                  </div>
                  <span className="whitespace-nowrap text-base font-semibold text-foreground">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* fade into the page below, so the video does not end on a hard edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}
