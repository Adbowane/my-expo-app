import { StyleSheet, Dimensions } from 'react-native';

const { width: W } = Dimensions.get('window');
export const BG_COLOR = '#0f172a'; // Slate-900 (très sombre)

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Pour la safearea + statusbar
    paddingBottom: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Léger blur visuel
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  logoAccent: {
    color: '#8B5CF6',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },

  // Hero
  heroContainer: {
    height: 500,
    width: W,
  },
  heroSlide: {
    width: W,
    height: 500,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroGradient: {
    height: 250,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroThemeBadge: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  playBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  playBtnText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  infoBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Cats
  categoriesSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: -10,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catPillEmoji: {
    fontSize: 16,
  },
  catPillText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
  },

  // Lists
  listSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  listScroll: {
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    width: 140,
    height: 200,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  cardGradient: {
    padding: 10,
    height: 80,
    justifyContent: 'flex-end',
    borderRadius: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // V-List
  verticalList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  hCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 8,
  },
  hCardImg: {
    width: 80, height: 60,
  },
  hCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  hCardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  hCardTheme: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
});
