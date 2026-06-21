import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';
import OptionsScreen from '../../src/screens/OptionsScreen';
import {renderWithState} from '../../src/test-support/renderWithState';

describe('OptionsScreen (RNTL component test)', () => {
  it('renders font size and contrast options', async () => {
    await renderWithState(<OptionsScreen />);

    expect(screen.getByText('Font Size')).toBeTruthy();
    expect(screen.getByText('Contrast')).toBeTruthy();
    expect(screen.getByTestId('font-small')).toBeTruthy();
    expect(screen.getByTestId('font-xl')).toBeTruthy();
    expect(screen.getByTestId('contrast-high')).toBeTruthy();
  });

  it('marks Medium font and Normal contrast as selected by default', async () => {
    await renderWithState(<OptionsScreen />);

    expect(
      screen.getByTestId('font-medium').props.accessibilityState.selected,
    ).toBe(true);
    expect(
      screen.getByTestId('contrast-normal').props.accessibilityState.selected,
    ).toBe(true);
  });

  it('updates the selected font size when an option is pressed', async () => {
    await renderWithState(<OptionsScreen />);

    await fireEvent.press(screen.getByTestId('font-large'));

    expect(
      screen.getByTestId('font-large').props.accessibilityState.selected,
    ).toBe(true);
    expect(
      screen.getByTestId('font-medium').props.accessibilityState.selected,
    ).toBe(false);
  });

  it('updates the selected contrast when an option is pressed', async () => {
    await renderWithState(<OptionsScreen />);

    await fireEvent.press(screen.getByTestId('contrast-xhigh'));

    expect(
      screen.getByTestId('contrast-xhigh').props.accessibilityState.selected,
    ).toBe(true);
    expect(
      screen.getByTestId('contrast-normal').props.accessibilityState.selected,
    ).toBe(false);
  });

  it('fires the menu callback', async () => {
    const onOpenMenu = jest.fn();
    await renderWithState(<OptionsScreen onOpenMenu={onOpenMenu} />);

    await fireEvent.press(screen.getByTestId('options-menu'));

    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });
});
