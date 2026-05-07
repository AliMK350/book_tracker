import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { useNavigation } from 'expo-router';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🔍 Rechercher</Text>

      <TextInput
        placeholder="Chercher un livre..."
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />

      <Text style={styles.resultText}>
        Résultats pour : "{query}"
      </Text>

      {/* Fake results pour design */}
      <FlatList
        data={[{ id: '1', title: 'Example Book' }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <Text style={styles.book}>{item.title}</Text>
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
    paddingTop: 60
  },

  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20
  },

  input: {
    backgroundColor: '#1e293b',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    marginBottom: 20
  },

  resultText: {
    color: '#94a3b8',
    marginBottom: 10
  },

  resultCard: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },

  book: {
    color: '#fff'
  }
});