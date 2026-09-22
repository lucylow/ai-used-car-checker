import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, PrimaryButton, SecondaryButton } from '../components/Primitives';
import { StepRail } from '../components/Navigation';
import { useReveal } from '../motion';

const PAGES = [
  { eyebrow: '01 · SEE THE CAR', title: 'Buying a used car should not feel like a gamble.', body: 'Capture the vehicle from multiple angles and keep every important observation attached to the inspection.', icon: 'camera', tone: 'cyan', bullets: ['Real vehicle evidence', 'Photo + video + voice', 'Guided inspection flow'] },
  { eyebrow: '02 · KNOW THE DEAL', title: 'Turn market data into a price you can explain.', body: 'See asking price, comparable listings, market range, repair impact, and negotiation context in one place.', icon: 'analytics', tone: 'blue', bullets: ['Comparable listings', 'Fair-value estimate', 'Repair impact'] },
  { eyebrow: '03 · SIGN WITH CONFIDENCE', title: 'AI assists. Humans authorize.', body: 'Review AI findings, prepare the contract, and keep human approval explicit before a document is signed.', icon: 'shield-checkmark', tone: 'mint', bullets: ['Explainable AI', 'Human review', 'Verified certificate'] },
];

export default function OnboardingScreen({ actions }) {
  const [page, setPage] = useState(0);
  const reveal = useReveal(`onboarding-${page}`, { duration: 400, distance: 14 });
  const current = PAGES[page];
  const next = () => page < PAGES.length - 1 ? setPage(page + 1) : actions?.onFinish?.();
  return <View style={styles.screen}>
    <View style={styles.top}><View style={styles.logo}><Ionicons name="shield-checkmark" size={20} color={COLORS.white} /></View><Text style={styles.brand}>CARWISE</Text><Pressable onPress={actions?.onFinish} style={styles.skip}><Text style={styles.skipText}>Skip</Text></Pressable></View>
    <StepRail steps={[{ label: 'See' }, { label: 'Price' }, { label: 'Sign' }]} activeIndex={page} />
    <Animated.View style={[styles.body, reveal]}>
      <View style={styles.visual}><View style={[styles.visualGlow, { backgroundColor: alpha(toneColor(current.tone), 0.09) }]} /><View style={[styles.visualIcon, { borderColor: alpha(toneColor(current.tone), 0.35), backgroundColor: alpha(toneColor(current.tone), 0.08) }]}><Ionicons name={current.icon} size={50} color={toneColor(current.tone)} /></View><View style={styles.visualTraceOne} /><View style={styles.visualTraceTwo} /><View style={styles.visualTraceThree} /></View>
      <Text style={TYPOGRAPHY.eyebrow}>{current.eyebrow}</Text><Text style={styles.title}>{current.title}</Text><Text style={styles.bodyText}>{current.body}</Text>
      <View style={styles.bullets}>{current.bullets.map((item) => <View key={item} style={styles.bullet}><Ionicons name="checkmark-circle" size={17} color={toneColor(current.tone)} /><Text style={styles.bulletText}>{item}</Text></View>)}</View>
    </Animated.View>
    <View style={styles.bottom}>{<PrimaryButton label={page === PAGES.length - 1 ? 'Get Started' : 'Continue'} icon="arrow-forward" onPress={next} />}<SecondaryButton label={page === 0 ? 'I already have an account' : 'Back'} icon={page === 0 ? 'person-outline' : 'arrow-back'} onPress={page === 0 ? actions?.onSignIn : () => setPage(page - 1)} style={{ marginTop: 9 }} /></View>
  </View>;
}

function toneColor(tone) { return tone === 'mint' ? COLORS.mint : tone === 'amber' ? COLORS.amber : tone === 'coral' ? COLORS.coral : tone === 'blue' ? COLORS.blue : COLORS.cyan; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg, padding: 18 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8 },
  logo: { width: 39, height: 39, borderRadius: 14, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
  brand: { color: COLORS.text, fontSize: 17, fontWeight: '900', letterSpacing: 2, flex: 1 },
  skip: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 8 },
  skipText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '750' },
  body: { flex: 1, justifyContent: 'center', paddingVertical: 20 },
  visual: { height: 250, borderRadius: 27, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 30, position: 'relative' },
  visualGlow: { position: 'absolute', width: 270, height: 270, borderRadius: 135 },
  visualIcon: { width: 126, height: 126, borderRadius: 42, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  visualTraceOne: { position: 'absolute', width: '52%', height: 1, top: '26%', left: '7%', backgroundColor: alpha(COLORS.cyan, 0.25) },
  visualTraceTwo: { position: 'absolute', width: '72%', height: 1, top: '74%', right: '5%', backgroundColor: alpha(COLORS.blue, 0.22) },
  visualTraceThree: { position: 'absolute', width: '35%', height: 1, top: '54%', left: '9%', backgroundColor: alpha(COLORS.mint, 0.2) },
  title: { color: COLORS.text, fontSize: 32, lineHeight: 38, fontWeight: '900', marginTop: 8 },
  bodyText: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 21, marginTop: 10 },
  bullets: { marginTop: 19, gap: 11 },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  bulletText: { color: COLORS.text, fontSize: 12, fontWeight: '700' },
  bottom: { paddingBottom: 6 },
});
