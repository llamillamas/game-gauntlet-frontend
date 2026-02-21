// Animation utilities for Tailwind + Framer Motion style animations

// Re-export all variants from animations/presets for convenience
export * from '../animations/presets';

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Tailwind animation classes
export const pulseGreen = 'animate-pulse bg-green-500/20';
export const pulseRed = 'animate-pulse bg-red-500/20';
export const shimmer = 'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent';

// CSS keyframes (add to globals.css)
export const keyframes = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;
