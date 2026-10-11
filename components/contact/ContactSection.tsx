import { existsSync } from "node:fs";
import path from "node:path";
import { Download, Mail } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { profile } from "@/data/portfolio";
import { RESUME_PATH } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ContactBackdrop } from "./ContactBackdrop";
import { ContactForm } from "./ContactForm";

/**
 * Contact: an immersive closing section. The resume link appears only when
 * public/resume.pdf exists, so no broken download is ever rendered.
 */
export function ContactSection() {
  const hasResume = existsSync(path.join(process.cwd(), "public", RESUME_PATH));

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line py-28 md:py-36">
      <ContactBackdrop />
      <div aria-hidden="true" className="fine-grid absolute inset-0 opacity-50" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-cyan">06</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span>Contact</span>
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="contact-title" className="display mt-6 text-balance text-[clamp(2.6rem,6vw,5.4rem)] text-silver">
              Have something <span className="text-cyan">interesting</span> to build?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-md text-base leading-relaxed text-silver-dim md:text-lg">
              I&apos;m open to software engineering internships, collaborative projects, and opportunities to build meaningful products.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            <ul className="divide-y divide-line border-y border-line">
              <li>
                <a href={`mailto:${profile.email}`} className="group flex items-center justify-between gap-4 py-4 text-silver hover:text-cyan focus-visible:text-cyan">
                  <span className="flex items-center gap-4">
                    <Mail aria-hidden="true" className="size-4 text-silver-dim group-hover:text-cyan" />
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">Email</span>
                  </span>
                  <span className="text-sm">{profile.email}</span>
                </a>
              </li>
              <li>
                <ExternalLinkRow href={profile.github} icon={<SiGithub aria-hidden="true" className="size-4" />} label="GitHub" value={profile.github.replace("https://", "")} />
              </li>
              {profile.linkedin ? (
                <li>
                  <ExternalLinkRow href={profile.linkedin} icon={<FaLinkedin aria-hidden="true" className="size-4" />} label="LinkedIn" value={profile.linkedin.replace(/^https?:\/\//, "")} />
                </li>
              ) : null}
              {hasResume ? (
                <li>
                  <a href={RESUME_PATH} download className="group flex items-center justify-between gap-4 py-4 text-silver hover:text-cyan focus-visible:text-cyan">
                    <span className="flex items-center gap-4">
                      <Download aria-hidden="true" className="size-4 text-silver-dim group-hover:text-cyan" />
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">Resume</span>
                    </span>
                    <span className="text-sm">Download PDF</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="glass rounded-[2rem] p-7 md:p-10">
            <h3 className="font-sans text-lg font-medium text-silver">Send a message</h3>
            <p className="mt-2 text-sm text-silver-dim">
              Tell me about the role, team or idea. Messages are checked for spam and delivered by email.
            </p>
            <div className="mt-8">
              <ContactForm emailFallback={profile.email} />
            </div>
            <p className="mt-8 text-xs text-mist">
              Prefer a direct email? <ExternalLink href={`mailto:${profile.email}`}>{profile.email}</ExternalLink>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ExternalLinkRow({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-4 text-silver hover:text-cyan focus-visible:text-cyan">
      <span className="flex items-center gap-4">
        <span className="text-silver-dim group-hover:text-cyan">{icon}</span>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">{label}</span>
      </span>
      <span className="text-sm">
        {value}
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  );
}
