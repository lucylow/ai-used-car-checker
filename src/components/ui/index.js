import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) => (
  <TouchableOpacity
    accessibilityRole="button"
    disabled={disabled || loading}
    onPress={onPress}
    activeOpacity={0.78}
    style={[styles.button, variant === 'secondary' && styles.secondaryButton, disabled && styles.disabled, style]}
  >
    {loading ? <ActivityIndicator color={variant === 'secondary' ? '#2F80ED' : '#FFFFFF'} /> : <Text style={[styles.buttonText, variant === 'secondary' && styles.secondaryButtonText]}>{title}</Text>}
  </TouchableOpacity>
);

export const Input = ({ label, error, style, ...props }) => (
  <View style={styles.field}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput placeholderTextColor="#92A1B8" style={[styles.input, error && styles.errorInput, style]} {...props} />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export const Card = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

export const Badge = ({ label, tone = 'blue' }) => <View style={[styles.badge, { backgroundColor: `${tone === 'mint' ? '#35D0BA' : tone === 'amber' ? '#F4B740' : tone === 'coral' ? '#F16B6B' : '#2F80ED'}22` }]}><Text style={[styles.badgeText, { color: tone === 'mint' ? '#35D0BA' : tone === 'amber' ? '#F4B740' : tone === 'coral' ? '#F16B6B' : '#2F80ED' }]}>{label}</Text></View>;

export const Loading = ({ label = 'Loading…' }) => <View style={styles.loading}><ActivityIndicator color="#2F80ED" /><Text style={styles.loadingText}>{label}</Text></View>;

export const EmptyState = ({ title, message }) => <View style={styles.empty}><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyMessage}>{message}</Text></View>;

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 14, backgroundColor: '#2F80ED', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  secondaryButton: { backgroundColor: '#151F32', borderWidth: 1, borderColor: '#2F80ED' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  secondaryButtonText: { color: '#2F80ED' },
  disabled: { opacity: 0.5 },
  field: { marginBottom: 14 },
  label: { color: '#92A1B8', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 7, textTransform: 'uppercase' },
  input: { backgroundColor: '#1C2940', color: '#F6F8FC', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  errorInput: { borderWidth: 1, borderColor: '#F16B6B' },
  errorText: { color: '#F16B6B', marginTop: 5, fontSize: 12 },
  card: { backgroundColor: '#151F32', borderWidth: 1, borderColor: '#263651', borderRadius: 18, padding: 18 },
  badge: { borderRadius: 30, paddingHorizontal: 9, paddingVertical: 5, alignSelf: 'flex-start' },
  badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  loading: { padding: 20, alignItems: 'center', gap: 10 },
  loadingText: { color: '#92A1B8', fontSize: 14 },
  empty: { alignItems: 'center', padding: 32 },
  emptyTitle: { color: '#F6F8FC', fontSize: 18, fontWeight: '800' },
  emptyMessage: { color: '#92A1B8', fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 8 },
});
