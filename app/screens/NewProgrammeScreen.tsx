import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';

// Définition des types
type RootStackParamList = {
  ProgramDetail: { programId: number };
  // Add other screens here as needed
};

type Program = {
  Program_Id: number;
  Goal_Id: number;
  Program_Name: string;
  Image: string | null;
};
const NewProgrammeScreen = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://172.31.16.1:3000/api/programs`);
      setPrograms(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des programmes:', err);
      setError('Impossible de charger les programmes. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleProgramPress = (program: Program) => {
    // Navigation vers la page de détail du programme
    navigation.navigate('ProgramDetail', { programId: program.Program_Id });
  };

  const renderItem = ({ item }: { item: Program }) => (
    <TouchableOpacity 
      style={styles.programCard} 
      onPress={() => handleProgramPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.programContent}>
        <Text style={styles.programName}>{item.Program_Name}</Text>
        <Text style={styles.programGoal}>Objectif ID: {item.Goal_Id}</Text>
      </View>
      
      {item.Image && !item.Image.endsWith('...') ? (
        <Image 
          source={{ uri: item.Image }} 
          style={styles.programImage} 
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>Image</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Chargement des programmes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPrograms}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Programmes</Text>
        <Text style={styles.subtitle}>Choisissez un programme pour commencer</Text>
      </View>
      
      <FlatList
        data={programs}
        renderItem={renderItem}
        keyExtractor={(item) => item.Program_Id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={8}
        onRefresh={fetchPrograms}
        refreshing={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  programCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  programContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  programGoal: {
    fontSize: 14,
    color: '#666666',
  },
  programImage: {
    width: 120,
    height: 120,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999999',
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NewProgrammeScreen;