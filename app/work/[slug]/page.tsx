import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Globe, Lock, Mail, Users } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { profile, projects } from "@/data/portfolio";
import type { Project } from "@/data/types";
import { ProjectEmblem } from "@/components/projects/ProjectEmblem";
import { Monogram } from "@/components/ui/Monogram";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * Static case study for every project in data/portfolio.ts.
 * Adding a project to the data file generates its page, its metadata, its
 * sitemap entry and its place in the pager — no extra wiring required.
 */

/** Unknown slugs are a 404 rather than an on-demand render. */
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.title} — ${project.category}`,
    description: project.problem,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      title: `${project.title} — ${project.category}`,
      description: project.problem,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${project.category}`,
      description: project.problem,
    },
  };
}

function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.problem,
    url: `${SITE_URL}/work/${project.slug}`,
    ...(project.github ? { codeRepository: project.github } : {}),
    ...(project.live ? { sameAs: project.live } : {}),
    author: {
      "@type": "Person",
      name: profile.name,
      url: SITE_URL,
      sameAs: [profile.github, ...(profile.linkedin ? [profile.linkedin] : [])],
    },
    keywords: project.stack.join(", "),
  };
}

/** A titled block of bullets, used for the case-study body. */
function Bullets({
  label,
  index,
  items,
  tone = "cyan",
}: {
  label: string;
  index: string;
  items: readonly string[];
  tone?: "cyan" | "silver";
}) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="eyebrow flex items-center gap-3">
        <span className="text-cyan">{index}</span>
        <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
        {label}
      </h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed text-silver-dim">
            <span
              aria-hidden="true"
              className={cn("mt-2 size-1 shrink-0 rounded-full", tone === "cyan" ? "bg-cyan" : "bg-silver-dim")}
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const previous = projects[(index - 1 + projects.length) % projects.length]!;
  const next = projects[(index + 1) % projects.length]!;
  const teamLabel =
    project.source === "contributor" ? "Team project · contributor" : "Independent · sole developer";

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-cyan px-4 py-2 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-line bg-ink/70 px-3 py-2 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl backdrop-saturate-150 md:px-4"
        >
          <Link href="/" className="group flex items-center gap-3 rounded-full py-1 pl-1 pr-2 text-silver">
            <Monogram size={34} className="text-silver transition-colors group-hover:text-cyan" />
            <span className="hidden font-mono text-[0.68rem] uppercase tracking-[0.2em] text-silver-dim sm:inline">
              {profile.name}
            </span>
          </Link>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim transition-colors hover:border-cyan/50 hover:text-cyan"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            All projects
          </Link>
        </nav>
      </header>

      <main id="main" className="relative isolate overflow-hidden pb-28 pt-28 md:pt-32">
        <div aria-hidden="true" className="fine-grid absolute inset-x-0 top-0 h-[70vh] opacity-40" />
        <div
          aria-hidden="true"
          className="absolute -right-[15%] top-[6%] h-[52vh] w-[52vh] rounded-full bg-cyan/[0.07] blur-[130px]"
        />

        <article className="relative mx-auto max-w-5xl px-6 md:px-10">
          <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-cyan">Case study</span>
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            <span>{project.category}</span>
            {project.year ? (
              <>
                <span aria-hidden="true" className="text-line-strong">/</span>
                <span>{project.year}</span>
              </>
            ) : null}
          </p>

          <h1 className="display mt-6 text-balance text-[clamp(3rem,8vw,6.4rem)] text-silver">
            {project.title}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-silver-dim md:text-xl">
            {project.problem}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.06] px-5 py-2.5 text-sm text-cyan transition-colors hover:bg-cyan/[0.14]"
              >
                <Globe aria-hidden="true" className="size-4" />
                Visit live site
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-2 text-sm text-silver hover:text-cyan"
              >
                <SiGithub aria-hidden="true" className="size-4" />
                Source repository
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">
                <Lock aria-hidden="true" className="size-3.5" />
                Source not published
              </span>
            )}
            <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">
              <Users aria-hidden="true" className="size-3.5" />
              {teamLabel}
            </span>
          </div>

          {/* Visual: the project's dimensional emblem, drawn in SVG. No screenshots exist,
              so none are implied. */}
          <figure className="glass relative mt-14 overflow-hidden rounded-[2rem]">
            <div aria-hidden="true" className="fine-grid absolute inset-0 opacity-40" />
            <ProjectEmblem
              emblem={project.emblem}
              accent={project.accent}
              className="relative mx-auto h-[240px] w-full max-w-xl p-8 md:h-[320px]"
            />
            <figcaption className="relative border-t border-line px-6 py-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-silver-dim">
              Fig. — {project.title} · {project.stack.slice(0, 4).join(" · ")}
            </figcaption>
          </figure>

          <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-14">
            <Bullets index="01" label="The problem" items={[project.problem]} />
            <Bullets index="02" label="What I built" items={project.built} />
            <Bullets index="03" label="Key implementation" items={project.implementation} tone="silver" />
            <Bullets index="04" label="My role and contribution" items={[project.role]} />
          </div>

          <section className="mt-14 border-t border-line pt-8">
            <h2 className="eyebrow">Technology</h2>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.title} technology stack`}>
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-line bg-white/[0.025] px-3.5 py-1.5 font-mono text-[0.72rem] text-silver"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass mt-16 flex flex-col gap-5 rounded-[2rem] p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="font-sans text-xl font-medium text-silver">Working on something similar?</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-silver-dim">
                {profile.status}. Tell me about the role, team or idea.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-silver px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-cyan"
              >
                <Mail aria-hidden="true" className="size-4" />
                Let&apos;s connect
              </Link>
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm text-silver transition-colors hover:border-cyan/60 hover:text-white"
              >
                Back to gallery
              </Link>
            </div>
          </section>

          <nav aria-label="Project navigation" className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            <Link
              href={`/work/${previous.slug}`}
              className="group flex flex-col gap-2 rounded-2xl border border-line p-5 transition-colors hover:border-cyan/40"
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-silver-dim">
                ← Previous
              </span>
              <span className="font-sans text-base text-silver group-hover:text-cyan">{previous.title}</span>
            </Link>
            <Link
              href={`/work/${next.slug}`}
              className="group flex flex-col gap-2 rounded-2xl border border-line p-5 text-right transition-colors hover:border-cyan/40 sm:items-end"
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-silver-dim">
                Next →
              </span>
              <span className="font-sans text-base text-silver group-hover:text-cyan">{next.title}</span>
            </Link>
          </nav>

          <p className="mt-10 flex items-center justify-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mist">
            <ArrowRight aria-hidden="true" className="size-3.5 text-cyan" />
            Every claim on this page comes from the repository and its live deployment
          </p>
        </article>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
