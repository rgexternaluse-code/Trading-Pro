/**
 * AI Trading App — Centralized Color Theme & Visual Color System (v1.0)
 * Maximum 5 primary semantic colors + neutral Dark & Light theme tokens.
 *
 * Visual Language:
 * - Brand Indigo (#6366F1) = Primary / Action / Navigation / Progress
 * - AI Teal (#14B8A6)      = AI Coach / AI Tutor / AI Explanations
 * - Positive Green (#22C55E)= Bullish Candle / Positive P&L / ✓ Completed / ✓ Correct
 * - Warning Amber (#F59E0B) = ⚠ Risk Warning / Attention / Caution
 * - Negative Red (#EF4444)  = Bearish Candle / Negative P&L / ✕ Incorrect / Stop Breach
 */

export type ThemeMode = 'dark' | 'light';

export const colors = {
  dark: {
    background: '#0B1020',
    surface: '#111827',
    surfaceElevated: '#182033',
    border: '#263149',

    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    textDisabled: '#64748B',
  },

  light: {
    background: '#F7F8FC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E2E8F0',

    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    textDisabled: '#94A3B8',
  },

  semantic: {
    primary: '#6366F1', // Brand Indigo
    ai: '#14B8A6',      // AI Teal
    positive: '#22C55E',// Positive Green (Bullish / Success)
    warning: '#F59E0B', // Warning Amber (Risk / Caution)
    negative: '#EF4444',// Negative Red (Bearish / Error)
  },

  chart: {
    bullishCandle: '#22C55E',
    bearishCandle: '#EF4444',
    bullishVolume: 'rgba(34, 197, 94, 0.26)',
    bearishVolume: 'rgba(239, 68, 68, 0.26)',
    gridDark: '#263149',
    gridLight: '#E2E8F0',
    crosshair: '#6366F1',
    indicatorPrimary: '#6366F1', // 20 EMA / Selected Price
    indicatorWarning: '#F59E0B', // VWAP / Caution Band
  },
} as const;
