import { Dimensions } from 'react-native';

export const fallbackImages = {
  'Perte de poids': 'https://tse4.mm.bing.net/th?id=OIG3.RAolgCJjIH4B4ovrt1tf&pid=ImgGn',
  'Gain musculaire': 'https://tse4.mm.bing.net/th?id=OIG3.RAolgCJjIH4B4ovrt1tf&pid=ImgGn',
  'Maintien de forme': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1169&auto=format&fit=crop',
  'Endurance cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1170&auto=format&fit=crop',
  'Force maximale': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1170&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop'
};

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const CARD_WIDTH = SCREEN_WIDTH * 0.8; // Augmenté pour avoir des cartes plus grandes
