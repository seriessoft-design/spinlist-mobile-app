/**
 * Banner Ad Component
 * Displays AdMob banner ads at the bottom of screens
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getBannerAdUnitId } from '../services/admob';

interface Props {
  show?: boolean;
}

const BannerAd: React.FC<Props> = ({ show = true }) => {
  if (!show) return null;

  return (
    <View style={styles.container}>
      <RNBannerAd
        unitId={getBannerAdUnitId()}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 5,
  },
});

export default BannerAd;
