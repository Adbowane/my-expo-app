import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/themed';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

type LevelScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LevelScreen'>;

const LevelScreen = () => {
  const navigation = useNavigation<LevelScreenNavigationProp>();
  
  interface Level {
    Level_Id: number;
    Level_Name: string;
    Image?: string;
  }

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setError(null);
        const response = await axios.get('http://172.31.16.1:3000/api/levels');
        setLevels(response.data);
      } catch (err) {
        console.error('Error fetching levels:', err);
        setError('Impossible de récupérer les niveaux.');
        Alert.alert('Erreur', 'Impossible de récupérer les niveaux.');
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  return (
    <ScrollView contentContainerStyle={tw`p-4 bg-[#1A1B41]`}>  
   
      <LinearGradient colors={["#9188F1", "#6A5ACD"]} style={tw`p-5 rounded-xl mb-6`}>
        <Text style={tw`text-3xl font-bold text-white text-center`}>Niveaux</Text>
      </LinearGradient>
      
      {loading ? (
        <ActivityIndicator size="large" color="#9188F1" style={tw`mt-10`} />
      ) : error ? (
        <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
      ) : (
        levels.map((level) => (
          <TouchableOpacity 
            key={level.Level_Id} 
            style={tw`mb-4`} 
            onPress={() => navigation.navigate('Goals', { id: level.Level_Id })}
          >
            <Card containerStyle={tw`rounded-xl p-0 bg-[#2D2E6F] border-0`}> 
              <Card.Title style={tw`text-lg text-white`}>{level.Level_Name}</Card.Title>
              <Card.Divider style={tw`border-gray-500`} />
              <Image 
                source={level.Image ? { uri: level.Image } : require('../../assets/musclay.png')} 
                style={tw`w-full h-40 rounded-b-xl`} 
                resizeMode="cover"
              />
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default LevelScreen;
