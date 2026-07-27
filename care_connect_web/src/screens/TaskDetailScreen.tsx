import { Badge, Card, PrimaryButton, SecondaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { formatDueDate } from '../utils/formatDueDate';
import { taskStatus } from '../utils/taskStatus';

export interface TaskDetailScreenProps {
  taskId: string;
  onResolved?: () => void;
  onBack?: () => void;
  onOpenMenu?: () => void;
}

export default function TaskDetailScreen({
  taskId,
  onResolved,
  onBack,
  onOpenMenu,
}: TaskDetailScreenProps) {
  const { tasks, markTaskResolved } = useAppState();
  const task = tasks.find((t) => t.id === taskId);

  const resolve = () => {
    if (!task || task.completed) return;
    // Destructive/important action → explicit confirmation (§3.3.4).
    const ok = window.confirm(
      `Mark task as resolved?\n\n"${task.title}" will be moved to your completed tasks.`,
    );
    if (!ok) return;
    markTaskResolved(task.id);
    onResolved?.();
  };

  if (!task) {
    return (
      <>
        <h1 className="screen-title" tabIndex={-1}>
          Task Details
        </h1>
        <p className="empty-state">Task not found.</p>
        <SecondaryButton label="Back" onClick={() => onBack?.()} />
      </>
    );
  }

  return (
    <>
      <h1 className="screen-title" tabIndex={-1}>
        Task Details
      </h1>

      <Card>
        <h2 className="card__title">{task.title}</h2>
        <p className="card__meta icon-text">
          <span className="toolbar__icon" aria-hidden="true">
            🕘
          </span>
          {`Due: ${formatDueDate(task.dueDate)}`}
        </p>
        {task.details.length > 0 && (
          <p className="card__meta--strong">{task.details}</p>
        )}
        <div className="stack-gap" />
        {(() => {
          const s = taskStatus(task);
          return <Badge variant={s.variant} icon={s.icon} label={s.label} />;
        })()}
      </Card>

      {task.caregiverName.length > 0 && (
        <Card>
          <h2 className="card__label">Caregiver</h2>
          <p className="card__title">{task.caregiverName}</p>
          {task.caregiverPhone.length > 0 && (
            <p className="card__meta icon-text">
              <span className="toolbar__icon" aria-hidden="true">
                📞
              </span>
              {task.caregiverPhone}
            </p>
          )}
          {task.caregiverEmail.length > 0 && (
            <p className="card__meta icon-text">
              <span className="toolbar__icon" aria-hidden="true">
                ✉
              </span>
              {task.caregiverEmail}
            </p>
          )}
        </Card>
      )}

      {/* Focus order per §2.4: Mark as Resolved, then MENU, then Back. */}
      {!task.completed && (
        <PrimaryButton
          label="Mark as Resolved"
          aria-label={`Mark ${task.title} as resolved`}
          onClick={resolve}
        />
      )}
      <PrimaryButton
        label="MENU"
        aria-label="Open menu"
        onClick={() => onOpenMenu?.()}
      />
      <SecondaryButton
        label="Back"
        aria-label="Back to task list"
        onClick={() => onBack?.()}
      />
    </>
  );
}
