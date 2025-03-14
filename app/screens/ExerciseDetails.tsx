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
  Next_Exercise_Name?: string; // Added for next exercise
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
  const [nextExercise, setNextExercise] = useState<string>('Bridge Pose (Setu Bandhasana)');

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setError(null);
        const response = await axios.get(`http://172.31.16.1:3000/api/exercises/${id}`);
        const fetchedExercise = response.data;
        // Add mock program name for UI
        fetchedExercise.Program_Name = "Morning Energizer";
        setExercise(fetchedExercise);
        const seconds = timeStringToSeconds(fetchedExercise.Time);
        setTimeLeft(seconds);
        setInitialTime(seconds);
        
        // Optionally fetch next exercise info
        try {
          const nextResponse = await axios.get(`http://172.31.16.1:3000/api/exercises/${id + 1}`);
          setNextExercise(nextResponse.data.Exercise_Name);
        } catch (err) {
          console.log('Next exercise not available');
        }
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
          onPress={() => navigation.navigate('ExerciseDetails', { id: id + 1 })}
        >
          <MaterialIcons name="format-list-bulleted" size={24} color="gray" />
          <View style={tw`ml-2`}>
            <Text style={tw`text-gray-400 text-xs`}>Next exercise:</Text>
            <Text style={tw`text-gray-600 text-sm`}>{nextExercise}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ExerciseDetails;