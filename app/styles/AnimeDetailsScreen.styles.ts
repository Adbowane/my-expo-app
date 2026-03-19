import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const BG_COLOR = '#0f172a'; // Slate-900

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: BG_COLOR,
    },
    centerBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 16,
        marginTop: 12,
        marginBottom: 20,
    },
    backBtnFallback: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    heroWrapper: {
        height: 480,
        width: '100%',
    },
    heroBg: {
        flex: 1,
    },
    heroGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        marginBottom: 20,
    },
    heroTheme: {
        color: '#8B5CF6',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 16,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        color: '#cbd5e1',
        fontSize: 12,
        fontWeight: '700',
    },
    tagAccent: {
        backgroundColor: '#FACC15',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagAccentText: {
        color: '#000',
        fontSize: 10,
        fontWeight: '900',
    },
    playActionRow: {
        paddingHorizontal: 20,
        marginTop: -30,
        zIndex: 10,
    },
    playBtnMain: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    playBtnTextMain: {
        color: '#0f172a',
        fontSize: 16,
        fontWeight: '900',
    },
    bodySection: {
        padding: 20,
    },
    descText: {
        color: '#94a3b8',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24,
    },
    workoutsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
    },
    workoutsCount: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    },
    workoutsList: {
        gap: 12,
    },
    exoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    exoNumBox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    exoNumText: {
        color: '#8B5CF6',
        fontSize: 14,
        fontWeight: '900',
    },
    exoContent: {
        flex: 1,
    },
    exoName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    exoTime: {
        color: '#64748b',
        fontSize: 13,
    },
});
