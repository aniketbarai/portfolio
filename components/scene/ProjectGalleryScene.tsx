"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Edges, Environment, Html, Lightformer, RoundedBox } from "@react-three/drei";
import type { Project } from "@/data/types";
import { damp } from "@/lib/utils";
import { SceneCanvas } from "./SceneCanvas";
import { palette, type SceneQuality } from "./shared";

export interface ProjectGalleryProps {
  projects: readonly Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
  quality: SceneQuality;
  active: boolean;
}

const ARC_STEP = 0.4;
const ARC_RADIUS = 3.0;

function accentColor(accent: Project["accent"]): string {
  if (accent === "lime") return palette.lime;
  if (accent === "cyan") return palette.cyan;
  return palette.silver;
}

/* ---------------------------------------------------------------------------
 * Each project gets its own miniature 3D emblem, built from real geometry.
 * ------------------------------------------------------------------------- */
function Emblem({ kind, accent }: { kind: Project["emblem"]; accent: Project["accent"] }) {
  const color = accentColor(accent);
  const glow = useMemo(() => new THREE.Color(color), [color]);

  if (kind === "stack") {
    return (
      <group>
        {[0, 1, 2, 3].map((i) => (
          <RoundedBox key={i} args={[0.9, 0.12, 0.5]} radius={0.02} smoothness={2} position={[0, -0.36 + i * 0.22, 0]} rotation={[0, i * 0.12, 0]}>
            <meshPhysicalMaterial color={palette.graphiteLight} metalness={0.9} roughness={0.32} clearcoat={0.4} />
            {i === 3 ? <Edges color={glow} /> : null}
          </RoundedBox>
        ))}
      </group>
    );
  }

  if (kind === "grid") {
    return (
      <group>
        {Array.from({ length: 9 }, (_, i) => {
          const x = (i % 3) * 0.3 - 0.3;
          const y = Math.floor(i / 3) * 0.3 - 0.3;
          const lit = i === 4 || i === 6;
          return (
            <mesh key={i} position={[x, y, 0]}>
              <boxGeometry args={[0.22, 0.22, 0.06]} />
              {lit ? (
                <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.6} toneMapped={false} />
              ) : (
                <meshStandardMaterial color={palette.graphiteLight} metalness={0.85} roughness={0.35} />
              )}
            </mesh>
          );
        })}
      </group>
    );
  }

  if (kind === "rings") {
    return (
      <group>
        {[
          { r: 0.55, rot: [1.1, 0.2, 0] as [number, number, number] },
          { r: 0.42, rot: [0.4, 1.0, 0.3] as [number, number, number] },
          { r: 0.7, rot: [1.5, -0.3, 0.7] as [number, number, number] },
        ].map((ring, i) => (
          <mesh key={i} rotation={ring.rot}>
            <torusGeometry args={[ring.r, 0.01, 10, 120]} />
            <meshStandardMaterial color={i === 2 ? glow : palette.silver} metalness={1} roughness={0.2} emissive={i === 2 ? glow : undefined} emissiveIntensity={i === 2 ? 1.2 : 0} />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.07, 20, 20]} />
          <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      </group>
    );
  }

  if (kind === "shield") {
    return (
      <group>
        {/* Extruded shield: a lathe-free build from two stacked plates plus a checkmark of boxes. */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.05, 6]} />
          <meshPhysicalMaterial color={palette.graphiteLight} metalness={0.9} roughness={0.3} clearcoat={0.5} />
          <Edges color={glow} />
        </mesh>
        <mesh position={[0, 0.05, 0.04]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.34, 0.008, 8, 64]} />
          <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        <group position={[0, 0.06, 0.06]}>
          <mesh position={[-0.07, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.11, 0.016, 0.012]} />
            <meshStandardMaterial color={palette.silver} metalness={1} roughness={0.18} />
          </mesh>
          <mesh position={[0.06, 0.05, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.22, 0.016, 0.012]} />
            <meshStandardMaterial color={palette.silver} metalness={1} roughness={0.18} />
          </mesh>
        </group>
      </group>
    );
  }

  if (kind === "pulse") {
    return (
      <group>
        {Array.from({ length: 7 }, (_, i) => {
          const heights = [0.16, 0.3, 0.22, 0.46, 0.26, 0.36, 0.18];
          const lit = i === 3;
          return (
            <mesh key={i} position={[(i - 3) * 0.16, -0.2 + (heights[i] ?? 0.2) / 2, 0]}>
              <boxGeometry args={[0.08, heights[i] ?? 0.2, 0.08]} />
              {lit ? (
                <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2} toneMapped={false} />
              ) : (
                <meshStandardMaterial color={palette.graphiteLight} metalness={0.9} roughness={0.3} />
              )}
            </mesh>
          );
        })}
        <mesh position={[0, 0.36, 0]}>
          <torusGeometry args={[0.38, 0.006, 8, 80]} />
          <meshBasicMaterial color={glow} transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }

  // "prism"
  return (
    <group>
      <mesh rotation={[0.3, 0.6, 0]}>
        <octahedronGeometry args={[0.52, 0]} />
        <meshPhysicalMaterial color="#dfe9f5" transparent opacity={0.16} roughness={0.05} clearcoat={1} depthWrite={false} />
        <Edges color={palette.silver} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[0.3, 0.6, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * A single gallery panel. It eases toward its arc position and responds to
 * pointer hover with a subtle tilt and an information tooltip.
 * ------------------------------------------------------------------------- */
function GalleryItem({
  project,
  index,
  activeIndex,
  reduced,
  onSelect,
  onHover,
  hovered,
}: {
  project: Project;
  index: number;
  activeIndex: number;
  reduced: boolean;
  onSelect: (index: number) => void;
  onHover: (index: number | null) => void;
  hovered: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const offset = index - activeIndex;
  const isActive = index === activeIndex;
  const accent = accentColor(project.accent);
  /* Panels far along the arc collapse out of the composition, so a longer
     project list stays readable instead of stacking at the horizon. */
  const offstage = Math.abs(offset) > 2.6;
  const labelled = Math.abs(offset) <= 2;

  const angle = offset * ARC_STEP;
  /* Resting transform. The frame loop only refines it, which keeps the very
     first painted frame correct and makes the reduced-motion single frame a
     valid composition instead of everything piled at the origin. */
  const rest = {
    position: [
      Math.sin(angle) * ARC_RADIUS,
      isActive ? 0.1 : -0.05,
      (Math.cos(angle) - 1) * ARC_RADIUS * 0.55 - (isActive ? 0 : 0.4),
    ] as [number, number, number],
    rotation: [0, -angle * 0.9, 0] as [number, number, number],
    scale: offstage ? 0.35 : isActive ? 1 : 0.78,
  };

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const tx = rest.position[0];
    const tz = rest.position[2];
    const ty = rest.position[1];
    const ts = offstage ? 0.35 : isActive ? 1 : 0.78;
    const tr = -angle * 0.9 + (hovered && !reduced ? 0.08 : 0);
    const lambda = 4.2;
    g.position.x = damp(g.position.x, tx, lambda, delta);
    g.position.z = damp(g.position.z, tz, lambda, delta);
    g.position.y = damp(g.position.y, ty + (hovered && !reduced ? 0.06 : 0), lambda, delta);
    g.rotation.y = damp(g.rotation.y, tr, lambda, delta);
    const s = damp(g.scale.x, hovered && !offstage ? ts * 1.04 : ts, 6, delta);
    g.scale.setScalar(s);
    // Invisible groups are skipped by the raycaster, so off-stage panels can
    // never steal a click from the panel in front of them.
    const visible = !offstage;
    if (g.visible !== visible) g.visible = visible;
  });

  const stop = (e: ThreeEvent<PointerEvent | MouseEvent>) => e.stopPropagation();

  return (
    <group
      ref={group}
      position={rest.position}
      rotation={rest.rotation}
      scale={rest.scale}
      visible={!offstage}
    >
      <RoundedBox
        args={[1.5, 2.0, 0.05]}
        radius={0.05}
        smoothness={3}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          stop(e);
          onHover(index);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "";
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          stop(e);
          onSelect(index);
        }}
      >
        <meshPhysicalMaterial
          color="#cfdbe8"
          transparent
          opacity={isActive ? 0.2 : 0.11}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.6}
          depthWrite={false}
        />
        <Edges color={isActive || hovered ? accent : palette.silver} transparent opacity={isActive ? 0.9 : hovered ? 0.7 : 0.35} />
      </RoundedBox>

      <group position={[0, 0.05, 0.05]} scale={0.7}>
        <Emblem kind={project.emblem} accent={project.accent} />
      </group>

      <mesh position={[-0.55, -0.85, 0.035]}>
        <boxGeometry args={[0.5, 0.012, 0.005]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={isActive ? 2.5 : 0.8} toneMapped={false} />
      </mesh>

      {labelled ? (
        <Html position={[0, -1.2, 0.05]} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
          <div
            className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
              isActive ? "text-cyan" : "text-silver-dim"
            }`}
          >
            0{index + 1} · {project.title}
          </div>
        </Html>
      ) : null}

      {hovered ? (
        <Html position={[1.05, 0.6, 0.2]} zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
          <div className="w-64 rounded-2xl border border-line-strong bg-ink/85 p-4 text-left shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan">{project.category}</p>
            <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-silver">{project.problem}</p>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-silver-dim">
              {project.stack.slice(0, 4).join(" · ")}
            </p>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function GalleryContent({
  projects,
  activeIndex,
  onSelect,
  quality,
}: Omit<ProjectGalleryProps, "active">) {
  const [hovered, setHovered] = useState<number | null>(null);
  const root = useRef<THREE.Group>(null);

  // Gentle, inertial camera response to the pointer for depth.
  useFrame((state, delta) => {
    const g = root.current;
    if (!g || quality.reduced) return;
    g.rotation.y = damp(g.rotation.y, state.pointer.x * 0.08, 3, delta);
    g.rotation.x = damp(g.rotation.x, -state.pointer.y * 0.04, 3, delta);
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#8ea3b8" />
      <directionalLight position={[3, 5, 6]} intensity={1.4} color="#e6eef7" />
      <spotLight position={[-4, 4, 5]} angle={0.6} penumbra={1} intensity={30} color={palette.cyan} distance={20} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2} position={[4, 2, 2]} scale={[2, 6, 1]} color="#e3edf7" />
        <Lightformer form="ring" intensity={1} position={[-2, 3, -2]} scale={4} color={palette.cyan} />
      </Environment>

      <group ref={root}>
        {projects.map((project, index) => (
          <GalleryItem
            key={project.slug}
            project={project}
            index={index}
            activeIndex={activeIndex}
            reduced={quality.reduced}
            onSelect={onSelect}
            onHover={setHovered}
            hovered={hovered === index}
          />
        ))}
      </group>
    </>
  );
}

export default function ProjectGalleryScene(props: ProjectGalleryProps) {
  return (
    <SceneCanvas quality={props.quality} active={props.active} cameraPosition={[0, 0.4, 6.4]} fov={30}>
      <GalleryContent
        projects={props.projects}
        activeIndex={props.activeIndex}
        onSelect={props.onSelect}
        quality={props.quality}
      />
    </SceneCanvas>
  );
}

