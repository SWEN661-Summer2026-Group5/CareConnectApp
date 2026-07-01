import React, { useEffect, useRef, useState } from 'react';
import type { AppActions } from '../navigation/actions';
import { modKey } from '../utils/bridge';

interface MenuItem {
  label: string;
  shortcut?: string;
  action: keyof AppActions;
}

interface TopMenu {
  label: string;
  items: MenuItem[];
}

function buildMenus(mod: string): TopMenu[] {
  return [
    {
      label: 'File',
      items: [
        { label: 'New Task', shortcut: `${mod}+N`, action: 'newTask' },
        { label: 'Save / Confirm', shortcut: `${mod}+S`, action: 'save' },
        { label: 'Mark Task Resolved', shortcut: `${mod}+R`, action: 'resolve' },
        { label: 'Sign Out', shortcut: `${mod}+Shift+Q`, action: 'signOut' },
      ],
    },
    {
      label: 'Edit',
      items: [{ label: 'Search', shortcut: `${mod}+F`, action: 'search' }],
    },
    {
      label: 'View',
      items: [
        { label: 'Go to Home', shortcut: `${mod}+H`, action: 'goHome' },
        { label: 'Go to Task List', shortcut: `${mod}+T`, action: 'goTasks' },
        { label: 'Go to Contacts', shortcut: `${mod}+L`, action: 'goContacts' },
        { label: 'Open Settings', shortcut: `${mod}+,`, action: 'goOptions' },
        { label: 'Sort Ascending', shortcut: `${mod}+Up`, action: 'sortAsc' },
        { label: 'Sort Descending', shortcut: `${mod}+Down`, action: 'sortDesc' },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'CareConnect Help', shortcut: 'F1', action: 'help' },
        { label: 'About CareConnect', action: 'about' },
      ],
    },
  ];
}

export function MenuBar({ actions }: { actions: AppActions }) {
  const menus = buildMenus(modKey());
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const barRef = useRef<HTMLUListElement>(null);
  const topRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Close the open menu on any outside click.
  useEffect(() => {
    if (openIndex === null) return;
    const onDown = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openIndex]);

  const focusTop = (index: number) => {
    topRefs.current[index]?.focus();
  };

  const openMenu = (index: number, focusItem: 'first' | 'last' = 'first') => {
    setOpenIndex(index);
    // Defer so the menu items exist before focusing.
    requestAnimationFrame(() => {
      const items = itemRefs.current.filter(Boolean);
      const target = focusItem === 'first' ? items[0] : items[items.length - 1];
      target?.focus();
    });
  };

  const closeMenu = (returnFocus = true) => {
    const idx = openIndex;
    setOpenIndex(null);
    if (returnFocus && idx !== null) focusTop(idx);
  };

  const runAction = (action: keyof AppActions) => {
    setOpenIndex(null);
    actions[action]?.();
  };

  const onTopKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        focusTop((index + 1) % menus.length);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusTop((index - 1 + menus.length) % menus.length);
        break;
      case 'Home':
        e.preventDefault();
        focusTop(0);
        break;
      case 'End':
        e.preventDefault();
        focusTop(menus.length - 1);
        break;
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        e.preventDefault();
        openMenu(index, 'first');
        break;
      case 'ArrowUp':
        e.preventDefault();
        openMenu(index, 'last');
        break;
      case 'Escape':
        setOpenIndex(null);
        break;
      default:
        break;
    }
  };

  const onItemKeyDown = (
    e: React.KeyboardEvent,
    itemIndex: number,
    itemCount: number,
  ) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        itemRefs.current[(itemIndex + 1) % itemCount]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        itemRefs.current[(itemIndex - 1 + itemCount) % itemCount]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        itemRefs.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        itemRefs.current[itemCount - 1]?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu(true);
        break;
      case 'ArrowRight':
        e.preventDefault();
        setOpenIndex(null);
        openMenu((openIndex! + 1) % menus.length);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setOpenIndex(null);
        openMenu((openIndex! - 1 + menus.length) % menus.length);
        break;
      case 'Tab':
        closeMenu(false);
        break;
      default:
        break;
    }
  };

  return (
    <ul className="menubar" role="menubar" aria-label="Main menu" ref={barRef}>
      {menus.map((menu, i) => {
        const expanded = openIndex === i;
        if (expanded) itemRefs.current = [];
        return (
          <li className="menubar__item" role="none" key={menu.label}>
            <button
              type="button"
              className="menubar__button"
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={expanded}
              // Each top-level menu is its own tab stop so the sequence is
              // File → Edit → View → Help, matching the design doc's focus
              // order (§2). Arrow keys still move between them as a bonus.
              tabIndex={0}
              ref={(el) => {
                topRefs.current[i] = el;
              }}
              onClick={() => (expanded ? closeMenu(false) : openMenu(i))}
              onKeyDown={(e) => onTopKeyDown(e, i)}
            >
              {menu.label}
            </button>
            {expanded && (
              <ul className="menu" role="menu" aria-label={menu.label}>
                {menu.items.map((item, j) => (
                  <li role="none" key={item.label}>
                    <button
                      type="button"
                      className="menu__item"
                      role="menuitem"
                      ref={(el) => {
                        itemRefs.current[j] = el;
                      }}
                      onClick={() => runAction(item.action)}
                      onKeyDown={(e) =>
                        onItemKeyDown(e, j, menu.items.length)
                      }
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="menu__shortcut" aria-hidden="true">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
