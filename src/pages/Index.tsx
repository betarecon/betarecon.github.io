import { useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Features, Clips, Pricing, Faq, FinalCta, Footer } from "@/components/Sections";

/**
 * The installer.
 *
 * A direct link to the asset attached to the GitHub release. GitHub serves
 * release assets as an attachment, so this downloads rather than navigating.
 *
 * If you ever host builds under a tag that contains a dot — a version like
 * "v1.0" rather than "stable" — keep the /download/ segment. Dropping it
 * silently gives you the release page's HTML instead of the installer, which
 * is an annoying thing to debug.
 *
 * To move the file elsewhere, replace this with the full URL. Nothing else in
 * the project needs to change.
 */
const DOWNLOAD_URL =
  "https://github.com/betarecon/redesigned-spoon/releases/download/stable/ReconStudio.exe";
const FILE_NAME = "ReconStudio.exe";

export default function Index() {
  /**
   * One click, one download.
   *
   * This used to open the staged-progress modal. It now fires the download
   * immediately instead. The synthetic anchor is used rather than
   * `window.location = url` because only a real anchor honours the `download`
   * attribute, which is what forces the browser to save the file as
   * "ReconStudio.exe" instead of navigating to it.
   */
  const startDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = DOWNLOAD_URL;
    a.download = FILE_NAME;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar onDownload={startDownload} />

      <Hero onDownload={startDownload} />

      <Features />
      <Clips />
      <Pricing onDownload={startDownload} />
      <Faq />
      <FinalCta onDownload={startDownload} />
      <Footer />
    </div>
  );
}
