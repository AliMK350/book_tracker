import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { COLORS } from '../../utils/constants';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: COLORS.primary,
        },
        contentStyle: {
          backgroundColor: COLORS.surface,
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Connexion',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Inscription',
        }}
      />
    </Stack>
  );
}
