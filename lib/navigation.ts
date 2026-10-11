import type { SectionId } from "@/data/types";

/**
 * Smoothly scrolls to a page section and moves keyboard focus to it, so
 * screen-reader and keyboard users land where they expect.
 *
 * Returns `false` when the section is not on the current page (for example on a
 * case-study route), so callers can navigate home instead of doing nothing.
 */
export function scrollToSection(id: SectionId | "top"): boolean {
  if (typeof document === "undefined") return false;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (id === "top") {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    return true;
  }

  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  return true;
}
