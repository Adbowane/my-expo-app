import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'Accueil', headerShown: false }}
        />
        <Stack.Screen
          name="Pages/Goals" // Correction ici
          options={{
            title: 'Objectifs Fitness',
            headerStyle: { backgroundColor: '#A020F0' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Pages/Levels" // Correction ici
          options={{
            title: 'Niveaux',
            headerStyle: { backgroundColor: '#8A2BE2' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Pages/Programmes" // Ajoute cette ligne si besoin
          options={{
            title: 'Programmes',
            headerStyle: { backgroundColor: '#6A0DAD' },
            headerTintColor: '#fff',
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
