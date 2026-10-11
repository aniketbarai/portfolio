import { about } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { LayerDiagram } from "./LayerDiagram";

/** About: editorial two-column introduction, grounded only in verified profile facts. */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-36">
      <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-cyan">01</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span>About</span>
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="about-title" className="display mt-6 text-balance text-[clamp(2.6rem,6vw,5.2rem)] text-silver">
              The developer behind <span className="text-cyan">the dimension.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="mt-12">
            <LayerDiagram />
          </Reveal>
        </div>

        <div className="flex flex-col justify-end gap-12">
          <Reveal delay={0.1} className="space-y-6">
            {about.intro.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-silver md:text-xl md:leading-relaxed">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.15}>
            <h3 className="eyebrow mb-4">Focus</h3>
            {about.focus.map((line) => (
              <p key={line} className="border-l border-cyan/50 pl-5 text-base leading-relaxed text-silver-dim">
                {line}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.2}>
            <h3 className="eyebrow mb-2">Beyond the code</h3>
            <ul className="divide-y divide-line border-y border-line">
              {about.interests.map((item, i) => {
                const [label, ...rest] = item.split(": ");
                const body = rest.join(": ");
                return (
                  <li key={item} className="group grid grid-cols-[2.5rem_1fr] gap-3 py-5">
                    <span className="font-mono text-xs text-cyan transition-transform duration-500 group-hover:translate-x-1">
                      0{i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-silver-dim">
                      {body ? (
                        <>
                          <span className="font-medium text-silver">{label}:</span> {body}
                        </>
                      ) : (
                        item
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
