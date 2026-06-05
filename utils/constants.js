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

// Premium Dark Ink Theme — Literary & Luxurious
export const COLORS = {
  // Backgrounds — deep parchment-to-ink gradient world
  bg:          '#0D0B0E',       // near-black with warm undertone
  bgAlt:       '#131118',       // slightly lighter bg
  surface:     '#1A1720',       // card surfaces
  surfaceHigh: '#221F2A',       // elevated surfaces
  surfaceBorder:'#2E2A38',      // borders

  // Brand & Accent
  primary:     '#E8C97A',       // Main theme color
  secondary:   '#5ABFB0',       // Secondary theme color
  gold:        '#E8C97A',       // warm literary gold
  goldDeep:    '#C9A84C',       // deeper gold for shadows
  goldGlow:    'rgba(232,201,122,0.15)', // glow
  crimson:     '#C95A5A',       // dramatic accent
  teal:        '#5ABFB0',       // secondary accent

  // Text
  textPrimary:   '#F5EFE0',     // warm cream
  textSecondary: '#A89E8E',     // parchment mid
  textMuted:     '#5E5850',     // muted brown-grey
  textInverse:   '#0D0B0E',

  // Status colors
  reading:    '#5ABFB0',
  completed:  '#7FBE7F',
  toRead:     '#A07CC0',
  favorite:   '#E87A7A',

  // Utility
  danger:     '#C95A5A',
  success:    '#7FBE7F',
  warning:    '#E8C97A',
  transparent: 'transparent',
  // Additional aliases used across components
  card: '#19171B',
  border: '#2E2A38',
  textTertiary: '#857969',
  dark: '#0B0A0C',
  darkMedium: '#141214',
};

export const PADDING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

// Typography scale
export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
};
