/**
 * Login Screen
 * Allows users to sign in with email/password or phone number
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { COLORS, APP_NAME, APP_TAGLINE } from '../constants/config';
import { signInWithEmail, signUpWithEmail, signInWithPhone } from '../services/firebase';
import { isValidEmail, isValidPhoneNumber } from '../utils/helpers';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const confirmation = await signInWithPhone(phoneNumber);
      navigation.navigate('OTP', { phoneNumber, confirmation } as any);
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderEmailForm = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleEmailAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp
            ? 'Already have an account? Sign In'
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderPhoneForm = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Phone Number (+1234567890)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handlePhoneAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_TAGLINE}</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, mode === 'email' && styles.activeTab]}
            onPress={() => setMode('email')}
          >
            <Text style={[styles.tabText, mode === 'email' && styles.activeTabText]}>
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'phone' && styles.activeTab]}
            onPress={() => setMode('phone')}
          >
            <Text style={[styles.tabText, mode === 'phone' && styles.activeTabText]}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'email' ? renderEmailForm() : renderPhoneForm()}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 60,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});

export default LoginScreen;
