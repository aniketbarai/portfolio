"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { SectionId } from "@/data/types";
import { useInView, useWebGLStatus } from "@/lib/hooks";
import { useSceneQuality } from "@/components/scene/shared";
import { scrollToSection } from "@/lib/navigation";
import { clamp } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import type { PointerState } from "@/components/scene/HeroScene";
import { HeroFallback } from "./HeroFallback";

/* The 3D bundle (three.js, R3F, drei) is split out and loaded only on WebGL-capable clients. */
const HeroScene = dynamic(() => import("@/components/scene/HeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Owns the hero's live input: pointer and scroll are written to refs (not state),
 * so pointer movement never re-renders React. Chooses between the WebGL scene and
 * the static fallback, and pauses rendering while the hero is off-screen.
 */
export function HeroVisual({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const webgl = useWebGLStatus();
  const quality = useSceneQuality(700, 200);
  const inView = useInView(sectionRef, { rootMargin: "120px" });

  const pointerRef = useRef<PointerState>({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerRef.current = {
        x: clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1),
        y: clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1),
      };
    };
    const onScroll = () => {
      scrollRef.current = clamp(window.scrollY / Math.max(window.innerHeight * 0.9, 1), 0, 1);
    };
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const showScene = webgl === "supported";

  return (
    <div className="absolute inset-0">
      {showScene ? (
        <ErrorBoundary name="hero-scene" fallback={<HeroFallback />}>
          <div className={`absolute inset-0 animate-fade-in ${quality.mobile ? "opacity-50" : ""}`}>
            <HeroScene
              active={inView}
              quality={quality}
              pointerRef={pointerRef}
              scrollRef={scrollRef}
              onNavigate={(section: SectionId) => scrollToSection(section)}
            />
          </div>
        </ErrorBoundary>
      ) : (
        <HeroFallback className="absolute inset-0" />
      )}
    </div>
  );
}
