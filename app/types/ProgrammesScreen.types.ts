import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

export type RouteParams = {
  goalId: number;
};

export type ProgrammesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Programmes'>;
export type ProgrammesScreenRouteProp = RouteProp<RootStackParamList, 'Programmes'>;

export type Program = {
  Program_Id: number;
  Program_Name: string;
  Goal_Id: number;
  Icon?: string;
  Description?: string;
};
