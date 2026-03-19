import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { API_URL } from '../types';
import { AvatarCustomizations } from '../components/Character';

// ── Types ────────────────────────────────────────────────────────────────────

interface AvatarStats {
  currentLevel: number;
  experiencePoints: number;
  baseAvatar: string | null;
}

interface AvatarContextType {
  customizations: AvatarCustomizations;
  stats: AvatarStats;
  isLoading: boolean;
  updateCustomizations: (custom: Partial<AvatarCustomizations>) => Promise<void>;
  refreshAvatar: () => Promise<void>;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_STATS: AvatarStats = {
  currentLevel: 1,
  experiencePoints: 0,
  baseAvatar: null,
};

const DEFAULT_CUSTOMIZATIONS: AvatarCustomizations = {
  primaryColor: '#7C3AED',
  secondaryColor: '#4F46E5',
  skinTone: '#C08060',
  gender: 'female',
  morphology: 'athletic',
  outfit: 'sport_01',
};

// ── Context ───────────────────────────────────────────────────────────────────

export const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [customizations, setCustomizations] = useState<AvatarCustomizations>(DEFAULT_CUSTOMIZATIONS);
  const [stats, setStats] = useState<AvatarStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(false);

  // Charger l'avatar depuis l'API
  const refreshAvatar = useCallback(async () => {
    if (!user?.userId || !token) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/avatar/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;

      setStats({
        currentLevel: data.currentLevel ?? data.Current_Level ?? 1,
        experiencePoints: data.experiencePoints ?? data.Experience_Points ?? 0,
        baseAvatar: data.baseAvatar ?? data.Base_Avatar ?? null,
      });

      // Charger les customizations JSON depuis le backend
      if (data.customizations || data.Customizations) {
        try {
          const raw = data.customizations ?? data.Customizations;
          const parsed: AvatarCustomizations = typeof raw === 'string' ? JSON.parse(raw) : raw;
          setCustomizations(prev => ({ ...prev, ...parsed }));
          await AsyncStorage.setItem('avatarCustomizations', JSON.stringify(parsed));
        } catch {
          // JSON malformé — garder les defaults
        }
      } else {
        // Charger depuis le cache local si pas de données backend
        const cached = await AsyncStorage.getItem('avatarCustomizations');
        if (cached) {
          setCustomizations(prev => ({ ...prev, ...JSON.parse(cached) }));
        }
      }
    } catch (error) {
      console.warn('Erreur chargement avatar:', error);
      // Fallback cache local
      const cached = await AsyncStorage.getItem('avatarCustomizations');
      if (cached) {
        setCustomizations(prev => ({ ...prev, ...JSON.parse(cached) }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId, token]);

  // Charger l'avatar au montage quand l'utilisateur est connecté
  useEffect(() => {
    if (user?.userId) {
      refreshAvatar();
    }
  }, [user?.userId]);

  // Sauvegarder les customizations (localement + API)
  const updateCustomizations = useCallback(async (custom: Partial<AvatarCustomizations>) => {
    const merged = { ...customizations, ...custom };
    setCustomizations(merged);

    // Cache local immédiat
    await AsyncStorage.setItem('avatarCustomizations', JSON.stringify(merged));

    // Sync API si connecté
    if (user?.userId && token) {
      try {
        await axios.patch(
          `${API_URL}/api/avatar/${user.userId}/customizations`,
          { customizations: merged },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.warn('Erreur sync customizations API:', error);
        // On garde quand même le changement local
      }
    }
  }, [customizations, user?.userId, token]);

  return (
    <AvatarContext.Provider value={{ customizations, stats, isLoading, updateCustomizations, refreshAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('useAvatar doit être utilisé dans un AvatarProvider');
  return ctx;
};
