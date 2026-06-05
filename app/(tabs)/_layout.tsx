import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';

export default function Layout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          shadowColor: 'transparent',
        },
        headerTitle: () => (
          <Text style={{ color: COLORS.primary, fontSize: 20, fontWeight: '800' }}>
            📚 Book Tracker
          </Text>
        ),

        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 15 }}>
            <TouchableOpacity onPress={() => router.push('/notifications')} style={{ marginRight: 15 }}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/40' }}
                style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border }}
              />
            </TouchableOpacity>
          </View>
        ),

        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          height: 70,
          borderRadius: 24,
          marginHorizontal: 12,
          marginBottom: 12,
          position: 'absolute',
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
          elevation: 10,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="librairy"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
