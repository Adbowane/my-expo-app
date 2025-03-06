import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/themed';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';

type LevelScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LevelScreen'>;

const LevelScreen = () => {
  const navigation = useNavigation<LevelScreenNavigationProp>();
  interface Level {
    Level_Id: number;
    Level_Name: string;
    Image?: string;
  }

  const [levels, setLevels] = useState<Level[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://grumpy-lines-smash.loca.lt/api/levels') // Remplacez par l'adresse IP locale de votre machine
      .then((response) => response.json())
      .then((data) => setLevels(data))
      .catch((error) => {
        console.error('Error fetching levels:', error);
        setError(error.toString());
        Alert.alert('Error', 'Failed to fetch levels data');
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={[tw`p-4`, { backgroundColor: '#1A1B41' }]}>
      <LinearGradient colors={["#9188F1", "#6A5ACD"]} style={tw`p-5 rounded-xl mb-6`}>
        <Text style={tw`text-3xl font-bold text-white text-center`}>Niveaux</Text>
      </LinearGradient>

      {error && <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>}

      {levels.map((level) => (
        <TouchableOpacity
          key={level.Level_Id}
          style={tw`mb-4`}
          onPress={() => navigation.navigate('ExerciseDetails', { id: level.Level_Id })}>
          <Card containerStyle={[tw`rounded-xl p-0`, { backgroundColor: '#2D2E6F', borderWidth: 0 }]}>
            <Card.Title style={tw`text-lg text-white`}>{level.Level_Name}</Card.Title>
            <Card.Divider style={tw`border-gray-500`} />
            <ImageBackground
              source={level.Image ? { uri: level.Image } : require('../../assets/musclay.png')}
              style={tw`h-52 w-full rounded-b-xl`}
              resizeMode="cover"
            >
              {/* Optionally add content over the image */}
            </ImageBackground>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default LevelScreen;