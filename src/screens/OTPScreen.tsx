/**
 * OTP Verification Screen
 * Allows users to enter the OTP code sent to their phone
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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/config';
import { verifyPhoneOTP } from '../services/firebase';

type OTPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTP'>;
type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

interface Props {
  navigation: OTPScreenNavigationProp;
  route: OTPScreenRouteProp;
}

const OTPScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phoneNumber, confirmation } = route.params as any;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await verifyPhoneOTP(confirmation, code);
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Verification Error', 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          {phoneNumber}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="000000"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Change Phone Number</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backText: {
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});

export default OTPScreen;
