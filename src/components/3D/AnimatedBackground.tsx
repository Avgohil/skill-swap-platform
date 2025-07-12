import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedParticles: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8B5CF6"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

const FloatingGeometry: React.FC<{ position: [number, number, number]; color: string }> = ({ position, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </Float>
  );
};

const WaveGeometry: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = Math.sin(x * 0.5 + state.clock.elapsedTime) * 0.3 + 
                          Math.cos(y * 0.5 + state.clock.elapsedTime * 0.7) * 0.2;
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[20, 20, 50, 50]} />
      <meshStandardMaterial
        color="#EC4899"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
};

interface AnimatedBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  className = '', 
  intensity = 'medium' 
}) => {
  const geometryCount = intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8;
  
  const geometries = useMemo(() => {
    const colors = ['#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'];
    return Array.from({ length: geometryCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      color: colors[i % colors.length]
    }));
  }, [geometryCount]);

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#8B5CF6" />
        
        <AnimatedParticles />
        <WaveGeometry />
        
        {geometries.map((geo, index) => (
          <FloatingGeometry
            key={index}
            position={geo.position}
            color={geo.color}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;