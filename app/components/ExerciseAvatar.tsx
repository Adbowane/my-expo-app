import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei/native';
import { Character } from './Character';
import { useAvatar } from '../context/AvatarContext';

interface ExerciseAvatarProps {
  animationName?: string;
  isPlaying?: boolean;
}

export function ExerciseAvatar({ animationName, isPlaying = true }: ExerciseAvatarProps) {
  const { customizations } = useAvatar();

  return (
    <Canvas style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <Suspense fallback={null}>
        <Character
          customizations={customizations}
          animationName={animationName}
          isPlaying={isPlaying}
        />
      </Suspense>
    </Canvas>
  );
}
