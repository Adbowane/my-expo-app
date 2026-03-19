import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Goals: { levelId?: number };
  Programmes: { goalId: number };
  LevelScreen: { name: string };
  Home: undefined;
  Profile: undefined;
  DashboardScreen: undefined;
  Exercises: { programId: number };
};

export type GoalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Goals'>;

export type Goal = {
  Goal_Id: number;
  Level_Id: number;
  Goal_Name: string;
  Description: string;
  Image: string;
  ImageGoal: string | null;
  Duration: string;
  Improvement: string;
  Followers: number;
  Impact: string;
  Streak: string;
};
