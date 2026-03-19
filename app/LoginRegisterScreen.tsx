import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from './context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, FitnessLevel, FavoriteAnime } from './types';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// ── Types ────────────────────────────────────────────────────────────────────

type FitnessOption = {
  key: FitnessLevel;
  label: string;
  description: string;
  emoji: string;
};

type AnimeOption = {
  key: FavoriteAnime;
  emoji: string;
};

// ── Données ──────────────────────────────────────────────────────────────────

const FITNESS_OPTIONS: FitnessOption[] = [
  { key: 'beginner', label: 'Débutant', description: 'Je commence tout juste', emoji: '🌱' },
  { key: 'intermediate', label: 'Intermédiaire', description: "J'ai quelques mois d'expérience", emoji: '🏋️' },
  { key: 'advanced', label: 'Avancé', description: "Je m'entraîne régulièrement", emoji: '🔥' },
];

const ANIME_OPTIONS: AnimeOption[] = [
  { key: 'Naruto', emoji: '⚠️' },
  { key: 'Dragon Ball', emoji: '⚡' },
  { key: 'One Piece', emoji: '🚢' },
  { key: 'Attack on Titan', emoji: '🛡️' },
];

// ── Composant Indicateur d'étapes ─────────────────────────────────────────────

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <View style={styles.stepContainer}>
    {Array.from({ length: totalSteps }).map((_, i) => {
      const step = i + 1;
      const isDone = step < currentStep;
      const isActive = step === currentStep;
      return (
        <React.Fragment key={step}>
          <View style={[styles.stepCircle, isDone && styles.stepDone, isActive && styles.stepActive]}>
            {isDone ? (
              <Text style={styles.stepCheck}>✓</Text>
            ) : (
              <Text style={[styles.stepNumber, isActive && styles.stepNumberActive]}>{step}</Text>
            )}
          </View>
          {step < totalSteps && (
            <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

// ── Formulaire principal ──────────────────────────────────────────────────────

const LoginRegisterForm = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, register } = useAuth();

  // Mode
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [registerStep, setRegisterStep] = useState(1); // 1=compte, 2=profil, 3=anime

  // Étape 1 — Compte
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Étape 2 — Profil
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel | null>(null);

  // Étape 3 — Anime
  const [favoriteAnime, setFavoriteAnime] = useState<FavoriteAnime | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────

  const isStep2Valid = fullName.trim().length > 0 && age.trim().length > 0 && fitnessLevel !== null;
  const isStep3Valid = favoriteAnime !== null;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      navigation.navigate('LevelScreen', { name: 'DefaultName' });
    } catch (error) {
      Alert.alert('Échec de connexion', error instanceof Error ? error.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation entre étapes
  const handleNextStep = () => {
    if (registerStep === 1) {
      if (!name || !surname || !email || !password || !passwordConfirmation) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
      }
      if (password !== passwordConfirmation) {
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
        return;
      }
      if (!agreeToTerms) {
        Alert.alert('Erreur', "Vous devez accepter les conditions d'utilisation");
        return;
      }
      setRegisterStep(2);
    } else if (registerStep === 2) {
      if (!isStep2Valid) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs et choisir un niveau de fitness');
        return;
      }
      setRegisterStep(3);
    }
  };

  const handleFinalRegister = async () => {
    setIsLoading(true);
    try {
      // Décomposer fullName en prénom/nom pour le backend si besoin
      const nameParts = fullName.trim().split(' ');
      const resolvedName = nameParts[0] || name;
      const resolvedSurname = nameParts.slice(1).join(' ') || surname;

      await register(
        email,
        password,
        resolvedName,
        resolvedSurname,
        age,
        fitnessLevel,
        favoriteAnime
      );
      navigation.navigate('LevelScreen', { name: resolvedName });
    } catch (error) {
      Alert.alert("Échec de l'inscription", error instanceof Error ? error.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipProfile = () => {
    // Continuer sans données de profil
    if (registerStep === 2) {
      setRegisterStep(3);
    } else if (registerStep === 3) {
      handleFinalRegister();
    }
  };

  const handleBack = () => {
    if (registerStep > 1) {
      setRegisterStep(registerStep - 1);
    } else {
      setIsLoginMode(true);
    }
  };

  // ── Rendu Connexion ────────────────────────────────────────────────────────

  const renderLoginForm = () => (
    <View style={styles.card}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]} onPress={() => setIsLoginMode(true)}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => { setIsLoginMode(false); setRegisterStep(1); }}>
          <Text style={styles.tabText}>Inscription</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.cardTitle}>Connectez-vous à votre compte</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Adresse email"
        placeholderTextColor="#9CA3AF"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Mot de passe"
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity style={styles.forgotLink}>
        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.primaryBtnText}>Se connecter</Text>}
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Ou continuer avec</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require('../assets/images/facebook.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require('../assets/images/google-icon.png')} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Rendu Étape 1 — Créer un compte ───────────────────────────────────────

  const renderStep1 = () => (
    <View style={styles.card}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={styles.tab} onPress={() => setIsLoginMode(true)}>
          <Text style={styles.tabText}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Inscription</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.cardTitle}>Créez un nouveau compte</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Prénom"
        placeholderTextColor="#9CA3AF"
      />
      <TextInput
        style={styles.input}
        value={surname}
        onChangeText={setSurname}
        placeholder="Nom"
        placeholderTextColor="#9CA3AF"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Adresse email"
        placeholderTextColor="#9CA3AF"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Mot de passe"
        placeholderTextColor="#9CA3AF"
      />
      <TextInput
        style={styles.input}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
        placeholder="Confirmez le mot de passe"
        placeholderTextColor="#9CA3AF"
      />

      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}
          onPress={() => setAgreeToTerms(!agreeToTerms)}
        >
          {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>
          J'accepte les <Text style={styles.linkText}>Termes</Text>, la{' '}
          <Text style={styles.linkText}>Politique de confidentialité</Text> et les{' '}
          <Text style={styles.linkText}>Frais</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleNextStep}>
        <Text style={styles.primaryBtnText}>Continuer →</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Rendu Étape 2 — Profil ─────────────────────────────────────────────────

  const renderStep2 = () => (
    <View style={styles.card}>
      {/* En-tête profil */}
      <View style={styles.profileHeaderIcon}>
        <Text style={styles.profileHeaderEmoji}>👤</Text>
      </View>
      <Text style={styles.cardTitle}>Créer votre profil</Text>
      <Text style={styles.cardSubtitle}>Personnalisez votre expérience fitness</Text>

      <Text style={styles.fieldLabel}>Nom complet</Text>
      <View style={styles.inputWithIcon}>
        <Text style={styles.inputIcon}>👤</Text>
        <TextInput
          style={styles.inputInner}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Votre nom complet"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <Text style={styles.fieldLabel}>Âge</Text>
      <View style={styles.inputWithIcon}>
        <Text style={styles.inputIcon}>📅</Text>
        <TextInput
          style={styles.inputInner}
          value={age}
          onChangeText={setAge}
          placeholder="Votre âge"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.fieldLabel}>Niveau de fitness</Text>
      {FITNESS_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.key}
          style={[styles.fitnessOption, fitnessLevel === opt.key && styles.fitnessOptionSelected]}
          onPress={() => setFitnessLevel(opt.key)}
        >
          <View style={[styles.radioCircle, fitnessLevel === opt.key && styles.radioCircleSelected]}>
            {fitnessLevel === opt.key && <View style={styles.radioInner} />}
          </View>
          <View style={styles.fitnessOptionText}>
            <Text style={[styles.fitnessOptionLabel, fitnessLevel === opt.key && styles.fitnessOptionLabelSelected]}>
              {opt.label}
            </Text>
            <Text style={styles.fitnessOptionDesc}>{opt.description}</Text>
          </View>
          <Text style={styles.fitnessEmoji}>{opt.emoji}</Text>
        </TouchableOpacity>
      ))}

      {/* Validation badge */}
      <View style={[styles.validationBadge, isStep2Valid && styles.validationBadgeOk]}>
        <View style={[styles.validationIcon, isStep2Valid && styles.validationIconOk]}>
          <Text style={styles.validationIconText}>{isStep2Valid ? '✓' : '✗'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.validationTitle}>Validation du profil</Text>
          <Text style={styles.validationDesc}>{isStep2Valid ? 'Prêt à continuer' : 'Informations manquantes'}</Text>
        </View>
        <View>
          <Text style={styles.validationStatusLabel}>Status</Text>
          <Text style={[styles.validationStatus, isStep2Valid && styles.validationStatusOk]}>
            {isStep2Valid ? 'Oui' : 'Non'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, !isStep2Valid && styles.primaryBtnDisabled]}
        onPress={handleNextStep}
        disabled={!isStep2Valid}
      >
        <Text style={styles.primaryBtnText}>Continuer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSkipProfile}>
        <Text style={styles.skipText}>Ignorer pour le moment</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Rendu Étape 3 — Anime préféré ─────────────────────────────────────────

  const renderStep3 = () => (
    <View style={styles.card}>
      <View style={styles.profileHeaderIcon}>
        <Text style={styles.profileHeaderEmoji}>🎌</Text>
      </View>
      <Text style={styles.cardTitle}>Anime préféré</Text>
      <Text style={styles.cardSubtitle}>Choisissez votre univers</Text>

      <View style={styles.animeGrid}>
        {ANIME_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.animeCard, favoriteAnime === opt.key && styles.animeCardSelected]}
            onPress={() => setFavoriteAnime(opt.key)}
          >
            <View style={[styles.animeIconBg, favoriteAnime === opt.key && styles.animeIconBgSelected]}>
              <Text style={styles.animeEmoji}>{opt.emoji}</Text>
            </View>
            <Text style={[styles.animeLabel, favoriteAnime === opt.key && styles.animeLabelSelected]}>
              {opt.key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Validation badge */}
      <View style={[styles.validationBadge, isStep3Valid && styles.validationBadgeOk]}>
        <View style={[styles.validationIcon, isStep3Valid && styles.validationIconOk]}>
          <Text style={styles.validationIconText}>{isStep3Valid ? '✓' : '✗'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.validationTitle}>Validation du profil</Text>
          <Text style={styles.validationDesc}>{isStep3Valid ? 'Prêt à s\'inscrire !' : 'Informations manquantes'}</Text>
        </View>
        <View>
          <Text style={styles.validationStatusLabel}>Status</Text>
          <Text style={[styles.validationStatus, isStep3Valid && styles.validationStatusOk]}>
            {isStep3Valid ? 'Oui' : 'Non'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, (!isStep3Valid || isLoading) && styles.primaryBtnDisabled]}
        onPress={handleFinalRegister}
        disabled={!isStep3Valid || isLoading}
      >
        {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.primaryBtnText}>Continuer</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSkipProfile}>
        <Text style={styles.skipText}>Ignorer pour le moment</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Rendu principal ────────────────────────────────────────────────────────

  const totalSteps = 3;
  const showStepIndicator = !isLoginMode;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header violet avec étapes */}
        {!isLoginMode && (
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Inscription</Text>
            <View style={{ width: 32 }} />
          </View>
        )}

        {showStepIndicator && (
          <View style={styles.stepWrapper}>
            <StepIndicator currentStep={registerStep} totalSteps={totalSteps} />
            <Text style={styles.stepLabel}>Étape {registerStep} sur {totalSteps}</Text>
          </View>
        )}

        {/* Logo (mode login uniquement) */}
        {isLoginMode && (
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/LogoBgSo.png')}
              style={styles.logo}
            />
          </View>
        )}

        {/* Contenu selon mode / étape */}
        {isLoginMode && renderLoginForm()}
        {!isLoginMode && registerStep === 1 && renderStep1()}
        {!isLoginMode && registerStep === 2 && renderStep2()}
        {!isLoginMode && registerStep === 3 && renderStep3()}

        {/* Lien switch mode */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {isLoginMode ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
          </Text>
          <TouchableOpacity onPress={() => { setIsLoginMode(!isLoginMode); setRegisterStep(1); }}>
            <Text style={styles.switchLink}>
              {isLoginMode ? 'Inscrivez-vous' : 'Connectez-vous'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ── Écran wrapper ─────────────────────────────────────────────────────────────

const LoginRegisterScreen = () => <LoginRegisterForm />;

// ── Styles ────────────────────────────────────────────────────────────────────

const PURPLE = '#6C4EF6';
const PURPLE_LIGHT = '#EDE9FF';
const PURPLE_DARK = '#4B2FCE';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F3F0FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // Header
  header: {
    backgroundColor: PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  // Step indicator
  stepWrapper: {
    backgroundColor: PURPLE,
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 32,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  stepDone: {
    backgroundColor: '#A78BFA',
    borderColor: '#A78BFA',
  },
  stepActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  stepNumber: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  stepNumberActive: {
    color: PURPLE,
  },
  stepCheck: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  stepLineDone: {
    backgroundColor: '#A78BFA',
  },
  stepLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 16,
  },
  logo: {
    width: 96,
    height: 96,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    padding: 24,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: PURPLE,
  },
  tabText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  tabTextActive: {
    color: PURPLE,
    fontWeight: '700',
  },

  // Title / subtitle
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: PURPLE,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Profile header icon
  profileHeaderIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: PURPLE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileHeaderEmoji: {
    fontSize: 28,
  },

  // Inputs
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    marginBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
    fontSize: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 4,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    marginBottom: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  inputInner: {
    flex: 1,
    color: '#1F2937',
    fontSize: 15,
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  linkText: {
    color: PURPLE,
    fontWeight: '600',
  },

  // Fitness options
  fitnessOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
  },
  fitnessOptionSelected: {
    borderColor: PURPLE,
    backgroundColor: PURPLE_LIGHT,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: PURPLE,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PURPLE,
  },
  fitnessOptionText: {
    flex: 1,
  },
  fitnessOptionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  fitnessOptionLabelSelected: {
    color: PURPLE,
  },
  fitnessOptionDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  fitnessEmoji: {
    fontSize: 20,
    marginLeft: 8,
  },

  // Anime grid
  animeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  animeCard: {
    width: '47%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  animeCardSelected: {
    borderColor: PURPLE,
    backgroundColor: PURPLE_LIGHT,
  },
  animeIconBg: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  animeIconBgSelected: {
    backgroundColor: '#E0D9FF',
  },
  animeEmoji: {
    fontSize: 28,
  },
  animeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  animeLabelSelected: {
    color: PURPLE,
  },

  // Validation badge
  validationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    gap: 10,
  },
  validationBadgeOk: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  validationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FCA5A5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  validationIconOk: {
    backgroundColor: '#4ADE80',
  },
  validationIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  validationDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  validationStatusLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  validationStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
    textAlign: 'right',
  },
  validationStatusOk: {
    color: '#22C55E',
  },

  // Buttons
  primaryBtn: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipText: {
    color: PURPLE,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: PURPLE,
    fontSize: 13,
    fontWeight: '600',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#9CA3AF',
    fontSize: 13,
    marginHorizontal: 10,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },

  // Switch
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  switchText: {
    color: '#6B7280',
    fontSize: 14,
  },
  switchLink: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginRegisterScreen;