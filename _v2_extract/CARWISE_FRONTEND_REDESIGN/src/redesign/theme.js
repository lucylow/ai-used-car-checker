import { Platform, StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#08111F',
  bgElevated: '#0D1728',
  surface: '#111D2F',
  surfaceElevated: '#17263B',
  surfaceSoft: '#1B2D45',
  border: '#263A54',
  borderStrong: '#35516F',
  text: '#F6F9FD',
  textSecondary: '#93A7BD',
  textTertiary: '#6F849C',
  blue: '#2F80ED',
  cyan: '#00D4FF',
  mint: '#35D0BA',
  amber: '#F4B740',
  coral: '#F16B6B',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(2, 8, 17, 0.84)',
  overlaySoft: 'rgba(2, 8, 17, 0.56)',
};

export const TYPE = {
  display: Platform.select({ ios: 'System', android: 'sans-serif' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace' }),
};

export const RADIUS = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  pill: 999,
};

export const SPACE = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 7,
  },
  glow: {
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
};

export const TYPOGRAPHY = StyleSheet.create({
  display: { fontFamily: TYPE.display, fontSize: 36, lineHeight: 42, fontWeight: '800', color: COLORS.text },
  h1: { fontFamily: TYPE.display, fontSize: 30, lineHeight: 36, fontWeight: '800', color: COLORS.text },
  h2: { fontFamily: TYPE.display, fontSize: 21, lineHeight: 28, fontWeight: '800', color: COLORS.text },
  h3: { fontFamily: TYPE.display, fontSize: 17, lineHeight: 23, fontWeight: '750', color: COLORS.text },
  body: { fontFamily: TYPE.body, fontSize: 15, lineHeight: 21, fontWeight: '400', color: COLORS.text },
  bodyMedium: { fontFamily: TYPE.body, fontSize: 15, lineHeight: 21, fontWeight: '600', color: COLORS.text },
  caption: { fontFamily: TYPE.body, fontSize: 12, lineHeight: 17, fontWeight: '500', color: COLORS.textSecondary },
  eyebrow: { fontFamily: TYPE.body, fontSize: 10, lineHeight: 14, fontWeight: '800', letterSpacing: 1.4, color: COLORS.textTertiary },
  metric: { fontFamily: TYPE.display, fontSize: 38, lineHeight: 44, fontWeight: '850', color: COLORS.text },
  mono: { fontFamily: TYPE.mono, fontSize: 12, lineHeight: 18, color: COLORS.textSecondary },
});

export const COMMON = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingHorizontal: SPACE[4], paddingTop: SPACE[4], paddingBottom: 130 },
  section: { marginTop: SPACE[6] },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACE[4],
    ...SHADOWS.card,
  },
  hairline: { height: 1, backgroundColor: COLORS.border },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fill: { flex: 1 },
});

export function toneColor(tone = 'blue') {
  const colors = {
    blue: COLORS.blue,
    cyan: COLORS.cyan,
    mint: COLORS.mint,
    amber: COLORS.amber,
    coral: COLORS.coral,
  };
  return colors[tone] || COLORS.blue;
}

export function alpha(hex, opacity) {
  const safe = Math.max(0, Math.min(1, opacity));
  if (!hex || !hex.startsWith('#') || hex.length !== 7) return hex;
  return `${hex}${Math.round(safe * 255).toString(16).padStart(2, '0')}`;
}
