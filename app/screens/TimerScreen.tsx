import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const TimerScreen = () => {
  let mt = 200;
  const [timeLeft, setTimeLeft] = useState<number>(mt); // Initial timer set to 60 seconds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Decrease time every second
    }
    return () => clearInterval(timer); // Cleanup interval on unmount or re-run
  }, [isTimerRunning, timeLeft]);

  const startTimer = () => {
    if (!isTimerRunning && timeLeft > 0) {
      setIsTimerRunning(true);
    }
  };

  return (
    <View style={tw`flex-1 bg-[#1A1B41] justify-center items-center`}>
      <LinearGradient colors={['#9188F1', '#6A5ACD']} style={tw`p-5 rounded-xl mb-6`}>
        <Text style={tw`text-3xl font-bold text-white text-center`}>Minuteur</Text>
      </LinearGradient>
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-6xl font-bold text-white mb-5`}>{timeLeft}</Text>
        <TouchableOpacity
          onPress={startTimer}
          style={tw`mt-5 bg-green-500 p-3 rounded-full`}
          disabled={isTimerRunning || timeLeft === 0}
        >
          <FontAwesome name="play" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimerScreen;
