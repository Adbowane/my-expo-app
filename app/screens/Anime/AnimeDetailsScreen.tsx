import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ImageBackground,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

import { API_URL } from '../../types';
import { getAnimeMedia } from '../../data/AnimeThemes';

// Imports types & styles
import { Challenge, Exercise, Nav, DetailsRouteProp } from '../../types/AnimeDetailsScreen.types';
import { styles, BG_COLOR } from '../../styles/AnimeDetailsScreen.styles';

export default function AnimeDetailsScreen() {
    const navigation = useNavigation<Nav>();
    const route = useRoute<DetailsRouteProp>();
    const { theme, challengeId } = route.params;

    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);

    // Média mocké basé sur le thème
    const media = getAnimeMedia(theme);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let currentChallenge = null;

                // 1. Récupérer le challenge spécifique ou le premier de ce thème
                if (challengeId) {
                    const res = await axios.get(`${API_URL}/api/challenges/${challengeId}`);
                    currentChallenge = res.data;
                } else {
                    const res = await axios.get(`${API_URL}/api/challenges`);
                    const all = Array.isArray(res.data) ? res.data : res.data.challenges || [];
                    currentChallenge = all.find((c: Challenge) => c.theme === theme);
                }

                if (currentChallenge) {
                    setChallenge(currentChallenge);

                    // Simulation d'une routine rattachée à cet anime
                    setExercises([
                        { Exercise_Id: 101, Exercise_Name: 'Échauffement Ninja', Time: '00:03:00' },
                        { Exercise_Id: 102, Exercise_Name: 'Pompes Explosives', Time: '00:01:30' },
                        { Exercise_Id: 103, Exercise_Name: 'Squat Sprint', Time: '00:02:00' },
                        { Exercise_Id: 104, Exercise_Name: 'Récupération', Time: '00:01:00' },
                    ]);
                }
            } catch (err) {
                console.warn('Erreur AnimeDetails:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [challengeId, theme]);

    if (loading) {
        return (
            <View style={[styles.root, styles.centerBox]}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        )
    }

    if (!challenge) {
        return (
            <View style={[styles.root, styles.centerBox]}>
                <Ionicons name="sad-outline" size={60} color="#334155" />
                <Text style={styles.emptyText}>Entraînement introuvable.</Text>
                <TouchableOpacity style={styles.backBtnFallback} onPress={() => navigation.goBack()}>
                    <Text style={{ color: '#fff' }}>Retour</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                {/* ── HEADER HERO ── */}
                <View style={styles.heroWrapper}>
                    <ImageBackground source={{ uri: media.poster }} style={styles.heroBg} resizeMode="cover">
                        <LinearGradient
                            colors={['rgba(15, 23, 42, 0.4)', 'transparent', BG_COLOR]} // Fades vers BG_COLOR
                            style={styles.heroGradient}
                        >
                            {/* Header Actions */}
                            <View style={styles.headerTop}>
                                <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                                    <Ionicons name="arrow-back" size={24} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconCircle}>
                                    <Ionicons name="heart-outline" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            {/* Infos Bas du Hero */}
                            <View style={styles.heroContent}>
                                <Text style={styles.heroTheme}>{challenge.theme?.toUpperCase()}</Text>
                                <Text style={styles.heroTitle}>{challenge.nom_challenge}</Text>

                                <View style={styles.tagsRow}>
                                    <View style={styles.tag}>
                                        <Text style={styles.tagText}>{challenge.dure_challenge || '20 Min'}</Text>
                                    </View>
                                    <View style={styles.tag}>
                                        <Text style={styles.tagText}>{challenge.difficulte || 'Extrême'}</Text>
                                    </View>
                                    <View style={styles.tagAccent}>
                                        <Text style={styles.tagAccentText}>✨ VEDETTE</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </View>

                {/* ── BOUTON JOUER (Fixé ou Scrollable) ── */}
                <View style={styles.playActionRow}>
                    <TouchableOpacity
                        style={styles.playBtnMain}
                        onPress={() => {
                            // Mène vers l'écran d'exercice avec l'ID du premier exercice animé
                            navigation.navigate('ExerciseDetails', {
                                exerciseId: exercises[0]?.Exercise_Id || 1, // Fallback ID
                                exercises: exercises.map(e => e.Exercise_Id)
                            });
                        }}
                    >
                        <Ionicons name="play" size={24} color="#0f172a" />
                        <Text style={styles.playBtnTextMain}>Commencer l'entraînement</Text>
                    </TouchableOpacity>
                </View>

                {/* ── DESCRIPTION ── */}
                <View style={styles.bodySection}>
                    <Text style={styles.descText}>
                        {challenge.description || media.description}
                    </Text>

                    <View style={styles.divider} />

                    {/* ── WORKOUTS LIES ── */}
                    <View style={styles.workoutsHeader}>
                        <Text style={styles.sectionTitle}>Séances d'entraînement</Text>
                        <Text style={styles.workoutsCount}>{exercises.length} Exos</Text>
                    </View>

                    <View style={styles.workoutsList}>
                        {exercises.map((exo, i) => (
                            <TouchableOpacity key={i} style={styles.exoCard}>
                                <View style={styles.exoNumBox}>
                                    <Text style={styles.exoNumText}>{i + 1}</Text>
                                </View>
                                <View style={styles.exoContent}>
                                    <Text style={styles.exoName}>{exo.Exercise_Name}</Text>
                                    <Text style={styles.exoTime}>{exo.Time}</Text>
                                </View>
                                <Ionicons name="play-circle-outline" size={28} color="#94a3b8" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Espace vide */}
                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
