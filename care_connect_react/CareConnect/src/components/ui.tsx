import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

const TEAL = '#0B7074';

// A filled call-to-action button (mirrors Flutter's ElevatedButton).
export function PrimaryButton({
  label,
  onPress,
  testID,
  accessibilityLabel = label,
  accessibilityHint,
}: {
  label: string;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      testID={testID}
      onPress={onPress}
      style={styles.primary}
    >
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

// An outlined button (mirrors Flutter's OutlinedButton).
export function SecondaryButton({
  label,
  onPress,
  selected,
  testID,
  accessibilityLabel = label,
  accessibilityHint,
}: {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={selected === undefined ? undefined : { selected }}
      testID={testID}
      onPress={onPress}
      style={[styles.secondary, selected && styles.secondarySelected]}
    >
      <Text
        style={[styles.secondaryText, selected && styles.secondarySelectedText]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// A labelled text field.
export function Field({
  label,
  testID,
  ...inputProps
}: { label: string; testID?: string } & TextInputProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.fieldLabel}
      >
        {label}
      </Text>
      <TextInput
        accessible
        accessibilityLabel={inputProps.accessibilityLabel ?? label}
        style={styles.input}
        testID={testID}
        {...inputProps}
      />
    </View>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: TEAL,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondary: {
    borderWidth: 1.5,
    borderColor: TEAL,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondarySelected: { backgroundColor: TEAL, borderColor: TEAL },
  secondaryText: { color: TEAL, fontSize: 16, fontWeight: '600' },
  secondarySelectedText: { color: '#FFFFFF' },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: TEAL,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCD5DC',
    padding: 24,
    marginBottom: 16,
  },
});
