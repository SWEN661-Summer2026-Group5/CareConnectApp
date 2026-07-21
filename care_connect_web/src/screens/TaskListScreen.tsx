import { useState } from 'react';
import { Badge, PrimaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import type { Task } from '../state/AppState';
import { formatDueDate } from '../utils/formatDueDate';
import { taskStatus } from '../utils/taskStatus';

export interface TaskListScreenProps {
  onAddTask?: () => void;
  onOpenTask?: (taskId: string) => void;
  onOpenMenu?: () => void;
}

function TaskCard({
  task,
  completed,
  onOpen,
}: {
  task: Task;
  completed?: boolean;
  onOpen?: () => void;
}) {
  const status = taskStatus(task);
  const label = `${task.title}. Due ${formatDueDate(task.dueDate)}. ${
    status.label
  }`;
  return (
    <button
      type="button"
      className={`table-row${completed ? ' table-row--completed' : ''}`}
      aria-label={onOpen ? `${label}. Opens task details` : label}
      onClick={onOpen}
      disabled={completed && !onOpen}
    >
      <span className="table-row__main">
        <span className="table-row__title">{task.title}</span>
        {task.details.length > 0 && (
          <span className="table-row__sub">{task.details}</span>
        )}
      </span>
      <span className="table-row__meta">
        <span className="toolbar__icon" aria-hidden="true">
          🕘
        </span>
        {formatDueDate(task.dueDate)}
      </span>
      <Badge variant={status.variant} icon={status.icon} label={status.label} />
      {onOpen && (
        <span className="table-row__chevron" aria-hidden="true">
          ›
        </span>
      )}
    </button>
  );
}

export default function TaskListScreen({
  onAddTask,
  onOpenTask,
  onOpenMenu,
}: TaskListScreenProps) {
  const { activeTasks, completedTasks, sortTasksAsc, toggleTaskSort } =
    useAppState();
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <>
      <h1 className="screen-title" tabIndex={-1}>
        Tasks
      </h1>

      <div className="row">
        <div className="grow">
          <PrimaryButton label="Add New Task" onClick={() => onAddTask?.()} />
        </div>
        <button
          type="button"
          className="sort-button"
          aria-pressed={sortTasksAsc}
          aria-label={
            sortTasksAsc
              ? 'Sort tasks, currently earliest first. Activates latest first.'
              : 'Sort tasks, currently latest first. Activates earliest first.'
          }
          onClick={toggleTaskSort}
        >
          <span aria-hidden="true">{sortTasksAsc ? '▲' : '▼'}</span>
        </button>
      </div>

      <h2 className="card__label">{`Active (${activeTasks.length})`}</h2>

      {activeTasks.length === 0 ? (
        <p className="empty-state">No active tasks.</p>
      ) : (
        <ul className="table-list">
          {activeTasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} onOpen={() => onOpenTask?.(task.id)} />
            </li>
          ))}
        </ul>
      )}

      {completedTasks.length > 0 && (
        <>
          <button
            type="button"
            className="completed-toggle"
            aria-expanded={showCompleted}
            aria-controls="completed-tasks"
            onClick={() => setShowCompleted((v) => !v)}
          >
            <span>{`${completedTasks.length} Completed`}</span>
            <span aria-hidden="true">{showCompleted ? '▲' : '▼'}</span>
          </button>
          {showCompleted && (
            <ul id="completed-tasks" className="table-list">
              {completedTasks.map((task) => (
                <li key={task.id}>
                  <TaskCard task={task} completed />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <div className="stack-gap" />
      <PrimaryButton
        label="MENU"
        aria-label="Open menu"
        onClick={() => onOpenMenu?.()}
      />
    </>
  );
}
