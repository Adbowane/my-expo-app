import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Dimensions, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'twrnc';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import { API_URL } from '../types';

import { RouteParams, ProgrammesScreenNavigationProp, Program } from '../types/ProgrammesScreen.types';
import { styles, ITEM_WIDTH } from '../styles/ProgrammesScreen.styles';

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
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
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

  const renderItem = ({ item, index }: { item: Program; index: number }) => (
    <TouchableOpacity
      style={[styles.card, { width: Math.round(ITEM_WIDTH) }]}
      onPress={() => handleSelectProgram(item.Program_Id, index)}
      activeOpacity={0.9}
    >
      <View style={styles.cardIconBox}>
        <Ionicons name={item.Icon as any} size={130} color="white" />
      </View>
      <View style={styles.cardPading}>
        <Text style={styles.cardTitle}>{item.Program_Name}</Text>
        <Text style={styles.cardDesc}>{item.Description}</Text>

        <View style={styles.cardMeta}>
          <Ionicons name="time-outline" size={18} color="#888" />
          <Text style={styles.cardMetaText}>4-5 séances par semaine</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Programmes</Text>
        <Text style={styles.subtitle}>Programmes adaptés à votre objectif</Text>
      </View>

      <View style={tw`flex-1`}>
        <FlatList
          ref={flatListRef}
          data={programmes}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + 16}
          decelerationRate="fast"
          contentContainerStyle={tw`py-4 px-2`}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          keyExtractor={(item, index) => (item?.Program_Id?.toString() || index.toString())}
          renderItem={renderItem}
        />

        <View style={styles.dotContainer}>
          {programmes.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? tw`bg-teal-500` : tw`bg-gray-300`
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
          >
            <Text style={styles.mainBtnText}>Commencer ce programme</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Navbar */}
      <Navbar />
    </View>
  );
}
