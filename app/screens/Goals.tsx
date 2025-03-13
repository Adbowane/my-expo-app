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
  Goals: undefined;
  Programmes: { goalId: number };
  LevelScreen: { programId: number };
};

type GoalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Goals'>;

type Goal = {
  Goal_Id: number;
  Goal_Name: string;
};

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  const navigation = useNavigation<GoalsScreenNavigationProp>();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('http://172.31.16.1:3000/api/goals');
        setGoals(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des objectifs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleSelectGoal = (goalId: number) => {
    setSelectedGoal(goalId === selectedGoal ? null : goalId);
  };

  if (loading) {
    return (
      <View style={tw`flex-1 p-5 bg-[#A020F0]`}>
        <ActivityIndicator size="large" color="#A020F0" />
        <Text style={tw`text-2xl font-bold text-white text-center mt-4`}>Chargement des objectifs...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-5 bg-[#A020F0]`}>
      <Text style={tw`text-3xl font-bold text-white text-center mb-5`}>🎯 Choisis un Objectif</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.Goal_Id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              tw`bg-white p-4 rounded-xl mb-3 border border-gray-300`,
              item.Goal_Id === selectedGoal && tw`border-[#7CFC00] border-2`,
            ]}
            onPress={() => handleSelectGoal(item.Goal_Id)}
          >
            <Text style={tw`text-xl font-semibold`}>{item.Goal_Name}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedGoal && (
        <TouchableOpacity
          style={tw`bg-[#7CFC00] p-4 rounded-xl items-center mt-5`}
          onPress={() => navigation.navigate('Programmes', { goalId: selectedGoal })}
        >
          <Text style={tw`text-lg font-bold text-white`}>Suivant</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Goals;