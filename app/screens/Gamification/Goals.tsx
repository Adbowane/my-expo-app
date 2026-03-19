import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../types';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StatusBar,
  Animated,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import axios from 'axios';
import Navbar from '../../components/Navbar';

import { GoalsScreenNavigationProp, Goal } from '../../types/Goals.types';
import { fallbackImages, CARD_WIDTH } from '../../styles/Goals.styles';

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const navigation = useNavigation<GoalsScreenNavigationProp>();
  const route = useRoute();
  const { levelId: initialLevelId } = (route.params as { levelId?: number }) || {};

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Mapping des icônes pour chaque type d'objectif
  const goalIcons: { [key: string]: string } = {
    'Perte de poids': 'scale-balance',
    'Gain musculaire': 'weight-lifter',
    'Maintien de forme': 'human',
    'Endurance cardio': 'heart-pulse',
    'Force maximale': 'weight',
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/goals`);

        // Vérification et mappage des données de l'API
        const processedGoals = response.data.map((item: any) => {
          // Mappage robuste pour gérer les variations de noms de champs de l'API
          const mappedGoal: Goal = {
            Goal_Id: item.Goal_Id || item.id || item.goalId,
            Level_Id: item.Level_Id || item.levelId,
            Goal_Name: item.Goal_Name || item.name || item.title || '',
            Description: item.Description || item.description || '',
            Image: item.Image || item.image || item.imageUrl || '',
            ImageGoal: item.Image || item.image || item.imageUrl || fallbackImages.default,
            Duration: item.Duration || item.duration || 'N/A',
            Improvement: item.Improvement || item.improvement || 'N/A',
            Followers: item.Followers || item.followers || 0,
            Impact: item.Impact || item.impact || 'N/A',
            Streak: item.Streak || item.streak || 'N/A',
          };

          console.log('Mapped Goal:', mappedGoal.Goal_Id, mappedGoal.Goal_Name);
          return mappedGoal;
        });

        setGoals(processedGoals);

        // Sélectionner l'objectif correspondant au levelId ou le premier par défaut
        if (processedGoals.length > 0) {
          let targetIndex = 0;
          if (initialLevelId) {
            const foundIndex = processedGoals.findIndex((g: Goal) => g.Level_Id === initialLevelId);
            if (foundIndex !== -1) targetIndex = foundIndex;
          }

          setSelectedGoal(processedGoals[targetIndex].Goal_Id);
          setCurrentIndex(targetIndex);

          // Petit délai pour laisser le temps à la liste de se charger avant de scroller
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: targetIndex, animated: false });
          }, 100);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des objectifs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleImageError = (goalId: number) => {
    console.log('Image failed to load for goal ID:', goalId); // Log image load failure
    setImageErrors(prev => ({ ...prev, [goalId]: true }));
  };

  const getImageSource = (item: Goal) => {
    if (imageErrors[item.Goal_Id]) {
      return fallbackImages[item.Goal_Name as keyof typeof fallbackImages] || fallbackImages.default;
    }
    return item.ImageGoal || undefined;
  };

  const handleSelectGoal = (goalId: number, index: number) => {
    setSelectedGoal(goalId);
    setCurrentIndex(index);

    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true
    });
  };

  const getIconNameForGoal = (goalName: string) => {
    return goalIcons[goalName] || 'dumbbell';
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      setSelectedGoal(viewableItems[0].item.Goal_Id);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged }
  ]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={tw`text-lg font-medium text-gray-700 mt-4`}>Chargement des objectifs...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Fitness Category Badge */}
        <View style={tw`px-5 mt-4`}>
          <View style={tw`bg-blue-500 self-start rounded-full px-3 py-1`}>
            <Text style={tw`text-xs font-medium text-white`}>Fitness</Text>
          </View>
        </View>

        {/* Main Title */}
        <View style={tw`px-5 mt-2`}>
          <Text style={tw`text-3xl font-extrabold tracking-tight`}>
            Choisissez votre objectif
          </Text>

          {/* Progress Dots */}
          <View style={tw`flex-row my-3`}>
            {[0, 1, 2, 3, 4].map((dot, index) => (
              <View
                key={index}
                style={tw`h-2 w-2 rounded-full mx-1 ${index <= 2 ? 'bg-black' : 'bg-gray-300'}`}
              />
            ))}
          </View>
        </View>

        {/* Carousel of Goals */}
        <Animated.FlatList
          ref={flatListRef}
          data={goals}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 16} // Ajout de la marge
          decelerationRate="fast"
          contentContainerStyle={tw`py-4 px-2`}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          keyExtractor={(item, index) => (item?.Goal_Id?.toString() || index.toString())}
          renderItem={({ item, index }) => {
            const isSelected = item.Goal_Id === selectedGoal;

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleSelectGoal(item.Goal_Id, index)}
                style={[
                  { width: CARD_WIDTH, marginHorizontal: 8 },
                  tw`rounded-3xl`,
                  isSelected && tw`border-4 border-purple-500` // Entourer l'élément sélectionné
                ]}
              >
                <View style={tw`bg-white rounded-3xl shadow-md overflow-hidden h-160`}>
                  {/* Goal Image and Details with Gradient */}
                  <View style={tw`h-2/3 justify-center items-center bg-gray-100 relative`}>
                    {/* Image de l'objectif avec gestion des erreurs */}
                    <Image
                      source={{ uri: getImageSource(item) as string | undefined }}
                      style={tw`absolute w-full h-full`}
                      resizeMode="cover"
                      onError={() => handleImageError(item.Goal_Id)}
                    />

                    {/* Gradient overlay pour meilleure visibilité du texte */}
                    <LinearGradient
                      colors={['transparent', 'rgba(102, 51, 153, 0.8)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={tw`absolute w-full h-full`}
                    />

                    {/* Nom de l'objectif en grand à droite */}
                    <View style={tw`absolute right-4 top-8 w-40 items-end`}>
                      <Text style={tw`text-4xl font-black text-white text-right leading-tight`}>
                        {(item.Goal_Name || '').toUpperCase()}
                      </Text>
                    </View>

                    {/* Icône pour l'objectif */}
                    <View style={tw`absolute bottom-4 left-4 bg-black/20 p-3 rounded-full`}>
                      <MaterialCommunityIcons
                        name={getIconNameForGoal(item.Goal_Name) as any}
                        size={32}
                        color="#fff"
                      />
                    </View>

                    {/* Statistiques */}
                    <View style={tw`absolute right-4 bottom-16`}>
                      <View style={tw`items-end mb-6`}>
                        <Text style={tw`text-gray-200 text-xs mb-1`}>SUIVIS PAR</Text>
                        <View style={tw`flex-row items-center`}>
                          <Text style={tw`text-lg font-bold text-white mr-1`}>
                            {Math.round(item.Followers / 1000)}k+
                          </Text>
                          <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
                        </View>
                      </View>

                      <View style={tw`items-end mb-6`}>
                        <Text style={tw`text-gray-200 text-xs mb-1`}>STREAK MOYEN</Text>
                        <Text style={tw`text-lg font-bold text-white`}>{item.Streak}</Text>
                      </View>

                      <View style={tw`items-end`}>
                        <Text style={tw`text-gray-200 text-xs mb-1`}>IMPACT MOYEN</Text>
                        <Text style={tw`text-lg font-bold text-white`}>{item.Impact}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Détails en bas */}
                  <View style={tw`bg-white p-4 rounded-t-3xl -mt-6 flex-1`}>
                    <Text style={tw`text-gray-500 text-sm font-medium mb-1`}>Détails de l'intervention</Text>

                    {/* Navigation par onglets */}
                    <View style={tw`flex-row mb-4`}>
                      <Text style={tw`text-xl font-bold mr-4 uppercase`}>APERÇU</Text>
                      <Text style={tw`text-xl font-bold text-gray-300 uppercase`}>INFO SCIENTIFIQUE</Text>
                    </View>

                    <View style={tw`flex-row justify-between mb-2`}>
                      <View style={tw`flex-1 mr-2 bg-gray-100 p-3 rounded-lg`}>
                        <Text style={tw`text-xs text-gray-500`}>DURÉE RECOMMANDÉE</Text>
                        <Text style={tw`text-base font-bold`}>{item.Duration}</Text>
                      </View>
                      <View style={tw`flex-1 ml-2 bg-gray-100 p-3 rounded-lg`}>
                        <Text style={tw`text-xs text-gray-500`}>AMÉLIORATION ATTENDUE</Text>
                        <Text style={tw`text-base font-bold`}>{item.Improvement}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Bouton Suivant */}
        {selectedGoal && (
          <View style={tw`px-5 mb-24`}>
            <TouchableOpacity
              style={tw`bg-violet-600 p-4 rounded-full items-center shadow-md`}
              onPress={() => navigation.navigate('Programmes', { goalId: selectedGoal })} // Pass goalId
            >
              <Text style={tw`text-lg font-bold text-white`}>Commencer cet objectif</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Navbar */}
      <Navbar />

    </View>
  );
}

export default Goals;