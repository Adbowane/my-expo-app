import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // Ensure this path is correct
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

// Define the navigation prop type for this screen
type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 py-2 bg-white border-b border-gray-200`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={tw`text-2xl`}>←</Text>
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SettingScreen')}>
          <Text style={tw`text-2xl`}>≡</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={tw`items-center mt-4`}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual image URL
          style={tw`w-24 h-24 rounded-full`}
        />
        <Text style={tw`text-lg font-semibold mt-2`}>Isabell Roberts</Text>
        <Text style={tw`text-gray-500`}>@isabell_roberts</Text>
        <View style={tw`flex-row items-center bg-gray-200 px-4 py-2 rounded-full mt-2`}>
          <Text style={tw`text-xl`}>👣</Text>
          <Text style={tw`text-lg font-medium ml-2`}>6,859</Text>
          <Text style={tw`text-gray-600 ml-1`}>Steps today</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={tw`mt-6 px-4`}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Friends')}
          style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}
        >
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl`}>👥</Text>
            <Text style={tw`text-base ml-3`}>Friends</Text>
          </View>
          <Text style={tw`text-gray-400`} >></Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Statistics')}
          style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}
        >
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl`}>📊</Text>
            <Text style={tw`text-base ml-3`}>Statistics</Text>
          </View>
          <Text style={tw`text-gray-400`}>></Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Academy')}
          style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}
        >
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl`}>📚</Text>
            <Text style={tw`text-base ml-3`}>Academy</Text>
          </View>
          <Text style={tw`text-gray-400`}>></Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Strengthlog')}
          style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}
        >
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl`}>💪</Text>
            <Text style={tw`text-base ml-3`}>Strengthlog</Text>
          </View>
          <Text style={tw`text-gray-400`}>></Text>
        </TouchableOpacity>

        <View style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl`}>🎵</Text>
            <Text style={tw`text-base ml-3`}>Sound</Text>
          </View>
          <Switch
            trackColor={{ false: '#d4d4d4', true: '#34c759' }}
            thumbColor={'#fff'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => setSoundEnabled(value)}
            value={soundEnabled}
          />
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={[tw`flex-row justify-around items-center bg-black p-2`, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={tw`text-white`}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Jumps')}>
          <Text style={tw`text-white`}>Jumps</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Battle')}>
          <Text style={tw`text-white`}>Battle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
          <Text style={tw`text-white`}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={tw`text-white`}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;