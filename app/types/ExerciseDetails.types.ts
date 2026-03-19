// Fichier supprimé temporairement
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Interface pour les exercices individuels
export interface Exercise {
  Exercise_Id: number;
  Program_Id: number;
  Exercise_Name: string;
  Image: string;
  Time: string;
  Program_Name?: string;
}

// Type de navigation pour l'écran des détails d'exercice
export type ExerciseDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExerciseDetails'>;
export type ExerciseDetailsRouteProp = RouteProp<RootStackParamList, 'ExerciseDetails'>;
