import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Field, PrimaryButton, SecondaryButton} from '../components/ui';
import {makeTask, useAppState} from '../state/AppState';

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
  const {addTask} = useAppState();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  // Mirrors tasks.dart _confirm: an empty title is a no-op.
  const confirm = () => {
    if (title.trim().length === 0) {
      return;
    }
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Task</Text>
      <Field
        label="Task Title"
        testID="new-task-title"
        value={title}
        onChangeText={setTitle}
      />
      <Field
        label="Details (optional)"
        testID="new-task-details"
        value={details}
        onChangeText={setDetails}
        multiline
      />
      <PrimaryButton label="Confirm" testID="new-task-confirm" onPress={confirm} />
      <SecondaryButton
        label="Discard Changes"
        testID="new-task-discard"
        onPress={() => onDiscard?.()}
      />
      <PrimaryButton
        label="MENU"
        testID="new-task-menu"
        onPress={() => onOpenMenu?.()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 24},
  title: {fontSize: 28, fontWeight: '600', marginBottom: 24},
});
