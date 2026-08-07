import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/AppUI';
import { useAnalysis } from '@/context/AnalysisContext';
import { useColors } from '@/hooks/useColors';

export default function LoadingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isAnalyzing, currentAnalysis, error } = useAnalysis();
  useEffect(() => {
    if (!isAnalyzing && currentAnalysis) router.replace('/results');
  }, [currentAnalysis, isAnalyzing, router]);
  useEffect(() => {
    if (!isAnalyzing && error) router.replace('/record');
  }, [error, isAnalyzing, router]);
  return (
    <Screen scroll={false} contentStyle={styles.content}>
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.spinner, { borderColor: colors.border }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Reading your signals</Text>
        <Text style={[styles.copy, { color: colors.mutedForeground }]}>We’re looking at the moments that shape how you come across.</Text>
        <View style={styles.steps}>
          {['Listening for delivery', 'Mapping presence cues', 'Preparing your coaching notes'].map((step, index) => (
            <View key={step} style={styles.step}>
              <View style={[styles.stepDot, { backgroundColor: index === 0 ? colors.primary : colors.muted }]} />
              <Text style={[styles.stepText, { color: colors.mutedForeground }]}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  spinner: { width: 112, height: 112, borderRadius: 56, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: -0.4, textAlign: 'center' },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 9, maxWidth: 290 },
  steps: { alignSelf: 'stretch', marginTop: 42, gap: 17 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepDot: { width: 8, height: 8, borderRadius: 4 },
  stepText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
});