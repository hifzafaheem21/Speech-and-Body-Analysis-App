import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({
  children,
  scroll = true,
  contentStyle,
  ...props
}: ScrollViewProps & { children: React.ReactNode; scroll?: boolean; contentStyle?: ViewStyle }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const paddingTop = Math.max(insets.top, 20);
  const paddingBottom = Math.max(insets.bottom + 24, 34);
  if (!scroll) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, paddingTop, paddingBottom }, contentStyle]}>
        {children}
      </View>
    );
  }
  return (
    <ScrollView
      {...props}
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[{ paddingTop, paddingBottom }, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Header({
  title,
  subtitle,
  onBack,
  action,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeading}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconButton}>
            <Feather name="arrow-left" size={21} color={colors.foreground} />
          </Pressable>
        ) : null}
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
          {subtitle ? <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
        </View>
      </View>
      {action}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
  loading = false,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  const colors = useColors();
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: isPrimary ? colors.primary : colors.secondary,
          opacity: disabled || loading ? 0.55 : pressed ? 0.78 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.primaryForeground : colors.foreground} />
      ) : (
        <>
          <Text style={[styles.primaryButtonText, { color: isPrimary ? colors.primaryForeground : colors.foreground }]}>
            {label}
          </Text>
          {icon ? <Feather name={icon} size={18} color={isPrimary ? colors.primaryForeground : colors.foreground} /> : null}
        </>
      )}
    </Pressable>
  );
}

export function MetricBar({ label, value, detail }: { label: string; value: number; detail?: string }) {
  const colors = useColors();
  return (
    <View style={styles.metricBlock}>
      <View style={styles.metricHeader}>
        <Text style={[styles.metricLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.metricValue, { color: colors.primary }]}>{value}</Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
        <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${value}%` }]} />
      </View>
      {detail ? <Text style={[styles.metricDetail, { color: colors.mutedForeground }]}>{detail}</Text> : null}
    </View>
  );
}

export function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.sectionRow}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{children}</Text>
      {right}
    </View>
  );
}

export function LogoMark({ small = false }: { small?: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.logoMark, { backgroundColor: colors.primary, width: small ? 34 : 42, height: small ? 34 : 42 }]}>
      <Ionicons name="pulse" size={small ? 19 : 24} color={colors.primaryForeground} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  headerLeading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -0.5 },
  headerSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 4 },
  iconButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { minHeight: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 20 },
  primaryButtonText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  metricBlock: { marginBottom: 18 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  metricLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  metricValue: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  progressTrack: { height: 8, borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 8 },
  metricDetail: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 7 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1.1, textTransform: 'uppercase' },
  logoMark: { borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});