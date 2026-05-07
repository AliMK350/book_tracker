import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';

const books = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    progress: '60%',
    image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg'
  },
  {
    id: '2',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    progress: '80%',
    image: 'https://covers.openlibrary.org/b/id/8101346-L.jpg'
  }
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>📚 Book Tracker</Text>
      <Text style={styles.subtitle}>Organise et suis tes lectures</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/search')}
      >
        <Text style={styles.buttonText}>Explorer les livres</Text>
      </TouchableOpacity>

      <Text style={styles.section}>Continue Reading</Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            
            <View style={styles.info}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.author}>{item.author}</Text>

              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: item.progress }]} />
              </View>

              <Text style={styles.progressText}>{item.progress}</Text>
            </View>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },

  logo: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 50
  },

  subtitle: {
    color: '#94a3b8',
    marginBottom: 25
  },

  button: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 5
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  section: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden'
  },

  image: {
    width: 90,
    height: 130
  },

  info: {
    flex: 1,
    padding: 10
  },

  bookTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  author: {
    color: '#94a3b8',
    marginBottom: 10
  },

  progressBar: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 5
  },

  progress: {
    height: '100%',
    backgroundColor: '#22c55e'
  },

  progressText: {
    color: '#94a3b8',
    marginTop: 5,
    fontSize: 12
  }
});