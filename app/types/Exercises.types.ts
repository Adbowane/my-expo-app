import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

export type ExerciseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Exercises'>;

export interface Program {
  Program_Id: number;
  Program_Name: string;
  Goal_Id: number;
}

export interface Exercise {
  Exercise_Id: number;
  Program_Id: number;
  Exercise_Name: string;
  Image: string;
  Time: string;
}
