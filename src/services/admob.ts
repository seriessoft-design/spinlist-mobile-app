/**
 * AdMob Service
 * Handles banner and interstitial ads
 */

import { Platform } from 'react-native';
import MobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { ADMOB_CONFIG, USE_TEST_ADS } from '../constants/config';

// Initialize AdMob
let isInitialized = false;

export const initializeAdMob = async () => {
  if (isInitialized) return;
  
  try {
    await MobileAds().initialize();
    isInitialized = true;
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('Error initializing AdMob:', error);
  }
};

// Get Ad Unit IDs based on platform and test mode
export const getAdUnitIds = () => {
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  const config = ADMOB_CONFIG[platform];
  
  if (USE_TEST_ADS) {
    return {
      banner: config.testBannerAdUnitId,
      interstitial: config.testInterstitialAdUnitId,
    };
  }
  
  return {
    banner: config.bannerAdUnitId,
    interstitial: config.interstitialAdUnitId,
  };
};

// ===== Banner Ads =====

export const getBannerAdUnitId = () => {
  return getAdUnitIds().banner;
};

export const BANNER_AD_SIZE = BannerAdSize.BANNER; // 320x50

// ===== Interstitial Ads =====

let interstitialAd: InterstitialAd | null = null;
let isInterstitialLoaded = false;

/**
 * Load interstitial ad
 */
export const loadInterstitialAd = () => {
  const adUnitId = getAdUnitIds().interstitial;
  
  interstitialAd = InterstitialAd.createForAdRequest(adUnitId);
  
  // Listen to ad events
  interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
    isInterstitialLoaded = true;
    console.log('Interstitial ad loaded');
  });
  
  interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
    isInterstitialLoaded = false;
    // Preload next ad
    loadInterstitialAd();
  });
  
  interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
    console.error('Interstitial ad error:', error);
    isInterstitialLoaded = false;
  });
  
  // Load the ad
  interstitialAd.load();
};

/**
 * Show interstitial ad if loaded
 */
export const showInterstitialAd = async (): Promise<boolean> => {
  if (!interstitialAd || !isInterstitialLoaded) {
    console.log('Interstitial ad not ready');
    return false;
  }
  
  try {
    await interstitialAd.show();
    return true;
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
    return false;
  }
};

/**
 * Check if interstitial ad is loaded
 */
export const isInterstitialAdReady = () => {
  return isInterstitialLoaded;
};

// ===== Ad Frequency Management =====

let actionCount = 0;
const AD_FREQUENCY = 5; // Show ad every 5 actions

/**
 * Track user action and show ad if needed
 */
export const trackActionForAd = async (isPro: boolean): Promise<void> => {
  if (isPro) return; // Don't show ads for Pro users
  
  actionCount++;
  
  if (actionCount >= AD_FREQUENCY) {
    actionCount = 0;
    await showInterstitialAd();
  }
};

/**
 * Reset action count
 */
export const resetActionCount = () => {
  actionCount = 0;
};
