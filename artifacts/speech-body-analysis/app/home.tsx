import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Header, LogoMark, PrimaryButton, Screen, SectionLabel } from '@/components/AppUI';
import { useAnalysis } from '@/context/AnalysisContext';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { history, currentAnalysis } = useAnalysis();
  const latest = currentAnalysis ?? history[0];
  return (
    <Screen contentStyle={styles.content}>
      <Header
        title="Good morning, Hifza"
        subtitle="Ready to sharpen your presence?"
        action={
          <Pressable onPress={() => router.push('/settings')} style={styles.profileButton}>
            <LogoMark small />
          </Pressable>
        }
      />
      <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.heroCopy}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR PRESENCE SCORE</Text>
          <Text style={[styles.score, { color: colors.foreground }]}>{latest?.overallScore ?? 84}</Text>
          <Text style={[styles.scoreCaption, { color: colors.mutedForeground }]}>
            {latest ? 'Your latest analysis is looking strong.' : 'Based on your first practice session.'}
          </Text>
          <Pressable onPress={() => router.push('/results')} style={styles.textLink}>
            <Text style={[styles.textLinkText, { color: colors.primary }]}>View insights</Text>
            <Feather name="arrow-up-right" size={15} color={colors.primary} />
          </Pressable>
        </View>
        <View style={[styles.scoreRing, { borderColor: colors.primary }]}>
          <Ionicons name="sparkles-outline" size={24} color={colors.primary} />
        </View>
      </View>
      <PrimaryButton label="Analyze a presentation" icon="arrow-right" onPress={() => router.push('/analyze')} />
      <View style={styles.spacer} />
      <SectionLabel right={<Pressable onPress={() => router.push('/history')}><Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text></Pressable>}>Recent sessions</SectionLabel>
      {history.length ? (
        <Pressable onPress={() => router.push('/results')} style={[styles.sessionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sessionIcon, { backgroundColor: colors.muted }]}>
            <Feather name={history[0].mode === 'video' ? 'video' : 'mic'} size={18} color={colors.primary} />
          </View>
          <View style={styles.sessionCopy}>
            <Text style={[styles.sessionName, { color: colors.foreground }]} numberOfLines={1}>{history[0].sourceName}</Text>
            <Text style={[styles.sessionDate, { color: colors.mutedForeground }]}>Just now · {history[0].mode === 'video' ? 'Video' : 'Speech'}</Text>
          </View>
          <Text style={[styles.sessionScore, { color: colors.primary }]}>{history[0].overallScore}</Text>
        </Pressable>
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="mic-outline" size={22} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your first session starts here</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Record a short introduction and get your baseline score.</Text>
        </View>
      )}
      <SectionLabel>Quick guide</SectionLabel>
      <View style={styles.guideRow}>
        {[
          ['01', 'Record', 'A 30–90 sec sample'],
          ['02', 'Review', 'Clear AI feedback'],
          ['03', 'Improve', 'Practice with intent'],
        ].map(([number, title, copy]) => (
          <View key={number} style={styles.guideItem}>
            <Text style={[styles.guideNumber, { color: colors.accent }]}>{number}</Text>
            <Text style={[styles.guideTitle, { color: colors.foreground }]}>{title}</Text>
            <Text style={[styles.guideCopy, { color: colors.mutedForeground }]}>{copy}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22 },
  profileButton: { marginRight: -8 },
  hero: { borderRadius: 26, borderWidth: 1, padding: 22, minHeight: 188, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, overflow: 'hidden' },
  heroCopy: { flex: 1 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.3 },
  score: { fontFamily: 'Inter_700Bold', fontSize: 58, letterSpacing: -2, lineHeight: 68, marginTop: 5 },
  scoreCaption: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, maxWidth: 190 },
  scoreRing: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  textLink: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 13 },
  textLinkText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  spacer: { height: 31 },
  seeAll: { fontFamily: 'Inter_600SemiBold', fontSize: 12, textTransform: 'none', letterSpacing: 0 },
  sessionCard: { borderRadius: 18, borderWidth: 1, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  sessionIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sessionCopy: { flex: 1, marginLeft: 12 },
  sessionName: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  sessionDate: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  sessionScore: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  emptyCard: { borderRadius: 18, borderWidth: 1, padding: 20, marginBottom: 28 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginTop: 12 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 5 },
  guideRow: { flexDirection: 'row', gap: 12 },
  guideItem: { flex: 1 },
  guideNumber: { fontFamily: 'Inter_700Bold', fontSize: 11, marginBottom: 8 },
  guideTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  guideCopy: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16, marginTop: 4 },
});