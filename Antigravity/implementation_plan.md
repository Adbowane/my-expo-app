# Avatar Animé dans ExerciseDetails

## Contexte

Actuellement, [ExerciseDetails.tsx](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/screens/ExerciseDetails.tsx) affiche une **image statique** (`exercise.Image` depuis l'API) pour montrer comment l'exercice se fait. L'objectif est de **remplacer cette image par le personnage 3D personnalisé de l'utilisateur** (avec ses couleurs de tenue) qui **joue l'animation de l'exercice** en temps réel via Three.js.

### Contrainte principale — assets
Il n'y a actuellement qu'**un seul fichier [.glb](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/assets/air-squat.glb)** : [air-squat.glb](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/assets/air-squat.glb) qui contient 1 animation (Air Squat).

> [!IMPORTANT]
> Pour que chaque exercice ait sa propre animation, il faudrait un [.glb](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/assets/air-squat.glb) par exercice ou un [.glb](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/assets/air-squat.glb) multi-animations. Avec un seul fichier, **tous les exercices joueront la même animation** (air squat), sauf si on ajoute d'autres [.glb](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/assets/air-squat.glb) par la suite.
> Le plan prévoit une **map exercice → clé d'animation** extensible dès le départ.

---

## Proposed Changes

### Composant réutilisable

#### [NEW] ExerciseAvatar.tsx
`c:\Users\bayes\FitnessAnimReactV3\my-expo-app\app\components\ExerciseAvatar.tsx`

Composant Three.js dédié aux exercices. Encapsule :
- `Canvas` + lumières + `Suspense`
- [Character](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/components/Character.tsx#51-110) avec les customisations de l'utilisateur (via [useAvatar()](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/context/AvatarContext.tsx#133-138))
- Reçoit une prop `animationName?: string` pour cibler une piste d'animation spécifique dans le [.glb](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/assets/air-squat.glb)
- Gère le démarrage/pause de l'animation en sync avec le timer (`isPlaying: boolean`)

```
<ExerciseAvatar
  animationName="AirSquat"   // ou undefined → joue la 1ère piste
  isPlaying={isTimerRunning}
/>
```

#### [MODIFY] Character.tsx
[c:\Users\bayes\FitnessAnimReactV3\my-expo-app\app\components\Character.tsx](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/components/Character.tsx)

Ajouter une prop `isPlaying?: boolean` pour pauseables animations (via `action.paused = !isPlaying`).

---

### Table de correspondance exercice → animation

#### [NEW] exerciseAnimations.ts
`c:\Users\bayes\FitnessAnimReactV3\my-expo-app\app\data\exerciseAnimations.ts`

```ts
export const EXERCISE_ANIMATION_MAP: Record<string, string> = {
  // Clé = partie du nom d'exercice (lowercase)   Valeur = nom de piste dans le GLB
  'squat':        'AirSquat',
  'air squat':    'AirSquat',
  // Extensible facilement quand de nouveaux .glb arrivent
};

/** Retrouve la clé d'animation à partir du nom d'exercice */
export function getAnimationKey(exerciseName: string): string | undefined {
  const lower = exerciseName.toLowerCase();
  return Object.entries(EXERCISE_ANIMATION_MAP).find(
    ([key]) => lower.includes(key)
  )?.[1];
}
```

---

### Écran principal

#### [MODIFY] ExerciseDetails.tsx
[c:\Users\bayes\FitnessAnimReactV3\my-expo-app\app\screens\ExerciseDetails.tsx](file:///c:/Users/bayes/FitnessAnimReactV3/my-expo-app/app/screens/ExerciseDetails.tsx)

- Remplacer le bloc `<Image source={{ uri: exercise.Image }} />` par `<ExerciseAvatar>`
- Passer `animationName` depuis `getAnimationKey(exercise.Exercise_Name)`
- Passer `isPlaying={isTimerRunning}` pour synchroniser l'animation avec le timer
- Si aucune animation trouvée → fallback sur l'image statique existante
- Amélioration visuelle : fond coloré derrière le Canvas (dégradé violet cohérent avec le reste de l'app)

---

## Comportement attendu

| Situation | Ce qui s'affiche |
|---|---|
| Exercice = "Air Squat" | Avatar 3D personnalisé qui loop l'animation AirSquat |
| Timer en pause | Animation pausée (personnage figé) |
| Timer en cours | Animation jouée en boucle |
| Exercice sans animation connue | Fallback image statique (`exercise.Image`) |
| Utilisateur non connecté | Avatar avec couleurs par défaut (violet) |

---

## Verification Plan

### Test manuel (étapes précises)
1. Lancer le frontend Expo : `npx expo start` dans `c:\Users\bayes\FitnessAnimReactV3\my-expo-app`
2. Se connecter avec un compte existant
3. Naviguer vers un niveau → objectif → programme → exercice
4. **Vérifier** : le Canvas 3D s'affiche à la place de l'image, le personnage a les couleurs de tenue configurées
5. Appuyer sur **Play** → l'animation démarre
6. Appuyer sur **Pause** → le personnage se fige
7. Attendre la fin du timer → passage à l'exercice suivant, nouvel avatar chargé

### Vérification fallback
8. Modifier temporairement un exercice pour avoir un nom sans correspondance connue → vérifier que l'image statique s'affiche à la place du Canvas
