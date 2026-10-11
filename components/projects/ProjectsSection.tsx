"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/data/portfolio";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useInView, useIsDesktop, useWebGLStatus } from "@/lib/hooks";
import { useSceneQuality } from "@/components/scene/shared";
import { cn } from "@/lib/utils";
import { ProjectCarousel } from "./ProjectCarousel";
import { ProjectDetail } from "./ProjectDetail";

const ProjectGalleryScene = dynamic(() => import("@/components/scene/ProjectGalleryScene"), {
  ssr: false,
  loading: () => <ScenePlaceholder label="Assembling spatial gallery" />,
});

/** Shown only while the 3D chunk downloads; the panel keeps its height, so nothing shifts. */
function ScenePlaceholder({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="flex h-full flex-col items-center justify-center gap-4">
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan/50 motion-reduce:hidden" />
        <span className="relative inline-flex size-2.5 rounded-full bg-cyan" />
      </span>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-silver-dim">{label}</p>
    </div>
  );
}

/**
 * Projects: a spatial 3D gallery on desktop (with keyboard-accessible tabs and a
 * full detail panel), and a touch-first carousel on smaller screens. Both views
 * read from the same `projects` data.
 */
export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sceneWrapper = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const webgl = useWebGLStatus();
  const desktop = useIsDesktop();
  const quality = useSceneQuality(0, 0);
  const inView = useInView(sceneWrapper, { rootMargin: "200px" });

  const active = projects[activeIndex] ?? projects[0]!;
  const select = useCallback((index: number) => setActiveIndex(index), []);

  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % projects.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + projects.length) % projects.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = projects.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  // Keep the selected tab visible on narrow screens.
  useEffect(() => {
    tabRefs.current[activeIndex]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative border-t border-line py-28 md:py-36">
      <div aria-hidden="true" className="fine-grid absolute inset-x-0 top-0 h-[60%] opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          index="02"
          eyebrow="Projects"
          id="projects-title"
          title={
            <>
              Selected work, <span className="text-cyan">in three dimensions.</span>
            </>
          }
          description="Each project is a panel in a spatial gallery. Hover to preview, select to read the case study. Every detail below comes from the repository and its live deployment."
        />

        {/* Desktop: spatial gallery with tabs and detail panel. */}
        <div className="mt-16 hidden lg:block">
          <div
            role="tablist"
            aria-label="Projects"
            className="mb-6 flex flex-wrap gap-2"
          >
            {projects.map((project, i) => {
              const selected = i === activeIndex;
              return (
                <button
                  key={project.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${project.slug}`}
                  aria-selected={selected}
                  aria-controls="project-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "group flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition-[border-color,background-color,color] duration-500",
                    selected
                      ? "border-cyan/50 bg-cyan/[0.08] text-white"
                      : "border-line text-silver-dim hover:border-line-strong hover:text-silver",
                  )}
                >
                  <span className={cn("font-mono text-[0.65rem]", selected ? "text-cyan" : "text-mist")}>0{i + 1}</span>
                  {project.title}
                </button>
              );
            })}
          </div>

          <div
            ref={sceneWrapper}
            className="glass relative h-[520px] overflow-hidden rounded-[2rem]"
          >
            <div aria-hidden="true" className="fine-grid absolute inset-0 opacity-50" />
            {webgl === "supported" && desktop ? (
              <ErrorBoundary name="project-gallery" fallback={<GalleryFallback />}>
                <div className="absolute inset-0">
                  <ProjectGalleryScene
                    projects={projects}
                    activeIndex={activeIndex}
                    onSelect={select}
                    quality={quality}
                    active={inView}
                  />
                </div>
              </ErrorBoundary>
            ) : (
              <GalleryFallback />
            )}
            <p className="pointer-events-none absolute bottom-5 left-6 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-silver-dim">
              Hover to preview · Click to select
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              id="project-panel"
              role="tabpanel"
              aria-labelledby={`tab-${active.slug}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="glass mt-6 rounded-[2rem] p-8 md:p-10"
            >
              <ProjectDetail project={active} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile and tablet: touch-first horizontal deck, no hover required. */}
        <div className="mt-12 lg:hidden">
          <ProjectCarousel />
        </div>
      </div>
    </section>
  );
}

function GalleryFallback() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="font-display text-3xl text-silver">Spatial view unavailable</p>
      <p className="max-w-sm text-sm text-silver-dim">
        This browser cannot render the 3D gallery. Use the project tabs below to read every case study.
      </p>
    </div>
  );
}
