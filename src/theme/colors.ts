export type ThemeColors = {
  primary: string;
  primaryLight: string;
  primaryDark: string;

  background: string;
  card: string;

  text: string;
  textSecondary: string;
  textMuted: string;

  border: string;
  muted: string;

  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
};

export const lightColors: ThemeColors = {
  primary: '#3b82f6',
  primaryLight: '#eff6ff',
  primaryDark: '#1d4ed8',

  background: '#ffffff',
  card: '#ffffff',

  text: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',

  border: '#e5e7eb',
  muted: '#f3f4f6',

  success: '#22c55e',
  successLight: '#f0fdf4',
  warning: '#f59e0b',
  warningLight: '#fffbeb',
  error: '#ef4444',
  errorLight: '#fef2f2',
};

export const darkColors: ThemeColors = {
  primary: '#60a5fa',
  primaryLight: '#1e3a5f',
  primaryDark: '#93c5fd',

  background: '#111827',
  card: '#1f2937',

  text: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',

  border: '#374151',
  muted: '#1f2937',

  success: '#4ade80',
  successLight: '#14532d',
  warning: '#fbbf24',
  warningLight: '#78350f',
  error: '#f87171',
  errorLight: '#7f1d1d',
};

// Backward compatibility
export const colors = lightColors;
