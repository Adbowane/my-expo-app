import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import tw from 'twrnc';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function IndexScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ImageBackground
      source={require('../../assets/images/home.png')}
      style={tw`flex-1 justify-center`}
    >
      <View style={tw`flex-1 bg-black/50 items-center justify-center p-6`}>
        <Text style={tw`text-3xl font-bold text-white mb-2`}>🏋️‍♂️ Bienvenue sur FitnessAnime</Text>
        <Text style={tw`text-xl text-white mb-8`}>
          Atteins tes objectifs fitness avec nous !
        </Text>
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 px-6 rounded-lg`}
          onPress={() => navigation.navigate('LoginRegisterScreen', { name: 'default' })}
        >
          <Text style={tw`text-white font-bold text-lg`}>Commencer l'aventure</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}