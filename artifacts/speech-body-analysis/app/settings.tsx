import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Header, Screen, SectionLabel } from '@/components/AppUI';
import { useAnalysis } from '@/context/AnalysisContext';
import { useColors } from '@/hooks/useColors';

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { clearHistory } = useAnalysis();
  const [haptics, setHaptics] = useState(true);
  const [reminders, setReminders] = useState(false);
  return (
    <Screen contentStyle={styles.content}>
      <Header title="Settings" subtitle="Make the coach work for you" onBack={() => router.back()} />
      <SectionLabel>Preferences</SectionLabel>
      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SettingRow icon="volume-2" title="Haptic feedback" description="Feel a gentle tap on key actions" value={haptics} onChange={setHaptics} colors={colors} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow icon="bell" title="Practice reminders" description="A nudge to keep your momentum" value={reminders} onChange={setReminders} colors={colors} />
      </View>
      <SectionLabel>Data & privacy</SectionLabel>
      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable style={styles.linkRow}><View style={[styles.linkIcon, { backgroundColor: colors.muted }]}><Feather name="shield" size={17} color={colors.primary} /></View><View style={styles.linkCopy}><Text style={[styles.linkTitle, { color: colors.foreground }]}>Privacy by design</Text><Text style={[styles.linkDescription, { color: colors.mutedForeground }]}>Your sessions stay on this device.</Text></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Pressable onPress={clearHistory} style={styles.linkRow}><View style={[styles.linkIcon, { backgroundColor: colors.muted }]}><Feather name="trash-2" size={17} color={colors.destructive} /></View><View style={styles.linkCopy}><Text style={[styles.linkTitle, { color: colors.foreground }]}>Clear session history</Text><Text style={[styles.linkDescription, { color: colors.mutedForeground }]}>Remove all saved analysis results.</Text></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>
      </View>
      <Text style={[styles.version, { color: colors.mutedForeground }]}>Speech Coach · MVP 1.0</Text>
    </Screen>
  );
}

function SettingRow({ icon, title, description, value, onChange, colors }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; description: string; value: boolean; onChange: (value: boolean) => void; colors: ReturnType<typeof useColors> }) {
  return <View style={styles.settingRow}><View style={[styles.linkIcon, { backgroundColor: colors.muted }]}><Feather name={icon} size={17} color={colors.primary} /></View><View style={styles.linkCopy}><Text style={[styles.linkTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.linkDescription, { color: colors.mutedForeground }]}>{description}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.secondary, true: colors.primary }} thumbColor={colors.foreground} /></View>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22 },
  panel: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, marginBottom: 29 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  linkIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  linkCopy: { flex: 1, marginLeft: 12 },
  linkTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  linkDescription: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  divider: { height: 1 },
  version: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center', marginTop: 18 },
});