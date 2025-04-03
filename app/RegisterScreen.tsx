import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth, AuthProvider } from './context/AuthContext';

// Composant qui contient le formulaire d'inscription
const RegisterForm = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    // Validation des champs
    if (!name || !surname || !email || !password || !passwordConfirmation) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name, surname);
      
      // Afficher une pop-up de succès
      Alert.alert(
        'Succès',
        'Inscription réussie ! Vous pouvez maintenant vous connecter.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Échec de l\'inscription', error.message);
        
      } else {
        Alert.alert('Échec de l\'inscription', 'Une erreur inconnue est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      
      <Text style={styles.label}>Prénom</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Entrez votre prénom"
      />
      
      <Text style={styles.label}>Nom</Text>
      <TextInput 
        style={styles.input} 
        value={surname} 
        onChangeText={setSurname} 
        placeholder="Entrez votre nom"
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="exemple@email.com"
      />
      
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Créez un mot de passe"
      />

      <Text style={styles.label}>Confirmez le mot de passe</Text>
      <TextInput
        style={styles.input}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
        placeholder="Confirmez votre mot de passe"
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="S'inscrire" onPress={handleRegister} />
      )}
    </View>
  );
};

// Composant principal qui enveloppe le formulaire avec l'AuthProvider
const RegisterScreen = () => {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: { 
    height: 50, 
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  }
});

export default RegisterScreen;