import Link from "next/link";
import { FileText, Globe, Lock } from "lucide-react";
import { SiGithub } from "react-icons/si";
import type { Project } from "@/data/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { cn } from "@/lib/utils";

/** Full case-study content for a project. Used by the desktop detail panel and the mobile cards. */
export function ProjectDetail({ project, compact = false, className }: { project: Project; compact?: boolean; className?: string }) {
  const teamLabel = project.source === "contributor" ? "Team project · contributor" : "Independent · sole developer";
  return (
    <div className={cn("flex flex-col", className)}>
      <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>{project.category}</span>
        <span aria-hidden="true" className="text-line-strong">/</span>
        {project.year ? (
          <>
            <span>{project.year}</span>
            <span aria-hidden="true" className="text-line-strong">/</span>
          </>
        ) : null}
        <span className={project.source === "owned" ? "text-cyan" : "text-lime"}>{teamLabel}</span>
      </p>

      <h3 className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)] text-silver">{project.title}</h3>

      <dl className={cn("mt-6 grid gap-6", compact ? "gap-5" : "md:grid-cols-2")}>
        <div>
          <dt className="eyebrow mb-2">Problem</dt>
          <dd className="text-sm leading-relaxed text-silver">{project.problem}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-2">My role</dt>
          <dd className="text-sm leading-relaxed text-silver">{project.role}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-2">What I built</dt>
          <dd>
            <ul className="space-y-2 text-sm leading-relaxed text-silver-dim">
              {project.built.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="eyebrow mb-2">Key implementation</dt>
          <dd>
            <ul className="space-y-2 text-sm leading-relaxed text-silver-dim">
              {project.implementation.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-silver-dim" />
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="mt-7">
        <p className="eyebrow mb-3">Technology</p>
        <ul className="flex flex-wrap gap-2" aria-label={`${project.title} technology stack`}>
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-full border border-line bg-white/[0.025] px-3 py-1 font-mono text-[0.7rem] text-silver">
              {tech}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-6">
        <Link
          href={`/work/${project.slug}`}
          className="link-underline inline-flex items-center gap-2 text-sm text-silver hover:text-cyan focus-visible:text-cyan"
        >
          <FileText aria-hidden="true" className="size-4" />
          Full case study
        </Link>
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-2 text-sm text-silver hover:text-cyan focus-visible:text-cyan"
          >
            <SiGithub aria-hidden="true" className="size-4" />
            GitHub repository
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">
            <Lock aria-hidden="true" className="size-3.5" />
            Source not published
          </span>
        )}
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.06] px-4 py-2 text-sm text-cyan transition-colors hover:bg-cyan/[0.14] focus-visible:bg-cyan/[0.14]"
          >
            <Globe aria-hidden="true" className="size-4" />
            Live demo
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">No public demo</span>
        )}
      </div>
      {project.live ? (
        <p className="mt-3 text-xs text-mist">
          Live link: <ExternalLink href={project.live}>{project.live.replace("https://", "")}</ExternalLink>
        </p>
      ) : null}
    </div>
  );
}
