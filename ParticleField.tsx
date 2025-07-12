import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    const colors = new Float32Array(1500 * 3);
    
    for (let i = 0; i < 1500; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      
      // Colors - gradient from purple to pink to teal
      const colorIndex = Math.random();
      if (colorIndex < 0.33) {
        // Purple
        colors[i * 3] = 0.545; // R
        colors[i * 3 + 1] = 0.361; // G
        colors[i * 3 + 2] = 0.965; // B
      } else if (colorIndex < 0.66) {
        // Pink
        colors[i * 3] = 0.925; // R
        colors[i * 3 + 1] = 0.286; // G
        colors[i * 3 + 2] = 0.600; // B
      } else {
        // Teal
        colors[i * 3] = 0.078; // R
        colors[i * 3 + 1] = 0.722; // G
        colors[i * 3 + 2] = 0.651; // B
      }
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.03) * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

interface ParticleFieldContainerProps {
  className?: string;
}

const ParticleFieldContainer: React.FC<ParticleFieldContainerProps> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 -z-20 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default ParticleFieldContainer;