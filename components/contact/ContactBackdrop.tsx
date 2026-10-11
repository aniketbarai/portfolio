"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView, useWebGLStatus } from "@/lib/hooks";
import { useSceneQuality } from "@/components/scene/shared";

const ContactScene = dynamic(() => import("@/components/scene/ContactScene"), { ssr: false, loading: () => null });

/** Mounts the luminous 3D backdrop only when the contact section is near the viewport. */
export function ContactBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const webgl = useWebGLStatus();
  const quality = useSceneQuality(320, 120);
  const inView = useInView(ref, { rootMargin: "300px", once: true });

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0">
      <div className="absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/[0.07] blur-[100px]" />
      {webgl === "supported" && inView ? (
        <div className="absolute inset-0 animate-fade-in">
          <ContactScene quality={quality} active={inView} />
        </div>
      ) : null}
    </div>
  );
}
