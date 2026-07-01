import { Card, PrimaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { useScreenActions } from '../navigation/screenActions';

export interface ContactListScreenProps {
  onAddContact?: () => void;
  onOpenMenu?: () => void;
}

export default function ContactListScreen({
  onAddContact,
  onOpenMenu,
}: ContactListScreenProps) {
  const {
    sortedContacts,
    sortContactsAsc,
    toggleContactSort,
    setContactSort,
  } = useAppState();

  useScreenActions(
    {
      onSortAsc: () => setContactSort(true),
      onSortDesc: () => setContactSort(false),
    },
    [setContactSort],
  );

  return (
    <>
      <h1 className="screen-title" tabIndex={-1}>
        Contacts
      </h1>

      <div className="row">
        <div className="grow">
          <PrimaryButton label="Add Contact" onClick={() => onAddContact?.()} />
        </div>
        <button
          type="button"
          className="sort-button"
          aria-pressed={sortContactsAsc}
          aria-label={
            sortContactsAsc
              ? 'Sort contacts, currently A to Z. Activates Z to A.'
              : 'Sort contacts, currently Z to A. Activates A to Z.'
          }
          onClick={toggleContactSort}
        >
          <span aria-hidden="true">{sortContactsAsc ? '▲' : '▼'}</span>
        </button>
      </div>

      {sortedContacts.length === 0 ? (
        <p className="empty-state">No contacts found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {sortedContacts.map((contact) => (
            <li key={contact.id}>
              <Card>
                <h2 className="card__title">{contact.name}</h2>
                {contact.role.length > 0 && (
                  <p className="card__meta--strong">{contact.role}</p>
                )}
                {contact.phone.length > 0 && (
                  <p className="card__meta icon-text">
                    <span className="toolbar__icon" aria-hidden="true">
                      📞
                    </span>
                    <span className="visually-hidden">Phone: </span>
                    {contact.phone}
                  </p>
                )}
                {contact.email.length > 0 && (
                  <p className="card__meta icon-text">
                    <span className="toolbar__icon" aria-hidden="true">
                      ✉
                    </span>
                    <span className="visually-hidden">Email: </span>
                    {contact.email}
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ul>
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
