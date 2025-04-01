import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Dimensions, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import { API_URL } from '../types';

type RouteParams = {
  levelId?: number;
  goalId: number; // Maintenant obligatoire
};

type RootStackParamList = {
  Programmes: { goalId: number };
  Exercises: { programId: number };
  Today: undefined;
  Workouts: undefined;
  Meals: undefined;
  Profile: undefined;
};

type ProgrammesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Programmes'>;

type Program = {
  Program_Id: number;
  Program_Name: string;
  Goal_Id: number;
  Icon?: string;
  Description?: string;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SCREEN_WIDTH * 0.22;

export default function Programmes() {
  const [programmes, setProgrammes] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<ProgrammesScreenNavigationProp>();
  const route = useRoute();
  const { goalId } = route.params as RouteParams;

  const programIcons = [
    'barbell-outline', 
    'bicycle-outline', 
    'body-outline', 
    'fitness-outline',
    'nutrition-outline'
  ];

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        if (!goalId) {
          throw new Error('Goal ID is required');
        }

        const response = await axios.get(`${API_URL}/api/programs/goal/${goalId}`);
        
        const enrichedData = response.data.map((program: Program, index: number) => ({
          ...program,
          Icon: programIcons[index % programIcons.length],
          Description: getProgramDescription(program.Program_Name)
        }));
        
        setProgrammes(enrichedData);
        if (enrichedData.length > 0) {
          setSelectedProgram(enrichedData[0].Program_Id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des programmes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [goalId]);

  const getProgramDescription = (programName: string) => {
    const descriptions: Record<string, string> = {
      'Cardio intense': 'Programme intensif pour améliorer votre endurance cardiovasculaire',
      'Programme prise de masse': 'Entraînement ciblé pour développer votre masse musculaire',
      'Fitness quotidien': 'Routine quotidienne pour maintenir votre forme physique',
      'Entraînement HIIT': 'Séances courtes et intenses pour maximiser la combustion des graisses',
      'Programme haltérophilie': 'Développez votre force maximale avec des exercices de puissance'
    };
    return descriptions[programName] || `Programme spécialisé pour ${programName.toLowerCase()}`;
  };

  const handleSelectProgram = (programId: number, index: number) => {
    setSelectedProgram(programId);
    setActiveIndex(index);
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
      setSelectedProgram(viewableItems[0].item.Program_Id);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged }
  ]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#00E676" />
        <Text style={tw`text-lg font-medium text-gray-700 mt-4`}>Chargement des programmes...</Text>
      </View>
    );
  }

  if (programmes.length === 0 && !loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="warning-outline" size={50} color="#888" />
        <Text style={tw`text-lg font-medium text-gray-700 mt-4`}>Aucun programme disponible pour cet objectif</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Program; index: number }) => (
    <TouchableOpacity
      style={tw`mx-2 bg-white rounded-3xl shadow-lg overflow-hidden w-${Math.round(ITEM_WIDTH)}`}
      onPress={() => handleSelectProgram(item.Program_Id, index)}
      activeOpacity={0.9}
    >
      <View style={tw`bg-violet-100 h-70 justify-center items-center`}>
        <Ionicons name={item.Icon as any} size={130} color="white" />
      </View>
      <View style={tw`p-5`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>{item.Program_Name}</Text>
        <Text style={tw`text-base text-gray-600 mt-2`}>{item.Description}</Text>
        
        <View style={tw`mt-4 flex-row items-center`}>
          <Ionicons name="time-outline" size={18} color="#888" />
          <Text style={tw`ml-2 text-gray-500`}>4-5 séances par semaine</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />
      
      <View style={tw`pt-12 pb-4 px-5`}>
        <Text style={tw`text-3xl font-bold text-gray-800`}>Programmes</Text>
        <Text style={tw`text-base text-gray-600 mt-1`}>Programmes adaptés à votre objectif</Text>
      </View>
      
      <View style={tw`flex-1`}>
        <FlatList
          ref={flatListRef}
          data={programmes}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + 16}
          decelerationRate="fast"
          contentContainerStyle={tw`py-4 px-2`}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          keyExtractor={(item) => item.Program_Id.toString()}
          renderItem={renderItem}
        />
        
        <View style={tw`flex-row justify-center my-4`}>
          {programmes.map((_, index) => (
            <View 
              key={index}
              style={tw`h-2 w-2 rounded-full mx-1 ${index === activeIndex ? 'bg-teal-500' : 'bg-gray-300'}`}
            />
          ))}
        </View>
      </View>
      
      {selectedProgram && (
        <View style={tw`px-5 pb-24`}>
          <TouchableOpacity
            style={tw`bg-violet-500 p-4 rounded-full items-center shadow-md`}
            onPress={() => navigation.navigate('Exercises', { programId: selectedProgram })}
          >
            <Text style={tw`text-lg font-bold text-white`}>Commencer ce programme</Text>
          </TouchableOpacity>
        </View>
      )}
      
     {/* Navbar */}
     <Navbar />
    </View>
  );
}
