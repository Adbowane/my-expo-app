import { View, Text, TouchableOpacity, ImageBackgroundBase} from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';

export default function Index() {

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ImageBackgroundBase
      source={require('../../assets/images/home.png')}
      className="flex-1 justify-center"
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <Text className="text-3xl font-bold text-white mb-2">🏋️‍♂️ Bienvenue sur FitnessAnime</Text>
        <Text className="text-xl text-white mb-8">
          Atteins tes objectifs fitness avec nous !
        </Text>
        <TouchableOpacity 
          className="bg-blue-500 py-3 px-6 rounded-lg"
          onPress={() => navigation.navigate('LevelScreen', { name: 'default' })}>
          <Text className="text-white font-bold text-lg">Commencer l'aventure</Text>
        </TouchableOpacity>
      </View>
    </ImageBackgroundBase>
  );
}


