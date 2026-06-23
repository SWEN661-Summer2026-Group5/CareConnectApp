import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Field, PrimaryButton, SecondaryButton } from '../components/ui';
import { makeContact, useAppState } from '../state/AppState';

export interface AddContactScreenProps {
  onConfirm?: () => void;
  onDiscard?: () => void;
  onOpenMenu?: () => void;
}

export default function AddContactScreen({
  onConfirm,
  onDiscard,
  onOpenMenu,
}: AddContactScreenProps) {
  const { addContact } = useAppState();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Mirrors contacts.dart _confirm: an empty name is a no-op.
  const confirm = () => {
    if (name.trim().length === 0) {
      return;
    }
    addContact(
      makeContact({
        id: Date.now().toString(),
        name: name.trim(),
        role: role.trim(),
        phone: phone.trim(),
        email: email.trim(),
      }),
    );
    onConfirm?.();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Add Contact
      </Text>
      <Field
        label="Contact Name"
        testID="add-contact-name"
        value={name}
        accessibilityHint="Enter the contact's full name"
        onChangeText={setName}
      />
      <Field
        label="Role (optional)"
        testID="add-contact-role"
        placeholder="Doctor, Nurse, etc."
        value={role}
        accessibilityHint="Enter the contact's role if known"
        onChangeText={setRole}
      />
      <Field
        label="Phone Number"
        testID="add-contact-phone"
        placeholder="(555) 123-4567"
        keyboardType="phone-pad"
        value={phone}
        accessibilityHint="Enter the contact's phone number"
        onChangeText={setPhone}
      />
      <Field
        label="Email Address"
        testID="add-contact-email"
        placeholder="email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        accessibilityHint="Enter the contact's email address"
        onChangeText={setEmail}
      />
      <PrimaryButton
        label="Confirm"
        accessibilityLabel="Confirm new contact"
        accessibilityHint="Adds this contact to the contact list"
        testID="add-contact-confirm"
        onPress={confirm}
      />
      <SecondaryButton
        label="Discard Changes"
        accessibilityHint="Returns without adding this contact"
        testID="add-contact-discard"
        onPress={() => onDiscard?.()}
      />
      <PrimaryButton
        label="MENU"
        accessibilityLabel="Open menu"
        accessibilityHint="Opens the main navigation menu"
        testID="add-contact-menu"
        onPress={() => onOpenMenu?.()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 24 },
});
