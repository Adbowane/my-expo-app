import { StyleSheet, Dimensions } from 'react-native';
import tw from 'twrnc';

export const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const ITEM_WIDTH = SCREEN_WIDTH * 0.22;

export const styles = StyleSheet.create({
  root: tw`flex-1 bg-white`,
  loadingContainer: tw`flex-1 justify-center items-center bg-white`,
  loadingText: tw`text-lg font-medium text-gray-700 mt-4`,
  emptyContainer: tw`flex-1 justify-center items-center bg-white`,
  emptyText: tw`text-lg font-medium text-gray-700 mt-4`,
  header: tw`pt-12 pb-4 px-5`,
  title: tw`text-3xl font-bold text-gray-800`,
  subtitle: tw`text-base text-gray-600 mt-1`,
  card: tw`mx-2 bg-white rounded-3xl shadow-lg overflow-hidden h-100`,
  cardIconBox: tw`bg-violet-100 h-70 justify-center items-center`,
  cardPading: tw`p-5`,
  cardTitle: tw`text-2xl font-bold text-gray-800`,
  cardDesc: tw`text-base text-gray-600 mt-2`,
  cardMeta: tw`mt-4 flex-row items-center`,
  cardMetaText: tw`ml-2 text-gray-500`,
  dotContainer: tw`flex-row justify-center my-4`,
  dot: tw`h-2 w-2 rounded-full mx-1`,
  actionContainer: tw`px-5 pb-12`,
  mainBtn: tw`bg-violet-500 p-4 rounded-full items-center shadow-md`,
  mainBtnText: tw`text-lg font-bold text-white`,
});
