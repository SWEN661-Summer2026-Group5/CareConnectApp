import { forwardRef } from 'react';
import type { AppActions } from '../navigation/actions';
import { useAppState } from '../state/AppState';

/**
 * Contextual toolbar shown on every screen (§2.2, §3.2.3). Its focus order is
 * exactly the three items the spec lists — New Task, Search, Settings — where
 * "Search" is the search field itself (the target of Ctrl+F / Edit ▸ Search,
 * §4). Icons are decorative (aria-hidden); every control keeps a text label so
 * its accessible name never relies on the glyph (§1.1.1, §2.5.3).
 */
export const Toolbar = forwardRef<HTMLInputElement, { actions: AppActions }>(
  function Toolbar({ actions }, searchRef) {
    const { searchQuery, setSearchQuery } = useAppState();

    return (
      <div className="toolbar" role="toolbar" aria-label="Actions">
        <button
          type="button"
          className="toolbar__button"
          onClick={actions.newTask}
        >
          <span className="toolbar__icon" aria-hidden="true">
            ＋
          </span>
          New Task
        </button>

        <div className="toolbar__search">
          <label htmlFor="toolbar-search">
            <span className="toolbar__icon" aria-hidden="true">
              🔍
            </span>{' '}
            Search
          </label>
          <input
            id="toolbar-search"
            ref={searchRef}
            type="search"
            value={searchQuery}
            placeholder="Search tasks and contacts"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="toolbar__button"
          onClick={actions.goOptions}
        >
          <span className="toolbar__icon" aria-hidden="true">
            ⚙
          </span>
          Settings
        </button>
      </div>
    );
  },
);
