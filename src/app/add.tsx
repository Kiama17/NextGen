import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/form-controls';
import { MotorForm } from '@/components/motor-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMotors } from '@/hooks/use-motors';
import { emptyMotor, type Motor } from '@/lib/motors';

export default function AddMotorScreen() {
  const insets = useSafeAreaInsets();
  const { add } = useMotors();
  const router = useRouter();
  const [motor, setMotor] = useState<Motor>(() => emptyMotor('three-phase'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (!motor.name.trim()) {
      setError('Motor name / ID is required.');
      return;
    }
    setSaving(true);
    try {
      await add(motor);
      router.dismiss();
    } catch (err) {
      setError('Could not save the record. Please try again.');
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Add Motor', headerShown: Platform.OS !== 'web' }} />
      <ThemedView style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <ThemedText type="subtitle">Add a Motor</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Fill in the nameplate and winding details.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.body}>
        <MotorForm value={motor} onChange={setMotor} />
        {error ? (
          <ThemedText type="small" style={{ color: '#d23b3b' }}>
            {error}
          </ThemedText>
        ) : null}
        <Button label={saving ? 'Saving…' : 'Save Motor'} onPress={handleSave} disabled={saving} />
        <ThemedView style={{ height: insets.bottom + Spacing.four }} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
    maxWidth: MaxContentWidth,
    alignSelf: 'stretch',
    width: '100%',
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'stretch',
    width: '100%',
  },
});
