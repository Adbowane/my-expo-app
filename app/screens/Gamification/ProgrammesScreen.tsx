import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'twrnc';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/Navbar';
import { API_URL } from '../../types';

import { RouteParams, ProgrammesScreenNavigationProp, Program } from '../../types/ProgrammesScreen.types';
import { styles, ITEM_WIDTH, SPACING } from '../../styles/ProgrammesScreen.styles';

// Suppression des doublons de constantes


export default function Programmes() {
  const [programmes, setProgrammes] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<ProgrammesScreenNavigationProp>();
  const route = useRoute();
  const { goalId } = route.params as RouteParams;

  const programIcons = [
    'barbell-outline',
    'bicycle-outline',
    'body-outline',
    'fitness-outline',
    'nutrition-outline'
  ];

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        if (!goalId) {
          throw new Error('Goal ID is required');
        }

        const response = await axios.get(`${API_URL}/api/programs/goal/${goalId}`);

        // Robust mapping for API variations
        const enrichedData = response.data.map((item: any, index: number) => {
          const mappedProgram: Program = {
            Program_Id: item.Program_Id || item.id || item.programId,
            Program_Name: item.Program_Name || item.name || item.title || 'Programme',
            Goal_Id: item.Goal_Id || item.goalId || goalId,
            Icon: programIcons[index % programIcons.length],
            Description: getProgramDescription(item.Program_Name || item.name || item.title || '')
          };
          console.log('Mapped Program:', mappedProgram.Program_Id, mappedProgram.Program_Name);
          return mappedProgram;
        });

        setProgrammes(enrichedData);
        if (enrichedData.length > 0) {
          setSelectedProgram(enrichedData[0].Program_Id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des programmes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [goalId]);

  const getProgramDescription = (programName: string) => {
    const descriptions: Record<string, string> = {
      'Cardio intense': 'Programme intensif pour améliorer votre endurance cardiovasculaire',
      'Programme prise de masse': 'Entraînement ciblé pour développer votre masse musculaire',
      'Fitness quotidien': 'Routine quotidienne pour maintenir votre forme physique',
      'Entraînement HIIT': 'Séances courtes et intenses pour maximiser la combustion des graisses',
      'Programme haltérophilie': 'Développez votre force maximale avec des exercices de puissance'
    };
    return descriptions[programName] || `Programme spécialisé pour ${(programName || 'fitness').toLowerCase()}`;
  };

  const handleSelectProgram = (programId: number, index: number) => {
    setSelectedProgram(programId);
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60
  };

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
      setSelectedProgram(viewableItems[0].item.Program_Id);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged }
  ]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#00E676" />
        <Text style={styles.loadingText}>Chargement des programmes...</Text>
      </View>
    );
  }

  if (programmes.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="warning-outline" size={50} color="#888" />
        <Text style={styles.emptyText}>Aucun programme disponible pour cet objectif</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Program; index: number }) => {
    const isActive = activeIndex === index;
    
    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity
          style={[styles.card, isActive && styles.cardActive]}
          onPress={() => handleSelectProgram(item.Program_Id, index)}
          activeOpacity={0.9}
        >
          <View style={styles.cardImageContainer}>
            {isActive && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Sélectionné</Text>
              </View>
            )}
            <View style={styles.cardIconCircle}>
              <Ionicons name={item.Icon as any} size={50} color="#8B5CF6" />
            </View>
          </View>
          
          <View style={styles.cardPading}>
            <View>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.Program_Name}</Text>
              <Text style={styles.cardDesc} numberOfLines={3}>{item.Description}</Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.cardMeta}>
                <Ionicons name="time-outline" size={18} color="#888" />
                <Text style={styles.cardMetaText}>4-5 séances / sem.</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Programmes</Text>
        <Text style={styles.subtitle}>Découvrez les programmes adaptés à votre objectif</Text>
      </View>

      <View style={tw`flex-1`}>
        <FlatList
          ref={flatListRef}
          data={programmes}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.listContentContainer}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          keyExtractor={(item, index) => (item?.Program_Id?.toString() || index.toString())}
          renderItem={renderItem}
          extraData={activeIndex}
        />

        <View style={styles.paginationContainer}>
          {programmes.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive
              ]}
            />
          ))}
        </View>
      </View>

      {selectedProgram && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.mainBtn}
            onPress={() => navigation.navigate('Exercises', { programId: selectedProgram })}
            activeOpacity={0.8}
          >
            <Text style={styles.mainBtnText}>Commencer</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Navbar */}
      <Navbar />
    </View>
  );
}

