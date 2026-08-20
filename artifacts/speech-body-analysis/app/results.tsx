import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Header, MetricBar, Screen, SectionLabel } from '@/components/AppUI';
import { useAnalysis } from '@/context/AnalysisContext';
import { useColors } from '@/hooks/useColors';

export default function ResultsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { currentAnalysis, deleteSession } = useAnalysis();
  if (!currentAnalysis) {
    return <Screen contentStyle={styles.content}><Header title="Your results" onBack={() => router.replace('/home')} /><Text style={[styles.empty, { color: colors.mutedForeground }]}>Complete an analysis to see your coaching notes.</Text></Screen>;
  }
  const metrics = [
    ['Confidence', currentAnalysis.confidence],
    ['Eye contact', currentAnalysis.eyeContact],
    ['Speech rate', currentAnalysis.speechRate],
    ['Body posture', currentAnalysis.bodyPosture],
    ['Hand gestures', currentAnalysis.handGestures],
  ] as const;
  const handleDelete = async () => {
    try {
      await deleteSession(currentAnalysis);
      router.replace('/home');
    } catch {
      // Keep the result visible if a remote delete is temporarily unavailable.
    }
  };
  return (
    <Screen contentStyle={styles.content}>
      <Header title="Your results" subtitle={currentAnalysis.sourceName} onBack={() => router.replace('/home')} action={<Pressable onPress={() => router.push('/analyze')}><Feather name="plus" size={22} color={colors.foreground} /></Pressable>} />
      <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.scoreRing}>
          <Text style={[styles.score, { color: colors.foreground }]}>{currentAnalysis.overallScore}</Text>
          <Text style={[styles.outOf, { color: colors.mutedForeground }]}>/100</Text>
        </View>
        <View style={styles.scoreCopy}>
          <Text style={[styles.scoreTitle, { color: colors.foreground }]}>Overall presence</Text>
          <Text style={[styles.scoreDescription, { color: colors.mutedForeground }]}>You’re already coming across as composed and credible.</Text>
          <View style={styles.scoreTag}><Ionicons name="trending-up" size={13} color={colors.primary} /><Text style={[styles.scoreTagText, { color: colors.primary }]}>Strong baseline</Text></View>
        </View>
      </View>
      <SectionLabel>Signal breakdown</SectionLabel>
      <View style={[styles.metricsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {metrics.map(([label, metric]) => <MetricBar key={label} label={label} value={metric.score} detail={metric.detail} />)}
      </View>
      <SectionLabel>Three things to try next</SectionLabel>
      <View style={styles.suggestions}>
        {currentAnalysis.suggestions.map((suggestion, index) => (
          <View key={suggestion} style={[styles.suggestion, { backgroundColor: colors.muted }]}>
            <Text style={[styles.suggestionNumber, { color: colors.accent }]}>{String(index + 1).padStart(2, '0')}</Text>
            <Text style={[styles.suggestionText, { color: colors.foreground }]}>{suggestion}</Text>
          </View>
        ))}
      </View>
      <Pressable onPress={() => router.push('/record?mode=video')} style={styles.practiceLink}>
        <Text style={[styles.practiceText, { color: colors.primary }]}>Practice another sample</Text>
        <Feather name="arrow-right" size={16} color={colors.primary} />
      </Pressable>
      <Pressable accessibilityRole="button" onPress={handleDelete} style={styles.deleteButton}>
        <Feather name="trash-2" size={15} color={colors.destructive} />
        <Text style={[styles.deleteText, { color: colors.destructive }]}>Delete my data</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22 },
  scoreCard: { borderWidth: 1, borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  scoreRing: { width: 106, height: 106, borderRadius: 53, borderWidth: 8, borderColor: '#67E8C5', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  score: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -1 },
  outOf: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 13 },
  scoreCopy: { flex: 1, marginLeft: 17 },
  scoreTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  scoreDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 5 },
  scoreTag: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  scoreTagText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  metricsCard: { borderWidth: 1, borderRadius: 22, padding: 18, marginBottom: 28 },
  suggestions: { gap: 9 },
  suggestion: { borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'flex-start' },
  suggestionNumber: { fontFamily: 'Inter_700Bold', fontSize: 11, marginRight: 13, marginTop: 2 },
  suggestionText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19 },
  practiceLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 23 },
  practiceText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center', marginTop: 100 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 25, paddingVertical: 10 },
  deleteText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
});