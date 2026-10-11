import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
}

/** Consistent section heading: index, uppercase metadata label, editorial title. */
export function SectionHeader({ index, eyebrow, title, description, align = "left", id, className }: SectionHeaderProps) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="text-cyan">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        <span>{eyebrow}</span>
      </p>
      <h2 id={id} className="display mt-5 text-balance text-[clamp(2.4rem,5.5vw,4.6rem)] text-silver">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-silver-dim md:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}
