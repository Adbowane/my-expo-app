import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

export type LevelScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LevelScreen'>;

export interface Level {
  id: number;
  name: string;
  image?: string;
  isCompleted?: boolean;
  isProcessing?: boolean;
  isLocked?: boolean;
}
