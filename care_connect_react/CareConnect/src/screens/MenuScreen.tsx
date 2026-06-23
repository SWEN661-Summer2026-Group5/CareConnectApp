import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SecondaryButton } from '../components/ui';

export interface MenuScreenProps {
  onHome?: () => void;
  onTasks?: () => void;
  onContacts?: () => void;
  onOptions?: () => void;
  onSignOut?: () => void;
}

function MenuButton({
  label,
  onPress,
  testID,
  accessibilityHint,
}: {
  label: string;
  onPress?: () => void;
  testID?: string;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      testID={testID}
      onPress={onPress}
      style={styles.menuButton}
    >
      <Text style={styles.menuLabel}>{label}</Text>
    </Pressable>
  );
}

export default function MenuScreen({
  onHome,
  onTasks,
  onContacts,
  onOptions,
  onSignOut,
}: MenuScreenProps) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Menu
      </Text>
      <MenuButton
        label="Home"
        accessibilityHint="Opens the home screen"
        testID="menu-home"
        onPress={() => onHome?.()}
      />
      <MenuButton
        label="Tasks"
        accessibilityHint="Opens the task list"
        testID="menu-tasks"
        onPress={() => onTasks?.()}
      />
      <MenuButton
        label="Contacts"
        accessibilityHint="Opens the contact list"
        testID="menu-contacts"
        onPress={() => onContacts?.()}
      />
      <MenuButton
        label="Options"
        accessibilityHint="Opens accessibility preferences"
        testID="menu-options"
        onPress={() => onOptions?.()}
      />
      <View style={styles.spacer} />
      <SecondaryButton
        label="Sign Out"
        accessibilityHint="Signs out and returns to the login screen"
        testID="menu-sign-out"
        onPress={() => onSignOut?.()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 24 },
  menuButton: {
    borderWidth: 1.5,
    borderColor: '#0B7074',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  menuLabel: { fontSize: 20, fontWeight: '600', color: '#0B7074' },
  spacer: { height: 16 },
});
