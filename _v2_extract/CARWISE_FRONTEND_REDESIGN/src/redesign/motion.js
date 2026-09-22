import { AccessibilityInfo, Animated, Easing } from 'react-native';
import { useEffect, useRef, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => mounted && setReduced(Boolean(value)))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

export function motionDuration(duration, reduced) {
  return reduced ? 1 : duration;
}

export function useReveal(key, options = {}) {
  const { duration = 320, distance = 12, delay = 0 } = options;
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(reduced ? 0 : distance)).current;

  useEffect(() => {
    opacity.stopAnimation();
    translateY.stopAnimation();
    if (reduced) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    opacity.setValue(0);
    translateY.setValue(distance);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [key, reduced, duration, distance, delay, opacity, translateY]);

  return { opacity, transform: [{ translateY }] };
}

export function usePressScale() {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const pressIn = () => {
    if (reduced) return;
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 30, bounciness: 4 }).start();
  };
  const pressOut = () => {
    if (reduced) return;
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 7 }).start();
  };
  return { scale, pressIn, pressOut };
}

export function animateValue(value, toValue, duration = 500, reduced = false) {
  value.stopAnimation();
  Animated.timing(value, {
    toValue,
    duration: motionDuration(duration, reduced),
    easing: Easing.out(Easing.cubic),
    useNativeDriver: false,
  }).start();
}

export function pulseAnimation(value, reduced = false, minimum = 0.42, maximum = 1) {
  if (reduced) {
    value.setValue(maximum);
    return () => {};
  }
  const loop = Animated.loop(
    Animated.sequence([
      Animated.timing(value, { toValue: maximum, duration: 650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(value, { toValue: minimum, duration: 650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]),
  );
  loop.start();
  return () => loop.stop();
}
