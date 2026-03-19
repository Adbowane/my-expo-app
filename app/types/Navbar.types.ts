import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';

export type NavigationProp = StackNavigationProp<RootStackParamList>;

export type NavItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  route: keyof RootStackParamList;
  routeParams?: object;
  requiresAuth?: boolean;
};
