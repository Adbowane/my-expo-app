import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator,Image,FlatList,Dimensions,StatusBar} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

// Définition du type pour les paramètres de route
type RouteParams = {
  levelId?: number;
  goalId?: number;
};

// Définition correcte du type de navigation
type RootStackParamList = {
  Programmes: undefined;
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
  // Ajout de champs pour l'interface visuelle
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
  const { levelId, goalId } = (route.params as RouteParams) || {};

  // Icônes pour les différents types de programmes
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
        const response = await axios.get('http://172.31.16.1:3000/api/programs');
        
        // Enrichir les données avec des descriptions et icônes
        const enrichedData = response.data.map((program: Program, index: number) => ({
          ...program,
          Icon: programIcons[index % programIcons.length],
          Description: `Programme adapté pour atteindre vos objectifs de ${program.Program_Name.toLowerCase()}`
        }));
        
        setProgrammes(enrichedData);
      } catch (error) {
        console.error('Erreur lors de la récupération des programmes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

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
      
      {/* Header */}
      <View style={tw`pt-12 pb-4 px-5`}>
        <Text style={tw`text-3xl font-bold text-gray-800`}>Programmes</Text>
        <Text style={tw`text-base text-gray-600 mt-1`}>Sélectionnez votre programme d'entraînement</Text>
      </View>
      
      {/* Carousel */}
      <View style={tw`flex-1 `}>
        <FlatList
          ref={flatListRef}
          data={programmes}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + 16} // 16 est pour les marges
          decelerationRate="fast"
          contentContainerStyle={tw`py-4 px-2 `}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          keyExtractor={(item) => item.Program_Id.toString()}
          renderItem={renderItem}
        />
        
        {/* Indicators */}
        <View style={tw`flex-row justify-center my-4`}>
          {programmes.map((_, index) => (
            <View 
              key={index}
              style={tw`h-2 w-2 rounded-full mx-1 ${index === activeIndex ? 'bg-teal-500' : 'bg-gray-300'}`}
            />
          ))}
        </View>
      </View>
      
      {/* Action Button */}
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
    </View>
  );
}