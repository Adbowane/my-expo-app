import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'twrnc';
import axios from 'axios';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { API_URL } from '../../types';
import { ExerciseAvatar } from '../../components/ExerciseAvatar';
import { getAnimationKey } from '../../data/exerciseAnimations';
import { ExerciseDetailsNavigationProp, Exercise } from '../../types/ExerciseDetails.types';
import { styles } from '../../styles/ExerciseDetails.styles';

// Utility function to convert HH:MM:SS to seconds
const timeStringToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const ExerciseDetails = () => {
  const navigation = useNavigation<ExerciseDetailsNavigationProp>();
  const route = useRoute();
  // Mise à jour de la récupération des paramètres
  const {
    exerciseId,
    programId,
    exercises = [],
  } = route.params as {
    exerciseId: number;
    programId: number;
    exercises: number[];
  };

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [programExercises, setProgramExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [programName, setProgramName] = useState<string>('');

  useEffect(() => {
    const fetchExerciseAndProgram = async () => {
      try {
        setError(null);
        setLoading(true);

        // --- GESTION DES EXERCICES MOCKES (Venant de AnimeDetailsScreen) ---
        if (exerciseId > 100) {
          console.log("Mocked Exercise Detected:", exerciseId);

          // Mock de données pour l'exercice
          const fetchedExercise: Exercise = {
            Exercise_Id: exerciseId,
            Program_Id: programId || 999,
            Exercise_Name: 'Entraînement Anime',
            Image: 'https://via.placeholder.com/400x400/1F2937/FFFFFF?text=Anime+Workout',
            Time: '00:01:00', // 1 minute par défaut
            Program_Name: 'Séance Anime'
          };

          // Noms plus cohérents selon l'ID
          if (exerciseId === 101) fetchedExercise.Exercise_Name = 'Échauffement Ninja';
          if (exerciseId === 102) fetchedExercise.Exercise_Name = 'Pompes Explosives';
          if (exerciseId === 103) fetchedExercise.Exercise_Name = 'Squat Sprint';
          if (exerciseId === 104) fetchedExercise.Exercise_Name = 'Récupération';

          setProgramName('Séance Anime');
          setExercise(fetchedExercise);
          setTimeLeft(timeStringToSeconds(fetchedExercise.Time));
          setInitialTime(timeStringToSeconds(fetchedExercise.Time));

          // Si on nous a passé une liste d'ID mockés dans route.params
          if (exercises && exercises.length > 0) {
            const mockList = exercises.map((id, index) => ({
              Exercise_Id: id,
              Program_Id: programId || 999,
              Exercise_Name: `Mock ${id}`,
              Image: '',
              Time: '00:01:00',
            }));
            setProgramExercises(mockList);
            const index = exercises.indexOf(exerciseId);
            setCurrentExerciseIndex(index !== -1 ? index : 0);
          }
          setLoading(false);
          return; // On arrête là pour les mocks !!
        }
        // ------------------------------------------------------------------

        // Récupérer l'exercice actuel (Base de données normale)
        const exerciseResponse = await axios.get(`${API_URL}/api/exercises/${exerciseId}`);
        const rawExercise = exerciseResponse.data;
        const fetchedExercise: Exercise = {
          Exercise_Id: rawExercise.Exercise_Id || rawExercise.id || exerciseId,
          Program_Id: rawExercise.Program_Id || rawExercise.programId || programId,
          Exercise_Name: rawExercise.Exercise_Name || rawExercise.name || 'Exercice',
          Image: rawExercise.Image || rawExercise.image || '',
          Time: rawExercise.Time || rawExercise.time || '00:00:00',
        };

        // Récupérer le nom du programme
        const programResponse = await axios.get(`${API_URL}/api/programs/${programId}`);
        const program_Name =
          programResponse.data.Program_Name || programResponse.data.name || 'Programme';
        setProgramName(program_Name);
        fetchedExercise.Program_Name = program_Name;

        setExercise(fetchedExercise);

        // Initialiser le timer
        const seconds = timeStringToSeconds(fetchedExercise.Time);
        setTimeLeft(seconds);
        setInitialTime(seconds);

        // Récupérer tous les exercices du programme pour la navigation
        if (exercises.length === 0) {
          const programExercisesResponse = await axios.get(
            `${API_URL}/api/exercises/program/${programId}`
          );
          setProgramExercises(programExercisesResponse.data);

          // Trouver l'index de l'exercice actuel
          const index = programExercisesResponse.data.findIndex(
            (ex: Exercise) => ex.Exercise_Id === exerciseId
          );
          setCurrentExerciseIndex(index !== -1 ? index : 0);
        } else {
          // Si nous avons déjà les IDs des exercices, récupérer leurs détails
          const fetchedExercises = await Promise.all(
            exercises.map((id: number) =>
              axios.get(`${API_URL}/api/exercises/${id}`).then((res) => res.data)
            )
          );
          setProgramExercises(fetchedExercises);

          // Trouver l'index de l'exercice actuel
          const index = exercises.findIndex((exId: number) => exId === exerciseId);
          setCurrentExerciseIndex(index !== -1 ? index : 0);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'exercice:", err);
        setError("Impossible de récupérer l'exercice.");
        // Gérer visuellement plutôt qu'avec une Alert bloquante si possible
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseAndProgram();
  }, [exerciseId, programId, exercises]);

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
          exerciseId: nextExercise.Exercise_Id,
          programId: programId,
          exercises:
            exercises.length > 0 ? exercises : programExercises.map((ex) => ex.Exercise_Id),
        });
      }
    }
  };

  // Fonction pour obtenir le nom du prochain exercice
  const getNextExerciseName = (): string => {
    if (programExercises.length > 0) {
      const nextIndex = (currentExerciseIndex + 1) % programExercises.length;
      return programExercises[nextIndex]?.Exercise_Name || 'Fin du programme';
    }
    return 'Chargement...';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#48B0F1" />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Exercice non trouvé.'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Program and Exercise Name */}
      <View style={styles.titleContainer}>
        <Text style={styles.programName}>
          {exercise.Program_Name}
        </Text>
        <Text style={styles.exerciseName}>
          {exercise.Exercise_Name}
        </Text>
      </View>

      {/* Timer Container */}
      <View style={styles.timerContainer}>
        <View style={styles.timerRow}>
          <View>
            <Text style={styles.timerLabel}>Timer</Text>
            <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
            <TouchableOpacity
              style={styles.stopBtn}
              onPress={() => {
                setIsTimerRunning(false);
                setTimeLeft(initialTime);
              }}>
              <Text style={styles.stopBtnText}>Stop</Text>
            </TouchableOpacity>
          </View>

          {/* Circular Timer */}
          <TouchableOpacity
            style={[
              styles.playBtnCircle,
              { backgroundColor: '#9188F1' },
            ]}
            onPress={isTimerRunning ? stopTimer : startTimer}>
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

      {/* Exercise Avatar or Image */}
      <View style={styles.avatarContainer}>
        {getAnimationKey(exercise.Exercise_Name) ? (
          <ExerciseAvatar
            animationName={getAnimationKey(exercise.Exercise_Name)}
            isPlaying={isTimerRunning}
          />
        ) : (
          <Image source={{ uri: exercise.Image }} style={styles.avatarImage} resizeMode="contain" />
        )}
      </View>

      {/* Next Exercise */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextExerciseRow} onPress={goToNextExercise}>
          <MaterialIcons name="format-list-bulleted" size={24} color="gray" />
          <View style={styles.nextExerciseInfo}>
            <Text style={styles.nextExerciseLabel}>Prochain exercice:</Text>
            <Text style={styles.nextExerciseName}>{getNextExerciseName()}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ExerciseDetails;
