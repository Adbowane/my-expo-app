import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types/Home.types';

export default function Home(): JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View>
      <Text>Home</Text>
      <TouchableOpacity onPress={() => navigation.navigate('LevelScreen', { name: 'defaultName' })}>
        <Text>Index</Text>
      </TouchableOpacity>
    </View>
  );

}; 
