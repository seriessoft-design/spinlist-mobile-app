/**
 * App Navigation Structure
 * Handles routing between screens
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../types';

// Import screens (will be created next)
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import DecisionMakerScreen from '../screens/DecisionMakerScreen';
import ListKeeperScreen from '../screens/ListKeeperScreen';
import DecisionResultScreen from '../screens/DecisionResultScreen';
import ListDetailScreen from '../screens/ListDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProUpgradeScreen from '../screens/ProUpgradeScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Tab Navigator (Decision Maker + List Keeper)
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="DecisionMaker"
        component={DecisionMakerScreen}
        options={{
          tabBarLabel: 'Decide',
          tabBarIcon: ({ color, size }) => <span style={{ fontSize: size }}>🎲</span>,
        }}
      />
      <Tab.Screen
        name="ListKeeper"
        component={ListKeeperScreen}
        options={{
          tabBarLabel: 'Lists',
          tabBarIcon: ({ color, size }) => <span style={{ fontSize: size }}>📝</span>,
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Stack Navigator
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen 
          name="DecisionResult" 
          component={DecisionResultScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="ListDetail" component={ListDetailScreen} />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name="ProUpgrade" 
          component={ProUpgradeScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
