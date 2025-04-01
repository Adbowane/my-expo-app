import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../types';

import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import axios from 'axios';
import Navbar from 'app/components/Navbar';

// Définition du type pour les paramètres de route
type RouteParams = {
  levelId?: number;
  goalId?: number;
};

// Définition correcte du type de navigation
type RootStackParamList = {
  Goals: undefined;
  Programmes: { goalId: number };
  LevelScreen: { programId: number };
  Home: undefined;
  Profile: undefined;
  Calendar: undefined;
  Today: undefined;
  Workouts: undefined;
};

type GoalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Goals'>;

type Goal = {
  Goal_Id: number;
  Level_Id: number;
  Goal_Name: string;
  Description: string;
  Image: string;
  ImageGoal: string | null;
  Duration: string;
  Improvement: string;
  Followers: number;
  Impact: string;
  Streak: string;

};

// Images de secours par catégorie
export const fallbackImages = {
  'Perte de poids': 'https://tse4.mm.bing.net/th?id=OIG3.RAolgCJjIH4B4ovrt1tf&pid=ImgGn',
  'Gain musculaire': 'https://tse4.mm.bing.net/th?id=OIG3.RAolgCJjIH4B4ovrt1tf&pid=ImgGn',
  'Maintien de forme': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1169&auto=format&fit=crop',
  'Endurance cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1170&auto=format&fit=crop',
  'Force maximale': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1170&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop'
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.8; // Augmenté pour avoir des cartes plus grandes

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  
  const navigation = useNavigation<GoalsScreenNavigationProp>();
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
        
        // Vérification des URLs des images
        const processedGoals = response.data.map((goal: Goal) => {
          console.log('Original Image URL:', goal.Image); // Log original image URL
          // Utiliser l'image de la base de données par défaut
          goal.ImageGoal = goal.Image || fallbackImages.default;
          console.log('Processed Image URL:', goal.ImageGoal); // Log processed image URL
          return goal;
        });
        
        setGoals(processedGoals);
        
        // Sélectionner le premier par défaut
        if (processedGoals.length > 0) {
          setSelectedGoal(processedGoals[0].Goal_Id);
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
    setImageErrors(prev => ({...prev, [goalId]: true}));
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
            WEIGHT EXERCISES
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
          keyExtractor={(item) => item.Goal_Id.toString()}
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
                        {item.Goal_Name.toUpperCase()}
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