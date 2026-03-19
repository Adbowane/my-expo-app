import React, { Suspense, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import useControls from 'r3f-native-orbitcontrols';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import { API_URL } from '../../types';
import { Character } from '../../components/Character';
import { useAvatar } from '../../context/AvatarContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

// Imports types & styles
import { Nav, Challenge } from '../../types/DashboardScreen.types';
import { styles, BG, PURPLE } from '../../styles/DashboardScreen.styles';

const DashboardScreen = () => {
  const navigation = useNavigation<Nav>();
  const [OrbitControls, events] = useControls();
  const { user, token } = useAuth();
  const { customizations, stats } = useAvatar();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeProgress] = useState(65);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  // Streak simulé (à connecter à l'API progress)
  const dayStreak = 3;
  const totalXP = stats.experiencePoints ?? 1432;
  const league = stats.currentLevel >= 5 ? 'Or' : stats.currentLevel >= 3 ? 'Argent' : 'Bronze';
  const top3 = 0;

  // Charger le dernier challenge
  useEffect(() => {
    const loadChallenge = async () => {
      setLoadingChallenge(true);
      try {
        const res = await axios.get(`${API_URL}/api/challenges`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const challenges: Challenge[] = Array.isArray(res.data)
          ? res.data
          : res.data.challenges ?? [];
        if (challenges.length > 0) {
          setChallenge(challenges[0]);
        }
      } catch {
        // Si pas de challenges, on utilise un placeholder
        setChallenge({
          id_challenge: 1,
          nom_challenge: 'Défi du jour',
          description: 'One Punch Man — 100 pompes, 100 squats !',
          theme: 'One Punch Man',
          difficulte: 'Intermédiaire',
        });
      } finally {
        setLoadingChallenge(false);
      }
    };
    loadChallenge();
  }, [token]);

  const leagueIcon = league === 'Or' ? '🥇' : league === 'Argent' ? '🥈' : '🥉';

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stats supérieures ─────────────────────────────────── */}
        <View style={styles.topStats}>
          {/* Streak */}
          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{dayStreak}</Text>
            </View>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          {/* Total XP */}
          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statValue}>{totalXP.toLocaleString()}</Text>
            </View>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>

        {/* ── Ligue + Classement ───────────────────────────────── */}
        <View style={styles.topStats}>
          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>{leagueIcon}</Text>
              <Text style={styles.statValue}>{league}</Text>
            </View>
            <Text style={styles.statLabel}>Current League</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🏅</Text>
              <Text style={styles.statValue}>{top3}</Text>
            </View>
            <Text style={styles.statLabel}>Top 3 Finishes</Text>
          </View>
        </View>

        {/* ── Avatar 3D central ─────────────────────────────────── */}
        <View style={styles.avatarSection}>
          {/* Boutons latéraux gauche */}
          <View style={styles.sidebtnsLeft}>
            <TouchableOpacity
              style={styles.sideBtn}
              onPress={() => navigation.navigate('DashboardScreen')}
            >
              <Ionicons name="home" size={20} color={PURPLE} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sideBtn}
              onPress={() => navigation.navigate('LevelScreen', { name: 'Default' })}
            >
              <Ionicons name="list" size={20} color={PURPLE} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sideBtn}
              onPress={() => navigation.navigate('CharacterScreen')}
            >
              <Ionicons name="settings-outline" size={20} color={PURPLE} />
            </TouchableOpacity>
          </View>

          {/* Canvas Three.js */}
          <View style={styles.canvasWrapper} {...events}>
            <Canvas camera={{ position: [0, 0, 2.6], fov: 50 }}>
              <OrbitControls enableZoom={false} />
              <ambientLight intensity={1.5} />
              <directionalLight position={[3, 5, 3]} intensity={1.5} />
              <directionalLight position={[-3, 3, -2]} intensity={0.6} color="#C4B5FD" />
              <pointLight position={[0, 2, 2]} intensity={0.8} color="#7B5CF0" />
              <Suspense fallback={null}>
                <Character customizations={customizations} />
              </Suspense>
            </Canvas>
          </View>

          {/* Boutons latéraux droite — vides pour symétrie */}
          <View style={styles.sidebtnsRight} />
        </View>

        {/* ── Dernier challenge ─────────────────────────────────── */}
        <View style={styles.challengeCard}>
          {loadingChallenge ? (
            <ActivityIndicator color={PURPLE} />
          ) : challenge ? (
            <>
              <View style={styles.challengeHeader}>
                <View>
                  <Text style={styles.challengeTitle}>{challenge.nom_challenge}</Text>
                  {challenge.theme && (
                    <Text style={styles.challengeTheme}>{challenge.theme}</Text>
                  )}
                </View>
                {/* Mini avatars challenge */}
                <View style={styles.challengeAvatars}>
                  {['🟣', '🔵', '🟢'].map((c, i) => (
                    <View key={i} style={[styles.challengeAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                      <Text style={{ fontSize: 14 }}>{c}</Text>
                    </View>
                  ))}
                  <View style={styles.challengeMoreBtn}>
                    <Text style={styles.challengeMoreText}>3+</Text>
                  </View>
                </View>
              </View>

              {/* Barre de progression */}
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${challengeProgress}%` }]} />
              </View>
              <Text style={styles.progressPct}>{challengeProgress}%</Text>

              <TouchableOpacity
                style={styles.challengeBtn}
                onPress={() => navigation.navigate('LevelScreen', { name: 'Default' })}
              >
                <Text style={styles.challengeBtnText}>Continuer →</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>

        {/* ── Nom utilisateur + niveau ─────────────────────────── */}
        <View style={styles.userInfoBar}>
          <View style={styles.userXpBadge}>
            <Text style={styles.userXpText}>Niv. {stats.currentLevel}</Text>
          </View>
          <Text style={styles.userName}>
            {user?.name ?? 'Athlète'} {user?.surname ?? ''}
          </Text>
          <TouchableOpacity
            style={styles.editAvatarBtn}
            onPress={() => navigation.navigate('CharacterScreen')}
          >
            <Ionicons name="color-palette-outline" size={18} color={PURPLE} />
            <Text style={styles.editAvatarText}>Personnaliser</Text>
          </TouchableOpacity>
        </View>

        {/* Espace en bas pour la navbar */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── Navbar ────────────────────────────────────────────── */}
      <Navbar />
    </SafeAreaView>
  );
};

export default DashboardScreen;