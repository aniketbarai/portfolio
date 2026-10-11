"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Edges, Environment, Html, Lightformer, RoundedBox } from "@react-three/drei";
import { damp } from "@/lib/utils";
import type { SectionId } from "@/data/types";
import { SceneCanvas } from "./SceneCanvas";
import { palette, seededRandom, useBrushedRoughness, type SceneQuality } from "./shared";

export interface PointerState {
  x: number;
  y: number;
}

export interface HeroSceneProps {
  active: boolean;
  quality: SceneQuality;
  pointerRef: RefObject<PointerState>;
  /** 0 at the top of the page, 1 once the hero has scrolled away. */
  scrollRef: RefObject<number>;
  onNavigate: (section: SectionId) => void;
}

/* ---------------------------------------------------------------------------
 * Layer: applies depth-based parallax to its children. Objects with a larger
 * `depth` move more with the pointer, which establishes spatial layering.
 * ------------------------------------------------------------------------- */
function Layer({
  depth,
  pointerRef,
  reduced,
  children,
}: {
  depth: number;
  pointerRef: RefObject<PointerState>;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = reduced ? { x: 0, y: 0 } : (pointerRef.current ?? { x: 0, y: 0 });
    g.position.x = damp(g.position.x, p.x * depth * 0.45, 3.2, delta);
    g.position.y = damp(g.position.y, -p.y * depth * 0.3, 3.2, delta);
  });
  return <group ref={group}>{children}</group>;
}

/* ---------------------------------------------------------------------------
 * Interactive label shown on hover. Pointer events are disabled on the label,
 * so it never blocks the object underneath.
 * ------------------------------------------------------------------------- */
function HoverLabel({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Html position={position} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div className="whitespace-nowrap rounded-full border border-cyan/40 bg-ink/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan shadow-[0_0_24px_-6px_rgb(62_232_255/0.6)] backdrop-blur-md">
        {text} <span aria-hidden="true">→</span>
      </div>
    </Html>
  );
}

function setCursor(value: string) {
  if (typeof document !== "undefined") document.body.style.cursor = value;
}

/* ---------------------------------------------------------------------------
 * The monolith: a brushed-metal architectural form with two emissive slits.
 * ------------------------------------------------------------------------- */
function Monolith({
  brushed,
  onNavigate,
  reduced,
}: {
  brushed: THREE.Texture;
  onNavigate: (section: SectionId) => void;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || reduced) return;
    // A slow, almost imperceptible float keeps the monolith alive.
    g.position.y = damp(g.position.y, Math.sin(state.clock.elapsedTime * 0.6) * 0.06, 2, delta);
    g.rotation.y = damp(g.rotation.y, Math.sin(state.clock.elapsedTime * 0.18) * 0.12, 2, delta);
  });

  return (
    <group ref={group}>
      <RoundedBox
        args={[1.3, 3.3, 0.9]}
        radius={0.035}
        smoothness={3}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          setCursor("pointer");
        }}
        onPointerOut={() => {
          setHovered(false);
          setCursor("");
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onNavigate("about");
        }}
      >
        <meshPhysicalMaterial
          color={palette.graphiteLight}
          metalness={0.92}
          roughness={0.42}
          roughnessMap={brushed}
          clearcoat={0.45}
          clearcoatRoughness={0.28}
          envMapIntensity={1.15}
        />
        <Edges color={palette.silver} threshold={18} transparent opacity={hovered ? 0.7 : 0.28} />
      </RoundedBox>

      {/* Emissive slit: the single restrained light source of the monolith. */}
      <mesh position={[0, 0.2, 0.455]}>
        <boxGeometry args={[0.05, 2.5, 0.01]} />
        <meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      <mesh position={[0.36, -1.22, 0.455]}>
        <boxGeometry args={[0.42, 0.025, 0.01]} />
        <meshStandardMaterial color={palette.lime} emissive={palette.lime} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>

      {hovered ? <HoverLabel text="About the developer" position={[0, 2.25, 0]} /> : null}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * Precise orbital rings with a light traveling along the innermost ring.
 * ------------------------------------------------------------------------- */
const RINGS: ReadonlyArray<{ radius: number; tilt: [number, number, number]; speed: number }> = [
  { radius: 2.15, tilt: [1.2, 0.1, 0.2], speed: 0.14 },
  { radius: 2.6, tilt: [1.05, 0.2, -0.35], speed: -0.09 },
  { radius: 3.15, tilt: [1.35, -0.1, 0.5], speed: 0.05 },
];

