import { StyleSheet, Dimensions } from 'react-native';

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const PURPLE = '#6C4EF6';
export const PURPLE_DARK = '#4B2FCE';
export const BG = '#F0EDFF';

export const MORPHOLOGIES_MALE = [
  { key: 'slim', label: 'MINCE', emoji: '🧍' },
  { key: 'athletic', label: 'ATHLÉTIQUE', emoji: '🏃' },
  { key: 'muscular', label: 'MUSCLÉ', emoji: '💪' },
  { key: 'tall', label: 'GRAND', emoji: '⬆️' },
  { key: 'robust', label: 'ROBUSTE', emoji: '🦁' },
  { key: 'powerful', label: 'PUISSANT', emoji: '🔥' },
];

export const MORPHOLOGIES_FEMALE = [
  { key: 'slim_f', label: 'MINCE', emoji: '🧍‍♀️' },
  { key: 'athletic_f', label: 'ATHLÉTIQUE', emoji: '🏃‍♀️' },
  { key: 'slim_f2', label: 'MINCE', emoji: '💃' },
  { key: 'tall_f', label: 'GRANDE', emoji: '⬆️' },
  { key: 'sport_f', label: 'SPORTIVE', emoji: '🎽' },
  { key: 'energetic_f', label: 'ÉNERGIQUE', emoji: '⚡' },
];

export const OUTFIT_COLORS = [
  { key: 'purple', hex: '#7C3AED', label: 'Violet' },
  { key: 'pink', hex: '#EC4899', label: 'Rose' },
  { key: 'dark', hex: '#374151', label: 'Sombre' },
  { key: 'slate', hex: '#64748B', label: 'Gris' },
  { key: 'blue', hex: '#3B82F6', label: 'Bleu' },
  { key: 'red', hex: '#EF4444', label: 'Rouge' },
];

export const SKIN_TONES = [
  { key: 'light', hex: '#F5D5BA' },
  { key: 'medium', hex: '#C68642' },
  { key: 'dark', hex: '#8D5524' },
  { key: 'warm', hex: '#E8975A' },
];

export const OUTFIT_TABS = ['HAUTS', 'BAS', 'CHAUSSURES'] as const;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
  },
  headerSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },

  // Sections
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#6C4EF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Genre
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  genderCard: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 10,
    backgroundColor: '#FAFAFA',
  },
  genderCardSelected: {
    borderColor: PURPLE,
    backgroundColor: '#F0EDFF',
  },
  genderAvatarBg: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  genderAvatarBgSelected: {
    backgroundColor: '#DDD6FE',
  },
  genderEmoji: {
    fontSize: 36,
  },
  genderLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  selectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  selectBadgeActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  selectBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Preview 3D
  previewContainer: {
    width: SCREEN_W * 0.35,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#EDE9FF',
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(237,233,255,0.7)',
  },

  // Morphologies
  morphGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  morphCard: {
    width: '30%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 10,
    backgroundColor: '#FAFAFA',
    marginBottom: 4,
  },
  morphCardSelected: {
    borderColor: PURPLE,
    backgroundColor: '#F0EDFF',
  },
  morphEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  morphLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  morphLabelSelected: {
    color: PURPLE,
  },

  // Tenue — onglets
  outfitTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  outfitTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  outfitTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outfitTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  outfitTabTextActive: {
    color: PURPLE,
    fontWeight: '800',
  },

  // Couleurs
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Peau
  skinRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skinSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  skinSwatchSelected: {
    borderWidth: 3,
    borderColor: PURPLE,
  },

  // Bouton confirmer
  confirmBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmBtn: {
    backgroundColor: PURPLE,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
