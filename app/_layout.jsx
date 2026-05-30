import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Redirect, Slot, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../utils/constants';
import { AuthProvider } from '../context/AuthContext';
import { BooksProvider } from '../context/BooksContext';

function RootLayoutNav() {
  const { isLoading, isSignout } = useAuth();
  const segments = useSegments();
  const isAuthRoute = segments.includes('(auth)');

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.dark }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isSignout && !isAuthRoute) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <BooksProvider>
        <RootLayoutNav />
      </BooksProvider>
    </AuthProvider>
  );
}