"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { SkillCategory } from "@/data/types";
import { damp } from "@/lib/utils";
import { SceneCanvas } from "./SceneCanvas";
import { fibonacciSphere, palette, seededRandom, type SceneQuality } from "./shared";

export interface ConstellationProps {
  categories: readonly SkillCategory[];
  /** Key of the currently highlighted skill ("category:name"), or null. */
  highlighted: string | null;
  onHover: (key: string | null) => void;
  onSelect: (key: string) => void;
  quality: SceneQuality;
  active: boolean;
}

interface Node {
  key: string;
  name: string;
  category: number;
  position: THREE.Vector3;
}

function buildLayout(categories: readonly SkillCategory[]): { nodes: Node[]; hubs: THREE.Vector3[]; segments: Float32Array } {
  const hubs = fibonacciSphere(categories.length, 2.25);
  const rand = seededRandom(31);
  const nodes: Node[] = [];
  const segments: number[] = [];

  categories.forEach((category, ci) => {
    const hub = hubs[ci] ?? new THREE.Vector3();
    let previous: THREE.Vector3 | null = null;
    category.skills.forEach((skill) => {
      const offset = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(0.7 + rand() * 0.55);
      const position = hub.clone().add(offset);
      nodes.push({ key: `${category.id}:${skill.name}`, name: skill.name, category: ci, position });
      segments.push(hub.x, hub.y, hub.z, position.x, position.y, position.z);
      if (previous) segments.push(previous.x, previous.y, previous.z, position.x, position.y, position.z);
      previous = position;
    });
  });

  return { nodes, hubs, segments: new Float32Array(segments) };
}

function setCursor(value: string) {
  if (typeof document !== "undefined") document.body.style.cursor = value;
}

function ConstellationContent({ categories, highlighted, onHover, onSelect, quality }: Omit<ConstellationProps, "active">) {
  const layout = useMemo(() => buildLayout(categories), [categories]);
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (quality.reduced) return;
    g.rotation.y += delta * 0.045;
    g.rotation.x = damp(g.rotation.x, state.pointer.y * 0.18, 3, delta);
    g.rotation.z = damp(g.rotation.z, -state.pointer.x * 0.08, 3, delta);
    if (rings.current) rings.current.rotation.z += delta * 0.06;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 5]} intensity={6} color={palette.silver} distance={14} />
      <pointLight position={[-3, -2, 3]} intensity={4} color={palette.cyan} distance={12} />

      <group ref={group}>
        {/* Connection lines: hub-to-node and node-to-node within each cluster. */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[layout.segments, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={palette.silver} transparent opacity={0.22} depthWrite={false} />
        </lineSegments>

        {/* Orbital rings: depth cues that read as an observatory instrument. */}
        <group ref={rings}>
          <mesh rotation={[1.15, 0.2, 0.1]}>
            <torusGeometry args={[2.9, 0.006, 8, 180]} />
            <meshBasicMaterial color={palette.silver} transparent opacity={0.18} />
          </mesh>
          <mesh rotation={[0.5, -0.4, 0.9]}>
            <torusGeometry args={[3.3, 0.005, 8, 180]} />
            <meshBasicMaterial color={palette.cyan} transparent opacity={0.16} />
          </mesh>
        </group>

        {layout.hubs.map((hub, ci) => {
          const category = categories[ci];
          return (
            <group key={category?.id ?? ci} position={hub}>
              <mesh>
                <icosahedronGeometry args={[0.14, 1]} />
                <meshStandardMaterial color={palette.graphiteLight} metalness={0.9} roughness={0.3} emissive={palette.cyan} emissiveIntensity={0.25} />
              </mesh>
              {category ? (
                <Html center zIndexRange={[5, 0]} position={[0, 0.32, 0]} style={{ pointerEvents: "none" }}>
                  <div className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-silver-dim">
                    {category.label}
                  </div>
                </Html>
              ) : null}
            </group>
          );
        })}

        {layout.nodes.map((node) => (
          <Node
            key={node.key}
            node={node}
            isActive={highlighted === node.key}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </group>
    </>
  );
}

function Node({
  node,
  isActive,
  onHover,
  onSelect,
}: {
  node: Node;
  isActive: boolean;
  onHover: (key: string | null) => void;
  onSelect: (key: string) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const emphasized = isActive || hovered;

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const target = emphasized ? 1.9 : 1;
    const s = damp(m.scale.x, target, 8, delta);
    m.scale.setScalar(s);
  });

  return (
    <group position={node.position}>
      <mesh
        ref={mesh}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          onHover(node.key);
          setCursor("pointer");
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          setCursor("");
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(node.key);
        }}
      >
        <sphereGeometry args={[0.042, 16, 16]} />
        <meshStandardMaterial
          color={emphasized ? palette.cyan : palette.silver}
          emissive={emphasized ? palette.cyan : "#000000"}
          emissiveIntensity={emphasized ? 2 : 0}
          toneMapped={!emphasized}
        />
      </mesh>
      {emphasized ? (
        <Html center zIndexRange={[40, 0]} position={[0, 0.14, 0]} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full border border-cyan/40 bg-ink/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan backdrop-blur">
            {node.name}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

export default function SkillConstellationScene(props: ConstellationProps) {
  return (
    <SceneCanvas quality={props.quality} active={props.active} cameraPosition={[0, 0, 7.2]} fov={36}>
      <ConstellationContent
        categories={props.categories}
        highlighted={props.highlighted}
        onHover={props.onHover}
        onSelect={props.onSelect}
        quality={props.quality}
      />
    </SceneCanvas>
  );
}
