import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

import { API_URL } from '../types';
import Navbar from '../components/Navbar';
import { getAnimeMedia } from '../data/AnimeThemes';

// Imports types & styles
import { Challenge, Nav } from '../types/AnimeDiscoverScreen.types';
import { styles, BG_COLOR } from '../styles/AnimeDiscoverScreen.styles';

export default function AnimeDiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/challenges`);
        const data = Array.isArray(res.data) ? res.data : res.data.challenges || [];
        setChallenges(data);
      } catch (err) {
        console.warn('Erreur chargement challenges:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  // Grouper par thèmes uniques
  const uniqueThemes = Array.from(new Set(challenges.map(c => c.theme).filter(Boolean)));

  // Vedettes (Héro Carousel)
  const featuredChallenges = challenges.filter(c => c.is_vedette);
  // Si aucune vedette configurée en BDD, on prend les 3 premiers thèmes uniques
  const heroItems = featuredChallenges.length > 0
    ? featuredChallenges
    : uniqueThemes.slice(0, 3).map(theme => challenges.find(c => c.theme === theme)!);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Header flottant ── */}
      <View style={styles.header}>
        <Text style={styles.logoText}>FITNESS<Text style={styles.logoAccent}>ANIM</Text></Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('AnimeSearchScreen', {})}
          >
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Hero Carousel (Vedettes) ── */}
        {loading ? (
          <View style={[styles.heroContainer, { justifyContent: 'center' }]}>
            <ActivityIndicator color="#8B5CF6" size="large" />
          </View>
        ) : (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.heroContainer}
          >
            {heroItems.map((item, idx) => {
              const media = getAnimeMedia(item.theme);
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.heroSlide}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('AnimeDetailsScreen', { theme: item.theme, challengeId: item.id_challenge })}
                >
                  <ImageBackground
                    source={{ uri: media.poster }}
                    style={styles.heroImage}
                    resizeMode="cover"
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(15, 23, 42, 0.8)', BG_COLOR]} // Fade vers le fond de l'app
                      style={styles.heroGradient}
                    >
                      <Text style={styles.heroThemeBadge}>{item.theme?.toUpperCase()}</Text>
                      <Text style={styles.heroTitle}>{item.nom_challenge}</Text>
                      <View style={styles.heroActions}>
                        <View style={styles.playBtn}>
                          <Ionicons name="play" size={20} color="#0f172a" />
                          <Text style={styles.playBtnText}>S'entraîner</Text>
                        </View>
                        <View style={styles.infoBtn}>
                          <Ionicons name="information-circle-outline" size={24} color="#fff" />
                        </View>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* ── Catégories Rapides ── */}
        <View style={styles.categoriesSection}>
          <TouchableOpacity style={styles.categoryPill} onPress={() => navigation.navigate('AnimeSearchScreen', { initialQuery: 'Force' })}>
            <Text style={styles.catPillEmoji}>💪</Text>
            <Text style={styles.catPillText}>Force Pure</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryPill} onPress={() => navigation.navigate('AnimeSearchScreen', { initialQuery: 'Cardio' })}>
            <Text style={styles.catPillEmoji}>🏃</Text>
            <Text style={styles.catPillText}>Agilité</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryPill} onPress={() => navigation.navigate('AnimeSearchScreen', { initialQuery: 'Aura' })}>
            <Text style={styles.catPillEmoji}>🌟</Text>
            <Text style={styles.catPillText}>Aura & Chakra</Text>
          </TouchableOpacity>
        </View>

        {/* ── Liste : Univers Populaires ── */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Univers Populaires</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listScroll}>
            {uniqueThemes.map((theme, i) => {
              const media = getAnimeMedia(theme);
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.card}
                  onPress={() => navigation.navigate('AnimeDetailsScreen', { theme })}
                >
                  <ImageBackground source={{ uri: media.cover }} style={styles.cardImage} imageStyle={{ borderRadius: 8 }}>
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardGradient}>
                      <Text style={styles.cardTitle}>{theme}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Liste : Nouveaux Entraînements ── */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Nouveaux Entraînements</Text>
          <View style={styles.verticalList}>
            {challenges.slice(0, 5).map((c, i) => {
              const media = getAnimeMedia(c.theme);
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.hCard}
                  onPress={() => navigation.navigate('AnimeDetailsScreen', { theme: c.theme, challengeId: c.id_challenge })}
                >
                  <ImageBackground source={{ uri: media.cover }} style={styles.hCardImg} imageStyle={{ borderRadius: 8 }} />
                  <View style={styles.hCardContent}>
                    <Text style={styles.hCardTitle} numberOfLines={1}>{c.nom_challenge}</Text>
                    <Text style={styles.hCardTheme}>{c.theme}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#64748b" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}
