/**
 * Visual preset: SPACE_COSMOS (one of the 10 valid presets).
 * Accent colours are overridden from the brief (cyan #39C7FF, gold #F3C54C,
 * violet #7450C8, navy #141A3C) but the preset `name` stays SPACE_COSMOS.
 */
export const THEME = {
  name: 'SPACE_COSMOS',

  colors: {
    bgDeep: '#04060F',
    bgBase: '#0A0E26',
    surface: '#141A3C',
    surfaceRaised: '#1C2450',

    accentPrimary: '#39C7FF',
    accentSecondary: '#F3C54C',
    accentTertiary: '#7450C8',
    accentDeep: '#4169E1',
    danger: '#E84A5F',

    textPrimary: '#F5EFE5',
    textSecondary: 'rgba(245,239,229,0.62)',
    textMuted: 'rgba(245,239,229,0.42)',

    glassFill: 'rgba(245,239,229,0.07)',
    glassBorder: 'rgba(245,239,229,0.16)',
    lineAccent: 'rgba(57,199,255,0.22)',

    onAccent: '#06122B',
    onGold: '#141A3C',
  },

  gradients: {
    loader: ['#04060F', '#0A0E26', '#141A3C'] as const,
    menuFade: ['transparent', 'rgba(20,26,60,0.55)', '#141A3C'] as const,
    map: ['#0A0E26', '#141A3C', '#1C2450'] as const,
    tutorial: ['#070A1E', '#141A3C'] as const,
    gameScrim: ['rgba(7,10,30,0.72)', 'rgba(20,26,60,0.88)'] as const,
    resultWin: ['#0A0E26', '#152A52', '#1C2450'] as const,
    resultLose: ['#070A1E', '#141A3C', '#2A1430'] as const,
    cta: ['#39C7FF', '#4169E1'] as const,
    charge: ['#F3C54C', '#E8A93C'] as const,
    progress: ['#39C7FF', '#F3C54C'] as const,
  },

  /** Conduit colours. Keys match the game model. */
  conduit: {
    cyan: '#39C7FF',
    gold: '#F3C54C',
    violet: '#7450C8',
  },

  radius: {sm: 14, md: 18, lg: 20, xl: 24, sheet: 30},

  type: {
    hero: {fontSize: 34, fontWeight: '900' as const, letterSpacing: 5},
    title: {fontSize: 28, fontWeight: '900' as const, letterSpacing: 3},
    section: {fontSize: 15, fontWeight: '800' as const, letterSpacing: 2},
    body: {fontSize: 15, fontWeight: '700' as const, lineHeight: 21},
    caption: {fontSize: 10.5, fontWeight: '600' as const, letterSpacing: 2},
    number: {fontSize: 22, fontWeight: '900' as const},
  },
} as const;

export type ConduitColour = keyof typeof THEME.conduit;

export const C = THEME.colors;
