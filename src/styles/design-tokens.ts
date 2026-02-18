/**
 * Design Tokens for Game Gauntlet
 * 
 * Single source of truth for design values.
 * Import these tokens throughout the app for consistency.
 */

// ─── Color Palette ──────────────────────────────────────────────────────────

export const colors = {
  // Primary brand colors
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5', // Main indigo
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Success/positive states
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main emerald
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  
  // Warning/caution states
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main amber
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  // Error/negative states
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  // Neutral/gray scale (dark theme optimized)
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  
  // Dark mode surface colors
  dark: {
    bg: '#0a0a0f',
    surface: '#12121a',
    card: '#1a1a24',
    elevated: '#22222e',
    border: '#2a2a38',
    borderHover: '#3a3a4a',
  },
} as const

// ─── Semantic Colors ────────────────────────────────────────────────────────

export const semanticColors = {
  // Background hierarchy
  background: colors.dark.bg,
  surface: colors.dark.surface,
  card: colors.dark.card,
  elevated: colors.dark.elevated,
  
  // Border colors
  border: colors.dark.border,
  borderHover: colors.dark.borderHover,
  
  // Interactive colors
  primary: colors.primary[600],
  primaryHover: colors.primary[500],
  primaryActive: colors.primary[700],
  
  secondary: colors.success[500],
  secondaryHover: colors.success[400],
  secondaryActive: colors.success[600],
  
  accent: colors.warning[500],
  accentHover: colors.warning[400],
  accentActive: colors.warning[600],
  
  // State colors
  success: colors.success[500],
  successBg: 'rgba(16, 185, 129, 0.1)',
  
  warning: colors.warning[500],
  warningBg: 'rgba(245, 158, 11, 0.1)',
  
  error: colors.error[500],
  errorBg: 'rgba(239, 68, 68, 0.1)',
  
  // Text colors
  text: colors.neutral[100],
  textSecondary: colors.neutral[400],
  textMuted: colors.neutral[500],
  textDisabled: colors.neutral[600],
} as const

// ─── Typography ─────────────────────────────────────────────────────────────

export const typography = {
  // Font families
  fontFamily: {
    heading: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  },
  
  // Font sizes (rem values)
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

// ─── Spacing (4px grid) ─────────────────────────────────────────────────────

export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const

// ─── Border Radius ──────────────────────────────────────────────────────────

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const

// ─── Shadows ────────────────────────────────────────────────────────────────

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  
  // Glow effects
  glowPrimary: `0 0 20px ${colors.primary[600]}40, 0 0 40px ${colors.primary[600]}20`,
  glowSuccess: `0 0 20px ${colors.success[500]}40, 0 0 40px ${colors.success[500]}20`,
  glowWarning: `0 0 20px ${colors.warning[500]}40, 0 0 40px ${colors.warning[500]}20`,
  glowError: `0 0 20px ${colors.error[500]}40, 0 0 40px ${colors.error[500]}20`,
} as const

// ─── Z-Index Scale ──────────────────────────────────────────────────────────

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
} as const

// ─── Transitions ────────────────────────────────────────────────────────────

export const transitions = {
  duration: {
    instant: '50ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
} as const

// ─── Breakpoints ────────────────────────────────────────────────────────────

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ─── CSS Custom Properties Export ───────────────────────────────────────────

export const cssVariables = `
  :root {
    /* Colors */
    --color-primary: ${colors.primary[600]};
    --color-success: ${colors.success[500]};
    --color-warning: ${colors.warning[500]};
    --color-error: ${colors.error[500]};
    
    /* Dark theme surfaces */
    --color-bg: ${colors.dark.bg};
    --color-surface: ${colors.dark.surface};
    --color-card: ${colors.dark.card};
    --color-elevated: ${colors.dark.elevated};
    --color-border: ${colors.dark.border};
    
    /* Text */
    --color-text: ${colors.neutral[100]};
    --color-text-secondary: ${colors.neutral[400]};
    --color-text-muted: ${colors.neutral[500]};
    
    /* Typography */
    --font-heading: ${typography.fontFamily.heading};
    --font-body: ${typography.fontFamily.body};
    --font-mono: ${typography.fontFamily.mono};
    
    /* Spacing base (4px) */
    --spacing-unit: 4px;
    
    /* Border radius */
    --radius-sm: ${borderRadius.sm};
    --radius-md: ${borderRadius.md};
    --radius-lg: ${borderRadius.lg};
    --radius-xl: ${borderRadius.xl};
    
    /* Transitions */
    --transition-fast: ${transitions.duration.fast};
    --transition-normal: ${transitions.duration.normal};
    --transition-slow: ${transitions.duration.slow};
  }
`

// ─── Export All ─────────────────────────────────────────────────────────────

export const designTokens = {
  colors,
  semanticColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  cssVariables,
} as const

export default designTokens
