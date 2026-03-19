import { StyleSheet, Dimensions } from 'react-native';

const BG_COLOR = '#0f172a'; // Slate-900 
const { width: W } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BG_COLOR,
  },
  backBtn: {
    paddingRight: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: '100%',
  },
  
  // Filters
  filterSection: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterChipText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: '#fff',
  },

  // Grid
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
      color: '#64748b',
      fontSize: 16,
      marginTop: 10,
  },
  resultsGrid: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 50,
  },
  resultsCount: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 16,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    width: (W - 32 - 12) / 2, // 2 columns
    height: 220,
    marginBottom: 8,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gridGradient: {
    padding: 12,
    height: 100,
    justifyContent: 'flex-end',
    borderRadius: 8,
  },
  gridTheme: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  gridTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
