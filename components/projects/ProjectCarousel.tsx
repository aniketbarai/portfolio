import { ArrowRight } from "lucide-react";
import { projects } from "@/data/portfolio";
import { ProjectDetail } from "./ProjectDetail";
import { ProjectEmblem } from "./ProjectEmblem";

/**
 * Touch-first gallery for mobile and no-WebGL devices: a horizontal, scroll-snapped
 * deck of full project cards. No hover dependency; everything is visible.
 */
export function ProjectCarousel() {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 pb-4 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-silver-dim">
        <span>Swipe to explore</span>
        <ArrowRight aria-hidden="true" className="size-4 text-cyan" />
      </div>
      <ul
        className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Projects"
      >
        {projects.map((project, i) => (
          <li
            key={project.slug}
            id={`project-card-${project.slug}`}
            className="glass relative flex w-[86vw] max-w-md shrink-0 snap-center flex-col overflow-hidden rounded-3xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-graphite fine-grid">
              <ProjectEmblem emblem={project.emblem} accent={project.accent} className="absolute inset-0 size-full p-6" />
              <span className="absolute left-5 top-4 font-mono text-[0.68rem] tracking-[0.2em] text-cyan">0{i + 1}</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <ProjectDetail project={project} compact />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
