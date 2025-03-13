import { View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home(): JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  return(
    <View>
      <Text>Home</Text>
      <TouchableOpacity onPress={() => navigation.navigate('LevelScreen', { name: 'defaultName' })}>
        <Text>Index</Text>
      </TouchableOpacity>
    </View>
  );

}; 
