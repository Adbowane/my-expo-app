import { StyleSheet } from 'react-native';
import tw from 'twrnc';

export const styles = StyleSheet.create({
  root: tw`flex-1 bg-white`,
  center: tw`flex-1 bg-white justify-center items-center`,
  header: tw`flex-row items-center justify-between px-4 pt-2`,
  titleContainer: tw`px-6 py-3`,
  programName: tw`text-gray-500 text-center text-sm font-medium`,
  exerciseName: tw`text-black text-center text-xl font-semibold mt-1`,
  timerContainer: tw`mx-6 bg-gray-100 rounded-2xl overflow-hidden`,
  timerRow: tw`flex-row items-center justify-between p-4`,
  timerLabel: tw`text-gray-500 text-xs font-medium`,
  timerValue: tw`text-3xl font-bold`,
  stopBtn: tw`bg-gray-800 rounded-lg px-4 py-1 mt-1`,
  stopBtnText: tw`text-white text-xs font-medium text-center`,
  playBtnCircle: tw`w-20 h-20 rounded-full justify-center items-center`,
  avatarContainer: tw`flex-1 justify-center items-center px-6 py-4`,
  avatarImage: tw`w-4/5 h-64`,
  footer: tw`px-6 pb-8`,
  nextExerciseRow: tw`flex-row items-center`,
  nextExerciseInfo: tw`ml-2`,
  nextExerciseLabel: tw`text-gray-400 text-xs`,
  nextExerciseName: tw`text-gray-600 text-sm`,
  errorText: tw`text-red-500 text-center text-lg`,
});
