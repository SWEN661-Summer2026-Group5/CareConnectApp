import React, { useState } from 'react';
import { Field, PrimaryButton, SecondaryButton } from '../components/ui';
import { makeTask, useAppState } from '../state/AppState';

export interface NewTaskScreenProps {
  onConfirm?: () => void;
  onDiscard?: () => void;
  onOpenMenu?: () => void;
}

export default function NewTaskScreen({
  onConfirm,
  onDiscard,
  onOpenMenu,
}: NewTaskScreenProps) {
  const { addTask } = useAppState();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (title.trim().length === 0) {
      setError('A task title is required.');
      return;
    }
    setError('');
    addTask(
      makeTask({
        id: Date.now().toString(),
        title: title.trim(),
        details: details.trim(),
        dueDate: new Date(),
      }),
    );
    onConfirm?.();
  };

  const discard = () => {
    const dirty = title.trim().length > 0 || details.trim().length > 0;
    if (dirty) {
      const ok = window.confirm(
        'Discard this task?\n\nYour entered details will not be saved.',
      );
      if (!ok) return;
    }
    onDiscard?.();
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <>
      <h1 className="screen-title" tabIndex={-1}>
        Add New Task
      </h1>
      <form onSubmit={onFormSubmit} noValidate>
        <Field
          label="Task Title"
          required
          value={title}
          error={error}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Field
          label="Details (optional)"
          multiline
          value={details}
          onChange={(e) => setDetails(e.target.value)}
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
