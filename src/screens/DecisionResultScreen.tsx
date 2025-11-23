/**
 * Decision Result Screen
 * Shows the result of the decision with confetti celebration
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/config';
import ConfettiCannon from 'react-native-confetti-cannon';

type DecisionResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DecisionResult'
>;
type DecisionResultScreenRouteProp = RouteProp<RootStackParamList, 'DecisionResult'>;

interface Props {
  navigation: DecisionResultScreenNavigationProp;
  route: DecisionResultScreenRouteProp;
}

const DecisionResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { result } = route.params;
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    // Trigger confetti on mount
    if (confettiRef.current) {
      confettiRef.current.start();
    }
  }, []);

  const handleDone = () => {
    navigation.goBack();
  };

  const handleSpinAgain = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut
      />

      <View style={styles.content}>
        <Text style={styles.label}>The answer is...</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
        <Text style={styles.emoji}>🎉</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleSpinAgain}>
          <Text style={styles.secondaryButtonText}>Spin Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleDone}>
          <Text style={styles.primaryButtonText}>Done</Text>
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
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 20,
    color: COLORS.textLight,
    marginBottom: 30,
  },
  resultContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderRadius: 20,
    marginBottom: 30,
    minWidth: '80%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emoji: {
    fontSize: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DecisionResultScreen;
