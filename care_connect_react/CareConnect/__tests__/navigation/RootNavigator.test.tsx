import React from 'react';
import {BackHandler} from 'react-native';
import {act, fireEvent, screen} from '@testing-library/react-native';
import RootNavigator from '../../src/navigation/RootNavigator';
import {renderWithState} from '../../src/test-support/renderWithState';

// Signs in from the initial Login screen so flows can start on Home.
async function signIn() {
  await fireEvent.changeText(screen.getByTestId('login-email'), 'a@b.com');
  await fireEvent.changeText(screen.getByTestId('login-password'), 'pw');
  await fireEvent.press(screen.getByTestId('login-submit'));
}

describe('RootNavigator (navigation smoke test)', () => {
  it('starts on the Login screen', async () => {
    await renderWithState(<RootNavigator />);

    expect(screen.getByText('CareConnect')).toBeTruthy();
    expect(screen.getByTestId('login-submit')).toBeTruthy();
  });

  it('replaces Login with Home after signing in', async () => {
    await renderWithState(<RootNavigator />);

    await signIn();

    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('pushes and pops the forgot-password screen', async () => {
    await renderWithState(<RootNavigator />);

    await fireEvent.press(screen.getByTestId('login-forgot'));
    expect(screen.getByText('Reset Password')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('reset-back'));
    expect(screen.getByTestId('login-submit')).toBeTruthy();
  });

  it('navigates Home → Menu → Contacts', async () => {
    await renderWithState(<RootNavigator />);
    await signIn();

    await fireEvent.press(screen.getByTestId('home-menu'));
    expect(screen.getByText('Menu')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('menu-contacts'));
    expect(screen.getByText('Contacts')).toBeTruthy();
  });

  it('opens a task from Home and pops back after resolving', async () => {
    await renderWithState(<RootNavigator />);
    await signIn();

    await fireEvent.press(screen.getByTestId('home-view-task'));
    expect(screen.getByText('Task Details')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('task-resolve'));
    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('resets to Login when signing out from the Menu', async () => {
    await renderWithState(<RootNavigator />);
    await signIn();

    await fireEvent.press(screen.getByTestId('home-menu'));
    await fireEvent.press(screen.getByTestId('menu-sign-out'));

    expect(screen.getByText('CareConnect')).toBeTruthy();
    expect(screen.getByTestId('login-submit')).toBeTruthy();
  });

  describe('Android hardware back button', () => {
    let backPress: (() => boolean) | undefined;
    let addSpy: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
      backPress = undefined;
      // Capture the handler RootNavigator registers so we can fire it like
      // the OS would on a hardware back press.
      addSpy = jest
        .spyOn(BackHandler, 'addEventListener')
        .mockImplementation((event, handler) => {
          if (event === 'hardwareBackPress') {
            backPress = handler as () => boolean;
          }
          return {remove: jest.fn()};
        });
    });

    afterEach(() => addSpy.mockRestore());

    it('pops the stack and reports the press as handled', async () => {
      await renderWithState(<RootNavigator />);
      await signIn();
      await fireEvent.press(screen.getByTestId('home-menu'));
      expect(screen.getByText('Menu')).toBeTruthy();

      let handled: boolean | undefined;
      await act(async () => {
        handled = backPress?.();
      });

      expect(handled).toBe(true);
      expect(screen.getByText('Home')).toBeTruthy();
    });

    it('leaves the press unhandled at the root so the OS can exit', async () => {
      await renderWithState(<RootNavigator />);

      let handled: boolean | undefined;
      await act(async () => {
        handled = backPress?.();
      });

      expect(handled).toBe(false);
      expect(screen.getByTestId('login-submit')).toBeTruthy();
    });
  });
});
