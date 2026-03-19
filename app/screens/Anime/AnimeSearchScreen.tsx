import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

import { API_URL } from '../../types';
import { getAnimeMedia } from '../../data/AnimeThemes';

// Imports des types et styles
import { Nav, SearchRouteProp, Challenge } from '../../types/AnimeSearchScreen.types';
import { styles } from '../../styles/AnimeSearchScreen.styles';

const BG_COLOR = '#0f172a'; // Slate-900 
const FILTERS = ['Tous', 'Force', 'Cardio', 'Agilité', 'Aura', 'Souplesse'];

export default function AnimeSearchScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<SearchRouteProp>();

  const initialQuery = route.params?.initialQuery || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/challenges`);
        const data = Array.isArray(res.data) ? res.data : res.data.challenges || [];
        setChallenges(data);

        // Si la recherche initiale pointe vers un filtre spécifique (ex: Force)
        if (initialQuery && FILTERS.includes(initialQuery)) {
          setActiveFilter(initialQuery);
          setQuery(''); // On vide l'input, on utilise le chip
        }
      } catch (err) {
        console.warn('Erreur chargement challenges (search):', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, [initialQuery]);

  // Filtrage combiné : Texte + Filtre cat
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Filtre texte
      const matchesSearch =
        c.nom_challenge.toLowerCase().includes(query.toLowerCase()) ||
        (c.theme && c.theme.toLowerCase().includes(query.toLowerCase()));

      // Filtre catégorie (simulé en lisant les mots clés du titre)
      let matchesFilter = true;
      if (activeFilter !== 'Tous') {
        // Ceci est un mock de catégorie car l'API challenge n'a pas de tag catégorie. 
        matchesFilter = Boolean(
          c.nom_challenge.toLowerCase().includes(activeFilter.toLowerCase()) ||
          (c.theme && c.theme.toLowerCase().includes(activeFilter.toLowerCase()))
        );
      }
      return matchesSearch && matchesFilter;
    });
  }, [challenges, query, activeFilter]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />

      {/* ── Barre de recherche ── */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ex : Attack on Titan, Cardio..."
            placeholderTextColor="#64748b"
            value={query}
            onChangeText={setQuery}
            autoFocus={!initialQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Filtres ── */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => { setActiveFilter(f); setQuery(''); }}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Résultats Grid ── */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color="#8B5CF6" size="large" />
        </View>
      ) : filteredChallenges.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="sad-outline" size={60} color="#334155" />
          <Text style={styles.emptyText}>Aucun entraînement trouvé.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultsGrid}>
          <Text style={styles.resultsCount}>Résultats : {filteredChallenges.length}</Text>

          <View style={styles.gridWrap}>
            {filteredChallenges.map((c, i) => {
              const media = getAnimeMedia(c.theme);
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.gridCard}
                  onPress={() => navigation.navigate('AnimeDetailsScreen', { theme: c.theme, challengeId: c.id_challenge })}
                >
                  <ImageBackground source={{ uri: media.cover }} style={styles.gridImage} imageStyle={{ borderRadius: 8 }}>
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.gridGradient}>
                      <Text style={styles.gridTheme}>{c.theme}</Text>
                      <Text style={styles.gridTitle} numberOfLines={2}>{c.nom_challenge}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}
