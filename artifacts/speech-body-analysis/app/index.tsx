import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { LogoMark } from '@/components/AppUI';

export default function SplashScreen() {
  const colors = useColors();
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/home'), 1400);
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require('../assets/images/speech-coach-icon.png')} style={styles.icon} />
      <LogoMark />
      <Text style={[styles.title, { color: colors.foreground }]}>Speak with presence.</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Your private AI presentation coach</Text>
      <View style={[styles.dot, { backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 29, letterSpacing: -0.8, marginTop: 20, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, marginTop: 10, textAlign: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 36 },
});