function OrbitRings({ reduced }: { reduced: boolean }) {
  const refs = useRef<Array<THREE.Group | null>>([]);
  const traveler = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    RINGS.forEach((ring, i) => {
      const g = refs.current[i];
      if (g && !reduced) g.rotation.z += ring.speed * delta;
    });
    const t = traveler.current;
    if (t && !reduced) {
      const a = state.clock.elapsedTime * 0.7;
      t.position.set(Math.cos(a) * RINGS[0]!.radius, Math.sin(a) * RINGS[0]!.radius, 0);
    }
  });

  return (
    <group>
      {RINGS.map((ring, i) => (
        <group key={ring.radius} rotation={ring.tilt} ref={(el) => {
          refs.current[i] = el;
        }}>
          <mesh>
            <torusGeometry args={[ring.radius, 0.0075, 12, 240]} />
            <meshStandardMaterial color={palette.silver} metalness={1} roughness={0.22} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
      <mesh ref={traveler} rotation={RINGS[0]!.tilt}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * Floating glass panels. Each one opens a section when clicked.
 * ------------------------------------------------------------------------- */
interface PanelConfig {
  section: SectionId;
  label: string;
  position: [number, number, number];
  size: [number, number];
  rotation: [number, number, number];
  depth: number;
  phase: number;
}

const PANELS: readonly PanelConfig[] = [
  { section: "projects", label: "Selected projects", position: [-2.35, 1.05, 0.9], size: [1.05, 1.35], rotation: [0.08, 0.55, -0.12], depth: 1.1, phase: 0 },
  { section: "skills", label: "Skills constellation", position: [2.45, -0.55, -0.6], size: [1.2, 0.82], rotation: [-0.1, -0.45, 0.08], depth: 0.7, phase: 1.7 },
  { section: "experience", label: "Experience timeline", position: [-2.1, -1.55, 0.4], size: [1.25, 0.8], rotation: [0.05, 0.35, 0.1], depth: 1.4, phase: 3.1 },
];

function GlassPanel({
  config,
  onNavigate,
  reduced,
}: {
  config: PanelConfig;
  onNavigate: (section: SectionId) => void;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [w, h] = config.size;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    const targetY = config.position[1] + Math.sin(t * 0.5 + config.phase) * 0.09;
    g.position.y = damp(g.position.y, targetY, 3, delta);
    const targetScale = hovered ? 1.06 : 1;
    g.scale.setScalar(damp(g.scale.x, targetScale, 6, delta));
    g.rotation.y = damp(g.rotation.y, config.rotation[1] + (hovered ? 0.12 : 0), 4, delta);
  });

  return (
    <group ref={group} position={config.position} rotation={config.rotation}>
      <RoundedBox
        args={[w, h, 0.03]}
        radius={0.04}
        smoothness={2}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          setCursor("pointer");
        }}
        onPointerOut={() => {
          setHovered(false);
          setCursor("");
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onNavigate(config.section);
        }}
      >
        <meshPhysicalMaterial
          color="#d7e3ef"
          transparent
          opacity={hovered ? 0.3 : 0.16}
          roughness={0.05}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.8}
          depthWrite={false}
        />
        <Edges color={palette.silver} transparent opacity={hovered ? 0.85 : 0.45} />
      </RoundedBox>
      {/* Accent line along the lower edge. */}
      <mesh position={[-w / 2 + 0.12, -h / 2 + 0.1, 0.02]}>
        <boxGeometry args={[w * 0.3, 0.012, 0.005]} />
        <meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={hovered ? 2.5 : 1} toneMapped={false} />
      </mesh>
      {hovered ? <HoverLabel text={config.label} position={[0, h / 2 + 0.22, 0]} /> : null}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * Luminous geometric fragments scattered through the volume. One is an
 * entry point to the contact section; the rest are decorative.
 * ------------------------------------------------------------------------- */
function Fragments({ count, reduced, onNavigate }: { count: number; reduced: boolean; onNavigate: (s: SectionId) => void }) {
  const items = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: count }, (_, i) => {
      const angle = rand() * Math.PI * 2;
      const radius = 2.4 + rand() * 2.4;
      return {
        key: i,
        position: [Math.cos(angle) * radius, (rand() - 0.5) * 3.6, Math.sin(angle) * radius * 0.6 - 0.5] as [number, number, number],
        scale: 0.6 + rand() * 1.4,
        speed: 0.2 + rand() * 0.4,
        lit: rand() > 0.72,
        interactive: i === 0,
      };
    });
  }, [count]);

  return (
    <>
      {items.map((item) => (
        <Fragment3D
          key={item.key}
          position={item.position}
          scale={item.scale}
          speed={item.speed}
          lit={item.lit}
          interactive={item.interactive}
          reduced={reduced}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
}

function Fragment3D({
  position,
  scale,
  speed,
  lit,
  interactive,
  reduced,
  onNavigate,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  lit: boolean;
  interactive: boolean;
  reduced: boolean;
  onNavigate: (s: SectionId) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m || reduced) return;
    m.rotation.x += speed * delta * 0.6;
    m.rotation.y += speed * delta;
  });

  return (
    <group position={position} scale={scale}>
      <mesh
        ref={mesh}
        onPointerOver={
          interactive
            ? (e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHovered(true);
                setCursor("pointer");
              }
            : undefined
        }
        onPointerOut={
          interactive
            ? () => {
                setHovered(false);
                setCursor("");
              }
            : undefined
        }
        onClick={
          interactive
            ? (e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onNavigate("contact");
              }
            : undefined
        }
      >
        <octahedronGeometry args={[0.09, 0]} />
        {lit || interactive ? (
          <meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={interactive ? 2.4 : 1.2} toneMapped={false} />
        ) : (
          <meshStandardMaterial color={palette.silver} metalness={1} roughness={0.2} />
        )}
      </mesh>
      {interactive && hovered ? <HoverLabel text="Start a conversation" position={[0, 0.35, 0]} /> : null}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * Ambient particles: a sparse, slowly drifting field for depth.
 * ------------------------------------------------------------------------- */
function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rand = seededRandom(9);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 13;
      arr[i * 3 + 1] = (rand() - 0.5) * 9;
      arr[i * 3 + 2] = (rand() - 0.5) * 9 - 1;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current && !reduced) points.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={palette.silver} size={0.022} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

/* ---------------------------------------------------------------------------
 * Camera rig: eases toward a pointer-driven offset and a scroll-driven
 * position, so the view drifts with the mouse and travels as the page scrolls.
 * ------------------------------------------------------------------------- */
function CameraRig({
  pointerRef,
  scrollRef,
  reduced,
}: {
  pointerRef: RefObject<PointerState>;
  scrollRef: RefObject<number>;
  reduced: boolean;
}) {
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const camera = state.camera;
    const p = reduced ? { x: 0, y: 0 } : (pointerRef.current ?? { x: 0, y: 0 });
    const s = scrollRef.current ?? 0;
    const targetX = p.x * 0.35;
    const targetY = 0.35 + p.y * 0.2 - s * 1.9;
    const targetZ = 7.1 + s * 2.6;
    camera.position.x = damp(camera.position.x, targetX, 2.4, delta);
    camera.position.y = damp(camera.position.y, targetY, 2.4, delta);
    camera.position.z = damp(camera.position.z, targetZ, 2.4, delta);
    look.set(0, -0.15 - s * 0.9, 0);
    camera.lookAt(look);
  });

  return null;
}

