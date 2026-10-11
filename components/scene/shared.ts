import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";

/** Palette used by every 3D scene, mirroring the CSS design tokens. */
export const palette = {
  ink: "#05070a",
  graphite: "#141a22",
  graphiteLight: "#2a333f",
  silver: "#d6dee7",
  silverDim: "#8d99a8",
  cyan: "#3ee8ff",
  lime: "#c4ff4d",
} as const;

export interface SceneQuality {
  /** Narrow viewports and touch-first devices. */
  mobile: boolean;
  /** The user asked for reduced motion. */
  reduced: boolean;
  /** Device pixel ratio cap. */
  dpr: [number, number];
  /** Particle budget for ambient effects. */
  particles: number;
}

/** Derives render budgets from the device. Pure function of two booleans and a count. */
export function useSceneQuality(desktopParticles: number, mobileParticles: number): SceneQuality {
  const narrow = useMediaQuery("(max-width: 767px)", false);
  const coarse = useMediaQuery("(pointer: coarse)", false);
  const reduced = useReducedMotion();
  const mobile = narrow || coarse;
  return {
    mobile,
    reduced,
    dpr: mobile ? [1, 1.25] : [1, 1.75],
    particles: mobile ? mobileParticles : desktopParticles,
  };
}

/**
 * Procedural brushed-metal roughness texture. Generated once on the client via
 * a canvas, so the scene ships no image files. Dispose when unmounted.
 */
export function useBrushedRoughness(seed = 7): THREE.CanvasTexture {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      let s = seed;
      const rand = () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 900; i++) {
        const y = rand() * size;
        const x = rand() * size;
        const len = 40 + rand() * 180;
        const v = 110 + Math.floor(rand() * 60);
        ctx.strokeStyle = `rgba(${v},${v},${v},${0.25 + rand() * 0.35})`;
        ctx.lineWidth = 0.6 + rand() * 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len, y + (rand() - 0.5) * 0.6);
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
  }, [seed]);

  // Release the GPU copy when the owning scene unmounts.
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** Deterministic pseudo-random generator so scene layouts are stable across renders. */
export function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Evenly distributes `count` points on a sphere (Fibonacci lattice). */
export function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1 || 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return points;
}
