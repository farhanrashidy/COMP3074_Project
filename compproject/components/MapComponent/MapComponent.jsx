// app/components/MapComponent/MapComponent.web.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapComponent({ markers }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map not available on web yet</Text>
      <Text style={styles.subtitle}>
        Active locations: {markers?.length ?? 0}
      </Text>
      {/* Later, you can plug in a real web map here (Leaflet, Mapbox, etc.) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
  },
});
