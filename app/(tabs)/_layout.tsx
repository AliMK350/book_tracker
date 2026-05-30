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
          backgroundColor: COLORS.dark,
        },
        headerTitle: () => (
          <Text style={{ color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold' }}>
            📚 Book Tracker
          </Text>
        ),

        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 15 }}>
            <TouchableOpacity onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/40' }}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              />
            </TouchableOpacity>
          </View>
        ),

        tabBarStyle: {
          backgroundColor: COLORS.darkMedium,
          borderTopWidth: 0,
          height: 65,
          borderRadius: 20,
          marginHorizontal: 10,
          marginBottom: 10,
          position: 'absolute'
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
