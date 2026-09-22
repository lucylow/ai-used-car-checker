/**
 * CarWise AI Mock Data V5
 * Purpose: rich, deterministic fixtures for frontend visual development.
 * Replace these fixtures with production API/state selectors during integration.
 */

export const AI_MOTION_MATRIX_V5 = {
  vinScan: { enter: 'fade', scanLine: 'loop-1200', resolve: 'success-260', haptic: 'selection' },
  imageReview: { enter: 'zoom-fade', annotation: 'draw-box-280', confidence: 'count-520', haptic: 'light' },
  multimodalMerge: { enter: 'stagger', photo: 'float-in', audio: 'waveform', document: 'slide-up', merge: 'crossfade-320' },
  aiAnalysis: { stages: 6, progress: 'spring-fill-600', shimmer: 'pulse-1400', reducedMotion: 'crossfade-180' },
  marketChart: { draw: 'path-reveal-650', marker: 'spring-pop-280', tooltip: 'scale-fade-180' },
  riskScore: { count: '0-to-final-850', ring: 'arc-850', label: 'fade-up-180' },
  bottomSheet: { present: 'spring-380', dismiss: 'drag-resistance', backdrop: 'fade-220' },
  success: { icon: 'stroke-draw-360', copy: 'fade-up-220', pulse: 'single-420' },
};

export const V5_INTERACTION_RECIPES = [
  { id: 'press-card', activeScale: 0.985, duration: 90, easing: 'easeOut', accessibility: 'announce-selected' },
  { id: 'toggle-chip', activeScale: 0.97, duration: 80, easing: 'spring', accessibility: 'announce-state' },
  { id: 'capture-retake', duration: 240, easing: 'easeInOut', accessibility: 'focus-camera' },
  { id: 'expand-explanation', duration: 180, easing: 'easeOut', accessibility: 'announce-expanded' },
  { id: 'pinch-media', minScale: 1, maxScale: 4, reset: 1, accessibility: 'announce-zoom' },
];
