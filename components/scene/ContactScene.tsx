"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { damp } from "@/lib/utils";
import { SceneCanvas } from "./SceneCanvas";
import { palette, seededRandom, type SceneQuality } from "./shared";

/** Luminous central structure with drifting particles, used behind the contact section. */
function ContactContent({ quality }: { quality: SceneQuality }) {
  const core = useRef<THREE.Group>(null);
  const particles = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rand = seededRandom(77);
    const count = quality.mobile ? 120 : 320;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 12;
      arr[i * 3 + 1] = (rand() - 0.5) * 7;
      arr[i * 3 + 2] = (rand() - 0.5) * 6 - 1;
    }
    return arr;
  }, [quality.mobile]);

  useFrame((state, delta) => {
    if (quality.reduced) return;
    if (core.current) {
      core.current.rotation.y += delta * 0.09;
      core.current.rotation.x = damp(core.current.rotation.x, state.pointer.y * 0.2, 2.5, delta);
    }
    if (particles.current) particles.current.rotation.y -= delta * 0.01;
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 4]} intensity={8} color={palette.cyan} distance={14} />
      <group ref={core} position={[0, 0, 0]}>
        <mesh>
          <octahedronGeometry args={[0.85, 0]} />
          <meshPhysicalMaterial color={palette.graphite} metalness={0.9} roughness={0.25} transparent opacity={0.6} depthWrite={false} />
          <Edges color={palette.cyan} transparent opacity={0.85} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.28, 1]} />
          <meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
        <mesh rotation={[1.2, 0.3, 0]}>
          <torusGeometry args={[1.45, 0.006, 8, 200]} />
          <meshBasicMaterial color={palette.silver} transparent opacity={0.25} />
        </mesh>
        <mesh rotation={[0.4, 1.1, 0.5]}>
          <torusGeometry args={[1.8, 0.005, 8, 200]} />
          <meshBasicMaterial color={palette.lime} transparent opacity={0.12} />
        </mesh>
      </group>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={palette.silver} size={0.02} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
      </points>
    </>
  );
}

export default function ContactScene({ quality, active }: { quality: SceneQuality; active: boolean }) {
  return (
    <SceneCanvas quality={quality} active={active} cameraPosition={[0, 0, 6]} fov={36}>
      <ContactContent quality={quality} />
    </SceneCanvas>
  );
}
