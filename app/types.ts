export type RootStackParamList = {
  IndexScreen: undefined;
  Exercises: { programId: number };
  ExerciseDetails: { exerciseId: number; programId?: number; exercises: number[] };
  Content: { id: number };
  Index: undefined;
  TimerScreen: undefined;
  Jumps: undefined;
  Battle: undefined;
  Progress: undefined;
  Profile: undefined;
  SettingScreen: undefined; // For the settings screen
  Friends: undefined;
  Statistics: undefined;
  Academy: undefined;
  LoginRegisterScreen: { name?: string };
  Strengthlog: undefined;
  SettingsScreen: undefined;
  DashboardScreen: undefined;
  Programmes: { goalId: number };
  Home: undefined;
  Login: undefined;
  Register: undefined;
  LoginScreen: undefined;
  LevelScreen: { name: string };
  RegisterScreen: undefined;
  NewProgrammeScreen: undefined;
  Goals: { levelId?: number };
  CharacterScreen: undefined;
  AnimeDiscoverScreen: undefined;
  AnimeSearchScreen: { initialQuery?: string };
  AnimeDetailsScreen: { theme: string; challengeId?: number };
};

// Niveau de fitness (correspond aux valeurs ENUM du backend)
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

// Animes favoris disponibles
export type FavoriteAnime = 'Naruto' | 'Dragon Ball' | 'One Piece' | 'Attack on Titan';

// Données du formulaire de profil (étape 2 de l'inscription)
export interface ProfileFormData {
  fullName: string;
  age: string;
  fitnessLevel: FitnessLevel | null;
  favoriteAnime: FavoriteAnime | null;
}

export const API_URL = 'https://e347-194-11-197-236.ngrok-free.app';