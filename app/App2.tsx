import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LevelScreen from './screens/LevelScreen';
import ExerciseDetails from './screens/ExerciseDetails';
import Exercises from './screens/Exercises';
import Home from './screens/Home';
import IndexScreen from './screens/IndexScreen';
import SettingsScreen from './screens/SettingsScreen';
import DashboardScreen from './screens/DashboardScreen';
import Programmes from './screens/ProgrammesScreen';
import Goals from './screens/Goals';
import { RootStackParamList } from './types';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import LoginRegisterScreen from './LoginRegisterScreen';
import { AuthProvider, useAuth } from './screens';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="IndexScreen">
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
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
