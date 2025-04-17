import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../types';

// Interface pour l'utilisateur
type User = {
  userId: number;
  email: string;
  name: string;
  surname: string;
  currentLevel?: number; // Niveau actuel depuis User_Avatar
};

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, surname: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Création du contexte
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur du contexte
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données stockées au démarrage
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);

          // Valider le token en récupérant les données utilisateur
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await axios.get(`${API_URL}/api/user/${parsedUser.userId}`);
          const { User_Id, Email, Name, Surname } = response.data.user;
          const currentLevel = response.data.avatar?.Current_Level || 1;

          const updatedUser = {
            userId: User_Id,
            email: Email,
            name: Name,
            surname: Surname,
            currentLevel,
          };

          setUser(updatedUser);
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données auth:', error);
        // En cas d'erreur (par exemple, token invalide), déconnexion
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, { email, password });
      const { token, user: userData, avatar } = response.data;

      const user: User = {
        userId: userData.User_Id,
        email: userData.Email,
        name: userData.Name,
        surname: userData.Surname,
        currentLevel: avatar?.Current_Level || 1,
      };

      // Stocker le token et les données utilisateur
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);

      // Configurer l'en-tête Authorization pour les requêtes futures
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw new Error('Échec de la connexion. Vérifiez vos identifiants.');
    }
  };

  // Fonction d'inscription
  const register = async (email: string, password: string, name: string, surname: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        email,
        password,
        name,
        surname,
      });

      // Après l'inscription, connecter automatiquement l'utilisateur
      const { token, user: userData, avatar } = response.data;

      const user: User = {
        userId: userData.User_Id,
        email: userData.Email,
        name: userData.Name,
        surname: userData.Surname,
        currentLevel: avatar?.Current_Level || 1,
      };

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw new Error('Échec de l\'inscription. L\'email est peut-être déjà utilisé.');
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw new Error('Échec de la déconnexion.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};