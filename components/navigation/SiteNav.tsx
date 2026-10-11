"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navigation, profile } from "@/data/portfolio";
import type { SectionId } from "@/data/types";
import { Monogram } from "@/components/ui/Monogram";
import { scrollToSection } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/** Floating navigation: compacts after scrolling, tracks the active section, and collapses on mobile. */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Compact the bar once the hero has been left behind.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: the section crossing the middle band of the viewport is active.
  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu with Escape and return focus to its toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: SectionId) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto relative w-full max-w-5xl rounded-full border transition-[background-color,border-color,box-shadow,padding] duration-700 ease-[var(--ease-out-expo)]",
          scrolled
            ? "border-line bg-ink/70 py-2 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent py-3",
        )}
      >
        <div className="flex items-center justify-between gap-4 px-3 md:px-4">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              scrollToSection("top");
            }}
            className="group flex items-center gap-3 rounded-full py-1 pl-1 pr-2 text-silver"
            aria-label={`${profile.name} — back to top`}
          >
            <Monogram size={34} className="text-silver transition-colors group-hover:text-cyan" />
            <span className="hidden font-mono text-[0.68rem] uppercase tracking-[0.2em] text-silver-dim sm:inline">
              {profile.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-sm transition-colors duration-300",
                      isActive ? "text-white" : "text-silver-dim hover:text-silver",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-cyan/35 bg-cyan/[0.08] shadow-[inset_0_0_18px_-8px_rgb(62_232_255/0.6)]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    ) : null}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-silver transition-colors hover:border-cyan/50 hover:text-white md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="size-4" /> : <Menu aria-hidden="true" className="size-4" />}
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              id={menuId}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-3xl p-2 md:hidden"
            >
              <ul className="flex flex-col">
                {navigation.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={active === item.id ? "location" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        go(item.id);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base",
                        active === item.id ? "text-cyan" : "text-silver hover:bg-white/[0.04]",
                      )}
                    >
                      {item.label}
                      <span aria-hidden="true" className="font-mono text-xs text-silver-dim">
                        0{navigation.indexOf(item) + 1}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </header>
  );
}
