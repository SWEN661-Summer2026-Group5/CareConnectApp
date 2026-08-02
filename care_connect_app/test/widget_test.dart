// Smoke test: the app boots to the Login screen and sign-in validation works.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:care_connect_app/main.dart';

void main() {
  testWidgets('App boots to the Login screen', (WidgetTester tester) async {
    await tester.pumpWidget(const CareConnectApp());

    expect(find.text('CareConnect'), findsOneWidget);
    expect(find.text('Sign In'), findsWidgets);
    expect(find.text('Forgot Password?'), findsOneWidget);
  });

  testWidgets('Empty sign-in shows a validation error instead of navigating',
      (WidgetTester tester) async {
    await tester.pumpWidget(const CareConnectApp());

    await tester.tap(find.widgetWithText(ElevatedButton, 'Sign In'));
    await tester.pumpAndSettle();

    expect(
      find.text('Enter both your email address and password to sign in.'),
      findsOneWidget,
    );
    // Still on the login screen.
    expect(find.text('Your personal health companion'), findsOneWidget);
  });
}
