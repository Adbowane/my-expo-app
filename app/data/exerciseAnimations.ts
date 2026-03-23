// ── Registry de toutes les animations disponibles ───────────────────────────
// Chaque clé correspond à un fichier GLB dans app/assets/

export type AnimationKey =
  | 'air-squat'
  | 'back-squat'
  | 'air-squat-bent'
  | 'bicycle-crunch'
  | 'circle-crunch'
  | 'idle'
  | 'overhead-squat'
  | 'push-up'
  | 'situps'
  | 'jumping-jacks-start'
  | 'jumping-jacks-stop';

/** Mappage clé → fichier GLB (require statique requis par Metro bundler) */
export const ANIMATION_FILES: Record<AnimationKey, any> = {
  'air-squat': require('../assets/air-squat.glb'),
  'air-squat-bent': require('../assets/Air Squat Bent Arms.glb'),
  'bicycle-crunch': require('../assets/Bicycle Crunch.glb'),
  'back-squat': require('../assets/Back Squat.glb'),
  'circle-crunch': require('../assets/Circle Crunch.glb'),
  'idle': require('../assets/Idle Transition.glb'),
  'overhead-squat': require('../assets/Overhead Squat.glb'),
  'push-up': require('../assets/Push Up To Idle.glb'),
  'situps': require('../assets/Situps.glb'),
  'jumping-jacks-start': require('../assets/Start Jumping Jacks.glb'),
  'jumping-jacks-stop': require('../assets/Stop Jumping Jacks.glb'),
};

/** Labels affichés dans le sélecteur UI */
export const ANIMATION_LABELS: Record<AnimationKey, string> = {
  'air-squat': '⬇️ Squat',
  'air-squat-bent': '⬇️ Squat Bent',
  'back-squat': '⬇️ Back Squat',
  'bicycle-crunch': '🚴 Bicycle',
  'circle-crunch': '🔄 Crunch',
  'idle': '🧘 Idle',
  'overhead-squat': '🏋️ Overhead',
  'push-up': '💪 Push-up',
  'situps': '🏃 Sit-up',
  'jumping-jacks-start': '🤸 Jumping Jack',
  'jumping-jacks-stop': '🛑 Stop J.Jack',
};

/** Animations proposées dans le sélecteur Dashboard Skin */
export const DASHBOARD_ANIMATIONS: AnimationKey[] = [
  'idle',
  'air-squat',
  'push-up',
  'jumping-jacks-start',
  'situps',
  'bicycle-crunch',
  'back-squat',
];

// ── Mapping nom d'exercice → animation ──────────────────────────────────────

const EXERCISE_ANIMATION_MAP: Array<{ keywords: string[]; anim: AnimationKey }> = [
  { keywords: ['overhead squat', 'overhead'], anim: 'overhead-squat' },
  { keywords: ['air squat bent', 'squat bent'], anim: 'air-squat-bent' },
  { keywords: ['squat', 'air squat'], anim: 'air-squat' },
  { keywords: ['bicycle crunch', 'bicycle'], anim: 'bicycle-crunch' },
  { keywords: ['circle crunch', 'crunch'], anim: 'circle-crunch' },
  { keywords: ['sit-up', 'situp', 'abdo', 'abdos'], anim: 'situps' },
  { keywords: ['push-up', 'pushup', 'pompe'], anim: 'push-up' },
  { keywords: ['jumping jack', 'jumping jacks'], anim: 'jumping-jacks-start' },
  { keywords: ['repos', 'idle', 'rest'], anim: 'idle' },
];

/** Retrouve la clé d'animation à partir du nom de l'exercice */
export function getAnimationKey(exerciseName: string): AnimationKey | undefined {
  const lower = exerciseName.toLowerCase();
  for (const { keywords, anim } of EXERCISE_ANIMATION_MAP) {
    if (keywords.some((k) => lower.includes(k))) return anim;
  }
  return undefined;
}
