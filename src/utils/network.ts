/**
 * Network Utility
 * Handles network connectivity checking
 */

import NetInfo from '@react-native-community/netinfo';

/**
 * Check if device is connected to network
 */
export const isConnected = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.isInternetReachable === true;
  } catch (error) {
    console.error('Error checking network state:', error);
    return false; // Assume offline if check fails
  }
};

/**
 * Listen to network state changes
 */
export const onNetworkStateChange = (callback: (isConnected: boolean) => void) => {
  return NetInfo.addEventListener(state => {
    const connected = state.isConnected === true && state.isInternetReachable === true;
    callback(connected);
  });
};

/**
 * Get current network state
 */
export const getNetworkState = async () => {
  try {
    return await NetInfo.fetch();
  } catch (error) {
    console.error('Error getting network state:', error);
    return null;
  }
};
