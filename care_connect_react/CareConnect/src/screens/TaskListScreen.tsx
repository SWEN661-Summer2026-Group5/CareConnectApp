import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {PrimaryButton} from '../components/ui';
import {useAppState, Task} from '../state/AppState';
import {formatDueDate} from '../utils/formatDueDate';

export interface TaskListScreenProps {
  onAddTask?: () => void;
  onOpenTask?: (taskId: string) => void;
  onOpenMenu?: () => void;
}

function TaskCard({
  task,
  muted,
  onPress,
  testID,
}: {
  task: Task;
  muted?: boolean;
  onPress?: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      style={styles.taskCard}>
      <Text style={[styles.taskTitle, muted && styles.muted]}>{task.title}</Text>
      <Text style={[styles.taskTime, muted && styles.muted]}>
        {formatDueDate(task.dueDate)}
      </Text>
    </Pressable>
  );
}

export default function TaskListScreen({
  onAddTask,
  onOpenTask,
  onOpenMenu,
}: TaskListScreenProps) {
  const {activeTasks, completedTasks, sortTasksAsc, toggleTaskSort} =
    useAppState();
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      <View style={styles.row}>
        <View style={styles.flex}>
          <PrimaryButton
            label="Add New Task"
            testID="tasks-add"
            onPress={() => onAddTask?.()}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{selected: sortTasksAsc}}
          testID="tasks-sort"
          onPress={toggleTaskSort}
          style={styles.sortButton}>
          <Text>{sortTasksAsc ? '▲' : '▼'}</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>{`Active (${activeTasks.length})`}</Text>

      <ScrollView>
        {activeTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            testID={`task-card-${task.id}`}
            onPress={() => onOpenTask?.(task.id)}
          />
        ))}

        {completedTasks.length > 0 && (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{expanded: showCompleted}}
              testID="tasks-completed-toggle"
              onPress={() => setShowCompleted(v => !v)}
              style={styles.completedToggle}>
              <Text>{`${completedTasks.length} Completed`}</Text>
            </Pressable>
            {showCompleted &&
              completedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  muted
                  testID={`task-card-${task.id}`}
                />
              ))}
          </>
        )}
      </ScrollView>

      <PrimaryButton label="MENU" testID="tasks-menu" onPress={() => onOpenMenu?.()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24},
  title: {fontSize: 28, fontWeight: '600', marginBottom: 16},
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  flex: {flex: 1, marginRight: 12},
  sortButton: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#0B7074',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {marginBottom: 8},
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCD5DC',
    padding: 16,
    marginBottom: 12,
  },
  taskTitle: {fontSize: 20, fontWeight: '600', marginBottom: 4},
  taskTime: {color: '#17B5C3'},
  muted: {color: 'rgba(26,43,51,0.45)', textDecorationLine: 'line-through'},
  completedToggle: {
    borderWidth: 1,
    borderColor: '#CCD5DC',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
});
