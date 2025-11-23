/**
 * Spinlist App Type Definitions
 */

// User Types
export interface User {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  isPro: boolean;
}

// List Types
export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface List {
  id: string;
  userId: string;
  title: string;
  items: ListItem[];
  createdAt: Date;
  updatedAt: Date;
  deleteAt: Date; // Auto-delete timestamp (48 hours after creation)
  isDeleted: boolean;
}

// Decision Types
export interface DecisionOption {
  id: string;
  text: string;
}

export interface Decision {
  id: string;
  userId: string;
  options: DecisionOption[];
  result: string | null;
  createdAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  OTP: { phoneNumber: string };
  MainTabs: undefined;
  DecisionResult: { result: string };
  ListDetail: { listId: string };
  Settings: undefined;
  ProUpgrade: undefined;
};

export type MainTabParamList = {
  DecisionMaker: undefined;
  ListKeeper: undefined;
};

// Subscription Types
export interface SubscriptionProduct {
  identifier: string;
  title: string;
  description: string;
  price: string;
  priceString: string;
  currencyCode: string;
  introPrice: string | null;
}

export interface SubscriptionStatus {
  isPro: boolean;
  productIdentifier: string | null;
  expirationDate: Date | null;
  isActive: boolean;
}

// Settings Types
export interface AppSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
}

// Ad Types
export interface AdConfig {
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  showAds: boolean;
}
