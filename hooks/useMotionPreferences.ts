/**
 * useMotionPreferences Hook
 * 
 * Detects user's motion preferences and provides responsive animation settings.
 * Respects prefers-reduced-motion for accessibility compliance.
 */

import { useState, useEffect, useMemo } from 'react'

export interface MotionPreferences {
  // Core preference
  prefersReducedMotion: boolean
  
  // Device type detection
  isMobile: boolean
  isDesktop: boolean
  
  // Animation intensity multipliers (0-1)
  scaleIntensity: number
  durationMultiplier: number
  
  // Convenience booleans
  shouldAnimate: boolean
  shouldShowConfetti: boolean
  shouldUseHover: boolean
}

export interface AnimationConfig {
  duration: number
  scale: number
  opacity: number
}

/**
 * Hook to detect and manage motion preferences
 */
export function useMotionPreferences(): MotionPreferences {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleMotionChange)

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return useMemo(() => ({
    prefersReducedMotion,
    isMobile,
    isDesktop: !isMobile,
    scaleIntensity: prefersReducedMotion ? 0 : (isMobile ? 0.5 : 1),
    durationMultiplier: prefersReducedMotion ? 0.1 : 1,
    shouldAnimate: !prefersReducedMotion,
    shouldShowConfetti: !prefersReducedMotion,
    shouldUseHover: !isMobile && !prefersReducedMotion,
  }), [prefersReducedMotion, isMobile])
}

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

/**
 * Hook to get responsive hover/tap props for Framer Motion
 */
export function useInteractionProps() {
  const { isMobile, shouldAnimate } = useMotionPreferences()

  return useMemo(() => {
    if (!shouldAnimate) {
      return {}
    }

    if (isMobile) {
      // Mobile: tap effects only (no hover)
      return {
        whileTap: { scale: 0.95 },
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      }
    }

    // Desktop: hover + tap effects
    return {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: 'spring', stiffness: 400, damping: 17 }
    }
  }, [isMobile, shouldAnimate])
}

/**
 * Hook to get button-specific interaction props
 */
export function useButtonInteraction(variant: 'primary' | 'secondary' | 'subtle' = 'primary') {
  const { isMobile, shouldAnimate } = useMotionPreferences()

  const scales = {
    primary: { hover: 1.05, tap: 0.95 },
    secondary: { hover: 1.03, tap: 0.97 },
    subtle: { hover: 1.02, tap: 0.98 },
  }

  return useMemo(() => {
    if (!shouldAnimate) {
      return {}
    }

    const config = scales[variant]

    if (isMobile) {
      return {
        whileTap: { scale: config.tap },
        transition: { type: 'spring', stiffness: 500, damping: 20 }
      }
    }

    return {
      whileHover: { scale: config.hover },
      whileTap: { scale: config.tap },
      transition: { type: 'spring', stiffness: 500, damping: 20 }
    }
  }, [isMobile, shouldAnimate, variant])
}

export default useMotionPreferences
