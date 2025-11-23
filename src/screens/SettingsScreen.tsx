/**
 * Settings Screen
 * User account settings, app preferences, and logout
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { COLORS, APP_VERSION } from '../constants/config';
import { getCurrentUser, getUserData, signOut } from '../services/firebase';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const userData = await getUserData(currentUser.uid);
      setIsPro(userData?.isPro || false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const renderSection = (title: string) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderSettingRow = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (onPress && <Text style={styles.arrow}>›</Text>)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {renderSection('ACCOUNT')}
        {renderSettingRow(
          '👤',
          user?.email || user?.phoneNumber || 'User',
          isPro ? 'Pro Member' : 'Free Member'
        )}
        {!isPro && renderSettingRow(
          '⭐',
          'Upgrade to Pro',
          'Unlock all features',
          () => navigation.navigate('ProUpgrade')
        )}

        {renderSection('PREFERENCES')}
        {renderSettingRow(
          '🔊',
          'Sound Effects',
          'Play sounds for actions',
          undefined,
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        )}
        {renderSettingRow(
          '🔔',
          'Notifications',
          'Remind me about expiring lists',
          undefined,
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        )}

        {renderSection('SUPPORT')}
        {renderSettingRow(
          '❓',
          'Help & FAQ',
          'Get help and answers',
          () => Alert.alert('Help', 'Help documentation coming soon!')
        )}
        {renderSettingRow(
          '📧',
          'Contact Support',
          'Send us feedback',
          () => Alert.alert('Contact', 'support@spinlist.app')
        )}
        {renderSettingRow(
          '⭐',
          'Rate Us',
          'Leave a review',
          () => Alert.alert('Rate Us', 'Thank you for your support!')
        )}

        {renderSection('ABOUT')}
        {renderSettingRow(
          'ℹ️',
          'Version',
          APP_VERSION
        )}
        {renderSettingRow(
          '📄',
          'Privacy Policy',
          'How we protect your data',
          () => Alert.alert('Privacy', 'Privacy policy coming soon!')
        )}
        {renderSettingRow(
          '📜',
          'Terms of Service',
          'Terms and conditions',
          () => Alert.alert('Terms', 'Terms of service coming soon!')
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 28,
    color: COLORS.textLight,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    marginHorizontal: 20,
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SettingsScreen;
