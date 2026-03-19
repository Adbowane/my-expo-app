import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

export interface Challenge {
  id_challenge: number;
  nom_challenge: string;
  theme: string;
  is_vedette?: boolean;
}

export type Nav = NativeStackNavigationProp<RootStackParamList>;
