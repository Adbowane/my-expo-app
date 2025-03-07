import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/themed';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

type ExerciseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Exercises'>;

const Exercises = () => {
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  
  interface Exercise {
    Exercise_Id: number;
    Program_Id: number;
    Exercise_Name: string;
    Image: string;
    Time : number;
  }

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setError(null);
        const response = await axios.get('http://172.31.16.1:3000/api/exercises');
        setExercises(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des exercices:', err);
        setError('Impossible de récupérer les exercices.');
        Alert.alert('Erreur', 'Impossible de récupérer les exercices.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return (
    <ScrollView contentContainerStyle={tw`p-4 bg-[#1A1B41]`}>
      <LinearGradient colors={['#9188F1', '#6A5ACD']} style={tw`p-5 rounded-xl mb-6`}>
        <Text style={tw`text-3xl font-bold text-white text-center`}>Exercices</Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#9188F1" style={tw`mt-10`} />
      ) : error ? (
        <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
      ) : (
        exercises.map((exercise) => (
          <TouchableOpacity 
            key={exercise.Exercise_Id} 
            style={tw`mb-4`} 
            onPress={() => navigation.navigate('ExerciseDetails', { id: exercise.Exercise_Id })}
          >
            <Card containerStyle={tw`rounded-xl p-4 bg-[#2D2E6F] border-0`}>
              <Text style={tw`text-lg font-bold text-white`}>{exercise.Exercise_Name}</Text>
              <Text style={tw`text-lg font-bold text-white`}>{exercise.Time}</Text>
              <Image 
                    source={{ uri: exercise.Image }} 
                    style={tw`w-full h-40 mt-4`}
                    resizeMode='cover'
                    />
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default Exercises;