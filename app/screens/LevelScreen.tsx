import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_URL } from '../types';
import { RootStackParamList } from '../types';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; // Import du hook useAuth

type LevelScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LevelScreen'>;

interface Level {
  Level_Id: number;
  Level_Name: string;
  Image?: string;
  requiredXP?: number;
}

interface UserProgress {
  currentLevel: number;
  currentXP: number;
  unlockedLevels: number[];
}

const LevelScreen = () => {
  const navigation = useNavigation<LevelScreenNavigationProp>();
  const { user } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch levels and user progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all available levels
        const levelsResponse = await axios.get(`${API_URL}/api/levels`);
        
        // Fetch user-specific progress if logged in
        if (user?.userId) {
          const progressResponse = await axios.get(`${API_URL}/api/user/progress/${user.userId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          setUserProgress(progressResponse.data);
        }
        
        setLevels(levelsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        Alert.alert('Error', 'Failed to load levels data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Determine level status for UI
  const getLevelStatus = (levelId: number) => {
    if (!userProgress) return 'locked';
    
    if (levelId < userProgress.currentLevel) return 'completed';
    if (levelId === userProgress.currentLevel) return 'current';
    return 'locked';
  };

  // Handle level selection
  const handleSelectLevel = (levelId: number) => {
    const status = getLevelStatus(levelId);
    
    if (status === 'locked') {
      Alert.alert(
        'Level Locked',
        `You need to complete level ${userProgress?.currentLevel} first!`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate('Goals', { id: levelId });
  };

  // Render level card
  const renderLevelCard = (level: Level, index: number) => {
    const status = getLevelStatus(level.Level_Id);
    const isFirst = index === 0;

    return (
      <View key={level.Level_Id} style={tw`mb-4`}>
        {isFirst && (
          <View style={tw`mb-4`}>
            <TouchableOpacity 
              style={tw`bg-blue-400 rounded-xl p-4 flex-row items-center justify-between`}
              onPress={() => navigation.navigate('DashboardScreen')}
            >
              <View style={tw`flex-row items-center`}>
                <Feather name="clipboard" size={24} color="white" style={tw`mr-3`} />
                <Text style={tw`text-white font-bold text-lg`}>View My Progress</Text>
              </View>
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            <View style={tw`flex-row justify-center mt-2 mb-2`}>
              <View style={tw`w-2 h-2 bg-gray-400 rounded-full`}></View>
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            tw`bg-white rounded-xl p-4 shadow-sm`,
            status === 'locked' && tw`opacity-60`,
            status === 'current' && styles.currentLevel
          ]}
          onPress={() => handleSelectLevel(level.Level_Id)}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-16 h-16 mr-4 justify-center items-center`}>
                <Image 
                  source={level.Image ? { uri: level.Image } : require('../../assets/musclay.png')} 
                  style={tw`w-16 h-16 rounded-xl`} 
                  resizeMode="cover"
                />
                <View style={tw`absolute -bottom-1 w-12 h-1 bg-gray-200 rounded-full opacity-70`}></View>
              </View>
              
              <View>
                <Text style={tw`font-bold text-lg text-gray-800`}>{level.Level_Name}</Text>
                {status === 'completed' && (
                  <Text style={tw`text-green-500 text-xs`}>Completed</Text>
                )}
                {status === 'locked' && (
                  <Text style={tw`text-gray-500 text-xs`}>Locked</Text>
                )}
                {status === 'current' && (
                  <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-blue-500 text-xs mr-2`}>In Progress</Text>
                    {userProgress && (
                      <Text style={tw`text-xs text-gray-500`}>
                        {userProgress.currentXP}/{level.requiredXP || 1000} XP
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
            
            {status === 'completed' ? (
              <View style={tw`w-6 h-6 bg-green-500 rounded-full justify-center items-center`}>
                <Feather name="check" size={16} color="white" />
              </View>
            ) : status === 'locked' ? (
              <Feather name="lock" size={20} color="gray" />
            ) : (
              <View style={tw`w-24`}>
                <LinearGradient 
                  colors={['#FF4B8B', '#A450F8']} 
                  start={[0, 0]} 
                  end={[1, 0]} 
                  style={[
                    tw`h-1 rounded-full`,
                    { width: `${userProgress ? (userProgress.currentXP / (level.requiredXP || 1000)) * 100 : 0}%` }
                  ]}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        {status !== 'locked' && index < levels.length - 1 && (
          <View style={tw`flex-row justify-center mt-2 mb-2`}>
            <View style={tw`w-2 h-2 bg-gray-400 rounded-full`}></View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-blue-50`}>
        <ActivityIndicator size="large" color="#9188F1" />
        <Text style={tw`mt-4 text-gray-700`}>Loading your levels...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-blue-50`}>
        <Ionicons name="warning-outline" size={48} color="#ff4444" />
        <Text style={tw`mt-4 text-lg text-gray-700 px-8 text-center`}>{error}</Text>
        <TouchableOpacity
          style={tw`mt-6 bg-violet-600 px-6 py-3 rounded-full`}
          onPress={() => {
            setError(null);
            setLoading(true);
            // Retry fetching data
          }}
        >
          <Text style={tw`text-white font-bold`}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-blue-50`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <View style={tw`mb-6 relative`}>
          <Image 
            source={require('../../assets/musclay.png')} 
            style={tw`w-full h-40 rounded-xl`} 
            resizeMode="cover" 
          />
          <View style={tw`absolute bottom-4 left-4`}>
            <Text style={tw`text-2xl font-bold text-white`}>Your Training Levels</Text>
            <Text style={tw`text-white`}>
              {user 
                ? `Current Level: ${userProgress?.currentLevel || 1}`
                : 'Sign in to track your progress'}
            </Text>
          </View>
        </View>
        
        {levels.map((level, index) => renderLevelCard(level, index))}
      </ScrollView>
      
      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  currentLevel: {
    borderWidth: 2,
    borderColor: '#A450F8',
    shadowColor: '#A450F8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default LevelScreen;