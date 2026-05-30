import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { COLORS } from '../../utils/constants';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.dark,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: COLORS.textPrimary,
        },
        contentStyle: {
          backgroundColor: COLORS.dark,
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
