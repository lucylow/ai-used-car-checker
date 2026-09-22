import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, ChipRow, Screen, ScreenHeader, SectionHeader, SurfaceCard } from '../components/Primitives';
import { EvidenceTimeline } from '../components/Advanced';

const INITIAL = [
  { id: 'n1', type: 'AI', icon: 'sparkles', tone: 'cyan', title: 'AI findings are ready', body: 'CarWise found 7 visible findings in your latest evidence set.', time: '2 min ago', read: false },
  { id: 'n2', type: 'MARKET', icon: 'trending-up', tone: 'mint', title: 'Market data refreshed', body: 'Comparable vehicle pricing has been updated for your inspection.', time: '18 min ago', read: false },
  { id: 'n3', type: 'TASK', icon: 'camera', tone: 'amber', title: 'Complete the passenger side', body: 'Two recommended evidence photos are still missing.', time: '1 hr ago', read: true },
  { id: 'n4', type: 'REPORT', icon: 'document-text', tone: 'blue', title: 'Your report is saved', body: 'You can export, share, or continue reviewing the inspection.', time: 'Yesterday', read: true },
];
const activity = [
  { id: '1', time: '10:47', type: 'PHOTO', title: 'Front bumper photo added', description: 'AI annotation available for review.', color: COLORS.cyan },
  { id: '2', time: '10:44', type: 'VOICE', title: 'Engine note recorded', description: '“Slight clicking when turning left.”', color: COLORS.amber },
  { id: '3', time: '10:41', type: 'AI', title: 'Condition analysis completed', description: '7 findings are ready to confirm.', color: COLORS.mint },
  { id: '4', time: '10:35', type: 'VIN', title: 'VIN verified', description: 'Vehicle identity is attached to this inspection.', color: COLORS.cyan },
];

export default function NotificationsScreen({ actions }) {
  const [items, setItems] = useState(INITIAL);
  const [filter, setFilter] = useState('All');
  const visible = useMemo(() => filter === 'Unread' ? items.filter((item) => !item.read) : items, [filter, items]);
  const markRead = (id) => setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  const unread = items.filter((item) => !item.read).length;
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Notifications" subtitle={unread ? `${unread} unread updates` : "You're all caught up"} onBack={actions?.onBack} right={<Badge tone={unread ? 'cyan' : 'mint'} label={`${unread}`} />} />
    <ChipRow items={[{ value: 'All', label: 'All' }, { value: 'Unread', label: 'Unread' }]} selected={filter} onSelect={setFilter} />
    <View style={styles.list}>
      {visible.map((item) => {
        const color = item.tone === 'mint'
          ? COLORS.mint
          : item.tone === 'amber'
            ? COLORS.amber
            : item.tone === 'blue'
              ? COLORS.blue
              : COLORS.cyan;
        return (
          <Pressable
            key={item.id}
            onPress={() => markRead(item.id)}
            style={({ pressed }) => [
              styles.notification,
              !item.read && {
                borderColor: alpha(color, 0.32),
                backgroundColor: alpha(color, 0.04),
              },
              pressed && { opacity: 0.78 },
            ]}
          >
            <View style={[styles.notificationIcon, { backgroundColor: alpha(color, 0.1) }]}>
              <Ionicons name={item.icon} size={17} color={color} />
            </View>
            <View style={COMMON.fill}>
              <View style={COMMON.row}>
                <Text style={styles.notificationType}>{item.type}</Text>
                {!item.read ? <View style={[styles.unreadDot, { backgroundColor: color }]} /> : null}
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationBody}>{item.body}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
          </Pressable>
        );
      })}
    </View>

    <SectionHeader title="Inspection activity" subtitle="Evidence timeline" style={{ marginTop: 18 }} />
    <SurfaceCard><EvidenceTimeline events={activity} /></SurfaceCard>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  list: { gap: 9, marginTop: 12 },
  notification: { minHeight: 86, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  notificationIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  notificationType: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '850', letterSpacing: 0.7 },
  notificationTime: { color: COLORS.textTertiary, fontSize: 8, marginLeft: 'auto' },
  unreadDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 6 },
  notificationTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850', marginTop: 3 },
  notificationBody: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 14, marginTop: 2 },
});
