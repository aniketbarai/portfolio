"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skillCategories } from "@/data/portfolio";
import type { Skill, SkillCategory } from "@/data/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useInView, useIsDesktop, useWebGLStatus } from "@/lib/hooks";
import { useSceneQuality } from "@/components/scene/shared";
import { cn } from "@/lib/utils";

const SkillConstellationScene = dynamic(() => import("@/components/scene/SkillConstellationScene"), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="flex h-full flex-col items-center justify-center gap-4">
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan/50 motion-reduce:hidden" />
        <span className="relative inline-flex size-2.5 rounded-full bg-cyan" />
      </span>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-silver-dim">Charting constellation</p>
    </div>
  ),
});

interface Resolved {
  key: string;
  category: SkillCategory;
  skill: Skill;
}

/**
 * Skills: a 3D constellation and an accessible category grid share one selection model.
 * Hover (or focus) previews a technology; click pins it. The info panel always reflects the current choice.
 */
export function SkillsSection() {
  const categories = skillCategories;
  const [preview, setPreview] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const webgl = useWebGLStatus();
  const desktop = useIsDesktop();
  const quality = useSceneQuality(0, 0);
  const inView = useInView(sceneRef, { rootMargin: "200px" });

  const index = useMemo(() => {
    const map = new Map<string, Resolved>();
    for (const category of categories) {
      for (const skill of category.skills) {
        map.set(`${category.id}:${skill.name}`, { key: `${category.id}:${skill.name}`, category, skill });
      }
    }
    return map;
  }, [categories]);

  const defaultKey = `${categories[0]?.id ?? ""}:${categories[0]?.skills[0]?.name ?? ""}`;
  const displayKey = preview ?? pinned ?? defaultKey;
  const current = index.get(displayKey) ?? null;
  const totalSkills = useMemo(() => categories.reduce((n, c) => n + c.skills.length, 0), [categories]);

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          index="03"
          eyebrow="Skills"
          id="skills-title"
          title={
            <>
              A technical <span className="text-cyan">ecosystem,</span> not a logo wall.
            </>
          }
          description={`${totalSkills} technologies across six areas, each listed only because I have used it in a project or in this portfolio. Hover or focus a node to see how I use it.`}
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div ref={sceneRef} className="glass relative h-[420px] overflow-hidden rounded-[2rem] md:h-[520px]">
            <div aria-hidden="true" className="fine-grid absolute inset-0 opacity-40" />
            {webgl === "supported" && desktop ? (
              <ErrorBoundary name="skill-constellation" fallback={<p className="p-8 text-sm text-silver-dim">The constellation could not load. Every skill is listed in the categories below.</p>}>
                <div className="absolute inset-0">
                  <SkillConstellationScene
                    categories={categories}
                    highlighted={displayKey}
                    onHover={setPreview}
                    onSelect={(key) => setPinned(key)}
                    quality={quality}
                    active={inView}
                  />
                </div>
              </ErrorBoundary>
            ) : (
              <p className="flex h-full items-center justify-center p-8 text-center text-sm text-silver-dim">
                The 3D constellation is shown on larger screens. Every skill is available in the categories below.
              </p>
            )}
            <p className="pointer-events-none absolute bottom-5 left-6 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-silver-dim">
              Hover to inspect · Click to pin
            </p>
          </div>

          <aside aria-live="polite" aria-label="Selected technology" className="glass relative flex flex-col rounded-[2rem] p-8 md:p-10">
            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-1 flex-col"
                >
                  <p className="eyebrow text-cyan">{current.category.label}</p>
                  <h3 className="display mt-4 text-[clamp(2rem,3.4vw,2.9rem)] text-silver">{current.skill.name}</h3>
                  <p className="mt-5 text-base leading-relaxed text-silver-dim">{current.skill.usage}</p>
                  <p className="mt-auto pt-10 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist">
                    {pinned ? "Pinned selection · click another to change" : "Preview · click a node to pin"}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </aside>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, ci) => (
            <div key={category.id} className="bg-ink p-7 md:p-8">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-cyan">0{ci + 1}</p>
              <h3 className="mt-3 font-sans text-lg font-medium text-silver">{category.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-dim">{category.summary}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${category.label} technologies`}>
                {category.skills.map((skill) => {
                  const key = `${category.id}:${skill.name}`;
                  const isCurrent = displayKey === key;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        aria-pressed={pinned === key}
                        onMouseEnter={() => setPreview(key)}
                        onMouseLeave={() => setPreview(null)}
                        onFocus={() => setPreview(key)}
                        onBlur={() => setPreview(null)}
                        onClick={() => setPinned(key)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 font-mono text-[0.72rem] transition-[border-color,background-color,color] duration-300",
                          isCurrent ? "border-cyan/60 bg-cyan/[0.1] text-white" : "border-line text-silver-dim hover:border-line-strong hover:text-silver",
                          pinned === key && "ring-1 ring-cyan/50",
                        )}
                      >
                        {skill.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
