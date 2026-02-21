/**
 * Betting Animation Presets
 * 
 * Centralized animation configurations for the betting flow.
 * All animations use GPU-accelerated properties (transform, opacity) for performance.
 */

import { Variants, Transition } from 'framer-motion'

// ─── Timing Constants ───────────────────────────────────────────────────────

export const TIMING = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.6,
  slowest: 1.0,
} as const

// ─── Easing Functions ───────────────────────────────────────────────────────

export const EASING = {
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0, 0.6, 1],
  gentle: [0.25, 0.1, 0.25, 1],
} as const

// ─── Spring Configurations ──────────────────────────────────────────────────

export const SPRING = {
  snappy: { type: 'spring', stiffness: 500, damping: 30 } as Transition,
  bouncy: { type: 'spring', stiffness: 300, damping: 15 } as Transition,
  soft: { type: 'spring', stiffness: 200, damping: 25 } as Transition,
  gentle: { type: 'spring', stiffness: 100, damping: 20 } as Transition,
} as const

// ─── Colors ─────────────────────────────────────────────────────────────────

export const GLOW_COLORS = {
  success: 'rgba(0, 210, 106, 0.6)',
  error: 'rgba(255, 68, 68, 0.6)',
  warning: 'rgba(255, 170, 0, 0.6)',
  favorable: 'rgba(16, 185, 129, 0.6)', // Emerald
  unfavorable: 'rgba(245, 158, 11, 0.6)', // Amber
  primary: 'rgba(233, 69, 96, 0.6)',
  neutral: 'rgba(148, 163, 184, 0.4)',
} as const

// ─── Place Bet Flow Animations ──────────────────────────────────────────────

export const placeBetVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  hover: {
    scale: 1.02,
    transition: SPRING.snappy,
  },
  tap: {
    scale: 0.95,
    transition: { duration: TIMING.instant },
  },
  submitting: {
    scale: 0.98,
    opacity: 0.8,
    transition: { duration: TIMING.fast },
  },
  success: {
    scale: [1, 1.05, 1],
    transition: { duration: TIMING.normal, times: [0, 0.5, 1] },
  },
  error: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
}

export const placeBetButtonVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: '0 4px 14px rgba(233, 69, 96, 0.25)',
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 6px 20px rgba(233, 69, 96, 0.4)',
    transition: SPRING.snappy,
  },
  tap: {
    scale: 0.95,
    boxShadow: '0 2px 8px rgba(233, 69, 96, 0.2)',
    transition: { duration: TIMING.instant },
  },
  loading: {
    scale: 1,
    opacity: 0.7,
  },
  disabled: {
    scale: 1,
    opacity: 0.5,
    filter: 'grayscale(0.5)',
  },
}

// ─── Input Validation Animations ────────────────────────────────────────────

export const inputValidationVariants: Variants = {
  initial: {
    borderColor: 'rgba(15, 52, 96, 1)',
  },
  valid: {
    borderColor: 'rgba(0, 210, 106, 1)',
    transition: { duration: TIMING.fast },
  },
  invalid: {
    borderColor: 'rgba(255, 68, 68, 1)',
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.3 },
  },
  focused: {
    borderColor: 'rgba(233, 69, 96, 1)',
    boxShadow: '0 0 0 3px rgba(233, 69, 96, 0.2)',
    transition: { duration: TIMING.fast },
  },
}

export const checkmarkVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: SPRING.bouncy,
  },
}

// ─── Odds Update Animations ─────────────────────────────────────────────────

export const oddsUpdateVariants: Variants = {
  initial: {
    scale: 1,
    backgroundColor: 'transparent',
  },
  favorable: {
    scale: 1.02,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
    transition: { duration: TIMING.fast },
  },
  unfavorable: {
    scale: 0.98,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
    transition: { duration: TIMING.fast },
  },
  neutral: {
    scale: 1,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    transition: { duration: TIMING.slowest, ease: EASING.smooth },
  },
}

export const oddsGlowVariants: Variants = {
  idle: {
    opacity: 0,
  },
  pulse: {
    opacity: [0, 0.8, 0],
    scale: [1, 1.1, 1],
    transition: { duration: TIMING.slow, times: [0, 0.5, 1] },
  },
}

export const oddsNumberVariants: Variants = {
  enter: {
    y: -20,
    opacity: 0,
  },
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: TIMING.normal, ease: EASING.smooth },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: TIMING.fast },
  },
}

// ─── Balance Update Animations ──────────────────────────────────────────────

export const balanceVariants: Variants = {
  initial: {
    scale: 1,
  },
  decrease: {
    scale: [1, 0.95, 1],
    color: ['#e2e8f0', '#ff4444', '#e2e8f0'],
    transition: { duration: TIMING.slower, ease: EASING.smooth },
  },
  increase: {
    scale: [1, 1.05, 1],
    color: ['#e2e8f0', '#00d26a', '#e2e8f0'],
    transition: { duration: TIMING.slower, ease: EASING.smooth },
  },
  glow: {
    textShadow: [
      '0 0 0px rgba(0, 210, 106, 0)',
      '0 0 20px rgba(0, 210, 106, 0.8)',
      '0 0 0px rgba(0, 210, 106, 0)',
    ],
    transition: { duration: TIMING.slower },
  },
}

