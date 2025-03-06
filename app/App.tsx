import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LevelScreen from './screens/LevelScreen';
import ExerciseDetails from './screens/ExerciseDetails';
import {ScreenContent} from './screens/ScreenContent';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LevelScreen">
        <Stack.Screen name="LevelScreen" component={LevelScreen} />
        <Stack.Screen name="ExerciseDetails" component={ExerciseDetails} />

        {/* <Stack.Screen name="Content" component={ScreenContent} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;