import React, { useMemo } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, RADIUS, SPACE, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { usePressScale, useReveal } from '../motion';

export function Screen({ children, style, contentStyle, scroll = true, ...props }) {
  if (!scroll) return <View style={[COMMON.screen, style]} {...props}>{children}</View>;
  return <View style={[COMMON.screen, style]} {...props}><ScrollView contentContainerStyle={[COMMON.content, contentStyle]} showsVerticalScrollIndicator={false}>{children}</ScrollView></View>;
}

export function ScreenHeader({ title, subtitle, onBack, right, compact = false }) {
  return <View style={[styles.header, compact && styles.headerCompact]}>
    <View style={styles.headerTop}>
      {onBack ? <Pressable accessibilityRole="button" accessibilityLabel={`Back from ${title}`} onPress={onBack} hitSlop={10} style={styles.backButton}><Ionicons name="chevron-back" size={23} color={COLORS.text} /></Pressable> : null}
      <View style={COMMON.fill}>
        <Text style={TYPOGRAPHY.eyebrow}>CARWISE</Text>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      {right || <View style={{ width: 36 }} />}
    </View>
  </View>;
}

export function SectionHeader({ eyebrow, title, subtitle, actionLabel, onAction }) {
  return <View style={styles.sectionHeader}>
    <View style={COMMON.fill}>
      {eyebrow ? <Text style={TYPOGRAPHY.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
    {actionLabel ? <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}><Text style={styles.sectionAction}>{actionLabel}</Text></Pressable> : null}
  </View>;
}

export function SurfaceCard({ children, style, tone = 'default', animated = false, animationKey = 'card', onPress, disabled = false }) {
  const motion = useReveal(animationKey, { duration: 300, distance: 8 });
  const press = usePressScale();
  const toneStyle = tone === 'blue' ? styles.cardBlue : tone === 'mint' ? styles.cardMint : tone === 'amber' ? styles.cardAmber : tone === 'coral' ? styles.cardCoral : null;
  const content = <View style={[COMMON.card, toneStyle, style]}>{children}</View>;
  if (!onPress) return animated ? <Animated.View style={[motion]}>{content}</Animated.View> : content;
  return <Animated.View style={{ transform: [{ scale: press.scale }] }}>{
    animated ? <Animated.View style={motion}><Pressable disabled={disabled} onPress={onPress} onPressIn={press.pressIn} onPressOut={press.pressOut}>{content}</Pressable></Animated.View> :
    <Pressable disabled={disabled} onPress={onPress} onPressIn={press.pressIn} onPressOut={press.pressOut}>{content}</Pressable>
  }</Animated.View>;
}

export function PrimaryButton({ label, icon = 'arrow-forward', onPress, disabled = false, loading = false, compact = false, style, accessibilityHint }) {
  const press = usePressScale();
  return <Animated.View style={{ transform: [{ scale: press.scale }] }}>
    <Pressable disabled={disabled || loading} accessibilityRole="button" accessibilityLabel={label} accessibilityHint={accessibilityHint} onPress={onPress} onPressIn={press.pressIn} onPressOut={press.pressOut} style={[styles.primaryButton, compact && styles.primaryButtonCompact, disabled && styles.buttonDisabled, style]}>
      <Text style={styles.primaryButtonText}>{loading ? 'Working…' : label}</Text>
      <Ionicons name={loading ? 'sync' : icon} size={19} color={COLORS.white} />
    </Pressable>
  </Animated.View>;
}

export function SecondaryButton({ label, icon = 'chevron-forward', onPress, disabled = false, style }) {
  const press = usePressScale();
  return <Animated.View style={{ transform: [{ scale: press.scale }] }}>
    <Pressable disabled={disabled} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} onPressIn={press.pressIn} onPressOut={press.pressOut} style={[styles.secondaryButton, disabled && styles.buttonDisabled, style]}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
      <Ionicons name={icon} size={17} color={COLORS.textSecondary} />
    </Pressable>
  </Animated.View>;
}

export function IconButton({ icon, onPress, label, tone = 'default', size = 44 }) {
  const press = usePressScale();
  const color = toneColor(tone === 'default' ? 'blue' : tone);
  return <Animated.View style={{ transform: [{ scale: press.scale }] }}>
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} onPressIn={press.pressIn} onPressOut={press.pressOut} style={[styles.iconButton, { width: size, height: size }, tone !== 'default' && { backgroundColor: alpha(color, 0.12), borderColor: alpha(color, 0.25) }]}>
      <Ionicons name={icon} size={20} color={tone === 'default' ? COLORS.text : color} />
    </Pressable>
  </Animated.View>;
}

