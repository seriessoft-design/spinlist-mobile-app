/**
 * RevenueCat Service
 * Handles subscription management and Pro status
 */

import { Platform } from 'react-native';
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import { REVENUECAT_CONFIG, SUBSCRIPTION_PRODUCTS } from '../constants/config';
import { updateUserProStatus } from './firebase';

// Initialize RevenueCat
let isInitialized = false;

export const initializeRevenueCat = async (userId: string) => {
  if (isInitialized) return;
  
  try {
    // Configure SDK
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    
    // Use test API key for now (will be replaced with platform-specific keys)
    Purchases.configure({
      apiKey: REVENUECAT_CONFIG.apiKey,
      appUserID: userId,
    });
    
    isInitialized = true;
    console.log('RevenueCat initialized successfully');
    
    // Check initial subscription status
    await checkSubscriptionStatus(userId);
  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
  }
};

// ===== Subscription Status =====

/**
 * Check if user has active Pro subscription
 */
export const checkSubscriptionStatus = async (userId: string): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isPro = isUserPro(customerInfo);
    
    // Update Firestore with Pro status
    await updateUserProStatus(userId, isPro);
    
    return isPro;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};

/**
 * Check if customer info indicates Pro status
 */
const isUserPro = (customerInfo: CustomerInfo): boolean => {
  // Check if user has any active entitlements
  if (Object.keys(customerInfo.entitlements.active).length > 0) {
    return true;
  }
  
  // Check for lifetime purchase
  if (customerInfo.nonSubscriptionTransactions.length > 0) {
    return true;
  }
  
  return false;
};

/**
 * Listen to subscription status changes
 */
export const listenToSubscriptionChanges = (
  userId: string,
  callback: (isPro: boolean) => void
) => {
  Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
    const isPro = isUserPro(customerInfo);
    await updateUserProStatus(userId, isPro);
    callback(isPro);
  });
};

// ===== Offerings & Packages =====

/**
 * Get available subscription offerings
 */
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    
    if (offerings.current) {
      return offerings.current;
    }
    
    console.log('No current offering available');
    return null;
  } catch (error) {
    console.error('Error getting offerings:', error);
    return null;
  }
};

/**
 * Get all available packages
 */
export const getAvailablePackages = async (): Promise<PurchasesPackage[]> => {
  try {
    const offering = await getOfferings();
    
    if (offering) {
      return offering.availablePackages;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting packages:', error);
    return [];
  }
};

// ===== Purchase =====

/**
 * Purchase a subscription package
 */
export const purchasePackage = async (
  pkg: PurchasesPackage,
  userId: string
): Promise<{ success: boolean; isPro: boolean }> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPro = isUserPro(customerInfo);
    
    // Update Firestore
    await updateUserProStatus(userId, isPro);
    
    return { success: true, isPro };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
    } else {
      console.error('Error purchasing package:', error);
    }
    return { success: false, isPro: false };
  }
};

/**
 * Restore purchases
 */
export const restorePurchases = async (
  userId: string
): Promise<{ success: boolean; isPro: boolean }> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPro = isUserPro(customerInfo);
    
    // Update Firestore
    await updateUserProStatus(userId, isPro);
    
    return { success: true, isPro };
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return { success: false, isPro: false };
  }
};

// ===== Subscription Management =====

/**
 * Get customer info
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
};

/**
 * Get active subscriptions
 */
export const getActiveSubscriptions = async (): Promise<string[]> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return Object.keys(customerInfo.entitlements.active);
  } catch (error) {
    console.error('Error getting active subscriptions:', error);
    return [];
  }
};

/**
 * Check if specific product is active
 */
export const isProductActive = async (productId: string): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return productId in customerInfo.entitlements.active;
  } catch (error) {
    console.error('Error checking product status:', error);
    return false;
  }
};
