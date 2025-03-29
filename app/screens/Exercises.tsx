import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Feather, Ionicons } from '@expo/vector-icons';

// Type de navigation pour l'écran des exercices
type ExerciseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Exercises'>;

// Interface pour les programmes d'entraînement
interface Program {
  Program_Id: number;
  Program_Name: string;
  Goal_Id: number;
}

// Interface pour les exercices individuels
interface Exercise {
  Exercise_Id: number;
  Program_Id: number;
  Exercise_Name: string;
  Image: string;
  Time: string;
}

const Exercises = () => {
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  const route = useRoute();
  const { programId } = route.params as { programId: number };
  
  // États pour gérer les données
  const [program, setProgram] = useState<Program | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer le programme et ses exercices
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les détails du programme
      const programResponse = await axios.get(`http://172.31.16.1:3000/api/programs/${programId}`);
      setProgram(programResponse.data[0]);
      
      // Récupérer les exercices du programme
      const exercisesResponse = await axios.get(`http://172.31.16.1:3000/api/exercises/program/${programId}`);
      setExercises(exercisesResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de récupérer les données.');
      Alert.alert('Erreur', 'Impossible de récupérer les données.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [programId]);

  // Naviguer vers les détails d'un exercice
  const handleExerciseSelect = (exerciseId: number) => {
    navigation.navigate('ExerciseDetails', { id: exerciseId });
  };

  // Commencer l'entraînement
  const handleStartWorkout = () => {
    if (program) {
      navigation.navigate('ExerciseDetails', { id: program.Program_Id });
    }
  };

  // Rendu pendant le chargement
  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#0066ff" />
        <Text style={tw`mt-4 text-lg text-gray-700`}>Chargement des exercices...</Text>
      </SafeAreaView>
    );
  }

  // Rendu en cas d'erreur
  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-white`}>
        <Ionicons name="warning-outline" size={48} color="#ff4444" />
        <Text style={tw`mt-4 text-lg text-gray-700 text-center px-8`}>{error}</Text>
        <TouchableOpacity 
          style={tw`mt-6 bg-violet-600 px-6 py-3 rounded-full`}
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchData();
          }}
        >
          <Text style={tw`text-white font-bold`}>Réessayer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Rendu principal
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />
      
      {/* En-tête avec image */}
      <View style={tw`relative`}>
        {exercises.length > 0 && (
          <Image
            source={{ uri: exercises[0].Image }}
            style={tw`w-full h-48`}
            resizeMode="cover"
          />
        )}
        <View style={tw`absolute top-0 left-0 right-0 p-4 flex-row justify-between items-center`}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={tw`bg-white bg-opacity-20 rounded-full p-2`}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={tw`absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-40`}>
          {program && (
            <>
              <Text style={tw`text-2xl font-bold text-white`}>{program.Program_Name}</Text>
              <Text style={tw`text-white`}>
                {exercises.length} exercices
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Liste des exercices */}
      <ScrollView style={tw`flex-1 bg-white`}>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.Exercise_Id}
            onPress={() => handleExerciseSelect(exercise.Exercise_Id)}
            style={tw`flex-row items-center justify-between p-4 border-b border-gray-200`}
          >
            <View style={tw`flex-row items-center`}>
              <Image
                source={{ uri: exercise.Image }}
                style={tw`w-12 h-12 rounded-lg mr-4`}
                resizeMode="cover"
              />
              <View>
                <Text style={tw`font-medium text-lg`}>{exercise.Exercise_Name}</Text>
                <Text style={tw`text-gray-500`}>
                  {exercise.Time}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="gray" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bouton pour commencer l'entraînement */}
      {exercises.length > 0 && (
        <View style={tw`p-4 bg-white`}>
          <TouchableOpacity
            style={tw`bg-violet-600 py-4 rounded-full`}
            onPress={handleStartWorkout}
          >
            <Text style={tw`text-white text-center font-bold text-lg`}>Commencer l'entraînement</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={tw`flex-row justify-around items-center bg-white border-t border-gray-200 px-4 py-3`}>
        <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate('Today')}>
          <Ionicons name="calendar-outline" size={24} color="#888" />
          <Text style={tw`text-xs text-gray-500 mt-1`}>Aujourd'hui</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate('Workouts')}>
          <Ionicons name="flame-outline" size={24} color="#888" />
          <Text style={tw`text-xs text-gray-500 mt-1`}>Exercices</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={tw`items-center`}>
          <Ionicons name="restaurant-outline" size={24} color="#888" />
          <Text style={tw`text-xs text-gray-500 mt-1`}>Repas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={tw`text-xs text-gray-500 mt-1`}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Exercises;