export function Badge({ label, tone = 'blue', icon }) {
  const color = toneColor(tone);
  return <View style={[styles.badge, { backgroundColor: alpha(color, 0.12), borderColor: alpha(color, 0.25) }]}>
    {icon ? <Ionicons name={icon} size={12} color={color} style={{ marginRight: 4 }} /> : null}
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>;
}

export function SeverityBadge({ severity }) {
  const normalized = String(severity || 'minor').toLowerCase();
  const tone = normalized === 'critical' ? 'coral' : normalized === 'major' ? 'amber' : 'mint';
  return <Badge tone={tone} label={normalized.toUpperCase()} icon={normalized === 'minor' ? 'information-circle' : 'warning'} />;
}

export function Divider({ spacing = SPACE[4] }) {
  return <View style={[COMMON.hairline, { marginVertical: spacing }]} />;
}

export function SearchInput({ value, onChangeText, placeholder = 'Search', icon = 'search', right }) {
  return <View style={styles.searchBox}>
    <Ionicons name={icon} size={19} color={COLORS.textTertiary} />
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={COLORS.textTertiary} style={styles.searchInput} accessibilityLabel={placeholder} autoCapitalize="none" />
    {right}
  </View>;
}

export function InputField({ label, value, onChangeText, placeholder, helper, keyboardType, autoCapitalize = 'sentences', multiline = false, leftIcon, right, mono = false }) {
  return <View style={styles.field}>
    {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
    <View style={[styles.inputShell, multiline && styles.inputMultiline]}>
      {leftIcon ? <Ionicons name={leftIcon} size={18} color={COLORS.textSecondary} style={{ marginRight: 9, alignSelf: multiline ? 'flex-start' : 'center' }} /> : null}
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={COLORS.textTertiary} keyboardType={keyboardType} autoCapitalize={autoCapitalize} multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'} style={[styles.textInput, mono && TYPOGRAPHY.mono, multiline && { minHeight: 92 }]} />
      {right}
    </View>
    {helper ? <Text style={styles.fieldHelper}>{helper}</Text> : null}
  </View>;
}

export function SegmentedControl({ options, value, onChange }) {
  const selected = useMemo(() => options.find((item) => item.value === value), [options, value]);
  return <View style={styles.segmentWrap}>
    {options.map((item) => <Pressable key={item.value} accessibilityRole="radio" accessibilityState={{ selected: item.value === selected?.value }} onPress={() => onChange(item.value)} style={[styles.segment, item.value === value && styles.segmentSelected]}>
      {item.icon ? <Ionicons name={item.icon} size={15} color={item.value === value ? COLORS.white : COLORS.textSecondary} /> : null}
      <Text style={[styles.segmentText, item.value === value && styles.segmentTextSelected]}>{item.label}</Text>
    </Pressable>)}
  </View>;
}

export function MetricCard({ label, value, note, tone = 'blue', icon }) {
  const color = toneColor(tone);
  return <View style={styles.metricCard}>
    <View style={styles.metricCardTop}>
      <Text style={styles.metricLabel}>{label}</Text>
      {icon ? <View style={[styles.metricIcon, { backgroundColor: alpha(color, 0.12) }]}><Ionicons name={icon} size={15} color={color} /></View> : null}
    </View>
    <Text style={[styles.metricValue, { color: tone === 'default' ? COLORS.text : color }]}>{value}</Text>
    {note ? <Text style={styles.metricNote}>{note}</Text> : null}
  </View>;
}

export function ProgressBar({ progress = 0, tone = 'blue', height = 8, label, showPercent = true }) {
  const safe = Math.max(0, Math.min(100, Number(progress) || 0));
  const color = toneColor(tone);
  return <View>
    {(label || showPercent) ? <View style={styles.progressHeader}><Text style={styles.progressLabel}>{label || 'Progress'}</Text>{showPercent ? <Text style={[styles.progressPercent, { color }]}>{Math.round(safe)}%</Text> : null}</View> : null}
    <View style={[styles.progressTrack, { height }]}><View style={[styles.progressFill, { width: `${safe}%`, height, backgroundColor: color }]} /></View>
  </View>;
}

export function MiniStat({ icon, label, value, tone = 'blue' }) {
  const color = toneColor(tone);
  return <View style={styles.miniStat}><View style={[styles.miniStatIcon, { backgroundColor: alpha(color, 0.12) }]}><Ionicons name={icon} size={15} color={color} /></View><View style={COMMON.fill}><Text style={styles.miniStatLabel}>{label}</Text><Text style={styles.miniStatValue}>{value}</Text></View></View>;
}

export function EmptyState({ icon = 'sparkles-outline', title, body, actionLabel, onAction }) {
  return <SurfaceCard style={styles.emptyCard}>
    <View style={styles.emptyIcon}><Ionicons name={icon} size={27} color={COLORS.cyan} /></View>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyBody}>{body}</Text>
    {actionLabel ? <PrimaryButton label={actionLabel} onPress={onAction} compact /> : null}
  </SurfaceCard>;
}

