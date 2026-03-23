import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei/native';
import * as THREE from 'three';

import { AvatarCustomizations, GLTFResult, CharacterProps } from '../types/Character.types';
import { ANIMATION_FILES, AnimationKey } from '../data/exerciseAnimations';
import { GLTF } from 'three-stdlib';
export * from '../types/Character.types';

// ── Fichier mesh principal (contient le squelette + skinned mesh) ─────────────
const MESH_MODEL = require('../assets/air-squat.glb');

// ── Couleurs par défaut ───────────────────────────────────────────────────────
const DEFAULT_CUSTOMIZATIONS: AvatarCustomizations = {
  primaryColor: '#7C3AED',
  secondaryColor: '#4F46E5',
  skinTone: '#C68642',
  gender: 'female',
};

// ── Composant Character ───────────────────────────────────────────────────────

export function Character({
  customizations,
  animationName,
  isPlaying = true,
  ...props
}: CharacterProps) {
  const group = useRef<THREE.Group>(null);

  // Charger le mesh principal (toujours air-squat.glb pour les nodes/materials)
  const { nodes, materials } = useGLTF(MESH_MODEL) as GLTFResult;

  // Charger le GLB correspondant à l'animation demandée
  const animKey = (animationName as AnimationKey) ?? 'idle';
  const animFile = ANIMATION_FILES[animKey] ?? ANIMATION_FILES['idle'];
  const animResult = useGLTF(animFile) as GLTF & { animations: THREE.AnimationClip[] };
  const { animations } = animResult;

  // Connecter les animations au groupe du mesh
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
    mat.roughness = 0.6;
    mat.metalness = 0.1;
    return mat;
  }, [materials.maria_M1, mergedCustom.primaryColor]);

  // Gérer la lecture de l'animation
  useEffect(() => {
    if (names.length === 0) return;

    // Priorité : 1er clip du GLB chargé (chaque GLB n'en a qu'un)
    const targetName = names[0];

    if (actions[targetName]) {
      if (isPlaying) {
        actions[targetName]?.reset().fadeIn(0.3).play();
      } else {
        actions[targetName]!.paused = true;
      }
    }

    return () => {
      names.forEach((name) => actions[name]?.fadeOut(0.3));
    };
  }, [actions, names, animKey, isPlaying]);

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

// Précharger tous les GLB d'animation au démarrage
useGLTF.preload(MESH_MODEL);
Object.values(ANIMATION_FILES).forEach((file) => useGLTF.preload(file));
