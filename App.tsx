/**
 * Spinlist App
 * Main entry point
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { initializeAdMob, loadInterstitialAd } from './src/services/admob';
import { onAuthStateChanged } from './src/services/firebase';
import { initializeRevenueCat } from './src/services/revenuecat';

const App = () => {
  useEffect(() => {
    // Initialize services with defensive error handling
    const initializeServices = async () => {
      // Initialize AdMob (non-blocking)
      try {
        await initializeAdMob();
        console.log('AdMob initialized, now loading first ad');
        // Wait a moment for AdMob to be fully ready
        await new Promise(resolve => setTimeout(resolve, 500));
        // Preload first interstitial ad
        try {
          await loadInterstitialAd();
          console.log('First interstitial ad loaded successfully');
        } catch (adError) {
          console.log('Failed to load initial ad (non-critical):', adError);
        }
      } catch (admobError) {
        console.error('AdMob initialization failed (non-critical):', admobError);
      }
    };

    // Start initialization
    initializeServices();

    // Listen to auth state changes (with error handling)
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged((user) => {
        if (user) {
          // Initialize RevenueCat when user logs in (non-blocking)
          initializeRevenueCat(user.uid).catch((error) => {
            console.error('RevenueCat initialization failed (non-critical):', error);
          });
        }
      });
    } catch (authError) {
      console.error('Auth state listener setup failed:', authError);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth changes:', error);
        }
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;
