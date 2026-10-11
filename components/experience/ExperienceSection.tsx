import { SectionHeader } from "@/components/ui/SectionHeader";
import { Timeline } from "./Timeline";

/** Experience: real projects, client work and problem-solving milestones, from verified records. */
export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            index="04"
            eyebrow="Experience"
            id="experience-title"
            title={
              <>
                Shipping software, <span className="text-cyan">and learning in public.</span>
              </>
            }
            description="A timeline of client work, team projects and problem-solving milestones. Dates reflect the public record on GitHub."
          />
        </div>
        <div>
          <Timeline />
        </div>
      </div>
    </section>
  );
}
