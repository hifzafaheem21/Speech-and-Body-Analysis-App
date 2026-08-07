import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header, PrimaryButton, Screen } from '@/components/AppUI';
import { useAnalysis } from '@/context/AnalysisContext';
import { useColors } from '@/hooks/useColors';

export default function RecordingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { mode = 'speech' } = useLocalSearchParams<{ mode?: string }>();
  const { runAnalysis } = useAnalysis();
  const isVideo = mode === 'video';
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const timer = setTimeout(() => setRecording(false), 3000);
    return () => clearTimeout(timer);
  }, [recording]);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 0.7 });
    if (!result.canceled && result.assets[0]) setSelectedName(result.assets[0].fileName ?? 'presentation-video.mp4');
  };

  const startAnalysis = () => {
    void runAnalysis({ mode: isVideo ? 'video' : 'speech', sourceName: selectedName ?? (isVideo ? 'Camera presentation' : 'Voice practice') });
    router.replace('/loading');
  };

  return (
    <Screen contentStyle={styles.content}>
      <Header title={isVideo ? 'Capture your presence' : 'Capture your voice'} subtitle="A short sample is all we need" onBack={() => router.back()} />
      <View style={[styles.visual, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.visualCircle, { backgroundColor: colors.muted }]}>
          <Ionicons name={isVideo ? 'videocam-outline' : 'mic-outline'} size={42} color={colors.primary} />
        </View>
        <Text style={[styles.visualTitle, { color: colors.foreground }]}>{recording ? 'Listening…' : selectedName ?? (isVideo ? 'Add a video' : 'Start speaking')}</Text>
        <Text style={[styles.visualCopy, { color: colors.mutedForeground }]}>{recording ? 'Take your time. We’ll analyze the full signal.' : isVideo ? 'Upload a recent presentation or use a practice clip.' : 'Share a 30–90 second answer, pitch, or introduction.'}</Text>
        {recording ? <View style={[styles.recordingPulse, { backgroundColor: colors.accent }]} /> : null}
      </View>
      <View style={styles.actions}>
        {isVideo ? (
          <>
            <PrimaryButton label="Choose video" icon="upload" onPress={pickVideo} />
            <Pressable onPress={() => setSelectedName('Camera presentation')} style={[styles.secondaryAction, { borderColor: colors.border }]}>
              <Feather name="camera" size={18} color={colors.primary} />
              <Text style={[styles.secondaryActionText, { color: colors.foreground }]}>Use camera</Text>
            </Pressable>
          </>
        ) : (
          <PrimaryButton label={recording ? 'Recording sample…' : 'Record sample'} icon="mic" onPress={() => setRecording(true)} disabled={recording} />
        )}
      </View>
      <View style={[styles.tip, { backgroundColor: colors.muted }]}>
        <Feather name="info" size={16} color={colors.primary} />
        <Text style={[styles.tipText, { color: colors.mutedForeground }]}>For the most useful feedback, choose a natural sample instead of reading a script.</Text>
      </View>
      <View style={styles.bottom}>
        <PrimaryButton label="Analyze now" icon="arrow-right" onPress={startAnalysis} disabled={isVideo && !selectedName} />
        <Text style={[styles.fileHint, { color: colors.mutedForeground }]}>{selectedName ? 'Ready to analyze' : isVideo ? 'Select a video to continue' : 'You can also start with a sample recording'}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, flexGrow: 1 },
  visual: { borderWidth: 1, borderRadius: 28, minHeight: 290, alignItems: 'center', justifyContent: 'center', padding: 30, marginTop: 8 },
  visualCircle: { width: 104, height: 104, borderRadius: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  visualTitle: { fontFamily: 'Inter_700Bold', fontSize: 19, textAlign: 'center' },
  visualCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 8, maxWidth: 260 },
  recordingPulse: { width: 7, height: 7, borderRadius: 4, marginTop: 16 },
  actions: { gap: 12, marginTop: 18 },
  secondaryAction: { minHeight: 52, borderWidth: 1, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  secondaryActionText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  tip: { borderRadius: 16, padding: 14, flexDirection: 'row', gap: 10, marginTop: 18 },
  tipText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  bottom: { marginTop: 'auto', paddingTop: 32 },
  fileHint: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center', marginTop: 11 },
});