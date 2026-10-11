import type { SectionId } from "@/data/types";

/**
 * Smoothly scrolls to a page section and moves keyboard focus to it, so
 * screen-reader and keyboard users land where they expect.
 */
export function scrollToSection(id: SectionId | "top"): void {
  if (typeof document === "undefined") return;
  const target = id === "top" ? document.body : document.getElementById(id);
  if (!target) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    return;
  }

  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}
