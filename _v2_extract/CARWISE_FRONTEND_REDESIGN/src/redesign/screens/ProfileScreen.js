import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { MetricPill, PressableTile } from '../components/Advanced';

const sections = [
  { title: 'Account', items: [['person-outline', 'Profile', 'Name, email, membership'], ['card-outline', 'Subscription', 'Plan and billing'], ['notifications-outline', 'Notifications', 'Alerts and reminders']] },
  { title: 'App', items: [['moon-outline', 'Appearance', 'Dark mode'], ['pulse-outline', 'Motion', 'Animation preferences'], ['language-outline', 'Language', 'English']] },
  { title: 'Privacy', items: [['shield-checkmark-outline', 'Data & privacy', 'Export or delete data'], ['lock-closed-outline', 'Security', 'Biometrics and sessions']] },
];

export default function ProfileScreen({ actions }) {
  const [dark, setDark] = useState(true);
  const [motion, setMotion] = useState(true);
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Profile & Settings" subtitle="Tune your CarWise experience." onBack={actions?.onBack} right={<Badge tone="cyan" label="PROTOTYPE" />} />
    <SurfaceCard tone="blue"><View style={COMMON.row}><View style={styles.avatar}><Ionicons name="person" size={25} color={COLORS.text} /></View><View style={COMMON.fill}><Text style={styles.name}>CarWise Driver</Text><Text style={styles.email}>buyer@example.com</Text><View style={styles.membership}><Badge tone="cyan" label="PRO" /><Text style={styles.memberHint}>Unlimited inspection workspace</Text></View></View></View><View style={styles.profileStats}><MetricPill label="INSPECTIONS" value="12" tone="cyan" /><MetricPill label="REPORTS" value="8" tone="mint" /><MetricPill label="SAVED" value="4" tone="amber" /></View></SurfaceCard>
    <SectionHeader title="Settings" subtitle="Control your experience" style={{ marginTop: 20 }} />
    {sections.map((section) => <View key={section.title} style={styles.section}><Text style={TYPOGRAPHY.meta}>{section.title}</Text><SurfaceCard style={{ marginTop: 7 }}>{section.items.map(([icon, label, description], index) => <Pressable key={label} onPress={() => actions?.onSetting?.(label)} style={[styles.row, index !== section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.border }]}><View style={styles.rowIcon}><Ionicons name={icon} size={17} color={COLORS.textSecondary} /></View><View style={COMMON.fill}><Text style={styles.rowTitle}>{label}</Text><Text style={styles.rowBody}>{description}</Text></View><Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} /></Pressable> )}</SurfaceCard></View>)}
    <SectionHeader title="Quick preferences" style={{ marginTop: 19 }} />
    <SurfaceCard>
      <Preference icon="moon-outline" title="Dark appearance" subtitle="Recommended for the CarWise visual system" value={dark} onChange={setDark} />
      <Preference icon="pulse-outline" title="Motion effects" subtitle="Use animated progress and transitions" value={motion} onChange={setMotion} />
      <Preference icon="text-outline" title="Large type" subtitle="Respect system accessibility settings" value={false} disabled />
    </SurfaceCard>
    <SectionHeader title="Workspace actions" style={{ marginTop: 19 }} /><View style={styles.tiles}><PressableTile title="Export data" subtitle="JSON + documents" icon="download-outline" tone="cyan" onPress={() => Alert.alert('Export', 'Connect this button to the existing local export/data service.')} /><PressableTile title="Clear cache" subtitle="Keep inspections" icon="trash-bin-outline" tone="amber" onPress={() => Alert.alert('Cache', 'Cache cleared in this design-state demo.')} /><PressableTile title="Help" subtitle="Support center" icon="help-circle-outline" tone="mint" onPress={() => actions?.onHelp?.()} /><PressableTile title="About" subtitle="CarWise version" icon="information-circle-outline" tone="blue" onPress={() => Alert.alert('CarWise', 'AI-powered used car inspection frontend redesign.')} /></View>
    <PrimaryButton label="Manage subscription" icon="sparkles" onPress={() => actions?.onNavigate?.('paywall')} style={{ marginTop: 13 }} /><SecondaryButton label="Sign out" icon="log-out-outline" onPress={() => actions?.onSignOut?.() || Alert.alert('Sign out', 'Wire this to the repository authentication state.')} style={{ marginTop: 8, marginBottom: 30 }} />
  </Screen>;
}

function Preference({ icon, title, subtitle, value, onChange, disabled = false }) { return <View style={styles.preference}><View style={styles.rowIcon}><Ionicons name={icon} size={17} color={COLORS.textSecondary} /></View><View style={COMMON.fill}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowBody}>{subtitle}</Text></View><Switch value={value} onValueChange={onChange} disabled={disabled} trackColor={{ false: COLORS.surfaceSoft, true: alpha(COLORS.cyan, 0.45) }} thumbColor={value ? COLORS.cyan : COLORS.textTertiary} /></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  avatar: { width: 57, height: 57, borderRadius: 19, backgroundColor: alpha(COLORS.cyan, 0.11), alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  name: { color: COLORS.text, fontSize: 16, fontWeight: '900' },
  email: { color: COLORS.textSecondary, fontSize: 9, marginTop: 2 },
  membership: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  memberHint: { color: COLORS.textTertiary, fontSize: 8, marginLeft: 6 },
  profileStats: { flexDirection: 'row', marginTop: 14 },
  section: { marginBottom: 11 },
  row: { minHeight: 63, flexDirection: 'row', alignItems: 'center', gap: 9 },
  rowIcon: { width: 35, height: 35, borderRadius: 11, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: COLORS.text, fontSize: 11, fontWeight: '800' },
  rowBody: { color: COLORS.textTertiary, fontSize: 8, marginTop: 2 },
  preference: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tiles: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
});