export function WarningBanner({ title, body, tone = 'amber', actionLabel, onAction }) {
  const color = toneColor(tone);
  return <View style={[styles.warningBanner, { backgroundColor: alpha(color, 0.09), borderColor: alpha(color, 0.22) }]}>
    <View style={[styles.warningIcon, { backgroundColor: alpha(color, 0.16) }]}><Ionicons name={tone === 'coral' ? 'alert-circle' : 'warning'} size={17} color={color} /></View>
    <View style={COMMON.fill}><Text style={[styles.warningTitle, { color }]}>{title}</Text><Text style={styles.warningBody}>{body}</Text></View>
    {actionLabel ? <Pressable onPress={onAction} hitSlop={8}><Text style={[styles.warningAction, { color }]}>{actionLabel}</Text></Pressable> : null}
  </View>;
}

export function HeroImagePlaceholder({ label = 'Vehicle image', aspect = 1.48, uri }) {
  return <View style={[styles.heroMedia, { aspectRatio: aspect }]}>
    {uri ? <Animated.Image source={{ uri }} resizeMode="cover" style={StyleSheet.absoluteFillObject} /> : null}
    <View pointerEvents="none" style={styles.heroMediaNoise} />
    <View pointerEvents="none" style={styles.heroMediaGlow} />
    {!uri ? <View style={styles.heroPlaceholderCenter}><View style={styles.placeholderCar}><View style={styles.placeholderCabin} /><View style={styles.placeholderWindow} /><View style={styles.placeholderWheelLeft} /><View style={styles.placeholderWheelRight} /></View><Text style={styles.heroPlaceholderLabel}>{label}</Text></View> : null}
  </View>;
}

export function ChipRow({ items, selected, onSelect, horizontal = true }) {
  return <ScrollView horizontal={horizontal} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
    {items.map((item) => { const active = (item.value ?? item) === selected; const label = item.label ?? item; return <Pressable key={String(item.value ?? item)} onPress={() => onSelect?.(item.value ?? item)} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></Pressable>; })}
  </ScrollView>;
}

