/**
 * useMotionPreferences Hook
 * 
 * Detects user's motion preferences and provides responsive animation settings.
 * Respects prefers-reduced-motion and high contrast mode for accessibility compliance.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Variants } from 'framer-motion'
import { reducedMotionVariants, springs } from '../animations/presets'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MotionPreferences {
  // Core preferences
  prefersReducedMotion: boolean
  prefersHighContrast: boolean
  
  // Device detection
  isMobile: boolean
  isDesktop: boolean
  isTouchDevice: boolean
  
  // Animation multipliers (0-1)
  scaleIntensity: number
  durationMultiplier: number
  
  // Convenience flags
  shouldAnimate: boolean
  shouldShowConfetti: boolean
  shouldUseHover: boolean
  shouldShowGlow: boolean
}

export interface AnimationConfig {
  duration: number
  scale: number
  opacity: number
}

// ─── Main Hook ──────────────────────────────────────────────────────────────

/**
 * Hook to detect and manage motion preferences
 */
export function useMotionPreferences(): MotionPreferences {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [prefersHighContrast, setPrefersHighContrast] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // Check high contrast mode (forced-colors)
    const contrastQuery = window.matchMedia('(forced-colors: active)')
    setPrefersHighContrast(contrastQuery.matches)

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches)
    }
    contrastQuery.addEventListener('change', handleContrastChange)

    // Check if mobile/touch device
    const checkDevice = () => {
      const width = window.innerWidth
      const hasTouchPoints = navigator.maxTouchPoints > 0
      const hasTouch = 'ontouchstart' in window

      setIsMobile(width < 768)
      setIsTouchDevice(hasTouchPoints || hasTouch)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  return useMemo(() => ({
    prefersReducedMotion,
    prefersHighContrast,
    isMobile,
    isDesktop: !isMobile,
    isTouchDevice,
    scaleIntensity: prefersReducedMotion ? 0 : (isMobile ? 0.5 : 1),
    durationMultiplier: prefersReducedMotion ? 0.01 : 1,
    shouldAnimate: !prefersReducedMotion,
    shouldShowConfetti: !prefersReducedMotion && !isMobile,
    shouldUseHover: !isTouchDevice && !prefersReducedMotion,
    shouldShowGlow: !prefersReducedMotion && !prefersHighContrast,
  }), [prefersReducedMotion, prefersHighContrast, isMobile, isTouchDevice])
}

// ─── Animation Config Hook ──────────────────────────────────────────────────

/**
 * Get animation config based on motion preferences
 */
export function useAnimationConfig(
  baseConfig: AnimationConfig
): AnimationConfig {
  const { prefersReducedMotion, durationMultiplier, scaleIntensity } = useMotionPreferences()

  return useMemo(() => {
    if (prefersReducedMotion) {
      return {
        duration: 0.01,
        scale: 1,
        opacity: baseConfig.opacity,
      }
    }

    return {
      duration: baseConfig.duration * durationMultiplier,
      scale: 1 + (baseConfig.scale - 1) * scaleIntensity,
      opacity: baseConfig.opacity,
    }
  }, [prefersReducedMotion, durationMultiplier, scaleIntensity, baseConfig])
}

// ─── Variants Hook ──────────────────────────────────────────────────────────

/**
 * Get motion-safe variants
 */
export function useMotionVariants<T extends Variants>(variants: T): T | Variants {
  const { prefersReducedMotion } = useMotionPreferences()

  return useMemo(() => {
    if (prefersReducedMotion) {
      return reducedMotionVariants
    }
    return variants
  }, [prefersReducedMotion, variants])
}

// ─── Interaction Props Hook ─────────────────────────────────────────────────

/**
 * Hook to get responsive hover/tap props for Framer Motion
 */
export function useInteractionProps() {
  const { isTouchDevice, shouldAnimate } = useMotionPreferences()

  return useMemo(() => {
    if (!shouldAnimate) {
      return {}
    }

    if (isTouchDevice) {
      // Touch: tap effects only (no hover)
      return {
        whileTap: { scale: 0.95 },
        transition: springs.snappy,
      }
    }

    // Desktop: hover + tap effects
    return {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: springs.snappy,
    }
  }, [isTouchDevice, shouldAnimate])
}

// ─── Button Interaction Hook ────────────────────────────────────────────────

/**
 * Hook to get button-specific interaction props
 */
export function useButtonInteraction(
  variant: 'primary' | 'secondary' | 'ghost' | 'subtle' = 'primary'
) {
  const { isTouchDevice, shouldAnimate } = useMotionPreferences()

  const scales = useMemo(() => ({
    primary: { hover: 1.03, tap: 0.97 },
    secondary: { hover: 1.02, tap: 0.98 },
    ghost: { hover: 1.02, tap: 0.98 },
    subtle: { hover: 1.01, tap: 0.99 },
  }), [])

  return useMemo(() => {
    if (!shouldAnimate) {
      return {}
    }

    const config = scales[variant]

    if (isTouchDevice) {
      return {
        whileTap: { scale: config.tap },
        transition: springs.snappy,
      }
    }

    return {
      whileHover: { scale: config.hover },
      whileTap: { scale: config.tap },
      transition: springs.snappy,
    }
  }, [isTouchDevice, shouldAnimate, variant, scales])
}

// ─── Card Interaction Hook ──────────────────────────────────────────────────

/**
 * Hook to get card-specific interaction props
 */
export function useCardInteraction(isInteractive: boolean = true) {
  const { isTouchDevice, shouldAnimate, shouldShowGlow } = useMotionPreferences()

  return useMemo(() => {
    if (!shouldAnimate || !isInteractive) {
      return {}
    }

    const baseProps = {
      whileTap: { scale: 0.98 },
      transition: springs.snappy,
    }

    if (isTouchDevice) {
      return baseProps
    }

    return {
      ...baseProps,
      whileHover: { 
        y: -4,
        ...(shouldShowGlow && {
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
        }),
      },
    }
  }, [isTouchDevice, shouldAnimate, shouldShowGlow, isInteractive])
}

// ─── Entrance Animation Hook ────────────────────────────────────────────────

/**
 * Hook to get entrance animation props
 */
export function useEntranceAnimation(
  direction: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' = 'up',
  delay: number = 0
) {
  const { shouldAnimate } = useMotionPreferences()

  return useMemo(() => {
    if (!shouldAnimate) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      }
    }

    const directions = {
      up: { y: 20 },
      down: { y: -20 },
      left: { x: 20 },
      right: { x: -20 },
      scale: { scale: 0.95 },
      fade: {},
    }

    const initialTransform = directions[direction]

    return {
      initial: { opacity: 0, ...initialTransform },
      animate: { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.3,
          delay,
          ease: [0.4, 0, 0.2, 1],
        },
      },
    }
  }, [shouldAnimate, direction, delay])
}

// ─── Loading Animation Hook ─────────────────────────────────────────────────

/**
 * Hook to get loading/skeleton animation props
 */
export function useLoadingAnimation() {
  const { shouldAnimate } = useMotionPreferences()

  return useMemo(() => {
    if (!shouldAnimate) {
      return {
        animate: {},
        className: 'bg-neutral-700',
      }
    }

    return {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
      className: 'bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 bg-[length:200%_100%]',
    }
  }, [shouldAnimate])
}

// ─── Focus Ring Hook ────────────────────────────────────────────────────────

/**
 * Hook to check if keyboard navigation is active
 */
export function useKeyboardNavigation() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true)
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardUser(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return isKeyboardUser
}

// ─── Export Default ─────────────────────────────────────────────────────────

export default useMotionPreferences
