import type { ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <ThemedView type="backgroundElement" style={styles.sectionBody}>
        {children}
      </ThemedView>
    </View>
  );
}

export function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <ThemedText type="small">{label}</ThemedText>
        {required ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.required}>
            *
          </ThemedText>
        ) : null}
      </View>
      {children}
      {hint ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

export function TextField({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'number-pad' | 'decimal-pad' | 'email-address';
  multiline?: boolean;
}) {
  const theme = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textSecondary}
      keyboardType={keyboardType}
      multiline={multiline}
      style={[
        styles.input,
        {
          color: theme.text,
          backgroundColor: theme.background,
          borderColor: theme.backgroundSelected,
        },
        multiline && styles.inputMultiline,
      ]}
    />
  );
}

export function OptionGroup<T extends string>({
  value,
  onValueChange,
  options,
}: {
  value: T;
  onValueChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const theme = useTheme();
  return (
    <View style={styles.optionRow}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: selected ? theme.backgroundSelected : theme.background,
                borderColor: selected ? theme.text : theme.backgroundSelected,
              },
              pressed && styles.pressed,
            ]}
            onPress={() => onValueChange(opt.value)}>
            <ThemedText type="small" style={!selected && { color: theme.textSecondary }}>
              {opt.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  destructive,
  disabled,
  bordered,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  destructive?: boolean;
  disabled?: boolean;
  bordered?: boolean;
}) {
  const theme = useTheme();
  const primary = variant === 'primary' && !destructive;
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        primary && { backgroundColor: theme.text },
        destructive && { backgroundColor: '#d23b3b' },
        bordered && {
          borderWidth: 1,
          borderColor: theme.backgroundSelected,
          backgroundColor: 'transparent',
        },
        disabled && styles.buttonDisabled,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <ThemedText
        type="smallBold"
        style={{ color: destructive ? '#fff' : primary ? theme.background : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function CardRow({
  title,
  subtitle,
  right,
  onPress,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      disabled={!onPress}
      onPress={onPress}>
      <View style={styles.cardBody}>
        <ThemedText type="smallBold">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {right ? (
        <View style={styles.cardRight}>
          <ThemedText type="small" themeColor="textSecondary">
            {right}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );
}

export function StatBadge({ label, value }: { label: string; value: ReactNode }) {
  const theme = useTheme();
  return (
    <ThemedView type="backgroundElement" style={styles.stat}>
      <ThemedText type="title" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </ThemedView>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.empty}>
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        {title}
      </ThemedText>
      {hint ? <ThemedText themeColor="textSecondary">{hint}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two },
  sectionTitle: { textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionBody: { gap: Spacing.three, padding: Spacing.three, borderRadius: Spacing.three },
  field: { gap: Spacing.one },
  labelRow: { flexDirection: 'row', gap: Spacing.half, alignItems: 'center' },
  required: { fontSize: 14 },
  hint: { marginTop: Spacing.half },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    minHeight: 44,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  optionRow: { flexDirection: 'row', gap: Spacing.two },
  option: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignItems: 'center',
  },
  button: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  pressed: { opacity: 0.7 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    borderRadius: Spacing.two,
    minHeight: 56,
  },
  cardBody: { flex: 1, gap: Spacing.half },
  cardRight: { alignItems: 'flex-end' },
  stat: { flex: 1, borderRadius: Spacing.two, padding: Spacing.three, alignItems: 'center', gap: Spacing.one },
  statValue: { fontSize: 32 },
  empty: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.six },
  emptyTitle: { textAlign: 'center' },
});
