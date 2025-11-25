// app/(screens)/HomePage/HomePage.jsx
import { StyleSheet, Text, View } from 'react-native';
import MapComponent from '../../components/MapComponent/MapComponent';

// Temporary stub for "active tasks" with locations
const activeTaskLocations = [
  {
    id: '1',
    title: 'Hidden Statue',
    description: 'Find the statue near the fountain.',
    latitude: 43.6532,
    longitude: -79.3832,
  },
  {
    id: '2',
    title: 'Old Library Puzzle',
    description: 'Solve the riddle at the entrance.',
    latitude: 43.657,
    longitude: -79.39,
  },
];

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Tasks Map</Text>
      <View style={styles.mapContainer}>
        <MapComponent markers={activeTaskLocations} />
      </View>
      {/* Later you can add a summary of active tasks under the map */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
});
