/**
 * Visual preset: SPACE_COSMOS (canonical id 'space-cosmos'), accent colours
 * overridden for the Olympus brief: midnight blue + electric cyan + gold.
 *
 * NOTE: deliberately NOT declared `as const` — LinearGradient needs plain
 * string[] colour arrays, readonly tuples are rejected by its prop types.
 */
export const theme = {
  name: 'space-cosmos',
  preset: 'SPACE_COSMOS',

  colors: {
    bgDeep: '#04060F',
    bg: '#141A3C',
    bgAlt: '#0C1130',
    surface: '#1C2450',
    surfaceAlt: '#232C62',
    primary: '#39C7FF',
    secondary: '#F3C54C',
    violet: '#7450C8',
    danger: '#E84A5F',
    textPrimary: '#F5EFE5',
    textSecondary: 'rgba(245,239,229,0.62)',
    textMuted: 'rgba(245,239,229,0.40)',
    hairline: 'rgba(245,239,229,0.14)',
    onAccent: '#071027',
  },

  gradients: {
    loader: ['#04060F', '#0B1026', '#141A3C'] as string[],
    menuArt: ['#1E2860', '#19204A', '#121736'] as string[],
    game: ['#101535', '#141A3C', '#0C1130'] as string[],
    resultWin: ['#17255A', '#141A3C', '#0C1130'] as string[],
    resultLose: ['#1A1430', '#141A3C', '#0B0E26'] as string[],
    cta: ['#39C7FF', '#2F7FE8', '#7450C8'] as string[],
    ctaReplay: ['#39C7FF', '#7450C8'] as string[],
    charge: ['#F3C54C', '#E0A52F'] as string[],
    progress: ['#39C7FF', '#7450C8', '#F3C54C'] as string[],
  },

  radius: {
    sm: 12,
    md: 16,
    lg: 22,
    xl: 28,
  },
};

/** Energy channels. Each source/beacon pair carries exactly one of these. */
export const CHANNEL_COLORS = {
  cyan: '#39C7FF',
  gold: '#F3C54C',
  violet: '#7450C8',
};

export default theme;