export function FloatingAIButton({ onPress, label = 'Ask CarWise' }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.floatingAI}>
    <View style={styles.aiSpark}><Ionicons name="sparkles" size={17} color={COLORS.white} /></View><Text style={styles.floatingAIText}>{label}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  header: { marginBottom: SPACE[4] },
  headerCompact: { marginBottom: SPACE[2] },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...TYPOGRAPHY.h1, marginTop: 2 },
  headerSubtitle: { ...TYPOGRAPHY.caption, marginTop: 3, maxWidth: 310 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 12 },
  sectionTitle: { ...TYPOGRAPHY.h2, marginTop: 4 },
  sectionSubtitle: { ...TYPOGRAPHY.caption, marginTop: 3, maxWidth: 320 },
  sectionAction: { color: COLORS.blue, fontWeight: '750', fontSize: 13, paddingBottom: 3 },
  cardBlue: { borderColor: alpha(COLORS.blue, 0.38) },
  cardMint: { borderColor: alpha(COLORS.mint, 0.38) },
  cardAmber: { borderColor: alpha(COLORS.amber, 0.38) },
  cardCoral: { borderColor: alpha(COLORS.coral, 0.38) },
  primaryButton: { minHeight: 52, borderRadius: 16, backgroundColor: COLORS.blue, paddingHorizontal: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  primaryButtonCompact: { minHeight: 46, borderRadius: 14, paddingHorizontal: 14, alignSelf: 'stretch', marginTop: 14 },
  primaryButtonText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  secondaryButton: { minHeight: 50, borderRadius: 15, borderWidth: 1, borderColor: COLORS.borderStrong, backgroundColor: COLORS.surfaceElevated, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  secondaryButtonText: { color: COLORS.text, fontSize: 14, fontWeight: '750' },
  buttonDisabled: { opacity: 0.5 },
  iconButton: { borderRadius: 22, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  badge: { minHeight: 24, borderRadius: RADIUS.pill, borderWidth: 1, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: '850', letterSpacing: 0.55 },
  searchBox: { height: 50, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9 },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 15, minHeight: 48 },
  field: { marginTop: 15 },
  fieldLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 7 },
  inputShell: { minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: COLORS.borderStrong, backgroundColor: COLORS.surfaceElevated, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center' },
  inputMultiline: { alignItems: 'flex-start', paddingVertical: 11 },
  textInput: { flex: 1, color: COLORS.text, fontSize: 15, paddingVertical: 0 },
  fieldHelper: { color: COLORS.textTertiary, fontSize: 11, lineHeight: 15, marginTop: 5 },
  segmentWrap: { flexDirection: 'row', borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 4, gap: 3 },
  segment: { flex: 1, minHeight: 42, borderRadius: 11, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 6, paddingHorizontal: 8 },
  segmentSelected: { backgroundColor: COLORS.blue },
  segmentText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '750' },
  segmentTextSelected: { color: COLORS.white },
  metricCard: { flex: 1, minWidth: 142, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 14 },
  metricCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700' },
  metricIcon: { width: 28, height: 28, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  metricValue: { fontSize: 24, fontWeight: '850', marginTop: 11 },
  metricNote: { color: COLORS.textTertiary, fontSize: 10, marginTop: 2 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  progressLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '750' },
  progressPercent: { fontSize: 11, fontWeight: '850' },
  progressTrack: { backgroundColor: COLORS.surfaceSoft, borderRadius: 99, overflow: 'hidden' },
  progressFill: { borderRadius: 99 },
  miniStat: { flex: 1, minWidth: 125, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9 },
  miniStatIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  miniStatLabel: { color: COLORS.textTertiary, fontSize: 10, fontWeight: '700' },
  miniStatValue: { color: COLORS.text, fontSize: 14, fontWeight: '800', marginTop: 1 },
  emptyCard: { alignItems: 'center', paddingVertical: 28 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: alpha(COLORS.cyan, 0.09), justifyContent: 'center', alignItems: 'center', marginBottom: 13 },
  emptyTitle: { ...TYPOGRAPHY.h3, textAlign: 'center' },
  emptyBody: { ...TYPOGRAPHY.caption, textAlign: 'center', maxWidth: 290, marginTop: 7 },
  warningBanner: { borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  warningIcon: { width: 31, height: 31, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  warningTitle: { fontSize: 12, fontWeight: '850' },
  warningBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 15, marginTop: 2 },
  warningAction: { fontSize: 11, fontWeight: '850', paddingTop: 2 },
  heroMedia: { width: '100%', borderRadius: 22, backgroundColor: '#0A1728', overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  heroMediaNoise: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,30,50,0.28)' },
  heroMediaGlow: { position: 'absolute', left: -40, right: -40, bottom: -30, height: '70%', backgroundColor: 'rgba(0,212,255,0.07)', borderRadius: 150 },
  heroPlaceholderCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroPlaceholderLabel: { color: COLORS.textTertiary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginTop: 12, textTransform: 'uppercase' },
  placeholderCar: { width: '72%', height: '44%', borderRadius: 42, borderWidth: 2, borderColor: alpha(COLORS.cyan, 0.58), backgroundColor: alpha(COLORS.blue, 0.08), position: 'relative' },
  placeholderCabin: { position: 'absolute', width: '53%', height: '44%', top: '10%', left: '24%', borderRadius: 20, borderWidth: 2, borderColor: alpha(COLORS.cyan, 0.5) },
  placeholderWindow: { position: 'absolute', width: '40%', height: '20%', top: '17%', left: '30%', backgroundColor: alpha(COLORS.cyan, 0.16), borderRadius: 8 },
  placeholderWheelLeft: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surfaceSoft, borderWidth: 2, borderColor: COLORS.borderStrong, left: '7%', bottom: '4%' },
  placeholderWheelRight: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surfaceSoft, borderWidth: 2, borderColor: COLORS.borderStrong, right: '7%', bottom: '4%' },
  chip: { minHeight: 34, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, paddingHorizontal: 12, justifyContent: 'center' },
  chipActive: { backgroundColor: alpha(COLORS.blue, 0.16), borderColor: alpha(COLORS.blue, 0.42) },
  chipText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '750' },
  chipTextActive: { color: COLORS.white },
  floatingAI: { position: 'absolute', right: 18, bottom: 20, minHeight: 48, paddingHorizontal: 13, borderRadius: 24, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.4), flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: COLORS.cyan, shadowOpacity: 0.2, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  aiSpark: { width: 29, height: 29, borderRadius: 10, backgroundColor: COLORS.blue, justifyContent: 'center', alignItems: 'center' },
  floatingAIText: { color: COLORS.text, fontSize: 12, fontWeight: '800' },
});
