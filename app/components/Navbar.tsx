import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.navItem}>🏠 Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/Pages/Goals')}>
        <Text style={styles.navItem}>🎯 Goals</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#4caf50',
    borderRadius: 20, // Arrondi sur tous les côtés
    marginHorizontal: 10, // Ajoute un peu de marge pour éviter que la navbar touche les bords de l'écran
    marginBottom: 10, // Ajoute un peu d'espace sous la navbar
    paddingHorizontal: 15, // Ajoute du padding pour un meilleur rendu
  },
  navItem: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


