import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';

// Définir le type de navigation basé sur RootStackParamList
type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function Navbar() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={tw`flex-row justify-around items-center bg-white border-t border-gray-200 px-4 py-3`}>
      <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate('DashboardScreen')}>
        <Ionicons name="calendar-outline" size={24} color="#888" />
        <Text style={tw`text-xs text-gray-500 mt-1`}>Aujourd'hui</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate('Exercises', { id: 1 })}>
        <Ionicons name="flame-outline" size={24} color="#888" />
        <Text style={tw`text-xs text-gray-500 mt-1`}>Exercices</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={tw`items-center`}>
        <Ionicons name="restaurant-outline" size={24} color="#888" />
        <Text style={tw`text-xs text-gray-500 mt-1`}>Repas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate('SettingsScreen')}>
        <Ionicons name="person-outline" size={24} color="#888" />
        <Text style={tw`text-xs text-gray-500 mt-1`}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
}