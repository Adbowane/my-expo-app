import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei/native';
import * as THREE from 'three';

import { AvatarCustomizations, GLTFResult, CharacterProps } from '../types/Character.types';
export * from '../types/Character.types';

// ── Couleurs par défaut ───────────────────────────────────────────────────────

const DEFAULT_CUSTOMIZATIONS: AvatarCustomizations = {
  primaryColor: '#7C3AED',
  secondaryColor: '#4F46E5',
  skinTone: '#C68642',
  gender: 'female',
};

const modelPath = require('../assets/air-squat.glb');

// ── Composant Character ───────────────────────────────────────────────────────

export function Character({
  customizations,
  animationName,
  isPlaying = true,
  ...props
}: CharacterProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(modelPath) as GLTFResult;
  const { actions, names } = useAnimations(animations, group);

  // Fusionner avec les defaults
  const mergedCustom = useMemo(
    () => ({ ...DEFAULT_CUSTOMIZATIONS, ...customizations }),
    [customizations]
  );

  // Cloner le material pour appliquer les couleurs sans modifier l'original
  const customMaterial = useMemo(() => {
    const mat = materials.maria_M1.clone();
    if (mergedCustom.primaryColor) {
      mat.color = new THREE.Color(mergedCustom.primaryColor);
    }
    if (mergedCustom.skinTone) {
      // En production on pourrait avoir un material séparé pour la peau
      // Ici on garde la couleur du material principal pour la tenue
    }
    mat.roughness = 0.6;
    mat.metalness = 0.1;
    return mat;
  }, [materials.maria_M1, mergedCustom.primaryColor]);

  // Gérer l'animation
  useEffect(() => {
    const targetAnim = animationName
      ? names.find((n) => n.toLowerCase().includes(animationName.toLowerCase()))
      : names[0];

    if (targetAnim && actions[targetAnim]) {
      if (isPlaying) {
        actions[targetAnim]?.reset().fadeIn(0.5).play();
      } else {
        actions[targetAnim]!.paused = true;
      }
    } else if (names.length > 0 && actions[names[0]]) {
      if (isPlaying) {
        actions[names[0]]?.reset().fadeIn(0.5).play();
      } else {
        actions[names[0]]!.paused = true;
      }
    }

    return () => {
      names.forEach((name) => actions[name]?.fadeOut(0.5));
    };
  }, [actions, names, animationName, isPlaying]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01} position={[0, -1, 0]}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="Maria_J_J_Ong"
            geometry={nodes.Maria_J_J_Ong.geometry}
            material={customMaterial}
            skeleton={nodes.Maria_J_J_Ong.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(modelPath);
