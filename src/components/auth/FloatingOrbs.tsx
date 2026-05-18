import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface OrbProps {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  scale: number;
  phaseOffset?: number;
}

function Orb({ position, color, speed, distort, scale, phaseOffset = 0 }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phaseOffset;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.4;
    meshRef.current.position.x = position[0] + Math.cos(t * 0.7) * 0.15;
    meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <Sphere ref={meshRef} args={[scale, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        distort={distort}
        speed={speed * 0.8}
        roughness={0.1}
        metalness={0.05}
        transparent
        opacity={0.82}
      />
    </Sphere>
  );
}

export default function FloatingOrbs() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#fff4ee" />
      <pointLight position={[-5, 3, 2]} intensity={0.4} color="#c9a0dc" />
      <pointLight position={[3, -3, 1]} intensity={0.3} color="#f4845f" />

      {/* Main hero orb — large peach */}
      <Orb position={[-1.2, 0.6, -1]} color="#F4845F" speed={0.6} distort={0.35} scale={1.6} phaseOffset={0} />
      {/* Lavender medium */}
      <Orb position={[1.4, -0.8, -0.5]} color="#C9A0DC" speed={0.8} distort={0.4} scale={1.1} phaseOffset={2} />
      {/* Amber small */}
      <Orb position={[0.2, 1.8, -1.5]} color="#F9C784" speed={1.0} distort={0.3} scale={0.75} phaseOffset={4} />
      {/* Soft rose accent */}
      <Orb position={[-2.2, -1.2, -0.8]} color="#FBBCB0" speed={0.5} distort={0.25} scale={0.55} phaseOffset={1} />
      {/* Pale lavender tiny */}
      <Orb position={[2.0, 1.2, -2]} color="#DEC8F0" speed={1.2} distort={0.5} scale={0.45} phaseOffset={3} />
    </Canvas>
  );
}
