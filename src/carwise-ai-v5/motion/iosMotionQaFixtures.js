/**
 * iOS-focused motion QA cases for the V5 visual layer.
 * These describe expected behavior; they are not runtime animation code.
 */
export const IOS_MOTION_QA_CASES = [
  {
    id: 'ios-compact-default',
    device: 'iPhone SE (3rd generation)',
    width: 375,
    height: 667,
    contentSize: 'medium',
    reduceMotion: false,
    voiceOver: false,
    state: 'default',
    checks: ['no horizontal clipping', '44pt controls', 'bottom sheet clears home indicator'],
  },
  {
    id: 'ios-large-default',
    device: 'iPhone 15 Pro Max',
    width: 430,
    height: 932,
    contentSize: 'medium',
    reduceMotion: false,
    voiceOver: false,
    state: 'default',
    checks: ['hero remains image-forward', 'charts do not stretch labels', 'floating action stays above dock'],
  },
  {
    id: 'ios-large-text',
    device: 'iPhone 15',
    width: 393,
    height: 852,
    contentSize: 'accessibilityExtraExtraExtraLarge',
    reduceMotion: false,
    voiceOver: false,
    state: 'long-text',
    checks: ['vehicle title wraps', 'failure copy remains readable', 'buttons grow vertically instead of clipping'],
  },
  {
    id: 'ios-reduced-motion',
    device: 'iPhone 15',
    width: 393,
    height: 852,
    contentSize: 'medium',
    reduceMotion: true,
    voiceOver: false,
    state: 'analysis-loading',
    checks: ['replace loops with crossfade', 'skip count-up and scan sweep', 'preserve progress semantics'],
  },
  {
    id: 'ios-voiceover-analysis',
    device: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    contentSize: 'medium',
    reduceMotion: true,
    voiceOver: true,
    state: 'analysis-failure',
    checks: ['announce failure title', 'announce retry availability', 'focus first recovery action', 'do not rely on color'],
  },
  {
    id: 'ios-permission-denied',
    device: 'iPhone 14',
    width: 390,
    height: 844,
    contentSize: 'medium',
    reduceMotion: false,
    voiceOver: false,
    state: 'camera-permission-denied',
    checks: ['show library fallback', 'do not reprompt immediately', 'preserve current inspection'],
  },
  {
    id: 'ios-offline-recovery',
    device: 'iPhone 13 mini',
    width: 375,
    height: 812,
    contentSize: 'medium',
    reduceMotion: true,
    voiceOver: false,
    state: 'offline-analysis',
    checks: ['show queued state', 'keep evidence readable', 'retry is explicit', 'no restart required'],
  },
  {
    id: 'ios-sheet-keyboard',
    device: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    contentSize: 'large',
    reduceMotion: false,
    voiceOver: false,
    state: 'copilot-keyboard-open',
    checks: ['composer remains visible', 'sheet respects safe area', 'keyboard does not cover send action'],
  },
];

export const IOS_MOTION_RULES = [
  { id: 'reduced-motion', expected: 'crossfade or instant state change; no decorative loops' },
  { id: 'safe-area', expected: 'bottom sheets and dock clear home indicator' },
  { id: 'dynamic-type', expected: 'text wraps and controls expand without overlap' },
  { id: 'voiceover', expected: 'state, action, and recovery are announced in order' },
  { id: 'haptics', expected: 'optional and subordinate to visible state change' },
  { id: 'loading', expected: 'progress remains understandable without animation' },
];

export const getIosMotionCases = ({ reduceMotion, voiceOver, state } = {}) => IOS_MOTION_QA_CASES.filter((item) => (
  (reduceMotion === undefined || item.reduceMotion === reduceMotion)
  && (voiceOver === undefined || item.voiceOver === voiceOver)
  && (state === undefined || item.state === state)
));
