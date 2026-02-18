// Motion/Animation utilities
// Works with or without Framer Motion

export type MotionPreference = 'full' | 'reduced' | 'none'

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get appropriate animation duration based on preference
 */
export function getAnimationDuration(
  baseDuration: number,
  preference: MotionPreference = 'full'
): number {
  if (preference === 'none' || prefersReducedMotion()) return 0
  if (preference === 'reduced') return baseDuration * 0.5
  return baseDuration
}

/**
 * Standard animation variants for Framer Motion
 */
export const variants = {
  // Fade
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Scale
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  
  // Slide
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  // Bounce
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
      }
    },
    exit: { opacity: 0, scale: 0.3 },
  },
  
  // Shake (for errors)
  shake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    },
  },
  
  // Glow pulse
  glowPulse: {
    animate: {
      boxShadow: [
        '0 0 5px var(--gg-primary)',
        '0 0 20px var(--gg-primary)',
        '0 0 5px var(--gg-primary)',
      ],
      transition: { duration: 2, repeat: Infinity },
    },
  },
  
  // List item stagger
  listContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  listItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
}

/**
 * Standard transition configs
 */
export const transitions = {
  default: { duration: 0.3, ease: 'easeOut' },
  fast: { duration: 0.15, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 20 },
  bounce: { type: 'spring', stiffness: 500, damping: 15 },
  smooth: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
}

/**
 * Stagger delay for list animations
 */
export function staggerDelay(index: number, baseDelay = 0.05): number {
  return index * baseDelay
}

/**
 * CSS animation class helper for reduced motion
 */
export function getAnimationClass(
  animationClass: string,
  preference: MotionPreference = 'full'
): string {
  if (preference === 'none' || prefersReducedMotion()) return ''
  return animationClass
}
