"use client";

import { Canvas } from "@react-three/fiber";
import { palette, type SceneQuality } from "./shared";

interface SceneCanvasProps {
  children: React.ReactNode;
  quality: SceneQuality;
  /** When false the render loop stops (off-screen scenes cost no GPU time). */
  active: boolean;
  className?: string;
  fov?: number;
  cameraPosition?: [number, number, number];
}

/**
 * Shared R3F canvas configuration: capped pixel ratio, transparent background,
 * pause when off-screen, and a single on-demand frame under reduced motion.
 */
export function SceneCanvas({
  children,
  quality,
  active,
  className,
  fov = 34,
  cameraPosition = [0, 0, 7],
}: SceneCanvasProps) {
  const frameloop = quality.reduced ? "demand" : active ? "always" : "never";

  return (
    <Canvas
      className={className}
      dpr={quality.dpr}
      frameloop={frameloop}
      camera={{ position: cameraPosition, fov, near: 0.1, far: 80 }}
      gl={{
        antialias: !quality.mobile,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(palette.ink, 0);
        scene.background = null;
      }}
      aria-hidden="true"
    >
      {children}
    </Canvas>
  );
}
