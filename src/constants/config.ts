/**
 * Spinlist App Configuration
 * Contains all app constants, API keys, and configuration values
 */

// App Information
export const APP_NAME = 'Spinlist';
export const APP_TAGLINE = 'Spin to decide. List to remember.';
export const APP_VERSION = '1.0.0';

// Firebase Configuration
export const FIREBASE_CONFIG = {
  // iOS Configuration
  ios: {
    apiKey: 'YOUR_IOS_API_KEY',
    authDomain: 'spinlist-d8597.firebaseapp.com',
    projectId: 'spinlist-d8597',
    storageBucket: 'spinlist-d8597.firebasestorage.app',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_IOS_APP_ID',
  },
  // Android Configuration
  android: {
    apiKey: 'YOUR_ANDROID_API_KEY',
    authDomain: 'spinlist-d8597.firebaseapp.com',
    projectId: 'spinlist-d8597',
    storageBucket: 'spinlist-d8597.firebasestorage.app',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_ANDROID_APP_ID',
  },
};

// AdMob Configuration
export const ADMOB_CONFIG = {
  ios: {
    appId: 'ca-app-pub-7913011400514913~1290888174',
    bannerAdUnitId: 'ca-app-pub-7913011400514913/5965340792',
    interstitialAdUnitId: 'ca-app-pub-7913011400514913/4652259123',
    // Test IDs for development
    testBannerAdUnitId: 'ca-app-pub-3940256099942544/2934735716',
    testInterstitialAdUnitId: 'ca-app-pub-3940256099942544/4411468910',
  },
  android: {
    appId: 'ca-app-pub-7913011400514913~5038561494',
    bannerAdUnitId: 'ca-app-pub-7913011400514913/3802211889',
    interstitialAdUnitId: 'ca-app-pub-7913011400514913/8307706756',
    // Test IDs for development
    testBannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111',
    testInterstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712',
  },
};

// RevenueCat Configuration
export const REVENUECAT_CONFIG = {
  apiKey: 'goog_wrYRWLQYoXwWMRQvq5QOVRA0UBJ', // Production API key for Google Play
  // Production keys will be added after app store configuration
  iosApiKey: '',
  androidApiKey: '',
};

// Subscription Products
export const SUBSCRIPTION_PRODUCTS = {
  monthly: 'spinlist_pro_monthly',
  annual: 'spinlist_pro_annual',
  lifetime: 'spinlist_pro_lifetime',
};

// App Colors (from design)
export const COLORS = {
  primary: '#FF6B6B', // Coral
  secondary: '#4ECDC4', // Blue
  accent: '#9B59B6', // Purple
  background: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
};

// Free vs Pro Limits
export const FREE_LIMITS = {
  maxLists: 3,
  showAds: true,
  adFrequency: 5, // Show interstitial ad every 5 actions
};

export const PRO_FEATURES = {
  unlimitedLists: true,
  noAds: true,
  cloudSync: true,
  customThemes: true,
  prioritySupport: true,
};

// List Auto-Delete Timer (48 hours in milliseconds)
export const LIST_DELETE_TIMER = 48 * 60 * 60 * 1000; // 48 hours

// Onboarding
export const ONBOARDING_SCREENS = [
  {
    id: 1,
    title: 'Make Decisions Easily',
    description: 'Can\'t decide? Just spin the wheel and let fate choose for you!',
    icon: '🎲',
  },
  {
    id: 2,
    title: 'Remember Everything',
    description: 'Keep track of your lists with automatic 48-hour reminders.',
    icon: '📝',
  },
  {
    id: 3,
    title: 'Go Pro for More',
    description: 'Unlock unlimited lists, remove ads, and get premium features!',
    icon: '⭐',
  },
];

// Development Mode
export const __DEV__ = process.env.NODE_ENV === 'development';
export const USE_TEST_ADS = __DEV__; // Use test ad units in development
