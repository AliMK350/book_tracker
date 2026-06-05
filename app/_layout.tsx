import { Stack } from 'expo-router';
import { COLORS } from '../utils/constants';
import { AuthProvider } from '../context/AuthContext';
import { BooksProvider } from '../context/BooksContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <BooksProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.bg } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
        </Stack>
      </BooksProvider>
    </AuthProvider>
  );
}
