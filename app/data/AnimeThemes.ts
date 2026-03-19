// Ce fichier sert à associer localement une image (URL ou require) à un thème (Anime)
// Puisque l'API Challenges ne stocke pas directement l'image principale de la série.

export interface AnimeThemeMedia {
    poster: string;
    cover: string;
    description: string;
}

export const ANIME_THEMES: Record<string, AnimeThemeMedia> = {
    'dragon ball': {
        poster: 'https://m.media-amazon.com/images/M/MV5BMGMyOThiMGUtYmFmZi00YWM0LWJiM2QtZGMwM2Q2ODE4MzhhXkEyXkFqcGdeQXVyMjc2Nzg5OTQ@._V1_FMjpg_UX1000_.jpg',
        cover: 'https://images.alphacoders.com/131/1314467.jpg',
        description: 'Repoussez vos limites comme un Saiyan. Des entraînements explosifs axés sur la force pure, la plyométrie et la puissance.'
    },
    'naruto': {
        poster: 'https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLTg4YjktOGY5Yzc2MDUxMTE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_FMjpg_UX1000_.jpg',
        cover: 'https://wallpapers.com/images/hd/naruto-shippuden-dual-monitor-sgyr9t45o895j0j3.jpg',
        description: 'Maîtrisez votre Chakra. Agilité, endurance et cardio intense, inspirés des entraînements ninjas de Konoha.'
    },
    'one punch man': {
        poster: 'https://m.media-amazon.com/images/M/MV5BMTM3Nzg0NTItZWU4My00ODlkLTlhZWYtY2EzZGVmMThhYzA3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        cover: 'https://images.alphacoders.com/681/681605.jpg',
        description: 'La routine absolue pour une force incommensurable : 100 pompes, 100 abdos, 100 squats, 10km de course.'
    },
    'attack on titan': {
        poster: 'https://m.media-amazon.com/images/M/MV5BNzc5MTczNDgtYzEwOS00MDQwLTg4YTQtZDExMDJlNDRmOTEzXkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_FMjpg_UX1000_.jpg',
        cover: 'https://images8.alphacoders.com/133/1332670.png',
        description: 'Une préparation militaire rigoureuse. Entraínements intenses pour survivre au-delà des murs et maîtriser le tridimensionnel.'
    },
    'default': {
        poster: 'https://via.placeholder.com/400x600/1F2937/FFFFFF?text=Anime+Workout',
        cover: 'https://via.placeholder.com/1200x800/111827/FFFFFF?text=Epic+Training',
        description: 'Un entraînement épique vous attend. Préparez-vous à transpirer.'
    }
};

export const getAnimeMedia = (theme?: string): AnimeThemeMedia => {
    if (!theme) return ANIME_THEMES['default'];
    // Recherche par mots-clés
    const lowerTheme = theme.toLowerCase();
    
    // Check direct
    if (ANIME_THEMES[lowerTheme]) return ANIME_THEMES[lowerTheme];
    
    // Check partial
    const key = Object.keys(ANIME_THEMES).find(k => lowerTheme.includes(k) || k.includes(lowerTheme));
    if (key) return ANIME_THEMES[key];

    return ANIME_THEMES['default'];
};
