import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_URL, RootStackParamList } from '../types';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Type de navigation pour l'écran de niveaux
type LevelScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LevelScreen'>;

// Interface pour le type Level
interface Level {
  Level_Id: number;
  Level_Name: string;
  Image?: string;
  isCompleted?: boolean;
  isProcessing?: boolean;
  isLocked?: boolean;
}

const LevelScreen = () => {
  const navigation = useNavigation<LevelScreenNavigationProp>();
  const { user, isLoading } = useAuth(); //git  Récupérer user et isLoading
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les niveaux en fonction du niveau de l'utilisateur
  useEffect(() => {
    // Attendre que le chargement initial soit terminé
    if (isLoading) {
      console.log('AuthContext is still loading...');
      return;
    }

    // Vérifier si l'utilisateur est connecté
    if (!user?.userId) {
      console.log('No user found, redirecting to Login');
      setError('Vous devez être connecté pour voir vos niveaux.');
      setLoading(false);
      Alert.alert('Erreur', 'Veuillez vous connecter.', [
        {
          text: 'OK',
          onPress: () => {
            // Si LevelScreen est dans un navigator imbriqué, essayer le parent
            const parentNav = (navigation as any).getParent?.();
            if (parentNav && typeof parentNav.navigate === 'function') {
              // Naviguer via le parent navigator (route 'Login' doit exister au niveau racine)
              parentNav.navigate('Login' as never);
              return;
            }
            // Fallback : réinitialiser la stack de navigation pour aller vers Login
            if (typeof (navigation as any).reset === 'function') {
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
              return;
            }
            // Last resort: essayer la navigation locale (peut échouer si route inexistante dans ce navigator)
            try {
              navigation.navigate('Login' as never);
            } catch (e) {
              console.warn('Unable to navigate to Login from LevelScreen:', e);
            }
          },
        },
      ]);
      return;
    }

    console.log('User loaded:', { userId: user.userId, currentLevel: user.currentLevel });

    const fetchLevels = async () => {
      try {
        setError(null);
        // Utiliser currentLevel depuis user
        const currentLevel = user.currentLevel || 1;

        // Récupérer tous les niveaux disponibles
        const levelsResponse = await axios.get(`${API_URL}/api/levels`);
        console.log('Levels fetched:', levelsResponse.data);

        // Enrichir les niveaux avec l'état basé sur le niveau de l'utilisateur
        const enhancedLevels = levelsResponse.data.map((level: Level) => ({
          ...level,
          isCompleted: level.Level_Id < currentLevel,
          isProcessing: level.Level_Id === currentLevel,
          isLocked: level.Level_Id > currentLevel,
        }));
        setLevels(enhancedLevels);
      } catch (err) {
        console.error('Erreur lors de la récupération des niveaux:', err);
        setError('Impossible de récupérer les niveaux.');
        Alert.alert('Erreur', 'Impossible de récupérer les données.');
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [user?.userId, user?.currentLevel, isLoading, navigation]);

  // Fonction pour rendre une carte de niveau
  const renderLevelCard = (level: Level, index: number) => {
    const isFirst = index === 0;

    return (
      <View key={level.Level_Id} style={tw`mb-4`}>
        {isFirst && (
          <View style={tw`mb-4`}>
            <TouchableOpacity
              style={tw`bg-blue-400 rounded-xl p-4 flex-row items-center justify-between`}
              onPress={() => navigation.navigate('Goals', { id: 0 })}
            >
              <View style={tw`flex-row items-center`}>
                <Feather name="clipboard" size={24} color="white" style={tw`mr-3`} />
                <Text style={tw`text-white font-bold text-lg`}>Découvrir plus</Text>
              </View>
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            <View style={tw`flex-row justify-center mt-2 mb-2`}>
              <View style={tw`w-2 h-2 bg-gray-400 rounded-full`}></View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={tw`bg-white rounded-xl p-4 ${level.isLocked ? 'opacity-50' : ''}`}
          onPress={() => !level.isLocked && navigation.navigate('Goals', { id: level.Level_Id })}
          disabled={level.isLocked}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-16 h-16 mr-4 justify-center items-center`}>
                <Image
                  source={level.Image ? { uri: level.Image } : require('../../assets/musclay.png')}
                  style={tw`w-16 h-16 rounded-xl shadow-lg`}
                  resizeMode="cover"
                />
                <View style={tw`absolute -bottom-1 w-12 h-1 bg-gray-200 rounded-full opacity-70`}></View>
              </View>
              <View>
                <Text style={tw`font-bold text-lg text-gray-800`}>{level.Level_Name}</Text>
                {level.isCompleted && (
                  <Text style={tw`text-gray-500 text-xs`}>Niveau complété</Text>
                )}
                {level.isLocked && (
                  <Text style={tw`text-gray-500 text-xs`}>Niveau verrouillé</Text>
                )}
                {level.isProcessing && (
                  <Text style={tw`text-gray-500 text-xs`}>Niveau en cours</Text>
                )}
              </View>
            </View>
            {level.isCompleted ? (
              <View style={tw`w-6 h-6 bg-green-500 rounded-full justify-center items-center`}>
                <Feather name="check" size={16} color="white" />
              </View>
            ) : level.isLocked ? (
              <Feather name="lock" size={20} color="gray" />
            ) : level.isProcessing ? (
              <View style={tw`w-24`}>
                <LinearGradient
                  colors={['#FF4B8B', '#A450F8']}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={tw`h-1 rounded-full w-full`}
                />
              </View>
            ) : (
              <Feather name="chevron-right" size={20} color="gray" />
            )}
          </View>
        </TouchableOpacity>
        {!level.isLocked && index < levels.length - 1 && (
          <View style={tw`flex-row justify-center mt-2 mb-2`}>
            <View style={tw`w-2 h-2 bg-gray-400 rounded-full`}></View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-blue-50`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <View style={tw`mb-6 relative`}>
          <Image
            source={require('../../assets/musclay.png')}
            style={tw`w-full h-40 rounded-xl`}
            resizeMode="cover"
          />
          <View style={tw`absolute bottom-4 left-4`}>
            <Text style={tw`text-2xl font-bold text-white`}>Niveaux</Text>
            <Text style={tw`text-white`}>Votre progression fitness</Text>
          </View>
        </View>
        {isLoading || loading ? (
          <ActivityIndicator size="large" color="#9188F1" style={tw`mt-10`} />
        ) : error ? (
          <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
        ) : (
          levels.map((level, index) => renderLevelCard(level, index))
        )}
      </ScrollView>
      <Navbar />
    </SafeAreaView>
  );
};

export default LevelScreen;