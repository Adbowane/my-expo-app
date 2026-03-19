import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import tw from 'twrnc';

import { SettingsScreenNavigationProp, UserSettings } from '../types/SettingsScreen.types';

const defaultSettings: UserSettings = {
  language: 'en',
  theme: 'auto',
  measurementUnit: 'metric',
  timezone: 'UTC',
  emailNotifications: true,
  pushNotifications: true,
  workoutReminders: true,
  reminderTime: '09:00',
  challengeNotifications: true,
  goalNotifications: true,
  achievementNotifications: true,
  newsletterSubscription: false,
  marketingEmails: false,
  profileVisibility: 'friends',
  showWeight: true,
  showProgress: true,
  showStats: true,
  showLevel: true,
  shareProgressWithFriends: false,
  allowDataAnalytics: true,
  weeklyWorkoutGoal: 3,
  preferredWorkoutDays: [true, true, true, true, true, false, false],
  preferredWorkoutTime: 'morning',
  autoStartNextExercise: false,
  showRestTimer: true,
  restTimerDuration: 60,
  soundEffects: true,
  musicEnabled: true,
  hapticFeedback: true,
  showMotivationalQuotes: true,
  twoFactorEnabled: false,
  sessionTimeout: 30,
};

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const response = await api.get(`/api/settings/${user.userId}`);
      if (response.data) {
        setSettings({ ...defaultSettings, ...response.data });
      }
    } catch (error) {
      console.log('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    if (!user?.userId) return;
    try {
      setSaving(true);
      await api.put(`/api/settings/${user.userId}`, { [key]: value });
    } catch (error) {
      console.log('Error updating setting:', error);
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' },
    { label: 'Español', value: 'es' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Italiano', value: 'it' },
    { label: 'Português', value: 'pt' },
    { label: '日本語', value: 'ja' },
    { label: '中文', value: 'zh' },
  ];

  const themes = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Auto', value: 'auto' },
  ];

  const units = [
    { label: 'Metric (kg, cm)', value: 'metric' },
    { label: 'Imperial (lb, in)', value: 'imperial' },
  ];

  const workoutTimes = [
    { label: 'Morning', value: 'morning' },
    { label: 'Afternoon', value: 'afternoon' },
    { label: 'Evening', value: 'evening' },
    { label: 'Night', value: 'night' },
  ];

  const visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Friends', value: 'friends' },
    { label: 'Private', value: 'private' },
  ];

  const renderToggle = (key: keyof UserSettings, label: string, icon: string) => (
    <View style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-xl`}>{icon}</Text>
        <Text style={tw`text-base ml-3`}>{label}</Text>
      </View>
      <Switch
        trackColor={{ false: '#d4d4d4', true: '#34c759' }}
        thumbColor={'#fff'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={(value) => updateSetting(key, value)}
        value={settings[key] as boolean}
      />
    </View>
  );

  const renderSelector = (
    key: keyof UserSettings,
    label: string,
    icon: string,
    options: { label: string; value: string }[]
  ) => (
    <TouchableOpacity
      style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}
      onPress={() => {
        Alert.alert(label, 'Select an option', [
          ...options.map((opt) => ({
            text: opt.label,
            onPress: () => updateSetting(key, opt.value),
          })),
          { text: 'Cancel', style: 'cancel' },
        ]);
      }}>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-xl`}>{icon}</Text>
        <View style={tw`ml-3`}>
          <Text style={tw`text-base`}>{label}</Text>
          <Text style={tw`text-gray-500 text-sm`}>
            {options.find((o) => o.value === settings[key])?.label || 'Select'}
          </Text>
        </View>
      </View>
      <Text style={tw`text-gray-400`}>›</Text>
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={tw`mb-4`}>
      <Text style={tw`text-lg font-bold text-gray-700 mb-2 px-1`}>{title}</Text>
      {children}
    </View>
  );

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  if (loading) {
    return (
      <View style={tw`flex-1 bg-gray-100 justify-center items-center`}>
        <ActivityIndicator size="large" color="#34c759" />
        <Text style={tw`mt-2 text-gray-500`}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View
        style={tw`flex-row items-center justify-between px-4 py-2 bg-white border-b border-gray-200`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Settings</Text>
        <View style={tw`w-8`}>{saving && <ActivityIndicator size="small" color="#34c759" />}</View>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-20`}>
        <View style={tw`items-center mb-6`}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={tw`w-24 h-24 rounded-full`}
          />
          <Text style={tw`text-lg font-semibold mt-2`}>
            {user?.name} {user?.surname}
          </Text>
          <Text style={tw`text-gray-500`}>{user?.email}</Text>
          <View style={tw`flex-row items-center bg-gray-200 px-4 py-2 rounded-full mt-2`}>
            <Text style={tw`text-xl`}>⭐</Text>
            <Text style={tw`text-lg font-medium ml-2`}>Level {user?.currentLevel || 1}</Text>
          </View>
        </View>

        {renderSection(
          'General',
          <>
            {renderSelector('language', 'Language', '🌐', languages)}
            {renderSelector('theme', 'Theme', '🎨', themes)}
            {renderSelector('measurementUnit', 'Units', '📏', units)}
          </>
        )}

        {renderSection(
          'Notifications',
          <>
            {renderToggle('emailNotifications', 'Email Notifications', '📧')}
            {renderToggle('pushNotifications', 'Push Notifications', '🔔')}
            {renderToggle('workoutReminders', 'Workout Reminders', '🏋️')}
            {renderToggle('challengeNotifications', 'Challenge Notifications', '🏆')}
            {renderToggle('goalNotifications', 'Goal Notifications', '🎯')}
            {renderToggle('achievementNotifications', 'Achievements', '🌟')}
            {renderToggle('newsletterSubscription', 'Newsletter', '📰')}
            {renderToggle('marketingEmails', 'Marketing Emails', '📨')}
          </>
        )}

        {renderSection(
          'Privacy',
          <>
            {renderSelector('profileVisibility', 'Profile Visibility', '👁️', visibilityOptions)}
            {renderToggle('showWeight', 'Show Weight', '⚖️')}
            {renderToggle('showProgress', 'Show Progress', '📈')}
            {renderToggle('showStats', 'Show Stats', '📊')}
            {renderToggle('showLevel', 'Show Level', '⭐')}
            {renderToggle('shareProgressWithFriends', 'Share with Friends', '👥')}
            {renderToggle('allowDataAnalytics', 'Data Analytics', '📉')}
          </>
        )}

        {renderSection(
          'Workout Preferences',
          <>
            <View
              style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-xl`}>🎯</Text>
                <Text style={tw`text-base ml-3`}>Weekly Goal</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <TouchableOpacity
                  onPress={() => {
                    const newGoal = Math.max(1, settings.weeklyWorkoutGoal - 1);
                    updateSetting('weeklyWorkoutGoal', newGoal);
                  }}
                  style={tw`w-8 h-8 bg-gray-200 rounded-full justify-center items-center`}>
                  <Text style={tw`text-lg font-bold`}>-</Text>
                </TouchableOpacity>
                <Text style={tw`text-lg font-semibold mx-3`}>{settings.weeklyWorkoutGoal}</Text>
                <TouchableOpacity
                  onPress={() => {
                    const newGoal = Math.min(7, settings.weeklyWorkoutGoal + 1);
                    updateSetting('weeklyWorkoutGoal', newGoal);
                  }}
                  style={tw`w-8 h-8 bg-gray-200 rounded-full justify-center items-center`}>
                  <Text style={tw`text-lg font-bold`}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {renderSelector('preferredWorkoutTime', 'Preferred Time', '⏰', workoutTimes)}
            {renderToggle('autoStartNextExercise', 'Auto-start Exercise', '▶️')}
            {renderToggle('showRestTimer', 'Show Rest Timer', '⏱️')}
            <View
              style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-xl`}>⏱️</Text>
                <Text style={tw`text-base ml-3`}>Rest Duration</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <TouchableOpacity
                  onPress={() => {
                    const newDuration = Math.max(15, settings.restTimerDuration - 15);
                    updateSetting('restTimerDuration', newDuration);
                  }}
                  style={tw`w-8 h-8 bg-gray-200 rounded-full justify-center items-center`}>
                  <Text style={tw`text-lg font-bold`}>-</Text>
                </TouchableOpacity>
                <Text style={tw`text-lg font-semibold mx-3`}>{settings.restTimerDuration}s</Text>
                <TouchableOpacity
                  onPress={() => {
                    const newDuration = Math.min(180, settings.restTimerDuration + 15);
                    updateSetting('restTimerDuration', newDuration);
                  }}
                  style={tw`w-8 h-8 bg-gray-200 rounded-full justify-center items-center`}>
                  <Text style={tw`text-lg font-bold`}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {renderSection(
          'Audio & Video',
          <>
            {renderToggle('soundEffects', 'Sound Effects', '🔊')}
            {renderToggle('musicEnabled', 'Music', '🎵')}
            {renderToggle('hapticFeedback', 'Haptic Feedback', '📳')}
            {renderToggle('showMotivationalQuotes', 'Motivational Quotes', '💬')}
          </>
        )}

        {renderSection(
          'Security',
          <>
            {renderToggle('twoFactorEnabled', 'Two-Factor Auth', '🔒')}
            <View
              style={tw`flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm`}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-xl`}>⏱️</Text>
                <Text style={tw`text-base ml-3`}>Session Timeout</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <TouchableOpacity
                  onPress={() => {
                    const newTimeout = Math.max(5, settings.sessionTimeout - 5);
                    updateSetting('sessionTimeout', newTimeout);
                  }}
                  style={tw`w-8 h-8 bg-gray-200 rounded-full justify-center items-center`}>
                  <Text style={tw`text-lg font-bold`}>-</Text>
                </TouchableOpacity>
                <Text style={tw`text-lg font-semibold mx-3`}>{settings.sessionTimeout}m</Text>
                <TouchableOpacity
                  onPress={() => {
                    const newTimeout = Math.min(120, settings.sessionTimeout + 5);
                    updateSetting('sessionTimeout', newTimeout);
                  }}
                  style={tw`w-8 h-8 bg-gray-200 rounded-full justify-center items-center`}>
                  <Text style={tw`text-lg font-bold`}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity
          style={tw`bg-red-500 p-4 rounded-lg mb-4 mt-4`}
          onPress={() => {
            Alert.alert(
              'Reset Settings',
              'Are you sure you want to reset all settings to defaults?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Reset',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await api.post(`/api/settings/${user?.userId}/reset`);
                      setSettings(defaultSettings);
                      Alert.alert('Success', 'Settings have been reset to defaults.');
                    } catch (error) {
                      Alert.alert('Error', 'Failed to reset settings.');
                    }
                  },
                },
              ]
            );
          }}>
          <Text style={tw`text-white text-center font-bold`}>Reset All Settings</Text>
        </TouchableOpacity>
      </ScrollView>

      <Navbar />
    </View>
  );
};

export default SettingsScreen;
