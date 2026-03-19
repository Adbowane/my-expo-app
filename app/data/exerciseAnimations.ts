export const EXERCISE_ANIMATION_MAP: Record<string, string> = {
  // Clé = partie du nom d'exercice (lowercase)   Valeur = nom de piste dans le GLB
  squat: 'AirSquat',
  'air squat': 'AirSquat',
  // Extensible facilement quand de nouveaux .glb arrivent
};

/** Retrouve la clé d'animation à partir du nom d'exercice */
export function getAnimationKey(exerciseName: string): string | undefined {
  const lower = exerciseName.toLowerCase();
  return Object.entries(EXERCISE_ANIMATION_MAP).find(([key]) => lower.includes(key))?.[1];
}
