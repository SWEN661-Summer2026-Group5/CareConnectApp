import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Card, PrimaryButton} from '../components/ui';
import {useAppState} from '../state/AppState';
import {formatDueDate} from '../utils/formatDueDate';

export interface TaskDetailScreenProps {
  taskId: string;
  onResolved?: () => void;
  onOpenMenu?: () => void;
}

export default function TaskDetailScreen({
  taskId,
  onResolved,
  onOpenMenu,
}: TaskDetailScreenProps) {
  const {tasks, markTaskResolved} = useAppState();
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text testID="task-not-found">Task not found.</Text>
      </View>
    );
  }

  const resolve = () => {
    markTaskResolved(task.id);
    onResolved?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Details</Text>

      <Card>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.meta}>{`Due: ${formatDueDate(task.dueDate)}`}</Text>
        {task.details.length > 0 && (
          <Text style={styles.meta}>{task.details}</Text>
        )}
      </Card>

      {task.caregiverName.length > 0 && (
        <Card>
          <Text style={styles.label}>Caregiver</Text>
          <Text style={styles.taskTitle}>{task.caregiverName}</Text>
          {task.caregiverPhone.length > 0 && (
            <Text style={styles.meta}>{task.caregiverPhone}</Text>
          )}
          {task.caregiverEmail.length > 0 && (
            <Text style={styles.meta}>{task.caregiverEmail}</Text>
          )}
        </Card>
      )}

      <View style={styles.spacer} />

      {!task.completed && (
        <PrimaryButton
          label="Mark as Resolved"
          testID="task-resolve"
          onPress={resolve}
        />
      )}
      <PrimaryButton label="MENU" testID="task-menu" onPress={() => onOpenMenu?.()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24},
  title: {fontSize: 28, fontWeight: '600', marginBottom: 24},
  taskTitle: {fontSize: 20, fontWeight: '600', marginBottom: 8},
  label: {marginBottom: 8},
  meta: {color: '#17B5C3', marginBottom: 4},
  spacer: {flex: 1},
});
