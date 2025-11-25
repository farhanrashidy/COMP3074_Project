// app/components/MapComponent/MapComponent.jsx
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// For now, take markers as props so we can pass active tasks from HomePage
export default function MapComponent({ markers }) {
  const initialRegion = {
    latitude: markers?.[0]?.latitude ?? 43.6532,
    longitude: markers?.[0]?.longitude ?? -79.3832,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <MapView style={styles.map} initialRegion={initialRegion}>
      {markers?.map((m) => (
        <Marker
          key={m.id}
          coordinate={{ latitude: m.latitude, longitude: m.longitude }}
          title={m.title}
          description={m.description}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 12,
  },
});
