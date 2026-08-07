import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Header, PrimaryButton, Screen } from '@/components/AppUI';
import { useColors } from '@/hooks/useColors';

type Mode = 'speech' | 'video';

export default function AnalysisSelectionScreen() {
  const colors = useColors();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('speech');
  return (
    <Screen contentStyle={styles.content}>
      <Header title="New analysis" subtitle="What would you like to improve?" onBack={() => router.back()} />
      <Text style={[styles.intro, { color: colors.foreground }]}>Choose your focus</Text>
      <Text style={[styles.copy, { color: colors.mutedForeground }]}>We’ll look for the small signals that make a big difference in how you’re perceived.</Text>
      <View style={styles.cards}>
        {[
          { id: 'speech' as Mode, icon: 'mic' as const, title: 'Speech only', description: 'Confidence, pace, clarity, and delivery' },
          { id: 'video' as Mode, icon: 'video' as const, title: 'Speech + body language', description: 'Add eye contact, posture, and gestures' },
        ].map((item) => {
          const selected = mode === item.id;
          return (
            <Pressable key={item.id} onPress={() => setMode(item.id)} style={[styles.option, { backgroundColor: selected ? colors.muted : colors.card, borderColor: selected ? colors.primary : colors.border }]}>
              <View style={[styles.optionIcon, { backgroundColor: selected ? colors.primary : colors.secondary }]}>
                <Feather name={item.icon} size={22} color={selected ? colors.primaryForeground : colors.primary} />
              </View>
              <View style={styles.optionCopy}>
                <Text style={[styles.optionTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.optionDescription, { color: colors.mutedForeground }]}>{item.description}</Text>
              </View>
              <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.mutedForeground }]}>
                {selected ? <View style={[styles.radioDot, { backgroundColor: colors.primary }]} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.bottom}>
        <PrimaryButton label="Continue" icon="arrow-right" onPress={() => router.push({ pathname: '/record', params: { mode } })} />
        <Text style={[styles.privacy, { color: colors.mutedForeground }]}>Your recordings stay private and are only used to generate your feedback.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, flexGrow: 1 },
  intro: { fontFamily: 'Inter_700Bold', fontSize: 20, letterSpacing: -0.3, marginTop: 4 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 330 },
  cards: { gap: 12, marginTop: 28 },
  option: { borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center' },
  optionIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  optionCopy: { flex: 1, marginLeft: 13 },
  optionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  optionDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 4 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  bottom: { marginTop: 'auto', paddingTop: 48 },
  privacy: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 14, paddingHorizontal: 22 },
});