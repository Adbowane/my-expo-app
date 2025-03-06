import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/themed';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import tw from 'twrnc';
import { exercises } from '../data/exercises';
import { LinearGradient } from 'expo-linear-gradient';

type LevelScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LevelScreen'>;

const LevelScreen = () => {
  const navigation = useNavigation<LevelScreenNavigationProp>();

  return (
    <ScrollView contentContainerStyle={[tw`p-4`, { backgroundColor: '#1A1B41' }]}>  
      <LinearGradient colors={["#9188F1", "#6A5ACD"]} style={tw`p-5 rounded-xl mb-6`}>
        <Text style={tw`text-3xl font-bold text-white text-center`}>Niveaux</Text>
      </LinearGradient>
      
      {exercises.map((exercise) => (
        <TouchableOpacity 
          key={exercise.id} 
          style={tw`mb-4`} 
          onPress={() => navigation.navigate('ExerciseDetails', { id: exercise.id })}>
          <Card containerStyle={[tw`rounded-xl p-0`, { backgroundColor: '#2D2E6F', borderWidth: 0 }]}> 
            <Card.Title style={tw`text-lg text-white`}>{exercise.name}</Card.Title>
            <Card.Divider style={tw`border-gray-500`} />
            <Image source={exercise.image} style={tw`w-full h-40 rounded-b-xl`} resizeMode="cover" />
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default LevelScreen;
