import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { fetchProfile } from '../../api/profile';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await fetchProfile('1234567890');
      setProfile(p);
      if (!p) {
        setError('Profile not found');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {profile ? (
        <>
          <Text style={styles.name}>{profile.name}</Text>
          <Text>{profile.email}</Text>
          <Text style={styles.small}>ID: {profile.id}</Text>
        </>
      ) : (
        !loading && <Button title="Load profile" onPress={loadProfile} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  name: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  small: { marginTop: 8, color: '#666' },
  error: { color: 'red', marginBottom: 8 },
});

export default ProfilePage;
