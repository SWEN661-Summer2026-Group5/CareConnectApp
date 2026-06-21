import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SecondaryButton} from '../components/ui';

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
}: {
  label: string;
  onPress?: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      style={styles.menuButton}>
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
      <Text style={styles.title}>Menu</Text>
      <MenuButton label="Home" testID="menu-home" onPress={() => onHome?.()} />
      <MenuButton label="Tasks" testID="menu-tasks" onPress={() => onTasks?.()} />
      <MenuButton
        label="Contacts"
        testID="menu-contacts"
        onPress={() => onContacts?.()}
      />
      <MenuButton
        label="Options"
        testID="menu-options"
        onPress={() => onOptions?.()}
      />
      <View style={styles.spacer} />
      <SecondaryButton
        label="Sign Out"
        testID="menu-sign-out"
        onPress={() => onSignOut?.()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24},
  title: {fontSize: 28, fontWeight: '600', marginBottom: 24},
  menuButton: {
    borderWidth: 1.5,
    borderColor: '#0B7074',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  menuLabel: {fontSize: 20, fontWeight: '600', color: '#0B7074'},
  spacer: {height: 16},
});
