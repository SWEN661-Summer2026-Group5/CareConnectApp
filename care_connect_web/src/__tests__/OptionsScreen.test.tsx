import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionsScreen from '../screens/OptionsScreen';
import { renderWithProviders } from '../test-support/renderWithProviders';

describe('OptionsScreen', () => {
  it('renders the heading and both option groups', () => {
    renderWithProviders(<OptionsScreen />);

    expect(
      screen.getByRole('heading', { name: 'Options', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Font size' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Contrast' })).toBeInTheDocument();
  });

  it('renders all four font size buttons with spoken labels', () => {
    renderWithProviders(<OptionsScreen />);

    const group = screen.getByRole('group', { name: 'Font size' });
    expect(within(group).getAllByRole('button')).toHaveLength(4);
    for (const spoken of ['small', 'medium', 'large', 'extra large']) {
      expect(
        screen.getByRole('button', { name: `Font size ${spoken}` }),
      ).toBeInTheDocument();
    }
  });

  it('renders all three contrast buttons with spoken labels', () => {
    renderWithProviders(<OptionsScreen />);

    const group = screen.getByRole('group', { name: 'Contrast' });
    expect(within(group).getAllByRole('button')).toHaveLength(3);
    for (const spoken of ['normal', 'high', 'extra high']) {
      expect(
        screen.getByRole('button', { name: `Contrast ${spoken}` }),
      ).toBeInTheDocument();
    }
  });

  // The buttons expose their toggle state through aria-selected rather than
  // aria-pressed — see SecondaryButton's `selected` prop in components/ui.tsx.
  it('marks the current font size as selected and the others as not', () => {
    renderWithProviders(<OptionsScreen />, { seed: { fontSizeOption: 'large' } });

    expect(screen.getByRole('button', { name: 'Font size large' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Font size small' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('marks the current contrast as selected and the others as not', () => {
    renderWithProviders(<OptionsScreen />, { seed: { contrastOption: 'xhigh' } });

    expect(
      screen.getByRole('button', { name: 'Contrast extra high' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Contrast normal' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('moves the selection when another font size is chosen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<OptionsScreen />);

    await user.click(screen.getByRole('button', { name: 'Font size extra large' }));

    expect(
      screen.getByRole('button', { name: 'Font size extra large' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Font size medium' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('moves the selection when another contrast is chosen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<OptionsScreen />);

    await user.click(screen.getByRole('button', { name: 'Contrast high' }));

    expect(screen.getByRole('button', { name: 'Contrast high' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('opens the menu from the MENU button', async () => {
    const user = userEvent.setup();
    const onOpenMenu = vi.fn();
    renderWithProviders(<OptionsScreen onOpenMenu={onOpenMenu} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });
});
