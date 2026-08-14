import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardRow, EmptyState, Field, OptionGroup } from '@/components/form-controls';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMotors } from '@/hooks/use-motors';
import { useTheme } from '@/hooks/use-theme';
import type { MotorType } from '@/lib/motors';

type TypeFilter = 'any' | MotorType;

function describeType(type: MotorType) {
  return type === 'single-phase' ? 'Single-Phase' : 'Three-Phase';
}

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { motors } = useMotors();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('any');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return motors.filter((m) => {
      if (typeFilter !== 'any' && m.type !== typeFilter) return false;
      if (!q) return true;
      const hay = [
        m.name,
        m.manufacturer,
        m.model,
        m.hp,
        m.rpm,
        m.voltage,
        m.current,
        m.frequency,
        `${m.type}`,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [motors, query, typeFilter]);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Search', headerShown: Platform.OS !== 'web' }} />
      <ThemedView style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <ThemedText type="subtitle">Search motors</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          By ID, HP, RPM, manufacturer, type or voltage.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.body}>
        <ThemedView type="backgroundElement" style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="e.g. 1440 RPM, 5 HP, Siemens…"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            returnKeyType="search"
          />
          <Field label="Type">
            <OptionGroup<TypeFilter>
              value={typeFilter}
              onValueChange={setTypeFilter}
              options={[
                { value: 'any', label: 'Any' },
                { value: 'single-phase', label: 'Single' },
                { value: 'three-phase', label: 'Three' },
              ]}
            />
          </Field>
        </ThemedView>

        <ThemedView style={styles.resultsHeader}>
          <ThemedText type="smallBold">
            {query || typeFilter !== 'any' ? `${results.length} result(s)` : 'All motors'}
          </ThemedText>
        </ThemedView>

        {results.length === 0 ? (
          <EmptyState title="No matches" hint="Try a different search term or filter." />
        ) : (
          results.map((m) => (
            <CardRow
              key={m.id}
              title={m.name || 'Untitled motor'}
              subtitle={`${describeType(m.type)} · ${m.hp ? m.hp + ' HP' : '–'} · ${m.rpm ? m.rpm + ' RPM' : '–'}`}
              right={m.manufacturer || '–'}
              onPress={() => router.push({ pathname: `/motor/${m.id}` })}
            />
          ))
        )}
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
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'stretch',
    width: '100%',
  },
  searchBox: { gap: Spacing.three, padding: Spacing.three, borderRadius: Spacing.three },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    minHeight: 44,
  },
  resultsHeader: { paddingHorizontal: Spacing.two, paddingTop: Spacing.two },
});
