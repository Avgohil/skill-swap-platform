import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface SkillSphereProps {
  position: [number, number, number];
  skill: string;
  color: string;
}

const SkillSphere: React.FC<SkillSphereProps> = ({ position, skill, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={meshRef} castShadow receiveShadow>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.8}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
        <group ref={textRef} position={[0, 0, 0.9]}>
          <Text
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-bold.woff"
          >
            {skill}
          </Text>
        </group>
      </group>
    </Float>
  );
};

interface FloatingSkillsProps {
  skills: string[];
  className?: string;
}

const FloatingSkills: React.FC<FloatingSkillsProps> = ({ skills, className = '' }) => {
  const skillPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const colors = ['#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#EF4444'];
    
    skills.slice(0, 6).forEach((_, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 3;
      const z = Math.sin(angle) * radius;
      positions.push([x, y, z]);
    });
    
    return positions.map((pos, index) => ({
      position: pos,
      color: colors[index % colors.length]
    }));
  }, [skills]);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        shadows
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#8B5CF6" />
        
        {skills.slice(0, 6).map((skill, index) => (
          <SkillSphere
            key={skill}
            position={skillPositions[index]?.position || [0, 0, 0]}
            skill={skill}
            color={skillPositions[index]?.color || '#8B5CF6'}
          />
        ))}
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default FloatingSkills;