import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';

// Type de navigation pour l'écran de niveaux
type LevelScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LevelScreen'>;

// Interface pour le type Level avec des propriétés supplémentaires pour l'UI
interface Level {
  Level_Id: number;
  Level_Name: string;
  Image?: string;
  isCompleted?: boolean;
  isProcessing?: boolean;
  isLocked?: boolean;
}

const LevelScreen = () => {
  // Initialisation du hook de navigation
  const navigation = useNavigation<LevelScreenNavigationProp>();
  
  // États pour gérer les données, le chargement et les erreurs
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effet pour récupérer les données de niveaux depuis l'API
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        // Réinitialisation de l'état d'erreur
        setError(null);
        // Appel API pour récupérer les niveaux
        const response = await axios.get('http://172.31.16.1:3000/api/levels');
        // Enrichissement des données pour démonstration UI
        const enhancedLevels = response.data.map((level: Level, index: number) => ({
          ...level,
          isCompleted: index < 2 ,  // Le premier niveau est marqué comme complété
          isProcessing: index === 2,  // Le deuxième niveau est en cours de traitement
          isLocked: index === 3        // Les niveaux après le second sont verrouillés
        }));
        setLevels(enhancedLevels);
      } catch (err) {
        // Gestion des erreurs
        console.error('Error fetching levels:', err);
        setError('Impossible de récupérer les niveaux.');
        Alert.alert('Erreur', 'Impossible de récupérer les niveaux.');
      } finally {
        // Fin du chargement dans tous les cas
        setLoading(false);
      }
    };

    // Exécution de la fonction de récupération des données
    fetchLevels();
  }, []);

  // Fonction pour rendre une carte de niveau
  const renderLevelCard = (level: Level, index: number) => {
    const isFirst = index === 0;

    return (
      <View key={level.Level_Id} style={tw`mb-4`}>
        {/* Affiche le test de placement uniquement avant le premier niveau */}
        {isFirst && (
          <View style={tw`mb-4`}>
            <TouchableOpacity 
              style={tw`bg-blue-400 rounded-xl p-4 flex-row items-center justify-between`}
              onPress={() => navigation.navigate('Goals', { id: 0 })}
            >
              <View style={tw`flex-row items-center`}>
                <Feather name="clipboard" size={24} color="white" style={tw`mr-3`} />
                <Text style={tw`text-white font-bold text-lg`}>Placement test</Text>
              </View>
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            {/* Point de connexion entre le test et le premier niveau */}
            <View style={tw`flex-row justify-center mt-2 mb-2`}>
              <View style={tw`w-2 h-2 bg-gray-400 rounded-full`}></View>
            </View>
          </View>
        )}
        
        {/* Carte de niveau */}
        <TouchableOpacity 
          style={tw`bg-white rounded-xl p-4 ${level.isLocked ? 'opacity-50' : ''}`}
          onPress={() => !level.isLocked && navigation.navigate('Goals', { id: level.Level_Id })}
          disabled={level.isLocked}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center`}>
              {/* Image du niveau améliorée - plus grande et flottante */}
              <View style={tw`w-16 h-16 mr-4 justify-center items-center`}>
                <Image 
                  source={level.Image ? { uri: level.Image } : require('../../assets/musclay.png')} 
                  style={tw`w-16 h-16 rounded-xl shadow-lg`} 
                  resizeMode="cover"
                />
                {/* Effet d'ombre pour donner l'impression que l'image flotte */}
                <View style={tw`absolute -bottom-1 w-12 h-1 bg-gray-200 rounded-full opacity-70`}></View>
              </View>
              
              {/* Informations textuelles du niveau */}
              <View>
                <Text style={tw`font-bold text-lg text-gray-800`}>{level.Level_Name}</Text>
                {level.isCompleted && (
                  <Text style={tw`text-gray-500 text-xs`}>This part is complete</Text>
                )}
                {level.isLocked && (
                  <Text style={tw`text-gray-500 text-xs`}>This part is locked</Text>
                )}
                {level.isProcessing && (
                  <Text style={tw`text-gray-500 text-xs`}>This part is in progress</Text>
                )}
              </View>
            </View>
            
            {/* Indicateurs d'état du niveau */}
            {level.isCompleted ? (
              // Icône de validation pour niveau complété
              <View style={tw`w-6 h-6 bg-green-500 rounded-full justify-center items-center`}>
              <Feather name="check" size={16} color="white" />
              </View>
            ) : level.isLocked ? (
              // Icône de cadenas pour niveau verrouillé
              <Feather name="lock" size={20} color="gray" />
            ) : level.isProcessing ? (
              // Barre de progression pour niveau en cours
              <View style={tw`w-24`}>
              <LinearGradient 
                colors={['#FF4B8B', '#A450F8']} 
                start={[0, 0]} 
                end={[1, 0]} 
                style={tw`h-1 rounded-full w-full`}
              />
              </View>
            ) : (
              // Niveau non commencé
              <Feather name="chevron-right" size={20} color="gray" />
            )}
          </View>
        </TouchableOpacity>
        
        {/* Points de connexion entre les niveaux non verrouillés */}
        {!level.isLocked && index < levels.length - 1 && (
          <View style={tw`flex-row justify-center mt-2 mb-2`}>
            <View style={tw`w-2 h-2 bg-gray-400 rounded-full`}></View>
          </View>
        )}
      </View>
    );
  };

  return (
    // Conteneur principal avec gestion des zones sécurisées (notch, etc.)
    <SafeAreaView style={tw`flex-1 bg-blue-50`}>
      {/* Barre d'état personnalisée */}
     
      
      {/* Contenu principal défilable */}
      <ScrollView contentContainerStyle={tw`p-4`}>
        {/* En-tête avec image de fond */}
        <View style={tw`mb-6 relative`}>
          <Image 
            source={require('../../assets/musclay.png')} 
            style={tw`w-full h-40 rounded-xl`} 
            resizeMode="cover" 
          />
          <View style={tw`absolute bottom-4 left-4`}>
            <Text style={tw`text-2xl font-bold text-white`}>Level</Text>
            <Text style={tw`text-white`}>How would you rate your English</Text>
          </View>
        </View>
        
        {/* Affichage conditionnel selon l'état (chargement, erreur, données) */}
        {loading ? (
          // Indicateur de chargement
          <ActivityIndicator size="large" color="#9188F1" style={tw`mt-10`} />
        ) : error ? (
          // Message d'erreur
          <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
        ) : (
          // Liste des niveaux
          levels.map((level, index) => renderLevelCard(level, index))
        )}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={tw`absolute bottom-0 left-0 right-0 h-20 flex-row justify-around items-center bg-white border-t border-gray-200 px-4`}>
        <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate('Home')}>
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
        
        <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate('DashboardScreen')}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={tw`text-xs text-gray-500 mt-1`}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LevelScreen;