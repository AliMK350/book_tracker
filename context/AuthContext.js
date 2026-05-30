import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si utilisateur est déjà connecté
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('authToken');
        const savedUser = await AsyncStorage.getItem('user');
        if (savedToken) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Failed to restore token', e);
      } finally {
        setLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const authContext = {
    login: async (email, password) => {
      try {
        setError(null);
        const response = await authService.login(email, password);
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    signup: async (email, password, name) => {
      try {
        setError(null);
        const response = await authService.signup(email, password, name);
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    logout: async () => {
      try {
        setError(null);
        await authService.logout();
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } catch (err) {
        setError(err.message);
      }
    },
    isLoading: loading,
    isSignout: !token,
    user,
    token,
    error,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
