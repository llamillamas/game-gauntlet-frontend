/**
 * Animation Presets for Game Gauntlet
 * 
 * Centralized Framer Motion animation configurations.
 * All animations respect prefers-reduced-motion when used with useMotionPreferences hook.
 */

import { Variants, Transition, TargetAndTransition } from 'framer-motion'
import { colors } from '../styles/design-tokens'

// ─── Timing Constants ───────────────────────────────────────────────────────

export const timing = {
  instant: 0.05,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
  slowest: 1.0,
} as const

// ─── Easing Curves ──────────────────────────────────────────────────────────

export const easing = {
  // Snappy - quick exit, responsive feel
  snappy: [0.4, 0, 0.2, 1] as [number, number, number, number],
  
  // Smooth - balanced in/out
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  
  // EaseOut - quick start, slow end
  easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  
  // EaseIn - slow start, quick end
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
  
  // EaseInOut - smooth both ways
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  
  // Bouncy - overshoots slightly
  bouncy: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  
  // Sharp - minimal easing
  sharp: [0.4, 0, 0.6, 1] as [number, number, number, number],
  
  // Gentle - subtle, soft movement
  gentle: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
} as const

// ─── Spring Configurations ──────────────────────────────────────────────────

export const springs = {
  // Snappy - quick response
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30, mass: 1 },
  
  // Bouncy - playful feel
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 17, mass: 1 },
  
  // Soft - gentle movement
  soft: { type: 'spring' as const, stiffness: 200, damping: 25, mass: 1 },
  
  // Gentle - very subtle
  gentle: { type: 'spring' as const, stiffness: 100, damping: 20, mass: 1 },
  
  // Wobbly - exaggerated bounce
  wobbly: { type: 'spring' as const, stiffness: 180, damping: 12, mass: 1 },
  
  // Stiff - minimal bounce
  stiff: { type: 'spring' as const, stiffness: 600, damping: 40, mass: 1 },
}

// ─── Fade Variants ──────────────────────────────────────────────────────────

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: timing.normal, ease: easing.smooth },
  },
  exit: { 
    opacity: 0,
    transition: { duration: timing.fast, ease: easing.easeIn },
  },
}

export const fadeScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: timing.normal, ease: easing.smooth },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: timing.fast, ease: easing.easeIn },
  },
}

// ─── Slide Variants ─────────────────────────────────────────────────────────

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: timing.normal, ease: easing.easeOut },
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: timing.fast, ease: easing.easeIn },
  },
}

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: timing.normal, ease: easing.easeOut },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: timing.fast, ease: easing.easeIn },
  },
}

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: timing.normal, ease: easing.easeOut },
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: timing.fast, ease: easing.easeIn },
  },
}

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: timing.normal, ease: easing.easeOut },
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: timing.fast, ease: easing.easeIn },
  },
}

// ─── Scale Variants ─────────────────────────────────────────────────────────

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springs.bouncy,
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: timing.fast },
  },
}

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springs.bouncy,
  },
  exit: { 
    opacity: 0, 
    scale: 0,
    transition: { duration: timing.fast },
  },
}

// ─── Bounce Variants ────────────────────────────────────────────────────────

export const bounceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
      mass: 1,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.3,
    transition: { duration: timing.fast },
  },
}

export const bounceInVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.3,
    y: 30,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: springs.wobbly,
  },
  exit: { 
    opacity: 0, 
    scale: 0.3,
    y: 30,
    transition: { duration: timing.fast },
  },
}

// ─── Pulse Variants ─────────────────────────────────────────────────────────

export const pulseVariants: Variants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: easing.smooth,
    },
  },
}

export const heartbeatVariants: Variants = {
  idle: { scale: 1 },
  beat: {
    scale: [1, 1.15, 1, 1.1, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
}

// ─── Glow Variants ──────────────────────────────────────────────────────────

export const glowVariants: Variants = {
  idle: {
    boxShadow: '0 0 0px rgba(79, 70, 229, 0)',
  },
  glow: {
    boxShadow: [
      '0 0 0px rgba(79, 70, 229, 0)',
      '0 0 20px rgba(79, 70, 229, 0.6)',
      '0 0 0px rgba(79, 70, 229, 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easing.smooth,
    },
  },
}

export const glowSuccessVariants: Variants = {
  idle: {
    boxShadow: '0 0 0px rgba(16, 185, 129, 0)',
  },
  glow: {
    boxShadow: [
      '0 0 0px rgba(16, 185, 129, 0)',
      '0 0 20px rgba(16, 185, 129, 0.6)',
      '0 0 0px rgba(16, 185, 129, 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easing.smooth,
    },
  },
}

// ─── Shake Variants ─────────────────────────────────────────────────────────

export const shakeVariants: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -8, 8, -8, 8, -4, 4, 0],
    transition: { duration: 0.5, ease: easing.sharp },
  },
}

export const wiggleVariants: Variants = {
  idle: { rotate: 0 },
  wiggle: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.4, ease: easing.sharp },
  },
}

// ─── Shimmer (Skeleton Loading) ─────────────────────────────────────────────

