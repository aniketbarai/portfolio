import { GraduationCap } from "lucide-react";
import { education } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Timeline } from "./Timeline";

/**
 * Experience: real projects, client work, leadership and problem-solving
 * milestones, plus education.
 *
 * Grid placement is explicit so the reading order stays correct on small
 * screens (heading → timeline → education) while the wider layout keeps
 * education beneath the sticky heading beside the timeline.
 */
export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-28 md:py-36">
      <div className="flex flex-col gap-16 md:px-10 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-x-20 lg:gap-y-12">
        <div className="px-6 md:px-0 lg:col-start-1 lg:row-start-1 lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            index="04"
            eyebrow="Experience"
            id="experience-title"
            title={
              <>
                Shipping software, <span className="text-cyan">and learning in public.</span>
              </>
            }
            description="A timeline of client work, team projects, leadership and problem-solving milestones. Dates reflect the public record on GitHub."
          />
        </div>

        <div className="px-6 md:px-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Timeline />
        </div>

        <div className="px-6 md:px-0 lg:col-start-1 lg:row-start-2">
          <Reveal>
            <h3 className="eyebrow flex items-center gap-3">
              <GraduationCap aria-hidden="true" className="size-4 text-cyan" />
              Education
            </h3>
            <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {education.map((entry) => (
                <li key={entry.id} className="glass rounded-2xl p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-cyan">{entry.period}</span>
                    {entry.status === "current" ? (
                      <span className="rounded-full border border-lime/40 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-lime">
                        In progress
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 font-sans text-base font-medium text-silver">{entry.qualification}</p>
                  <p className="mt-1 text-sm text-mist">{entry.institution}</p>
                  {entry.detail ? <p className="mt-3 text-sm leading-relaxed text-silver-dim">{entry.detail}</p> : null}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
