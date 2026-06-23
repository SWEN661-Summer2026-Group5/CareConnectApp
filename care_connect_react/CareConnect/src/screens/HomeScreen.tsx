import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, PrimaryButton, SecondaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { formatDueDate } from '../utils/formatDueDate';

export interface HomeScreenProps {
  onViewTask?: (taskId: string) => void;
  onViewAllTasks?: () => void;
  onOpenMenu?: () => void;
}

export default function HomeScreen({
  onViewTask,
  onViewAllTasks,
  onOpenMenu,
}: HomeScreenProps) {
  const { activeTasks } = useAppState();
  const next = activeTasks.length > 0 ? activeTasks[0] : null;
  const nextUp = activeTasks.length > 1 ? activeTasks[1] : null;

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Home
      </Text>

      {next ? (
        <Card>
          <Text style={styles.label}>Next Task</Text>
          <Text style={styles.taskTitle}>{next.title}</Text>
          <Text style={styles.time}>{formatDueDate(next.dueDate)}</Text>
          <PrimaryButton
            label="View Task"
            accessibilityLabel={`View task: ${next.title}`}
            accessibilityHint="Opens task details"
            testID="home-view-task"
            onPress={() => onViewTask?.(next.id)}
          />
        </Card>
      ) : (
        <Card>
          <Text>No upcoming tasks.</Text>
        </Card>
      )}

      {nextUp && (
        <Card>
          <Text style={styles.label}>Next Up</Text>
          <Text style={styles.taskTitle}>{nextUp.title}</Text>
          <Text style={styles.time}>{formatDueDate(nextUp.dueDate)}</Text>
        </Card>
      )}

      <SecondaryButton
        label="View All Tasks"
        accessibilityHint="Opens the task list"
        testID="home-view-all"
        onPress={() => onViewAllTasks?.()}
      />
      <View style={styles.spacer} />
      <PrimaryButton
        label="MENU"
        accessibilityLabel="Open menu"
        accessibilityHint="Opens the main navigation menu"
        testID="home-menu"
        onPress={() => onOpenMenu?.()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 24 },
  label: { marginBottom: 8 },
  taskTitle: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  time: { color: '#17B5C3', marginBottom: 16 },
  spacer: { height: 16 },
});
