"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { profile } from "@/data/portfolio";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen cinematic hero. Text sits in a non-interactive overlay so the 3D
 * scene behind it receives pointer input; only the CTAs opt back in.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink grain"
    >
      {/* Atmosphere: fine grid, volumetric glow and a deep vignette. */}
      <div aria-hidden="true" className="fine-grid absolute inset-0 opacity-70" />
      <div
        aria-hidden="true"
        className="absolute -right-[10%] top-[10%] h-[70vh] w-[70vh] rounded-full bg-cyan/[0.09] blur-[120px] lg:right-[4%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-ink to-transparent"
      />

      <HeroVisual sectionRef={ref} />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-14 pt-36 md:px-10 md:pb-20 lg:justify-center lg:pb-24 lg:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="pointer-events-auto inline-flex w-fit items-center gap-3 rounded-full border border-line-strong bg-ink/50 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-silver backdrop-blur-md"
        >
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime/60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-lime" />
          </span>
          {profile.status}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="mt-8 font-sans text-sm font-medium uppercase tracking-[0.5em] text-silver-dim md:text-base"
        >
          ANIKET BARAI
        </motion.p>

        <h1
          id="hero-title"
          className="display mt-5 max-w-[14ch] text-balance text-[clamp(3.1rem,8.4vw,8.1rem)] text-silver"
        >
          <span className="sr-only">Engineering Ideas Into Digital Reality.</span>
          <span aria-hidden="true">
            {"Engineering Ideas Into Digital Reality.".split(" ").map((word, i) => (
              <span key={`${word}-${i}`}>
                <motion.span
                  className="inline-block will-change-transform"
                  initial={{ opacity: 0, y: "0.4em", filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                  transition={{ duration: 1, ease, delay: 0.35 + i * 0.08 }}
                >
                  {word}
                </motion.span>{" "}
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.9 }}
          className="mt-7 max-w-lg text-base leading-relaxed text-silver-dim md:text-lg"
        >
          {profile.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 1.05 }}
          className="pointer-events-auto mt-10 flex flex-wrap items-center gap-3"
        >
          <ButtonLink href="#projects">Explore My Work</ButtonLink>
          <ButtonLink href="#contact" variant="secondary">
            Let&apos;s Connect
          </ButtonLink>
        </motion.div>

        <a
          href="#about"
          className="pointer-events-auto group absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[0.66rem] uppercase tracking-[0.25em] text-silver-dim transition-colors hover:text-cyan focus-visible:text-cyan md:flex lg:left-10 lg:translate-x-0"
        >
          <span className="flex size-8 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-cyan/60">
            <ArrowDown aria-hidden="true" className="size-3.5 transition-transform duration-500 group-hover:translate-y-0.5" />
          </span>
          Scroll to explore
        </a>
      </div>
    </section>
  );
}