// ─── Settlement Animations ──────────────────────────────────────────────────

export const settlementProgressVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  filling: {
    scaleX: 1,
    transition: { duration: TIMING.slow, ease: EASING.smooth },
  },
}

export const settlementCardVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 20,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.normal, ease: EASING.smooth, delay: 0.2 },
  },
}

export const settlementWinVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    boxShadow: [
      '0 0 0px rgba(0, 210, 106, 0)',
      '0 0 30px rgba(0, 210, 106, 0.6)',
      '0 0 10px rgba(0, 210, 106, 0.3)',
    ],
    transition: { duration: 0.5, ease: EASING.smooth },
  },
}

export const settlementLoseVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 0.7,
    filter: 'grayscale(0.5)',
    transition: { duration: TIMING.normal, ease: EASING.smooth },
  },
}

// ─── Bet Slip Animations ────────────────────────────────────────────────────

export const betSlipVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: SPRING.snappy,
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: TIMING.fast },
  },
}

export const betSlipItemVariants: Variants = {
  hidden: {
    x: 50,
    opacity: 0,
    height: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    height: 'auto',
    transition: SPRING.soft,
  },
  exit: {
    x: -50,
    opacity: 0,
    height: 0,
    transition: { duration: TIMING.fast },
  },
}

export const lockIconVariants: Variants = {
  unlocked: {
    scale: 1,
    rotate: 0,
    color: '#94a3b8',
  },
  locked: {
    scale: [1, 1.2, 1],
    rotate: [0, -10, 10, 0],
    color: '#f5a623',
    transition: { duration: TIMING.normal },
  },
}

// ─── Skeleton/Loading Animations ────────────────────────────────────────────

export const skeletonVariants: Variants = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: TIMING.normal },
  },
}

// ─── Error/Toast Animations ─────────────────────────────────────────────────

export const toastVariants: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: SPRING.bouncy,
  },
  exit: {
    y: -100,
    opacity: 0,
    scale: 0.9,
    transition: { duration: TIMING.fast },
  },
}

export const shakeVariants: Variants = {
  idle: {
    x: 0,
  },
  shake: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: { duration: 0.5 },
  },
}

export const errorGlowVariants: Variants = {
  idle: {
    boxShadow: '0 0 0px rgba(255, 68, 68, 0)',
  },
  error: {
    boxShadow: [
      '0 0 0px rgba(255, 68, 68, 0)',
      '0 0 20px rgba(255, 68, 68, 0.6)',
      '0 0 10px rgba(255, 68, 68, 0.3)',
    ],
    transition: { duration: TIMING.slow },
  },
}

export const retryPulseVariants: Variants = {
  idle: {
    scale: 1,
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 1, repeat: Infinity },
  },
}

// ─── Live Odds Board Animations ─────────────────────────────────────────────

export const marketHighlightVariants: Variants = {
  normal: {
    scale: 1,
    boxShadow: '0 0 0px rgba(233, 69, 96, 0)',
  },
  highlighted: {
    scale: 1.02,
    boxShadow: '0 0 20px rgba(233, 69, 96, 0.4)',
    transition: { duration: TIMING.normal },
  },
}

export const favoriteStarVariants: Variants = {
  unfavorited: {
    scale: 1,
    rotate: 0,
    fill: 'transparent',
    stroke: '#94a3b8',
  },
  favorited: {
    scale: [1, 1.3, 1],
    rotate: [0, 15, -15, 0],
    fill: '#f5a623',
    stroke: '#f5a623',
    transition: { duration: TIMING.normal },
  },
}

// ─── Confetti Configuration ─────────────────────────────────────────────────

export const confettiConfig = {
  particleCount: 50,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#e94560', '#00d26a', '#f5a623', '#533483', '#e2e8f0'],
}

// ─── Utility Functions ──────────────────────────────────────────────────────

/**
 * Get animation variant based on odds direction
 */
export function getOddsVariant(
  prevOdds: number,
  newOdds: number,
  isBid: boolean = true
): 'favorable' | 'unfavorable' | 'neutral' {
  if (prevOdds === newOdds) return 'neutral'
  
  // For a bid, higher odds are favorable
  // For an ask, lower odds are favorable
  const isFavorable = isBid ? newOdds > prevOdds : newOdds < prevOdds
  
  return isFavorable ? 'favorable' : 'unfavorable'
}

/**
 * Stagger children animation helper
 */
export function staggerChildren(
  staggerDelay: number = 0.1
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }
}

/**
 * Create a custom transition with duration multiplier
 */
export function createTransition(
  baseDuration: number,
  multiplier: number = 1
): Transition {
  return {
    duration: baseDuration * multiplier,
    ease: EASING.smooth,
  }
}
