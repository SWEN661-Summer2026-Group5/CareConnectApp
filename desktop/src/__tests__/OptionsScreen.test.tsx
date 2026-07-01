import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionsScreen from '../screens/OptionsScreen';
import { renderWithProviders } from '../test-support/renderApp';

describe('OptionsScreen', () => {
  it('marks the current font size and contrast with aria-selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<OptionsScreen />);

    const medium = screen.getByRole('button', { name: 'Font size medium' });
    expect(medium).toHaveAttribute('aria-selected', 'true');

    const large = screen.getByRole('button', { name: 'Font size large' });
    expect(large).toHaveAttribute('aria-selected', 'false');

    await user.click(large);
    expect(large).toHaveAttribute('aria-selected', 'true');
    expect(medium).toHaveAttribute('aria-selected', 'false');
  });

  it('applies the contrast preference to the document root', async () => {
    const user = userEvent.setup();
    renderWithProviders(<OptionsScreen />);

    await user.click(screen.getByRole('button', { name: 'Contrast extra high' }));
    expect(
      screen.getByRole('button', { name: 'Contrast extra high' }),
    ).toHaveAttribute('aria-selected', 'true');
  });
});
