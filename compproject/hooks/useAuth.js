import { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const AUTH_ENDPOINT = process.env.EXPO_PUBLIC_API_URL ? `${process.env.EXPO_PUBLIC_API_URL}` : '';
const TOKEN_KEY = 'auth_token';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedToken && AUTH_ENDPOINT) {
          const response = await fetch(`${AUTH_ENDPOINT}/user/profile`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            const profile = await response.json();
            setUser(profile);
            setToken(storedToken);
          } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
          }
        }
      } catch (e) {
        console.error("Failed to load auth state", e);
      } finally {
        setLoading(false);
      }
    }
    loadState();
  }, []);

  const signIn = async (email, password) => {
    try {
      if (!AUTH_ENDPOINT) {
        console.error("API URL not configured");
        return { loginError: { message: "API URL not configured" }};
      }
      const response = await fetch(`${AUTH_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        return { loginError: { message: data.message || 'Sign-in failed' } };
      }
      
      setToken(data.token);
      setUser(data.user);
      await SecureStore.setItemAsync(TOKEN_KEY, data.token);
      return { user: data.user };
    } catch (error) {
      return { loginError: { message: error.message || 'An error occurred' } };
    }
  };

const signUp = async (email, password, name) => {
    try {
      if (!AUTH_ENDPOINT) {
        const errorMessage = "API URL not configured";
        console.error(errorMessage);
        return { error: { message: errorMessage }};
      }
      
      const endpoint = `${AUTH_ENDPOINT}/auth/signup`;
      console.log('Calling API endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        const responseText = await response.text();
        console.error("Failed to parse JSON response:", responseText);
        return { error: { message: `Server returned an invalid response. Status: ${response.status}` } };
      }

      if (!response.ok) {
        return { error: { message: data.message || 'Sign-up failed' } };
      }
      
      return { data };
    } catch (error) {
      console.error('Sign-up network error:', error);
      return { error: { message: error.message || 'An error occurred' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  const value = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
