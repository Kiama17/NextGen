import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, EmptyState, Section } from '@/components/form-controls';
import { MotorForm } from '@/components/motor-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMotors } from '@/hooks/use-motors';
import type { Motor, WindingInfo } from '@/lib/motors';

function describeType(type: 'single-phase' | 'three-phase') {
  return type === 'single-phase' ? 'Single-Phase' : 'Three-Phase';
}

type SpecRow = { label: string; value: string };

function windingRows(w?: WindingInfo, extra?: SpecRow[]): SpecRow[] {
  if (!w) return [];
  const rows: SpecRow[] = [
    { label: 'Pitch', value: w.pitch || '–' },
    { label: 'Turns', value: w.turns || '–' },
    { label: 'SWG', value: w.swg || '–' },
    { label: 'Connection', value: w.connection || '–' },
  ];
  if (w.coils) rows.push({ label: 'Coils', value: w.coils });
  if (w.wireDiameter) rows.push({ label: 'Wire Ø (mm)', value: w.wireDiameter });
  if (extra) rows.push(...extra);
  return rows;
}

export default function MotorDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, update, remove } = useMotors();
  const stored = id ? getById(id) : undefined;

  const initial = useMemo<Motor | null>(() => stored ?? null, [stored]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Motor | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!initial) {
    return (
      <ThemedView style={styles.container}>
        <EmptyState title="Motor not found" hint="It may have been deleted." />
        <Button label="Back" bordered onPress={() => router.back()} />
      </ThemedView>
    );
  }

  const motor = editing && draft ? draft : initial;

  const startEdit = () => {
    setDraft({ ...initial });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!draft) return;
    setError(null);
    if (!draft.name.trim()) {
      setError('Motor name / ID is required.');
      return;
    }
    setSaving(true);
    try {
      await update(draft);
      setEditing(false);
      setDraft(null);
    } catch {
      setError('Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete motor', `Delete “${initial.name || 'this motor'}”? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await remove(initial.id);
          router.back();
        },
      },
    ]);
  };

  const basicRows: SpecRow[] = [
    { label: 'Type', value: describeType(initial.type) },
    { label: 'HP', value: initial.hp || '–' },
    { label: 'kW', value: initial.kw || '–' },
    { label: 'Voltage', value: initial.voltage ? `${initial.voltage} V` : '–' },
    { label: 'Current', value: initial.current ? `${initial.current} A` : '–' },
    { label: 'RPM', value: initial.rpm || '–' },
    { label: 'Frequency', value: initial.frequency ? `${initial.frequency} Hz` : '–' },
    { label: 'Manufacturer', value: initial.manufacturer || '–' },
    { label: 'Model', value: initial.model || '–' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: initial.name || 'Motor', headerShown: Platform.OS !== 'web' }} />
      <ThemedView style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <ThemedText type="subtitle">{initial.name || 'Untitled motor'}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {describeType(initial.type)}
          {initial.manufacturer ? ` · ${initial.manufacturer}` : ''}
        </ThemedText>
      </ThemedView>

      {editing ? (
        <ThemedView style={styles.body}>
          <MotorForm value={motor} onChange={setDraft} />
          {error ? (
            <ThemedText type="small" style={{ color: '#d23b3b' }}>
              {error}
            </ThemedText>
          ) : null}
          <View style={styles.row}>
            <View style={styles.flex}>
              <Button label={saving ? 'Saving…' : 'Save'} onPress={handleSave} disabled={saving} />
            </View>
            <View style={styles.flex}>
              <Button label="Cancel" bordered onPress={cancelEdit} />
            </View>
          </View>
        </ThemedView>
      ) : (
        <ThemedView style={styles.body}>
          <Section title="Specification">
            <SpecTable rows={basicRows} />
          </Section>

          <Section title="Running winding">
            <SpecTable rows={windingRows(initial.runningWinding)} />
          </Section>

          {initial.type === 'single-phase' && initial.startingWinding ? (
            <Section title="Starting winding">
              <SpecTable rows={windingRows(initial.startingWinding)} />
            </Section>
          ) : null}

          {initial.type === 'three-phase' && initial.threePhaseWinding ? (
            <Section title="Three-phase winding">
              <SpecTable
                rows={windingRows(initial.threePhaseWinding, [
                  { label: 'Coil groups', value: initial.threePhaseWinding.coilGroups || '–' },
                  { label: 'Slots', value: initial.threePhaseWinding.slots || '–' },
                ])}
              />
            </Section>
          ) : null}

          {initial.notes ? (
            <Section title="Notes">
              <ThemedText type="small">{initial.notes}</ThemedText>
            </Section>
          ) : null}

          <View style={styles.row}>
            <View style={styles.flex}>
              <Button label="Edit" onPress={startEdit} />
            </View>
            <View style={styles.flex}>
              <Button label="Delete" destructive onPress={handleDelete} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Button label="Search" bordered onPress={() => router.push('/search')} />
            </View>
            <View style={styles.flex}>
              <Button label="Back" bordered onPress={() => router.back()} />
            </View>
          </View>
        </ThemedView>
      )}

      <ThemedView style={{ height: insets.bottom + Spacing.four }} />
    </ThemedView>
  );
}

function SpecTable({ rows }: { rows: SpecRow[] }) {
  return (
    <View style={{ gap: Spacing.two }}>
      {rows.map((r) => (
        <View key={r.label} style={localStyles.row}>
          <ThemedText type="small" themeColor="textSecondary" style={localStyles.label}>
            {r.label}
          </ThemedText>
          <ThemedText type="smallBold" style={localStyles.value}>
            {r.value}
          </ThemedText>
        </View>
      ))}
    </View>
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
  row: { flexDirection: 'row', gap: Spacing.three },
  flex: { flex: 1 },
});

const localStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { flex: 1 },
  value: { flex: 1, textAlign: 'right' },
});
