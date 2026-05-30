import Constants from 'expo-constants';

// API Configuration
const expoExtra = Constants.expoConfig?.extra || {};
export const API_BASE_URL =
  expoExtra.EXPO_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:3000/api';
export const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
export const GOOGLE_BOOKS_API_KEY =
  expoExtra.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY ||
  '';

// UI Colors
export const COLORS = {
  primary: '#6366f1',
  secondary: '#ec4899',
  dark: '#0f172a',
  darkMedium: '#1e293b',
  darkLight: '#334155',
  textPrimary: '#ffffff',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  accent: '#a78bfa',
};

export const PADDING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};
