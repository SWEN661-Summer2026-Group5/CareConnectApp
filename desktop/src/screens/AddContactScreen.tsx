import React, { useState } from 'react';
import { Field, PrimaryButton, SecondaryButton } from '../components/ui';
import { makeContact, useAppState } from '../state/AppState';
import { useConfirm } from '../components/ConfirmProvider';
import { useScreenActions } from '../navigation/screenActions';

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
  const confirmDialog = useConfirm();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (name.trim().length === 0) {
      setError('A contact name is required.');
      return;
    }
    setError('');
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

  const discard = async () => {
    const dirty =
      name.trim() || role.trim() || phone.trim() || email.trim();
    if (dirty) {
      const ok = await confirmDialog({
        title: 'Discard this contact?',
        message: 'Your entered details will not be saved.',
        confirmLabel: 'Discard',
        cancelLabel: 'Keep Editing',
        destructive: true,
      });
      if (!ok) return;
    }
    onDiscard?.();
  };

  useScreenActions({ onSave: submit }, [name, role, phone, email]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <>
      <h1 className="screen-title" tabIndex={-1}>
        Add Contact
      </h1>
      <form onSubmit={onFormSubmit} noValidate>
        <Field
          label="Contact Name"
          required
          value={name}
          error={error}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Role (optional)"
          placeholder="Doctor, Nurse, etc."
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Field
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Field
          label="Email Address"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PrimaryButton label="Confirm" type="submit" />
      </form>
      <SecondaryButton label="Discard Changes" onClick={discard} />
      <PrimaryButton
        label="MENU"
        aria-label="Open menu"
        onClick={() => onOpenMenu?.()}
      />
    </>
  );
}
