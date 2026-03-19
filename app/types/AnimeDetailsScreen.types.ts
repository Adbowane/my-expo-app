import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

export interface Challenge {
  id_challenge: number;
  nom_challenge: string;
  description: string;
  theme: string;
  difficulte: string;
  dure_challenge: string;
}

export interface Exercise {
  Exercise_Id: number;
  Exercise_Name: string;
  Time: string;
}

export type Nav = NativeStackNavigationProp<RootStackParamList>;
export type DetailsRouteProp = RouteProp<RootStackParamList, 'AnimeDetailsScreen'>;
