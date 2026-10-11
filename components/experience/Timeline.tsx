"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { experience } from "@/data/portfolio";
import type { ExperienceEntry, ExperienceKind } from "@/data/types";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const kindLabel: Record<ExperienceKind, string> = {
  client: "Client work",
  project: "Project",
  leadership: "Leadership",
  event: "Event",
  achievement: "Achievement",
  internship: "Internship",
};

/** Newest first, derived from the ISO start month in the data file. */
function sortEntries(entries: readonly ExperienceEntry[]): ExperienceEntry[] {
  return [...entries].sort((a, b) => (a.startedOn < b.startedOn ? 1 : a.startedOn > b.startedOn ? -1 : 0));
}

/**
 * Vertical timeline. The connection line draws as the section scrolls past;
 * all content is plain HTML and is readable without any animation.
 */
export function Timeline() {
  const entries = sortEntries(experience);
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative ml-2 border-l border-transparent md:ml-4">
      <motion.span
        aria-hidden="true"
        style={{ scaleY: lineScale }}
        className="absolute -left-px top-0 h-full w-px origin-top bg-gradient-to-b from-cyan via-cyan/50 to-transparent shadow-[0_0_12px_var(--color-cyan)]"
      />
      {entries.map((entry, i) => (
        <li key={entry.id} className="relative pb-14 pl-8 last:pb-0 md:pl-14">
          <span
            aria-hidden="true"
            className="absolute -left-[5px] top-2 size-[11px] rounded-full border border-cyan bg-ink shadow-[0_0_14px_-2px_var(--color-cyan)] md:-left-[6px]"
          />
          <Reveal delay={Math.min(i * 0.05, 0.2)}>
            <article className="group glass relative rounded-3xl p-6 transition-[transform,border-color] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-strong md:p-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <time className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-cyan">{entry.period}</time>
                <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.16em]", entry.kind === "client" ? "border-lime/40 text-lime" : "border-line-strong text-silver-dim")}>
                  {kindLabel[entry.kind]}
                </span>
              </div>
              <h3 className="mt-4 font-sans text-xl font-medium text-silver md:text-2xl">{entry.title}</h3>
              <p className="mt-1 text-sm text-mist">{entry.organization}</p>
              <p className="mt-5 max-w-3xl text-[0.95rem] leading-relaxed text-silver-dim">{entry.summary}</p>
              <ul className="mt-5 grid gap-2.5 md:grid-cols-2">
                {entry.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-silver">
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyan" />
                    {h}
                  </li>
                ))}
              </ul>
              {entry.links?.length ? (
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {entry.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1 text-sm text-silver hover:text-cyan focus-visible:text-cyan"
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
