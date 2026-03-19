import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

export interface Challenge {
  id_challenge: number;
  nom_challenge: string;
  description: string;
  theme: string;
  difficulte: string;
  is_animated?: boolean;
  is_vedette?: boolean;
}

export type Nav = NativeStackNavigationProp<RootStackParamList>;
