export type RootStackParamList = {
    IndexScreen: undefined;
    Exercises: { id: number };
    ExerciseDetails: { id: number; programId?: number; exercises: number[] }; // Add programId and exercises
    Content: { id: number };
    Index: undefined;
    TimerScreen : undefined;
    Jumps: undefined;
    Battle: undefined;
    Progress: undefined;
    Profile: undefined;
    SettingScreen: undefined; // For the settings screen
    Friends: undefined;
    Statistics: undefined;
    Academy: undefined;
    LoginRegisterScreen:{ name: string };
    Strengthlog: undefined;
    SettingsScreen: undefined;
    DashboardScreen: undefined;
    Programmes: undefined;
    Home: undefined;
    Login: undefined;
    Register: undefined;
    LoginScreen: undefined;
    LevelScreen: { name: string };
    RegisterScreen: undefined;
    NewProgrammeScreen: undefined;
    Goals: { id: number };
  };

  export const API_URL = 'https://17c3460a900e.ngrok-free.app'; 