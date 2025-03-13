import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import axios from 'axios';

// Définition du type pour les paramètres de route
type RouteParams = {
  levelId?: number;
  goalId?: number;
};

// Définition correcte du type de navigation
type RootStackParamList = {
  Programmes: undefined;
  Exercises: { programId: number };
};

type ProgrammesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Programmes'>;

type Program = {
  Program_Id: number;
  Program_Name: string;
  Goal_Id: number;
};

export default function Programmes() {
  const [programmes, setProgrammes] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  const navigation = useNavigation<ProgrammesScreenNavigationProp>();
  const route = useRoute();
  const { levelId, goalId } = (route.params as RouteParams) || {}; // Vérification des paramètres

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://172.31.16.1:3000/api/programs');
        setProgrammes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des programmes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleSelectProgram = (programId: number) => {
    setSelectedProgram(programId === selectedProgram ? null : programId);
  };

  if (loading) {
    return (
      <View style={tw`flex-1 p-5 bg-[#A020F0]`}>
        <ActivityIndicator size="large" color="#A020F0" />
        <Text style={tw`text-2xl font-bold text-white text-center mt-4`}>Chargement des programmes...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-5 bg-[#A020F0]`}>
      <Text style={tw`text-3xl font-bold text-white text-center mb-5`}>💪 Choisis un Programme</Text>
      <FlatList
        data={programmes}
        keyExtractor={(item) => item.Program_Id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              tw`bg-white p-4 rounded-xl mb-3 border border-gray-300`,
              item.Program_Id === selectedProgram && tw`border-[#7CFC00] border-2`,
            ]}
            onPress={() => handleSelectProgram(item.Program_Id)}
          >
            <Text style={tw`text-xl font-semibold`}>{item.Program_Name}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedProgram && (
        <TouchableOpacity
          style={tw`bg-[#7CFC00] p-4 rounded-xl items-center mt-5`}
          onPress={() => navigation.navigate('Exercises', { programId: selectedProgram })}
        >
          <Text style={tw`text-lg font-bold text-white`}>Suivant</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};