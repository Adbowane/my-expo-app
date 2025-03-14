import React, { useEffect, useState, useRef } from 'react';
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
  ImageBackground,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import axios from 'axios';

// Remarque: L'import LinearGradient nécessite l'installation de expo-linear-gradient
// npm install expo-linear-gradient

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
};

type GoalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Goals'>;

type Goal = {
  Goal_Id: number;
  Goal_Name: string;
  description?: string;
  image?: string;
  duration?: string;
  improvement?: string;
  followers?: number;
  impact?: string;
  streak?: string;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.25;

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const navigation = useNavigation<GoalsScreenNavigationProp>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Données d'exemple pour enrichir l'UI
  const goalIcons: { [key: string]: string } = {
      'Perte de poids': 'scale-balance',
      'Gain musculaire': 'weight-lifter',
      'Cardio': 'heart-pulse',
      'Flexibilité': 'yoga',
      'Endurance': 'run-fast',
    };

  const goalImpacts: { [key: string]: string } = {
    'Perte de poids': '-3.7%',
    'Gain musculaire': '+2.5%',
    'Cardio': '+15%',
    'Flexibilité': '+40%',
    'Endurance': '+25%',
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('http://172.31.16.1:3000/api/goals');
        
        // Enrichir les données avec des descriptions et statistiques pour l'UI
        const enrichedData = response.data.map((goal: Goal) => ({
          ...goal,
          description: `Programme conçu pour ${goal.Goal_Name.toLowerCase()} de manière efficace et durable`,
          duration: '4 months',
          improvement: '-2.5%',
          followers: Math.floor(Math.random() * 5000) + 1000,
          impact: goalImpacts[goal.Goal_Name] || '-2.8%',
          streak: Math.floor(Math.random() * 6) + 1 + ' months'
        }));
        
        setGoals(enrichedData);
        
        // Sélectionner le premier par défaut
        if (enrichedData.length > 0) {
          setSelectedGoal(enrichedData[0].Goal_Id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des objectifs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

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
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      
      
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
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={tw`py-4`}
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
                tw`w-${Math.round(CARD_WIDTH)} px-2 rounded-3xl opacity-100`,
                isSelected && tw`border-4 border-purple-500 opacity-90 ` // Entourer l'élément sélectionné d'un néon violet
              ]}
            >
              <View style={tw`bg-white rounded-3xl shadow-md overflow-hidden h-160 `}>
                {/* Goal Image and Details with Gradient */}
                <View style={tw`h-2/3 justify-center items-center bg-gray-100 relative`}>
                  {/* This would be a real image in production */}
                  <Image 
                    source={{ uri: 'https://tse1.mm.bing.net/th?id=OIG1.L1vcY8ZbHpDakEQMORap&pid=ImgGn' }}
                    style={tw`absolute w-full h-full`}
                    resizeMode="cover"
                  />
                  
                  {/* Gradient overlay for better text visibility */}
                  <LinearGradient
                    colors={['transparent', 'rgba(102, 51, 153, 0.8)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={tw`absolute w-full h-full`}
                  />
                  
                  {/* Large Goal Name on right side */}
                  <View style={tw`absolute right-4 top-8 w-40 items-end`}>
                    <Text style={tw`text-4xl font-black text-white text-right leading-tight`}>
                      {item.Goal_Name.toUpperCase()}
                    </Text>
                  </View>
                  
                  {/* Icon for the goal */}
                  <View style={tw`absolute bottom-4 left-4 bg-black/20 p-3 rounded-full`}>
                    <MaterialCommunityIcons 
                      name={getIconNameForGoal(item.Goal_Name) as any} 
                      size={32} 
                      color="#fff" 
                    />
                  </View>
                  
                  {/* Stats */}
                  <View style={tw`absolute right-4 bottom-16`}>
                    <View style={tw`items-end mb-6`}>
                      <Text style={tw`text-gray-200 text-xs mb-1`}>FOLLOWED BY</Text>
                      <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-lg font-bold text-white mr-1`}>{Math.round(item.followers / 1000)}k+</Text>
                        <MaterialCommunityIcons name="weight" size={24} color="#fff" />
                      </View>
                    </View>
                    
                    <View style={tw`items-end mb-6`}>
                      <Text style={tw`text-gray-200 text-xs mb-1`}>AVERAGE STREAK</Text>
                      <Text style={tw`text-lg font-bold text-white`}>{item.streak}</Text>
                    </View>
                    
                    <View style={tw`items-end`}>
                      <Text style={tw`text-gray-200 text-xs mb-1`}>AVERAGE IMPACT</Text>
                      <Text style={tw`text-lg font-bold text-white`}>{item.impact}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Bottom Details */}
                <View style={tw`bg-white p-4 rounded-t-3xl -mt-6 flex-1`}>
                  <Text style={tw`text-gray-500 text-sm font-medium mb-1`}>Intervention details</Text>
                  
                  {/* Tab Navigation */}
                  <View style={tw`flex-row mb-4`}>
                    <Text style={tw`text-xl font-bold mr-4 uppercase`}>OVERVIEW</Text>
                    <Text style={tw`text-xl font-bold text-gray-300 uppercase`}>SCIENTIFIC INFO</Text>
                  </View>
                  
                  <View style={tw`flex-row justify-between mb-2`}>
                    <View style={tw`flex-1 mr-2 bg-gray-100 p-3 rounded-lg`}>
                      <Text style={tw`text-xs text-gray-500`}>RECOMMENDED DURATION</Text>
                      <Text style={tw`text-base font-bold`}>{item.duration}</Text>
                    </View>
                    <View style={tw`flex-1 ml-2 bg-gray-100 p-3 rounded-lg`}>
                      <Text style={tw`text-xs text-gray-500`}>EXPECTED IMPROVEMENT</Text>
                      <Text style={tw`text-base font-bold`}>{item.improvement}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      
      {/* Next Button */}
      {selectedGoal && (
        <View style={tw`px-5 mb-24`}> {/* Ajout de mb-24 pour espacer le bouton de la barre de navigation */}
          <TouchableOpacity
            style={tw`bg-violet-600 p-4 rounded-full items-center shadow-md`}
            onPress={() => navigation.navigate('Programmes', { goalId: selectedGoal })}
          >
            <Text style={tw`text-lg font-bold text-white`}>Commencer cet objectif</Text>
          </TouchableOpacity>
        </View>
      )}

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

export default Goals;