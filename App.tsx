/**
 * Spinlist App
 * Main entry point
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeAdMob, loadInterstitialAd } from './src/services/admob';
import { onAuthStateChanged } from './src/services/firebase';
import { initializeRevenueCat } from './src/services/revenuecat';

const App = () => {
  useEffect(() => {
    // Initialize AdMob
    initializeAdMob().then(() => {
      // Preload first interstitial ad
      loadInterstitialAd();
    });

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        // Initialize RevenueCat when user logs in
        initializeRevenueCat(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
