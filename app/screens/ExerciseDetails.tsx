import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import tw from 'twrnc';
import axios from 'axios';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type ExerciseDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExerciseDetails'>;

interface Exercise {
  Exercise_Id: number;
  Program_Id: number;
  Exercise_Name: string;
  Image: string;
  Time: string; // Time as a string in HH:MM:SS format
  Program_Name?: string; // Added for program name
}

// Utility function to convert HH:MM:SS to seconds
const timeStringToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const ExerciseDetails = () => {
  const navigation = useNavigation<ExerciseDetailsNavigationProp>();
  const route = useRoute();
  // Mise à jour de la récupération des paramètres
  const { id, programId, exercises = [] } = route.params as { 
    id: number, 
    programId: number,
    exercises: number[] 
  };

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [programExercises, setProgramExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [programName, setProgramName] = useState<string>("");

  useEffect(() => {
    const fetchExerciseAndProgram = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Récupérer l'exercice actuel
        const exerciseResponse = await axios.get(`http://172.31.16.1:3000/api/exercises/${id}`);
        const fetchedExercise = exerciseResponse.data;
        
        // Récupérer le nom du programme
        const programResponse = await axios.get(`http://172.31.16.1:3000/api/programs/${programId}`);
        setProgramName(programResponse.data.Program_Name);
        fetchedExercise.Program_Name = programResponse.data.Program_Name;
        
        setExercise(fetchedExercise);
        
        // Initialiser le timer
        const seconds = timeStringToSeconds(fetchedExercise.Time);
        setTimeLeft(seconds);
        setInitialTime(seconds);
        
        // Récupérer tous les exercices du programme pour la navigation
        if (exercises.length === 0) {
          const programExercisesResponse = await axios.get(`http://172.31.16.1:3000/api/exercises/program/${programId}`);
          setProgramExercises(programExercisesResponse.data);
          
          // Trouver l'index de l'exercice actuel
          const index = programExercisesResponse.data.findIndex(
            (ex: Exercise) => ex.Exercise_Id === id
          );
          setCurrentExerciseIndex(index !== -1 ? index : 0);
        } else {
          // Si nous avons déjà les IDs des exercices, récupérer leurs détails
          const fetchedExercises = await Promise.all(
            exercises.map((id: number) => 
              axios.get(`http://172.31.16.1:3000/api/exercises/${id}`).then(res => res.data)
            )
          );
          setProgramExercises(fetchedExercises);
          
          // Trouver l'index de l'exercice actuel
          const index = exercises.findIndex((exerciseId: number) => exerciseId === id);
          setCurrentExerciseIndex(index !== -1 ? index : 0);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'exercice:', err);
        setError('Impossible de récupérer l\'exercice.');
        Alert.alert('Erreur', 'Impossible de récupérer l\'exercice.');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseAndProgram();
  }, [id, programId, exercises]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
            // Passer à l'exercice suivant dans le programme
            goToNextExercise();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const startTimer = () => {
    if (!isTimerRunning && timeLeft > 0) {
      setIsTimerRunning(true);
    }
  };

  const stopTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Fonction pour aller à l'exercice suivant dans le programme
  const goToNextExercise = () => {
    if (programExercises.length > 0) {
      const nextIndex = (currentExerciseIndex + 1) % programExercises.length;
      const nextExercise = programExercises[nextIndex];
      
      if (nextExercise) {
        navigation.replace('ExerciseDetails', {
          id: nextExercise.Exercise_Id,
          programId: programId,
          exercises: exercises.length > 0 ? exercises : programExercises.map(ex => ex.Exercise_Id)
        });
      }
    }
  };

  // Fonction pour obtenir le nom du prochain exercice
  const getNextExerciseName = (): string => {
    if (programExercises.length > 0) {
      const nextIndex = (currentExerciseIndex + 1) % programExercises.length;
      return programExercises[nextIndex]?.Exercise_Name || "Fin du programme";
    }
    return "Chargement...";
  };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <ActivityIndicator size="large" color="#48B0F1" />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <Text style={tw`text-red-500 text-center text-lg`}>{error || 'Exercice non trouvé.'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 pt-2`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Program and Exercise Name */}
      <View style={tw`px-6 py-3`}>
        <Text style={tw`text-gray-500 text-center text-sm font-medium`}>{exercise.Program_Name}</Text>
        <Text style={tw`text-black text-center text-xl font-semibold mt-1`}>{exercise.Exercise_Name}</Text>
      </View>
      
      {/* Timer Container */}
      <View style={tw`mx-6 bg-gray-100 rounded-2xl overflow-hidden`}>
        <View style={tw`flex-row items-center justify-between p-4`}>
          <View>
            <Text style={tw`text-gray-500 text-xs font-medium`}>Timer</Text>
            <Text style={[tw`text-3xl font-bold`, {color: '#000'}]}>
              {formatTime(timeLeft)}
            </Text>
            <TouchableOpacity 
              style={tw`bg-gray-800 rounded-lg px-4 py-1 mt-1`}
              onPress={() => {
                setIsTimerRunning(false);
                setTimeLeft(initialTime);
              }}
            >
              <Text style={tw`text-white text-xs font-medium text-center`}>Stop</Text>
            </TouchableOpacity>
          </View>
          
          {/* Circular Timer */}
          <TouchableOpacity 
            style={[
              tw`w-20 h-20 rounded-full justify-center items-center`,
              { backgroundColor: '#9188F1' }
            ]}
            onPress={isTimerRunning ? stopTimer : startTimer}
          >
            <View style={tw`items-center justify-center`}>
              {isTimerRunning ? (
                <Ionicons name="pause" size={32} color="white" />
              ) : (
                <Ionicons name="play" size={32} color="white" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Exercise Image */}
      <View style={tw`flex-1 justify-center items-center px-6 py-4`}>
        <Image 
          source={{ uri: exercise.Image }} 
          style={tw`w-4/5 h-64`} 
          resizeMode="contain" 
        />
      </View>
      
      {/* Next Exercise */}
      <View style={tw`px-6 pb-8`}>
        <TouchableOpacity 
          style={tw`flex-row items-center`}
          onPress={goToNextExercise}
        >
          <MaterialIcons name="format-list-bulleted" size={24} color="gray" />
          <View style={tw`ml-2`}>
            <Text style={tw`text-gray-400 text-xs`}>Prochain exercice:</Text>
            <Text style={tw`text-gray-600 text-sm`}>{getNextExerciseName()}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ExerciseDetails;