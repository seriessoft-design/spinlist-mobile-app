/**
 * Pro Upgrade Screen
 * Shows subscription options and handles purchases via RevenueCat
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { COLORS, PRO_FEATURES } from '../constants/config';
import {
  getAvailablePackages,
  purchasePackage,
  restorePurchases,
} from '../services/revenuecat';
import { getCurrentUser } from '../services/firebase';
import type { PurchasesPackage } from 'react-native-purchases';

type ProUpgradeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProUpgrade'
>;

interface Props {
  navigation: ProUpgradeScreenNavigationProp;
}

const ProUpgradeScreen: React.FC<Props> = ({ navigation }) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const availablePackages = await getAvailablePackages();
      setPackages(availablePackages);
      if (availablePackages.length > 0) {
        setSelectedPackage(availablePackages[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load subscription options');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'Please sign in to purchase');
      return;
    }

    setPurchasing(true);
    try {
      const result = await purchasePackage(selectedPackage, user.uid);
      if (result.success && result.isPro) {
        Alert.alert(
          'Success!',
          'Welcome to Spinlist Pro! 🎉',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert('Purchase Failed', 'Please try again');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    const user = getCurrentUser();
    if (!user) return;

    setPurchasing(true);
    try {
      const result = await restorePurchases(user.uid);
      if (result.success && result.isPro) {
        Alert.alert(
          'Restored!',
          'Your Pro subscription has been restored.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('No Purchases', 'No previous purchases found');
      }
    } catch (error) {
      Alert.alert('Restore Failed', 'Please try again');
    } finally {
      setPurchasing(false);
    }
  };

  const renderFeature = (icon: string, text: string) => (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.badge}>⭐ PRO</Text>
        <Text style={styles.title}>Upgrade to Spinlist Pro</Text>
        <Text style={styles.subtitle}>
          Unlock all features and support development
        </Text>

        <View style={styles.featuresContainer}>
          {renderFeature('📝', 'Unlimited Lists')}
          {renderFeature('🚫', 'No Ads')}
          {renderFeature('☁️', 'Cloud Sync')}
          {renderFeature('🎨', 'Custom Themes')}
          {renderFeature('💬', 'Priority Support')}
        </View>

        {packages.length > 0 && (
          <View style={styles.packagesContainer}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.identifier}
                style={[
                  styles.packageCard,
                  selectedPackage?.identifier === pkg.identifier &&
                    styles.packageCardSelected,
                ]}
                onPress={() => setSelectedPackage(pkg)}
              >
                <View style={styles.packageHeader}>
                  <Text style={styles.packageTitle}>
                    {pkg.product.title}
                  </Text>
                  <Text style={styles.packagePrice}>
                    {pkg.product.priceString}
                  </Text>
                </View>
                <Text style={styles.packageDescription}>
                  {pkg.product.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.purchaseButton, purchasing && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={purchasing || !selectedPackage}
        >
          {purchasing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.purchaseButtonText}>Subscribe Now</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Subscriptions auto-renew unless cancelled 24 hours before the end of the
          current period. Manage in your App Store settings.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  closeIcon: {
    fontSize: 28,
    color: COLORS.textLight,
  },
  content: {
    paddingTop: 100,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  badge: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
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
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.text,
  },
  packagesContainer: {
    marginBottom: 30,
  },
  packageCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packageCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F5',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  packageDescription: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  purchaseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  purchaseButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreText: {
    color: COLORS.textLight,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ProUpgradeScreen;
