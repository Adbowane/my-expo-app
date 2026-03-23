import { StyleSheet, Dimensions } from 'react-native';
import tw from 'twrnc';

export const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Increased from 0.22 to 0.80 for a proper horizontal carousel UX
export const ITEM_WIDTH = SCREEN_WIDTH * 0.80; 
export const SPACING = 16;

export const styles = StyleSheet.create({
  root: tw`flex-1 bg-white`,
  loadingContainer: tw`flex-1 justify-center items-center bg-white z-10`,
  loadingText: tw`text-lg font-medium text-gray-700 mt-4`,
  emptyContainer: tw`flex-1 justify-center items-center bg-white`,
  emptyText: tw`text-lg font-medium text-gray-700 mt-4 text-center px-6`,
  
  header: tw`pt-14 pb-4 px-6`,
  title: tw`text-4xl font-extrabold text-gray-800 tracking-tight`,
  subtitle: tw`text-base text-gray-500 mt-2 font-medium`,
  
  listContentContainer: tw`px-4 py-4`,
  
  cardWrapper: {
    width: ITEM_WIDTH,
    marginHorizontal: SPACING / 2,
    paddingBottom: 24,
    paddingTop: 8,
  },
  
  card: tw`bg-white rounded-[32px] overflow-hidden flex-1 shadow-lg shadow-gray-200 border border-gray-100`,
  cardActive: tw`border-violet-500 shadow-violet-200 border-2`,
  
  cardImageContainer: tw`bg-violet-100 justify-center items-center h-56 relative`,
  
  badgeContainer: tw`absolute top-4 right-4 bg-teal-500 px-3 py-1.5 rounded-full z-10`,
  badgeText: tw`text-white text-xs font-bold uppercase tracking-widest`,
  
  cardIconCircle: tw`bg-white w-24 h-24 rounded-full justify-center items-center shadow-sm`,
  
  cardPading: tw`p-6 h-52 justify-between bg-white`,
  cardTitle: tw`text-2xl font-bold text-gray-800 mb-2 leading-tight`,
  cardDesc: tw`text-base text-gray-600 leading-relaxed`,
  
  cardFooter: tw`flex-row items-center border-t border-gray-100 pt-4 mt-2`,
  cardMeta: tw`flex-row items-center`,
  cardMetaText: tw`ml-2 text-sm font-medium text-gray-500`,
  
  paginationContainer: tw`flex-row justify-center items-center mt-2 mb-6`,
  dot: tw`h-2.5 rounded-full mx-1.5 duration-300`,
  dotActive: tw`w-8 bg-violet-500`,
  dotInactive: tw`w-2.5 bg-gray-300`,
  
  actionContainer: tw`px-6 pb-8 pt-2`,
  mainBtn: tw`bg-violet-500 p-4 rounded-full flex-row items-center justify-center shadow-lg shadow-violet-200`,
  mainBtnText: tw`text-lg font-bold text-white mr-2`,
});
