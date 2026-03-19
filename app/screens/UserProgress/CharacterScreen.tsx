import React, { Suspense, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import useControls from 'r3f-native-orbitcontrols';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Character, AvatarCustomizations } from '../../components/Character';
import { useAvatar } from '../../context/AvatarContext';

// Imports types & styles
import { Nav } from '../../types/CharacterScreen.types';
import {
  styles,
  PURPLE,
  MORPHOLOGIES_MALE,
  MORPHOLOGIES_FEMALE,
  OUTFIT_COLORS,
  SKIN_TONES,
  OUTFIT_TABS,
} from '../../styles/CharacterScreen.styles';

const CharacterScreen = () => {
  const navigation = useNavigation<Nav>();
  const [OrbitControls, events] = useControls();
  const { customizations, updateCustomizations, isLoading } = useAvatar();

  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>(customizations.gender ?? 'female');
  const [selectedMorphology, setSelectedMorphology] = useState(customizations.morphology ?? 'athletic');
  const [selectedColor, setSelectedColor] = useState(customizations.primaryColor ?? '#7C3AED');
  const [selectedSkin, setSelectedSkin] = useState(customizations.skinTone ?? '#C68642');
  const [activeOutfitTab, setActiveOutfitTab] = useState<typeof OUTFIT_TABS[number]>('HAUTS');
  const [isSaving, setIsSaving] = useState(false);

  // Preview local — sans attendre l'API
  const previewCustom: AvatarCustomizations = {
    gender: selectedGender,
    morphology: selectedMorphology,
    primaryColor: selectedColor,
    skinTone: selectedSkin,
  };

  const morphologies = selectedGender === 'male' ? MORPHOLOGIES_MALE : MORPHOLOGIES_FEMALE;

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCustomizations(previewCustom);
      Alert.alert('✅ Sauvegardé', 'Ton avatar a été personnalisé avec succès !');
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder les changements.');
    } finally {
      setIsSaving(false);
    }
  }, [previewCustom, updateCustomizations]);

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerSub}>STYLE ATHLÉTIQUE</Text>
          <Text style={styles.headerTitle}>VOTRE AVATAR PERSONNALISÉ</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={22} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="person-circle-outline" size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ── Corps de base ────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHOIX DU CORPS DE BASE</Text>
          <View style={styles.genderRow}>
            {/* HOMME */}
            <TouchableOpacity
              style={[styles.genderCard, selectedGender === 'male' && styles.genderCardSelected]}
              onPress={() => { setSelectedGender('male'); setSelectedMorphology('athletic'); }}
            >
              <View style={[styles.genderAvatarBg, selectedGender === 'male' && styles.genderAvatarBgSelected]}>
                <Text style={styles.genderEmoji}>🧑‍🦱</Text>
              </View>
              <Text style={styles.genderLabel}>HOMME</Text>
              <View style={[styles.selectBadge, selectedGender === 'male' && styles.selectBadgeActive]}>
                <Text style={styles.selectBadgeText}>
                  {selectedGender === 'male' ? '✓ SÉLECTIONNÉ' : 'SÉLECTIONNER'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Preview 3D */}
            <View style={styles.previewContainer} {...events}>
              <Canvas camera={{ position: [0, 0, 2.8], fov: 50 }}>
                <OrbitControls />
                <ambientLight intensity={1.2} />
                <directionalLight position={[3, 5, 3]} intensity={1.5} />
                <directionalLight position={[-3, 3, -2]} intensity={0.5} color="#A78BFA" />
                <Suspense fallback={null}>
                  <Character customizations={previewCustom} />
                </Suspense>
              </Canvas>
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator color={PURPLE} />
                </View>
              )}
            </View>

            {/* FEMME */}
            <TouchableOpacity
              style={[styles.genderCard, selectedGender === 'female' && styles.genderCardSelected]}
              onPress={() => { setSelectedGender('female'); setSelectedMorphology('athletic_f'); }}
            >
              <View style={[styles.genderAvatarBg, selectedGender === 'female' && styles.genderAvatarBgSelected]}>
                <Text style={styles.genderEmoji}>👩</Text>
              </View>
              <Text style={styles.genderLabel}>FEMME</Text>
              <View style={[styles.selectBadge, selectedGender === 'female' && styles.selectBadgeActive]}>
                <Text style={styles.selectBadgeText}>
                  {selectedGender === 'female' ? '✓ SÉLECTIONNÉ' : 'SÉLECTIONNER'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Morphologies ─────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MORPHOLOGIES (2D)</Text>
          <View style={styles.morphGrid}>
            {morphologies.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[styles.morphCard, selectedMorphology === m.key && styles.morphCardSelected]}
                onPress={() => setSelectedMorphology(m.key)}
              >
                <Text style={styles.morphEmoji}>{m.emoji}</Text>
                <Text style={[styles.morphLabel, selectedMorphology === m.key && styles.morphLabelSelected]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Sélection de tenue ─────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SÉLECTION DE TENUE</Text>

          {/* Onglets */}
          <View style={styles.outfitTabRow}>
            {OUTFIT_TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.outfitTab, activeOutfitTab === tab && styles.outfitTabActive]}
                onPress={() => setActiveOutfitTab(tab)}
              >
                <Text style={[styles.outfitTabText, activeOutfitTab === tab && styles.outfitTabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Grille de couleurs */}
          <View style={styles.colorGrid}>
            {OUTFIT_COLORS.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c.hex },
                  selectedColor === c.hex && styles.colorSwatchSelected,
                ]}
                onPress={() => setSelectedColor(c.hex)}
              >
                {selectedColor === c.hex && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Teintes de peau */}
          <Text style={[styles.sectionTitle, { marginTop: 16, marginBottom: 8 }]}>TEINTE DE PEAU</Text>
          <View style={styles.skinRow}>
            {SKIN_TONES.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[
                  styles.skinSwatch,
                  { backgroundColor: s.hex },
                  selectedSkin === s.hex && styles.skinSwatchSelected,
                ]}
                onPress={() => setSelectedSkin(s.hex)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Bouton Confirmer ─────────────────────────────────────── */}
      <View style={styles.confirmBar}>
        <TouchableOpacity
          style={[styles.confirmBtn, isSaving && styles.confirmBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.confirmBtnText}>CONFIRMER VOTRE LOOK</Text>
              <Ionicons name="sparkles" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CharacterScreen;