import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Header, PrimaryButton, Screen, SectionLabel } from '@/components/AppUI';
import { useAnalysis } from '@/context/AnalysisContext';
import { useColors } from '@/hooks/useColors';

export default function HistoryScreen() {
  const colors = useColors();
  const router = useRouter();
  const { history, selectAnalysis } = useAnalysis();
  return (
    <Screen contentStyle={styles.content}>
      <Header title="History" subtitle="Your progress over time" onBack={() => router.back()} />
      <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>SESSIONS COMPLETED</Text><Text style={[styles.summaryValue, { color: colors.foreground }]}>{history.length}</Text></View>
        <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
        <View><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>AVERAGE SCORE</Text><Text style={[styles.summaryValue, { color: colors.primary }]}>{history.length ? Math.round(history.reduce((sum, item) => sum + item.overallScore, 0) / history.length) : '—'}</Text></View>
      </View>
      <SectionLabel>All sessions</SectionLabel>
      {history.length ? history.map((item) => (
        <Pressable key={item.id} onPress={() => { selectAnalysis(item); router.push('/results'); }} style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.itemIcon, { backgroundColor: colors.muted }]}><Ionicons name={item.mode === 'video' ? 'videocam-outline' : 'mic-outline'} size={19} color={colors.primary} /></View>
          <View style={styles.itemCopy}><Text style={[styles.itemTitle, { color: colors.foreground }]} numberOfLines={1}>{item.sourceName}</Text><Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>{new Date(item.createdAt).toLocaleDateString()} · {item.mode === 'video' ? 'Video' : 'Speech'}</Text></View>
          <Text style={[styles.itemScore, { color: colors.primary }]}>{item.overallScore}</Text><Feather name="chevron-right" size={17} color={colors.mutedForeground} />
        </Pressable>
      )) : (
        <View style={styles.empty}><Ionicons name="time-outline" size={28} color={colors.mutedForeground} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>No sessions yet</Text><Text style={[styles.emptyCopy, { color: colors.mutedForeground }]}>Your analyzed presentations will appear here.</Text><PrimaryButton label="Start first analysis" icon="arrow-right" onPress={() => router.push('/analyze')} /></View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22 },
  summary: { borderWidth: 1, borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 28 },
  summaryLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1 },
  summaryValue: { fontFamily: 'Inter_700Bold', fontSize: 29, marginTop: 7 },
  summaryDivider: { width: 1, height: 42 },
  item: { borderWidth: 1, borderRadius: 18, padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  itemIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  itemCopy: { flex: 1, marginLeft: 12 },
  itemTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  itemMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  itemScore: { fontFamily: 'Inter_700Bold', fontSize: 18, marginRight: 13 },
  empty: { alignItems: 'center', paddingTop: 68, paddingHorizontal: 24 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 14 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 24 },
});