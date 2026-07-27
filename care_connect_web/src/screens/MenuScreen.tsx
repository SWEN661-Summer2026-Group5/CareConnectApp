import { SecondaryButton } from '../components/ui';

export interface MenuScreenProps {
  onHome?: () => void;
  onTasks?: () => void;
  onContacts?: () => void;
  onOptions?: () => void;
  onSignOut?: () => void;
}

function MenuLink({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <li>
      <button type="button" className="btn btn--secondary" onClick={onClick}>
        {label}
      </button>
    </li>
  );
}

export default function MenuScreen({
  onHome,
  onTasks,
  onContacts,
  onOptions,
  onSignOut,
}: MenuScreenProps) {
  const signOut = () => {
    const ok = window.confirm(
      'Sign out of CareConnect?\n\nYou will need to sign in again to manage your tasks.',
    );
    if (ok) onSignOut?.();
  };

  return (
    <>
      <h1 className="screen-title" tabIndex={-1}>
        Menu
      </h1>
      <nav aria-label="Primary navigation">
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <MenuLink label="Home" onClick={() => onHome?.()} />
          <MenuLink label="Tasks" onClick={() => onTasks?.()} />
          <MenuLink label="Contacts" onClick={() => onContacts?.()} />
          <MenuLink label="Options" onClick={() => onOptions?.()} />
        </ul>
      </nav>
      <div className="stack-gap" />
      <SecondaryButton label="Sign Out" onClick={signOut} />
    </>
  );
}
