import { Badge, Card, PrimaryButton, SecondaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { formatDueDate } from '../utils/formatDueDate';
import { taskStatus } from '../utils/taskStatus';

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
    <>
      <h1 className="screen-title" tabIndex={-1}>
        Home
      </h1>

      {next ? (
        <Card>
          <h2 className="card__label">Next Task</h2>
          <p className="card__title">{next.title}</p>
          <p className="card__meta icon-text">
            <span className="toolbar__icon" aria-hidden="true">
              🕘
            </span>
            {formatDueDate(next.dueDate)}
          </p>
          <div className="stack-gap" />
          {(() => {
            const s = taskStatus(next);
            return <Badge variant={s.variant} icon={s.icon} label={s.label} />;
          })()}
          <div className="stack-gap" />
          <PrimaryButton
            label="View Task"
            aria-label={`View Task: ${next.title}`}
            onClick={() => onViewTask?.(next.id)}
          />
        </Card>
      ) : (
        <Card>
          <p className="empty-state">No upcoming tasks.</p>
        </Card>
      )}

      {nextUp && (
        <Card>
          <h2 className="card__label">Next Up</h2>
          <p className="card__title">{nextUp.title}</p>
          <p className="card__meta icon-text">
            <span className="toolbar__icon" aria-hidden="true">
              🕘
            </span>
            {formatDueDate(nextUp.dueDate)}
          </p>
        </Card>
      )}

      <SecondaryButton label="View All Tasks" onClick={() => onViewAllTasks?.()} />
      <div className="stack-gap" />
      <PrimaryButton
        label="MENU"
        aria-label="Open menu"
        onClick={() => onOpenMenu?.()}
      />
    </>
  );
}