/* ---------------------------------------------------------------------------
 * Scene root
 * ------------------------------------------------------------------------- */
function HeroSceneContent({
  quality,
  pointerRef,
  scrollRef,
  onNavigate,
}: Omit<HeroSceneProps, "active">) {
  const brushed = useBrushedRoughness(11);
  const reduced = quality.reduced;
  const offsetX = quality.mobile ? 0 : 1.35;
  const scale = quality.mobile ? 0.78 : 1;
  const fragmentCount = quality.mobile ? 6 : 16;

  return (
    <>
      <CameraRig pointerRef={pointerRef} scrollRef={scrollRef} reduced={reduced} />

      <ambientLight intensity={0.22} color="#8ea3b8" />
      <directionalLight position={[4, 6, 5]} intensity={1.5} color="#e6eef7" />
      <spotLight
        position={[-5, 3.5, 4]}
        angle={0.5}
        penumbra={1}
        intensity={38}
        color={palette.cyan}
        distance={24}
      />
      <pointLight position={[2.6, -2.4, 3]} intensity={5} color={palette.lime} distance={12} />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[5, 1.5, -1]} rotation={[0, Math.PI / 2, 0]} scale={[2.5, 9, 1]} color="#e3edf7" />
        <Lightformer form="rect" intensity={0.6} position={[-4, 2, 3]} scale={[4, 2, 1]} color={palette.cyan} />
        <Lightformer form="ring" intensity={1.2} position={[0, 4, -3]} scale={5} color="#ffffff" />
      </Environment>

      <group position={[offsetX, quality.mobile ? 1.15 : 0, 0]} scale={scale}>
        <Layer depth={0.35} pointerRef={pointerRef} reduced={reduced}>
          <Monolith brushed={brushed} onNavigate={onNavigate} reduced={reduced} />
        </Layer>

        <Layer depth={0.7} pointerRef={pointerRef} reduced={reduced}>
          <OrbitRings reduced={reduced} />
        </Layer>

        {PANELS.map((panel) => (
          <Layer key={panel.section} depth={panel.depth} pointerRef={pointerRef} reduced={reduced}>
            <GlassPanel config={panel} onNavigate={onNavigate} reduced={reduced} />
          </Layer>
        ))}

        <Layer depth={1.5} pointerRef={pointerRef} reduced={reduced}>
          <Fragments count={fragmentCount} reduced={reduced} onNavigate={onNavigate} />
        </Layer>
      </group>

      <Layer depth={0.15} pointerRef={pointerRef} reduced={reduced}>
        <Particles count={quality.particles} reduced={reduced} />
      </Layer>
    </>
  );
}

export default function HeroScene(props: HeroSceneProps) {
  return (
    <SceneCanvas quality={props.quality} active={props.active} cameraPosition={[0, 0.35, 7.1]} fov={34}>
      <HeroSceneContent
        quality={props.quality}
        pointerRef={props.pointerRef}
        scrollRef={props.scrollRef}
        onNavigate={props.onNavigate}
      />
    </SceneCanvas>
  );
}
