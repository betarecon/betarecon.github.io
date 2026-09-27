# Recon Clips — landing page

Static marketing site for Recon Clips. React + TypeScript + Vite + Tailwind.

## Run locally

```bash
npm install
npm run dev
```

Serves on http://localhost:5173.

## Build

```bash
npm run build      # -> dist/
npm run preview    # serve the built output
```

## Publishing to GitHub Pages

Two things have to be right, and only one of them is obvious.

### 1. `base`

Pages serves a project site from a subpath:

```
https://<user>.github.io/<repo>/
```

The build has to know that. Set it at build time:

```bash
BASE_PATH=/<repo-name>/ npm run build
```

The bundled workflow sets this automatically, so you normally do not run it by
hand. If you do build manually and forget, the site loads a blank page and the
console fills with 404s for `/assets/...` — that is the symptom, not a mystery.

To find the value the workflow used, check the build step's output; it echoes the
resolved `base`.

### 2. Pages must be pointed at GitHub Actions

In the repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.

If the source is left on "Deploy from a branch", the workflow will succeed and
the site will still 404. Nothing in the logs will tell you this — it is a
repo setting, not a build failure.

### Deploy

Push to `main`. `.github/workflows/deploy.yml` builds and deploys. The URL lands
in the workflow's `deploy` job summary.

## The download link

`src/pages/Index.tsx`:

```ts
const DOWNLOAD_URL = "https://github.com/.../releases/download/stable/ReconStudio.exe";
const FILE_NAME = "ReconStudio.exe";
```

Both are consumed by `startDownload()`, which synthesises an anchor and clicks
it. An anchor is used rather than `window.location = url` because only a real
anchor honours the `download` attribute, and that attribute is what asks the
browser to save the file instead of navigating to it.

The release URL is absolute on purpose. It is a different host from the Pages
site, so it needs no `BASE_PATH` prefix — and it keeps working if the site is
later moved to a custom domain.

## Layout

```
src/
  pages/Index.tsx        page composition; all download triggers funnel through one handler
  components/
    Hero.tsx             background video, fade loop, blur shape, logo marquee
    Navbar.tsx           sticky bar with dropdowns
    Sections.tsx         Features, Clips, Pricing, FAQ, FinalCta, Footer
    Reveal.tsx           scroll-into-view fade
  index.css              CSS variables, liquid-glass, keyframes
  assets/logo.svg
```

## Notes for whoever edits this next

- **The video fade is driven by `requestAnimationFrame` reading `currentTime`**,
  not by CSS transitions. That is deliberate: a transition can be left stranded
  mid-fade if a frame is dropped or the element is seeked. `loop` is not set
  because the replay has to pass through the `ended` handler.
- **The marquee uses per-item `pr-16` rather than `gap-16` on the track.** With a
  uniform gap the track is not exactly twice one half, so `translateX(-50%)`
  lands half a gap short and the loop visibly jumps.
- **Do not add a "has this already started" ref guard to timed effects.** React
  StrictMode invokes effects twice in development; the first run claims the flag,
  its cleanup cancels the work, and the second run bails out — leaving nothing
  running. Each run must own the timers it cleans up.
- **Text marked "Recon" / "Clips" in the headline is split on purpose** so only
  the second word takes the gradient.
