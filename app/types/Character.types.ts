import * as THREE from 'three';
import { AnimationKey } from '../data/exerciseAnimations';
import { GLTF } from 'three-stdlib';

export interface AvatarCustomizations {
  /** Couleur principale de la tenue (hex) */
  primaryColor?: string;
  /** Couleur secondaire (hex) */
  secondaryColor?: string;
  /** Teinte de peau (hex) */
  skinTone?: string;
  /** Genre sélectionné (pour la sélection UI, pas le mesh) */
  gender?: 'male' | 'female';
  /** Morphologie sélectionnée */
  morphology?: string;
  /** Tenue sélectionnée */
  outfit?: string;
  /** Animation jouée par défaut sur le Dashboard */
  defaultAnimation?: AnimationKey;
}

export type GLTFResult = GLTF & {
  nodes: {
    Maria_J_J_Ong: THREE.SkinnedMesh;
    mixamorigHips: THREE.Bone;
  };
  materials: {
    maria_M1: THREE.MeshStandardMaterial;
  };
};

export interface CharacterProps extends Omit<JSX.IntrinsicElements['group'], 'ref'> {
  customizations?: AvatarCustomizations;
  animationName?: string;
  isPlaying?: boolean;
}
