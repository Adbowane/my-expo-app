import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

export interface Challenge {
  id_challenge: number;
  nom_challenge: string;
  theme: string;
}

export type Nav = NativeStackNavigationProp<RootStackParamList>;
export type SearchRouteProp = RouteProp<RootStackParamList, 'AnimeSearchScreen'>;
