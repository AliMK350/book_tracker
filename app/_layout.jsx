import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTitle: () => (
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            📚 Book Tracker
          </Text>
        ),

        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 15 }}>
            <Ionicons name="notifications-outline" size={22} color="#fff" style={{ marginRight: 15 }} />
            <Image
              source={{ uri: 'https://i.pravatar.cc/40' }}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
          </View>
        ),

        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopWidth: 0,
          height: 65,
          borderRadius: 20,
          marginHorizontal: 10,
          marginBottom: 10,
          position: 'absolute'
        },

        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
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
        name="library"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}