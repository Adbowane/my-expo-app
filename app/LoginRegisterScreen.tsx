import React, { useState } from 'react';
import { View, TextInput, Text, ActivityIndicator, Alert, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useAuth, AuthProvider } from './context/AuthContext';
import tw from 'twrnc';

const LoginRegisterForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { login, register } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      Alert.alert('Succès', 'Connexion réussie');
    } catch (error) {
      Alert.alert('Échec de connexion', error instanceof Error ? error.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !surname || !email || !password || !passwordConfirmation) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Erreur', 'Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name, surname);
      Alert.alert('Succès', 'Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setIsLoginMode(true);
    } catch (error) {
      Alert.alert('Échec de l\'inscription', error instanceof Error ? error.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={tw`flex-grow bg-gradient-to-b from-purple-100 to-pink-100`}
      keyboardShouldPersistTaps="handled"
    >
      <View style={tw`flex-1 justify-center p-6`}>
        {/* Logo */}
        <View style={tw`items-center mb-8`}>
          <Image 
            source={require('../assets/images/favicon.png')} // Remplacez par votre propre icône
            style={tw`w-24 h-24 mb-4`}
          />
        </View>

        {/* Card Container */}
        <View style={[tw`bg-white rounded-2xl p-8 shadow-sm`, styles.cardShadow]}>
          {/* Tab Navigation */}
          <View style={tw`flex-row mb-8`}>
            <TouchableOpacity
              style={tw`flex-1 pb-3 ${isLoginMode ? 'border-b-2 border-indigo-600' : 'border-b border-gray-200'}`}
              onPress={() => setIsLoginMode(true)}
            >
              <Text style={tw`text-center text-lg font-medium ${isLoginMode ? 'text-indigo-600' : 'text-gray-500'}`}>
                Connexion
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 pb-3 ${!isLoginMode ? 'border-b-2 border-indigo-600' : 'border-b border-gray-200'}`}
              onPress={() => setIsLoginMode(false)}
            >
              <Text style={tw`text-center text-lg font-medium ${!isLoginMode ? 'text-indigo-600' : 'text-gray-500'}`}>
                Inscription
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Title */}
          <Text style={tw`text-2xl font-bold text-gray-800 mb-6 text-center`}>
            {isLoginMode ? 'Connectez-vous à votre compte' : 'Créez un nouveau compte'}
          </Text>

          {/* Form Fields */}
          {!isLoginMode && (
            <>
              <TextInput
                style={tw`h-14 border border-gray-200 rounded-xl mb-4 px-5 bg-gray-50 text-gray-700`}
                value={name}
                onChangeText={setName}
                placeholder="Prénom"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                style={tw`h-14 border border-gray-200 rounded-xl mb-4 px-5 bg-gray-50 text-gray-700`}
                value={surname}
                onChangeText={setSurname}
                placeholder="Nom"
                placeholderTextColor="#9CA3AF"
              />
            </>
          )}

          <TextInput
            style={tw`h-14 border border-gray-200 rounded-xl mb-4 px-5 bg-gray-50 text-gray-700`}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Adresse email"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={tw`h-14 border border-gray-200 rounded-xl mb-4 px-5 bg-gray-50 text-gray-700`}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Mot de passe"
            placeholderTextColor="#9CA3AF"
          />

          {!isLoginMode && (
            <>
              <TextInput
                style={tw`h-14 border border-gray-200 rounded-xl mb-4 px-5 bg-gray-50 text-gray-700`}
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
                placeholder="Confirmez le mot de passe"
                placeholderTextColor="#9CA3AF"
              />

              <View style={tw`flex-row items-center mb-6`}>
                <TouchableOpacity
                  style={tw`h-5 w-5 rounded border ${agreeToTerms ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'} mr-2 justify-center items-center`}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  {agreeToTerms && <Text style={tw`text-white text-xs`}>✓</Text>}
                </TouchableOpacity>
                <Text style={tw`text-sm text-gray-600`}>
                  J'accepte les <Text style={tw`text-indigo-600`}>Termes</Text>, la <Text style={tw`text-indigo-600`}>Politique de confidentialité</Text> et les <Text style={tw`text-indigo-600`}>Frais</Text>
                </Text>
              </View>
            </>
          )}

          {/* Forgot Password Link */}
          {isLoginMode && (
            <TouchableOpacity style={tw`mb-6`}>
              <Text style={tw`text-indigo-600 text-right text-sm font-medium`}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={tw`bg-indigo-600 py-4 rounded-xl mb-6 shadow-md`}
            onPress={isLoginMode ? handleLogin : handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white text-center font-semibold text-lg`}>
                {isLoginMode ? 'Se connecter' : "S'inscrire"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Social Login Buttons */}
          {isLoginMode && (
            <>
              <View style={tw`flex-row items-center mb-6`}>
                <View style={tw`flex-1 h-px bg-gray-200`} />
                <Text style={tw`px-3 text-gray-500 text-sm`}>Ou continuer avec</Text>
                <View style={tw`flex-1 h-px bg-gray-200`} />
              </View>

              <View style={tw`flex-row justify-center space-x-4`}>
                <TouchableOpacity 
                  style={tw`border border-gray-200 rounded-xl p-3 flex-1 items-center`}
                >
                  <Image 
                    source={require('../assets/images/favicon.png')} 
                    style={tw`w-6 h-6`}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={tw`border border-gray-200 rounded-xl p-3 flex-1 items-center`}
                >
                  <Image 
                    source={require('../assets/images/favicon.png')} 
                    style={tw`w-6 h-6`}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Switch Mode Link */}
        <View style={tw`mt-6 flex-row justify-center`}>
          <Text style={tw`text-gray-600`}>
            {isLoginMode ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
          </Text>
          <TouchableOpacity onPress={() => setIsLoginMode(!isLoginMode)}>
            <Text style={tw`text-indigo-600 font-medium`}>
              {isLoginMode ? 'Inscrivez-vous' : 'Connectez-vous'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const LoginRegisterScreen = () => {
  return (
    <AuthProvider>
      <LoginRegisterForm />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default LoginRegisterScreen;