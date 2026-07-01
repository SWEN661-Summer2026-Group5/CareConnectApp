import type { Task } from '../state/AppState';
import type { BadgeVariant } from '../components/ui';

export interface TaskStatus {
  variant: BadgeVariant;
  icon: string;
  label: string;
}

/**
 * Maps a task to one of the three status badges from the style guide. Meaning is
 * carried by the label text and icon as well as colour, so it never depends on
 * colour perception alone (WCAG 1.4.1).
 *   - Completed → Active (green, ✓)
 *   - Past due  → High Priority (red, ⚠)
 *   - Upcoming  → Follow-up (orange, ♥)
 */
export function taskStatus(task: Task): TaskStatus {
  if (task.completed) {
    return { variant: 'active', icon: '✓', label: 'Completed' };
  }
  if (task.dueDate.getTime() < Date.now()) {
    return { variant: 'priority', icon: '⚠', label: 'High Priority' };
  }
  return { variant: 'followup', icon: '♥', label: 'Follow-up' };
}