export const shimmerVariants: Variants = {
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

// ─── Spin Variants ──────────────────────────────────────────────────────────

export const spinVariants: Variants = {
  idle: { rotate: 0 },
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export const spinSlowVariants: Variants = {
  idle: { rotate: 0 },
  spin: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// ─── Modal/Panel Variants ───────────────────────────────────────────────────

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: timing.normal },
  },
  exit: { 
    opacity: 0,
    transition: { duration: timing.fast },
  },
}

export const modalSlideUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: '100%',
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: springs.snappy,
  },
  exit: { 
    opacity: 0, 
    y: '100%',
    scale: 0.95,
    transition: { duration: timing.fast },
  },
}

export const modalCenterVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: springs.bouncy,
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: timing.fast },
  },
}

// ─── Button Interaction Variants ────────────────────────────────────────────

export const buttonVariants: Variants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: springs.snappy,
  },
  tap: { 
    scale: 0.98,
    transition: { duration: timing.instant },
  },
  loading: {
    scale: 1,
    opacity: 0.7,
  },
  disabled: {
    scale: 1,
    opacity: 0.5,
  },
}

export const buttonPrimaryVariants: Variants = {
  idle: { 
    scale: 1,
    boxShadow: `0 4px 14px ${colors.primary[600]}40`,
  },
  hover: { 
    scale: 1.03,
    boxShadow: `0 6px 20px ${colors.primary[600]}60`,
    transition: springs.snappy,
  },
  tap: { 
    scale: 0.97,
    boxShadow: `0 2px 8px ${colors.primary[600]}30`,
    transition: { duration: timing.instant },
  },
}

// ─── Card Entrance Variants ─────────────────────────────────────────────────

export const cardEntranceVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: timing.normal, 
      ease: easing.easeOut,
    },
  },
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
    transition: springs.snappy,
  },
}

// ─── List Stagger Variants ──────────────────────────────────────────────────

export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: timing.normal, ease: easing.easeOut },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: timing.fast },
  },
}

// ─── Input Validation Variants ──────────────────────────────────────────────

export const inputVariants: Variants = {
  idle: {
    borderColor: colors.dark.border,
    boxShadow: 'none',
  },
  focused: {
    borderColor: colors.primary[600],
    boxShadow: `0 0 0 3px ${colors.primary[600]}20`,
    transition: { duration: timing.fast },
  },
  valid: {
    borderColor: colors.success[500],
    transition: { duration: timing.fast },
  },
  invalid: {
    borderColor: colors.error[500],
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.3 },
  },
  disabled: {
    opacity: 0.5,
    borderColor: colors.dark.border,
  },
}

// ─── Badge Variants ─────────────────────────────────────────────────────────

export const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springs.bouncy,
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
    },
  },
}

// ─── Notification/Toast Variants ────────────────────────────────────────────

export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.bouncy,
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.9,
    transition: { duration: timing.fast },
  },
}

// ─── Reduced Motion Variants ────────────────────────────────────────────────

export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.01 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.01 },
  },
}

// ─── Utility Functions ──────────────────────────────────────────────────────

/**
 * Create staggered children animation
 */
export function staggerChildren(
  staggerDelay: number = 0.08,
  delayChildren: number = 0
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  }
}

/**
 * Create a custom transition with duration multiplier
 */
export function createTransition(
  baseDuration: number = timing.normal,
  easingCurve: readonly [number, number, number, number] = easing.smooth
): Transition {
  return {
    duration: baseDuration,
    ease: easingCurve as [number, number, number, number],
  }
}

/**
 * Get reduced motion safe variants
 */
export function getReducedMotionVariants(
  variants: Variants,
  prefersReducedMotion: boolean
): Variants {
  if (prefersReducedMotion) {
    return reducedMotionVariants
  }
  return variants
}

/**
 * Create hover/tap props based on device/preferences
 */
export function createInteractionProps(
  isMobile: boolean,
  shouldAnimate: boolean
): TargetAndTransition {
  if (!shouldAnimate) {
    return {}
  }

  if (isMobile) {
    return {
      whileTap: { scale: 0.95 },
      transition: springs.snappy,
    } as TargetAndTransition
  }

  return {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: springs.snappy,
  } as TargetAndTransition
}

// ─── Export All ─────────────────────────────────────────────────────────────

export const animationPresets = {
  // Timing
  timing,
  easing,
  springs,
  
  // Variants
  fadeVariants,
  fadeScaleVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleVariants,
  scaleInVariants,
  bounceVariants,
  bounceInVariants,
  pulseVariants,
  heartbeatVariants,
  glowVariants,
  glowSuccessVariants,
  shakeVariants,
  wiggleVariants,
  shimmerVariants,
  spinVariants,
  spinSlowVariants,
  modalBackdropVariants,
  modalSlideUpVariants,
  modalCenterVariants,
  buttonVariants,
  buttonPrimaryVariants,
  cardEntranceVariants,
  listContainerVariants,
  listItemVariants,
  inputVariants,
  badgeVariants,
  toastVariants,
  reducedMotionVariants,
  
  // Utilities
  staggerChildren,
  createTransition,
  getReducedMotionVariants,
  createInteractionProps,
} as const

export default animationPresets
