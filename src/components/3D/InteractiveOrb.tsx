import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface OrbProps {
  position: [number, number, number];
  color: string;
  speed?: number;
}

const InteractiveOrb: React.FC<OrbProps> = ({ position, color, speed = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.2;
      meshRef.current.rotation.y += 0.01 * speed;
      
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[1, 64, 64]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.6}
        distort={0.3}
        speed={2}
        roughness={0.1}
        metalness={0.2}
      />
    </Sphere>
  );
};

interface InteractiveOrbContainerProps {
  className?: string;
  orbCount?: number;
}

const InteractiveOrbContainer: React.FC<InteractiveOrbContainerProps> = ({ 
  className = '', 
  orbCount = 3 
}) => {
  const orbs = Array.from({ length: orbCount }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4
    ] as [number, number, number],
    color: ['#8B5CF6', '#EC4899', '#14B8A6', '#F97316'][i % 4],
    speed: 0.5 + Math.random() * 1
  }));

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        
        {orbs.map((orb, index) => (
          <InteractiveOrb
            key={index}
            position={orb.position}
            color={orb.color}
            speed={orb.speed}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default InteractiveOrbContainer;