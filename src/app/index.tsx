import { useRouter } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, CardRow, EmptyState, StatBadge } from '@/components/form-controls';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useMotors } from '@/hooks/use-motors';
import { useTheme } from '@/hooks/use-theme';

function describeType(type: 'single-phase' | 'three-phase') {
  return type === 'single-phase' ? 'Single-Phase' : 'Three-Phase';
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { motors, loading } = useMotors();

  const singles = motors.filter((m) => m.type === 'single-phase').length;
  const threes = motors.filter((m) => m.type === 'three-phase').length;
  const recent = motors.slice(0, 5);

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={[styles.header, { paddingTop: insets.top + Spacing.four, backgroundColor: theme.background }]}>
        <ThemedView style={styles.headerRow}>
          <ThemedView>
            <ThemedText type="subtitle">NextGen</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Motor winding records
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.statRow}>
          <StatBadge label="Single-Phase" value={loading && singles === 0 ? '–' : singles} />
          <StatBadge label="Three-Phase" value={loading && threes === 0 ? '–' : threes} />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.actionsRow}>
        <Button label="+ Add Motor" onPress={() => router.push('/add')} />
        <Button label="Search" bordered onPress={() => router.push('/search')} />
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.recentSection}>
        <ThemedText type="smallBold" style={styles.recentTitle}>
          Recent motor records
        </ThemedText>

        {loading && motors.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.muted}>
            Loading…
          </ThemedText>
        ) : recent.length === 0 ? (
          <EmptyState title="No motors yet" hint="Tap “Add Motor” to create the first record." />
        ) : (
          recent.map((m) => (
            <CardRow
              key={m.id}
              title={m.name || 'Untitled motor'}
              subtitle={`${describeType(m.type)} · ${m.hp ? m.hp + ' HP' : '–'} · ${m.rpm ? m.rpm + ' RPM' : '–'}`}
              right={m.manufacturer || '–'}
              onPress={() => router.push({ pathname: `/motor/${m.id}` })}
            />
          ))
        )}
      </ThemedView>

      {Platform.OS === 'web' ? <ThemedView style={{ height: Spacing.six }} /> : null}
      <ThemedView style={{ height: BottomTabInset + Spacing.three }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.four, paddingBottom: Spacing.three, gap: Spacing.three },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statRow: { flexDirection: 'row', gap: Spacing.three, maxWidth: MaxContentWidth, alignSelf: 'stretch' },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  recentSection: { margin: Spacing.four, padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.two },
  recentTitle: { textTransform: 'uppercase', letterSpacing: 0.5 },
  muted: { paddingVertical: Spacing.two },
});
