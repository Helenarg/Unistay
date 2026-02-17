import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  // Fix: React Native Web sets body { overflow: hidden } which prevents scrolling on web
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Only override overflow — don't touch RN Web's container positions/heights
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    }
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
