"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query. Returns `fallback` during server rendering
 * and the first client render, so markup never diverges between server and
 * client (no hydration mismatch), then updates after mount.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/** True when the user asked for reduced motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

/** True for pointer devices that hover (desktop/laptop with a mouse or trackpad). */
export function useCanHover(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)", false);
}

/** True for viewports wide enough for the spatial desktop layouts. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)", false);
}

export type WebGLStatus = "checking" | "supported" | "unsupported";

let webglCache: Exclude<WebGLStatus, "checking"> | null = null;

function getWebGLSnapshot(): Exclude<WebGLStatus, "checking"> {
  if (webglCache === null) webglCache = detectWebGL() ? "supported" : "unsupported";
  return webglCache;
}

/**
 * Detects WebGL2 (or WebGL1) once on the client, cached for the session.
 * Reports "checking" during server rendering and hydration, so the static
 * fallback is what the server sends.
 */
export function useWebGLStatus(): WebGLStatus {
  return useSyncExternalStore(
    () => () => {},
    getWebGLSnapshot,
    (): WebGLStatus => "checking",
  );
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    // Release the context promptly; R3F will create its own.
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Tracks whether an element is in (or near) the viewport. Used to pause
 * render loops of off-screen WebGL scenes and to lazy-mount heavy scenes.
 */
export function useInView<T extends Element>(
  ref: React.RefObject<T | null>,
  options: { rootMargin?: string; once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);
  const { rootMargin = "200px", once = false } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (once) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        } else {
          setInView(entry.isIntersecting);
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
