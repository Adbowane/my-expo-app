import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LevelScreen from './screens/Gamification/LevelScreen';
import ExerciseDetails from './screens/Exercises/ExerciseDetails';
import Exercises from './screens/Exercises/Exercises';
import Home from './screens/Home';
import IndexScreen from './screens/IndexScreen';
import SettingsScreen from './screens/Settings/SettingsScreen';
import DashboardScreen from './screens/UserProgress/DashboardScreen';
import Programmes from './screens/Gamification/ProgrammesScreen';
import Goals from './screens/Gamification/Goals';
import { RootStackParamList } from './types';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import LoginRegisterScreen from './LoginRegisterScreen';
import { AuthProvider, useAuth } from './screens';
import CharacterScreen from './screens/UserProgress/CharacterScreen';
import { AvatarProvider } from './context/AvatarContext';
import { AnimeDiscoverScreen, AnimeSearchScreen, AnimeDetailsScreen } from './screens';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AuthProvider>
      <AvatarProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="IndexScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginRegisterScreen" component={LoginRegisterScreen} />
            <Stack.Screen name="Programmes" component={Programmes} />
            <Stack.Screen name="Goals" component={Goals} />
            <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
            <Stack.Screen name="IndexScreen" component={IndexScreen} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="LevelScreen" component={LevelScreen} />
            <Stack.Screen name="ExerciseDetails" component={ExerciseDetails} />
            <Stack.Screen name="Exercises" component={Exercises} />
            <Stack.Screen name="CharacterScreen" component={CharacterScreen} />
            {/* Nouvelles routes Anime */}
            <Stack.Screen name="AnimeDiscoverScreen" component={AnimeDiscoverScreen} />
            <Stack.Screen name="AnimeSearchScreen" component={AnimeSearchScreen} />
            <Stack.Screen name="AnimeDetailsScreen" component={AnimeDetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AvatarProvider>
    </AuthProvider>
  );
};

export default App;
