import { SiteNav } from "@/components/navigation/SiteNav";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { Philosophy } from "@/components/philosophy/Philosophy";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/footer/Footer";
import { profile, projects } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

/** Structured data describing the person and their verified public projects. */
function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: profile.name,
        jobTitle: profile.title,
        email: `mailto:${profile.email}`,
        url: SITE_URL,
        sameAs: [profile.github, ...(profile.linkedin ? [profile.linkedin] : [])],
        knowsAbout: ["React", "Next.js", "Node.js", "Express.js", "MongoDB", "TypeScript", "JavaScript", "Java", "Python"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: profile.siteName,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      ...projects.map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        description: p.problem,
        url: p.live ?? p.github,
        codeRepository: p.github,
        author: { "@id": `${SITE_URL}/#person` },
      })),
    ],
  };
}

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-cyan px-4 py-2 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main" className="relative overflow-hidden">
        <Hero />
        <About />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <Philosophy />
        <ContactSection />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
