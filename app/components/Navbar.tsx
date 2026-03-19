import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

import { styles } from '../types/Navbar.styles';
import { NavigationProp, NavItem } from '../types/Navbar.types';

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Accueil',
    icon: 'home-outline',
    iconActive: 'home',
    route: 'DashboardScreen',
  },
  {
    name: 'Niveaux',
    icon: 'flame-outline',
    iconActive: 'flame',
    route: 'LevelScreen',
    routeParams: { name: 'Default' },
  },
  {
    name: 'Personnage',
    icon: 'person-outline',
    iconActive: 'person',
    route: 'CharacterScreen',
    requiresAuth: true,
  },
  {
    name: 'Animes',
    icon: 'tv-outline',
    iconActive: 'tv',
    route: 'AnimeDiscoverScreen',
    requiresAuth: true,
  },
  {
    name: 'Profil',
    icon: 'settings-outline',
    iconActive: 'settings',
    route: 'SettingsScreen',
    requiresAuth: true,
  },
];

export default function Navbar() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { token, isLoading } = useAuth();

  if (isLoading) return null;

  const handlePress = (item: NavItem) => {
    if (item.requiresAuth && !token) {
      navigation.navigate('LoginRegisterScreen', {});
      return;
    }
    const params = item.routeParams ?? {};
    // @ts-ignore — params dynamiques
    navigation.navigate(item.route, params);
  };

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = route.name === item.route;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.item}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            {/* Indicateur actif */}
            {isActive && <View style={styles.activeIndicator} />}

            <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
              <Ionicons
                name={isActive ? item.iconActive : item.icon}
                size={22}
                color={isActive ? '#fff' : '#9CA3AF'}
              />
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}