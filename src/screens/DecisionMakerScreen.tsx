/**
 * Decision Maker Screen
 * Main feature - spin the wheel to make decisions
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/config';
import { getRandomItem, delay } from '../utils/helpers';
import { saveDecision, getCurrentUser } from '../services/firebase';
import { trackActionForAd } from '../services/admob';

type DecisionMakerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MainTabs'
>;

interface Props {
  navigation: DecisionMakerScreenNavigationProp;
}

const DecisionMakerScreen: React.FC<Props> = ({ navigation }) => {
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    } else {
      Alert.alert('Limit Reached', 'Maximum 10 options allowed');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleSpin = async () => {
    // Validate options
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      Alert.alert('Not Enough Options', 'Please enter at least 2 options');
      return;
    }

    setIsSpinning(true);

    // Spin animation
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 10,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    // Wait for animation
    await delay(3000);

    // Get random result
    const result = getRandomItem(validOptions);

    // Save decision to Firestore
    const user = getCurrentUser();
    if (user) {
      try {
        await saveDecision(user.uid, validOptions, result);
      } catch (error) {
        console.error('Error saving decision:', error);
      }
    }

    setIsSpinning(false);

    // Track action for ad frequency
    if (user) {
      const userData = await import('../services/firebase').then(m =>
        m.getUserData(user.uid)
      );
      await trackActionForAd(userData?.isPro || false);
    }

    // Navigate to result screen
    navigation.navigate('DecisionResult', { result });
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎲 Decision Maker</Text>
        <Text style={styles.subtitle}>Can't decide? Let fate choose!</Text>
      </View>

      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {options.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <TextInput
              style={styles.optionInput}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChangeText={(text) => handleOptionChange(text, index)}
              editable={!isSpinning}
            />
            {options.length > 2 && (
              <TouchableOpacity
                onPress={() => handleRemoveOption(index)}
                disabled={isSpinning}
              >
                <Text style={styles.removeButton}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {options.length < 10 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddOption}
            disabled={isSpinning}
          >
            <Text style={styles.addButtonText}>+ Add Option</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.spinContainer}>
        <Animated.View
          style={[
            styles.spinWheel,
            { transform: [{ rotate: spin }] },
          ]}
        >
          <Text style={styles.wheelText}>🎲</Text>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
        onPress={handleSpin}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? 'Spinning...' : 'SPIN!'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  removeButton: {
    fontSize: 24,
    color: COLORS.error,
    marginLeft: 12,
    width: 30,
    textAlign: 'center',
  },
  addButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  spinContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  spinWheel: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelText: {
    fontSize: 60,
  },
  spinButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  spinButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DecisionMakerScreen;
