import { Layers, Gauge, Users, Server, GitBranch, BookOpen, type LucideIcon } from "lucide-react";
import { principles } from "@/data/portfolio";
import type { Principle } from "@/data/types";
import { Reveal } from "@/components/ui/Reveal";

const icons: Record<Principle["icon"], LucideIcon> = {
  layers: Layers,
  gauge: Gauge,
  users: Users,
  server: Server,
  git: GitBranch,
  book: BookOpen,
};

/** Engineering philosophy: concise principles, each with a small, restrained micro-interaction. */
export function Philosophy() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="relative overflow-hidden border-t border-line py-28 md:py-36">
      <div aria-hidden="true" className="absolute -left-[20%] top-[20%] h-[60vh] w-[60vh] rounded-full bg-lime/[0.035] blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-cyan">05</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span>Engineering philosophy</span>
            </p>
            <h2 id="philosophy-title" className="display mt-6 text-balance text-[clamp(2.6rem,6.2vw,5.6rem)] text-silver">
              Beyond writing code.
              <br />
              <span className="text-silver-dim">Building systems.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-base leading-relaxed text-silver-dim md:text-lg">
              Software lasts when its structure is clear, its performance is measured, and its failure modes are designed in from the start.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => {
            const Icon = icons[p.icon];
            return (
              <Reveal key={p.id} delay={(i % 3) * 0.06} className="h-full">
                <article className="group relative h-full bg-ink p-8 transition-colors duration-700 hover:bg-graphite/60 md:p-10">
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-line-strong bg-graphite/70 text-silver transition-[color,border-color,box-shadow] duration-700 group-hover:border-cyan/60 group-hover:text-cyan group-hover:shadow-[0_0_30px_-8px_rgb(62_232_255/0.7)]">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-[0.66rem] tracking-[0.2em] text-mist">0{i + 1}</span>
                  </div>
                  <h3 className="mt-8 font-sans text-xl font-medium text-silver">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-silver-dim">{p.body}</p>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan to-transparent transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-x-100 md:inset-x-10"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
