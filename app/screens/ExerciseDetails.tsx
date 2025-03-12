import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

type ExerciseDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExerciseDetails'>;

interface Exercise {
  Exercise_Id: number;
  Program_Id: number;
  Exercise_Name: string;
  Image: string;
  Time: string; // Time as a string in HH:MM:SS format
}

// Utility function to convert HH:MM:SS to seconds
const timeStringToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const ExerciseDetails = () => {
  const navigation = useNavigation<ExerciseDetailsNavigationProp>();
  const route = useRoute();
  const { id } = route.params as { id: number };

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setError(null);
        const response = await axios.get(`http://172.31.16.1:3000/api/exercises/${id}`);
        const fetchedExercise = response.data;
        setExercise(fetchedExercise);
        const seconds = timeStringToSeconds(fetchedExercise.Time);
        setTimeLeft(seconds);
        setInitialTime(seconds);
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'exercice:', err);
        setError('Impossible de récupérer l\'exercice.');
        Alert.alert('Erreur', 'Impossible de récupérer l\'exercice.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
            navigation.navigate('ExerciseDetails', { id: id + 1 });
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, navigation, id]);

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

  if (loading) {
    return (
      <View style={tw`flex-1 bg-[#1A1B41] justify-center items-center`}>
        <ActivityIndicator size="large" color="#9188F1" />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={tw`flex-1 bg-[#1A1B41] justify-center items-center`}>
        <Text style={tw`text-red-500 text-center text-lg`}>{error || 'Exercice non trouvé.'}</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#1A1B41] p-5`}> 
      <LinearGradient colors={['#9188F1', '#6A5ACD']} style={tw`p-5 rounded-b-xl`}>
        <Text style={tw`text-3xl font-bold text-white text-center`}>PRÊT À Y ALLER</Text>
      </LinearGradient>
      <View style={tw`flex-1 justify-center items-center p-5`}>        
        <Image source={{ uri: exercise.Image }} style={tw`w-3/4 h-1/2 mb-5`} resizeMode="contain" />
        <Text style={tw`text-2xl font-bold text-white mb-2`}>{exercise.Exercise_Name}</Text>
        <Progress.Circle
          size={120}
          progress={initialTime > 0 ? timeLeft / initialTime : 0}
          showsText
          formatText={() => formatTime(timeLeft)}
          thickness={8}
          color="#6A5ACD"
        />
        <View style={tw`flex-row mt-5`}>          
          <TouchableOpacity onPress={startTimer} style={tw`bg-green-500 p-3 rounded-full mx-2`}>
            <FontAwesome name="play" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={stopTimer} style={tw`bg-yellow-500 p-3 rounded-full mx-2`}>
            <FontAwesome name="pause" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ExerciseDetails', { id: id + 1 })} style={tw`bg-red-500 p-3 rounded-full mx-2`}>
            <FontAwesome name="step-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ExerciseDetails;