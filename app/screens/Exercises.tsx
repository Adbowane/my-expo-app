import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  Duration: number;
  Exercise_Count: number;
  Image: string;
}

// Interface pour les exercices individuels
interface Exercise {
  Exercise_Id: number;
  Program_Id: number;
  Exercise_Name: string;
  Image: string;
  Time: number;
  Reps?: number;
}

const Exercises = () => {
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  
  // États pour gérer les données
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'programs' | 'overview'>('programs');

  // Récupérer les programmes d'entraînement
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setError(null);
        // Exemple de données simulées pour les programmes
        // Dans une application réelle, cela viendrait de votre API
        const dummyPrograms: Program[] = [
          {
            Program_Id: 1,
            Program_Name: "ABDOS DÉBUTANT",
            Duration: 20,
            Exercise_Count: 16,
            Image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          {
            Program_Id: 2,
            Program_Name: "JAMBES INTERMÉDIAIRE",
            Duration: 30,
            Exercise_Count: 12,
            Image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          {
            Program_Id: 3,
            Program_Name: "FULL BODY AVANCÉ",
            Duration: 45,
            Exercise_Count: 20,
            Image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          }
        ];
        setPrograms(dummyPrograms);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des programmes:', err);
        setError('Impossible de récupérer les programmes.');
        Alert.alert('Erreur', 'Impossible de récupérer les programmes.');
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Récupérer les exercices pour un programme spécifique
  const fetchExercisesForProgram = async (programId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Dans une application réelle, vous feriez un appel API comme:
      // const response = await axios.get(`http://172.31.16.1:3000/api/exercises?programId=${programId}`);
      
      // Exemple de données simulées pour les exercices
      const dummyExercises: Exercise[] = [
        {
          Exercise_Id: 1,
          Program_Id: programId,
          Exercise_Name: "Crunch abdominal",
          Image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          Time: 0,
          Reps: 16
        },
        {
          Exercise_Id: 2,
          Program_Id: programId,
          Exercise_Name: "Jumping jacks",
          Image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          Time: 20,
          Reps: 0
        },
        {
          Exercise_Id: 3,
          Program_Id: programId,
          Exercise_Name: "Twist russe",
          Image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          Time: 0,
          Reps: 20
        },
        {
          Exercise_Id: 4,
          Program_Id: programId,
          Exercise_Name: "Escalade",
          Image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          Time: 0,
          Reps: 16
        },
        {
          Exercise_Id: 5,
          Program_Id: programId,
          Exercise_Name: "Toucher les talons",
          Image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          Time: 0,
          Reps: 20
        }
      ];
      
      setExercises(dummyExercises);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des exercices:', err);
      setError('Impossible de récupérer les exercices.');
      Alert.alert('Erreur', 'Impossible de récupérer les exercices.');
      setLoading(false);
    }
  };

  // Sélectionner un programme et afficher ses exercices
  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    fetchExercisesForProgram(program.Program_Id);
    setViewMode('overview');
  };

  // Revenir à la liste des programmes
  const handleBackToPrograms = () => {
    setViewMode('programs');
    setSelectedProgram(null);
  };

  // Naviguer vers les détails d'un exercice
  const handleExerciseSelect = (exerciseId: number) => {
    navigation.navigate('ExerciseDetails', { id: exerciseId });
  };

  // Commencer l'entraînement
  const handleStartWorkout = () => {
    if (selectedProgram) {
      // Naviguer vers un écran pour commencer l'entraînement complet
      Alert.alert('Démarrage', `Démarrage du programme ${selectedProgram.Program_Name}`);
      // navigation.navigate('WorkoutSession', { programId: selectedProgram.Program_Id });
    }
  };

  // Rendu de la liste des programmes
  const renderProgramsList = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0066ff" style={tw`mt-10`} />;
    }

    if (error) {
      return <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>;
    }

    return (
      <ScrollView contentContainerStyle={tw`p-4`}>
        <LinearGradient colors={['#9188F1', '#9188F1']} style={tw`p-5 rounded-60 mb-6`}>
          <Text style={tw`text-2xl font-bold text-white text-center`}>Programmes</Text>
        </LinearGradient>

        {programs.map((program) => (
          <TouchableOpacity
            key={program.Program_Id}
            style={tw`mb-4`}
            onPress={() => handleProgramSelect(program)}
          >
            <View style={tw`bg-white rounded-xl overflow-hidden shadow-md`}>
              <Image
                source={{ uri: program.Image }}
                style={tw`w-full h-40`}
                resizeMode="cover"
              />
              <View style={tw`p-4`}>
                <Text style={tw`text-xl font-bold text-gray-800`}>{program.Program_Name}</Text>
                <Text style={tw`text-gray-600`}>
                  {program.Duration} min • {program.Exercise_Count} exercices
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
         {/* Bottom Navigation */}
      <View style={tw`absolute bottom-0 left-0 right-0 h-20 flex-row justify-around items-center bg-white border-t border-gray-200 px-4`}>
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
      </ScrollView>
    );
  };

  // Rendu de la vue d'ensemble des exercices
  const renderExerciseOverview = () => {
    if (!selectedProgram) return null;

    if (loading) {
      return <ActivityIndicator size="large" color="#0066ff" style={tw`mt-10`} />;
    }

    if (error) {
      return <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>;
    }

    return (
      <View style={tw`flex-1`}>
        {/* En-tête avec image */}
        <View style={tw`relative`}>
          <Image
            source={{ uri: selectedProgram.Image }}
            style={tw`w-full h-48`}
            resizeMode="cover"
          />
          <View style={tw`absolute top-0 left-0 right-0 p-4 flex-row justify-between items-center`}>
            <TouchableOpacity onPress={handleBackToPrograms} style={tw`bg-white bg-opacity-20 rounded-full p-2`}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`bg-white bg-opacity-20 rounded-full p-2`}>
              <Feather name="more-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={tw`absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-40`}>
            <Text style={tw`text-2xl font-bold text-white`}>{selectedProgram.Program_Name}</Text>
            <Text style={tw`text-white`}>
              {selectedProgram.Duration} min • {selectedProgram.Exercise_Count} exercices
            </Text>
          </View>
        </View>

        {/* Durée et nombre d'exercices avec bouton modifier */}
        <View style={tw`flex-row justify-between items-center p-4 bg-white`}>
          <Text style={tw`text-lg font-medium`}>
            {selectedProgram.Duration} min • {selectedProgram.Exercise_Count} exercices
          </Text>
          <TouchableOpacity>
            <Text style={tw`text-blue-600 font-medium`}>Modifier</Text>
          </TouchableOpacity>
        </View>

        {/* Liste des exercices */}
        <ScrollView style={tw`flex-1 bg-white`}>
          {exercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.Exercise_Id}
              onPress={() => handleExerciseSelect(exercise.Exercise_Id)}
              style={tw`flex-row items-center justify-between p-4 border-b border-gray-200`}
            >
              <View style={tw`flex-row items-center`}>
                <TouchableOpacity style={tw`mr-4`}>
                  <Feather name="menu" size={20} color="gray" />
                </TouchableOpacity>
                <Image
                  source={{ uri: exercise.Image }}
                  style={tw`w-12 h-12 rounded-lg mr-4`}
                  resizeMode="cover"
                />
                <View>
                  <Text style={tw`font-medium text-lg`}>{exercise.Exercise_Name}</Text>
                  <Text style={tw`text-gray-500`}>
                    {exercise.Time > 0 ? `00:${exercise.Time.toString().padStart(2, '0')}` : `x${exercise.Reps}`}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="repeat" size={20} color="gray" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bouton pour commencer l'entraînement */}
        <View style={tw`p-4 bg-white`}>
          <TouchableOpacity
            style={tw`bg-violet-600 py-4 rounded-full`}
            onPress={handleStartWorkout}
          >
            <Text style={tw`text-white text-center font-bold text-lg`}>Début</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />
      {viewMode === 'programs' ? renderProgramsList() : renderExerciseOverview()}
    </SafeAreaView>
  );
};

export default Exercises;