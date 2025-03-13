import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

const DashboardScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={tw`flex-1 bg-white`}
        showsVerticalScrollIndicator={false}>
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200`}>
        <View style={tw`flex-row items-center`}>
          <Image
            source={{ uri: 'https://via.placeholder.com/30' }} // Placeholder for avatar
            style={tw`w-8 h-8 rounded-full mr-2`}
          />
          <View>
            <Text style={tw`text-sm text-gray-500`}>Welcome 🌱</Text>
            <Text style={tw`text-lg font-semibold`}>Sophia Muller</Text>
          </View>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity style={tw`mr-4`}>
            <Text style={tw`text-2xl`}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={tw`w-5 h-5 bg-red-500 rounded-full flex items-center justify-center`}>
              <Text style={tw`text-white text-xs`}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Challenge Section */}
      <View style={tw`mx-4 mt-4 p-4 bg-purple-200 rounded-lg relative`}>
        <TouchableOpacity style={tw`absolute top-2 right-2`}>
          <Text style={tw`text-gray-500`}>×</Text>
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-purple-800`}>Daily Challenge</Text>
        <Text style={tw`text-sm text-gray-700 mt-2`}>
          Sprint for 30 seconds. Repeat this interval 5 times.
        </Text>
        <TouchableOpacity style={tw`mt-4 bg-purple-600 px-4 py-2 rounded-full`}>
          <Text style={tw`text-white text-center`}>Done ></Text>
        </TouchableOpacity>
      </View>

      {/* Today Stats Section */}
      <View style={tw`mx-4 mt-4 h-65`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-lg font-semibold`}>Today Stats</Text>
          <TouchableOpacity>
            <Text style={tw`text-blue-500`}>See All ></Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`flex-row`}
        >
          <View style={tw`bg-green-100 p-4 rounded-lg w-72 mr-2`}>
            <Text style={tw`text-xs text-gray-500 `}>Daily Steps</Text>
            <Text style={tw`text-2xl font-bold mt-1`}>900 Steps</Text>
          </View>
          <View style={tw`bg-blue-100 p-4 rounded-lg w-72 mr-2`}>
            <Text style={tw`text-xs text-gray-500`}>Calories</Text>
            <Text style={tw`text-2xl font-bold mt-1`}>150 kcal</Text>
          </View>
          <View style={tw`bg-pink-100 p-4 rounded-lg w-72 mr-2`}>
            <Text style={tw`text-xs text-gray-500`}>Heart</Text>
            <Text style={tw`text-2xl font-bold mt-1`}>80</Text>
          </View>
          <View style={tw`bg-yellow-100 p-4 rounded-lg w-72 mr-2`}>
            <Text style={tw`text-xs text-gray-500`}>Sleep</Text>
            <Text style={tw`text-2xl font-bold mt-1`}>8 hrs</Text>
          </View>
        </ScrollView>
      </View>

      {/* Recent Activity Section */}
      <View style={tw`mx-4 mt-4`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-lg font-semibold`}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={tw`text-blue-500`}>See All ></Text>
          </TouchableOpacity>
        </View>
        <View style={tw`bg-gray-100 p-4 rounded-lg`}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300x150' }} // Placeholder for map
            style={tw`w-full h-40 rounded-lg`}
          />
          <View style={tw`flex-row justify-between items-center mt-2`}>
            <View style={tw`flex-row items-center`}>
              <Image
                source={{ uri: 'https://via.placeholder.com/20' }} // Placeholder for avatar
                style={tw`w-5 h-5 rounded-full mr-2`}
              />
              <Text>Jogging at Park</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-gray-500 mr-2`}>3 Apr - 07:00 am</Text>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/15' }} // Placeholder for small avatars
                  style={tw`w-3 h-3 rounded-full mr-1`}
                />
                <Text style={tw`text-gray-500`}>+2</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Safe Area Padding at Bottom */}
      <View style={{ paddingBottom: insets.bottom }} />
    </View>
    </ScrollView>
  );
};

export default DashboardScreen;