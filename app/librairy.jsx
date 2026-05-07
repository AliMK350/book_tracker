import { View, Text, StyleSheet } from 'react-native';

export default function Library() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Ma Bibliothèque</Text>
      <Text style={styles.subtitle}>
        Tes livres apparaîtront ici
      </Text>
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
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },

  subtitle: {
    color: '#94a3b8',
    marginTop: 10
  }
});