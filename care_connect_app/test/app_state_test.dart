import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
// Automatically maps to your team's package configuration paths
import 'package:care_connect_app/main.dart';

void main() {
  // Ensure Flutter binding is initialized for state notification tracking
  TestWidgetsFlutterBinding.ensureInitialized();

  group('CareConnect AppState & Utility Unit Tests (SWEN 661 Coverage)', () {
    late AppState appState;

    // Runs before every individual test block to provide a fresh state sandbox
    setUp(() {
      appState = AppState();
    });

    // ─── 1. TEST INITIALIZATION & SEED DATA ──────────────────────────────────
    test('Initial State Initialization Verification', () {
      expect(appState.fontSizeOption, FontSizeOption.medium);
      expect(appState.contrastOption, ContrastOption.normal);
      expect(appState.sortTasksAsc, true);
      expect(appState.sortContactsAsc, true);
      
      // Verifies that data seeding logic executes completely
      expect(appState.completedTasks.length, 1);
      expect(appState.activeTasks.length, 4);
      expect(appState.sortedContacts.length, 3);
    });

    // ─── 2. TEST TASK MANAGEMENT LOGIC ───────────────────────────────────────
    test('Task Management Mutation Operations', () {
      final initialActiveCount = appState.activeTasks.length;
      
      final newTask = Task(
        id: '99',
        title: 'Physical Therapy Exercise',
        dueDate: DateTime.now().add(const Duration(hours: 2)),
      );

      // Test Adding a Task
      appState.addTask(newTask);
      expect(appState.activeTasks.length, initialActiveCount + 1);

      // Test Marking a Task as Resolved (Completed)
      appState.markTaskResolved('99');
      expect(appState.completedTasks.any((t) => t.id == '99'), true);
    });

    // ─── 3. TEST CONTACT MANAGEMENT LOGIC ────────────────────────────────────
    test('Contact Management Operations', () {
      final initialContactCount = appState.sortedContacts.length;

      final newContact = Contact(
        id: '100',
        name: 'Zack Alpha Caregiver',
        role: 'Emergency Contact',
        phone: '555-0000',
        email: 'zack@care.com',
      );

      appState.addContact(newContact);
      expect(appState.sortedContacts.length, initialContactCount + 1);
    });

    // ─── 4. TEST DATA SORTING TOGGLES ────────────────────────────────────────
    test('Task and Contact Sorting Inversion Logic', () {
      // Toggle Task Sort
      expect(appState.sortTasksAsc, true);
      appState.toggleTaskSort();
      expect(appState.sortTasksAsc, false);

      // Toggle Contact Sort
      expect(appState.sortContactsAsc, true);
      appState.toggleContactSort();
      expect(appState.sortContactsAsc, false);
    });

    // ─── 5. TEST ACCESSIBILITY FONT SCALING MATRICES ─────────────────────────
    test('Font Scale Matrix Edge Cases', () {
      appState.setFontSize(FontSizeOption.small);
      expect(appState.fontScale, 0.85);

      appState.setFontSize(FontSizeOption.medium);
      expect(appState.fontScale, 1.0);

      appState.setFontSize(FontSizeOption.large);
      expect(appState.fontScale, 1.2);

      appState.setFontSize(FontSizeOption.xl);
      expect(appState.fontScale, 1.4);
    });

    // ─── 6. TEST DATE FORMATTING ENGINE ──────────────────────────────────────
    test('Utility Date Formatting Engine String Evaluations', () {
      final now = DateTime.now();
      
      // Test Today Case
      final todayTest = DateTime(now.year, now.month, now.day, 14, 30); // 2:30 PM
      expect(formatDueDate(todayTest), 'Today at 2:30 PM');

      // Test Tomorrow Case
      final tomorrowTest = DateTime(now.year, now.month, now.day + 1, 9, 05); // 9:05 AM
      expect(formatDueDate(tomorrowTest), 'Tomorrow at 9:05 AM');

      // Test Midnight Edge Case (Ensure 12:XX mapping doesn't output 0:XX)
      final midnightTest = DateTime(now.year, now.month, now.day, 0, 15); // 12:15 AM
      expect(formatDueDate(midnightTest), 'Today at 12:15 AM');
    });

    // ─── 7. TEST THEME GENERATOR MATRIX ──────────────────────────────────────
    test('Theme Generator Matrix Evaluations', () {
      // Test Normal Contrast Theme Mapping
      final normalTheme = buildTheme(ContrastOption.normal);
      expect(normalTheme.scaffoldBackgroundColor, const Color(0xFFEEF2F6));
      expect(normalTheme.colorScheme.primary, const Color(0xFF0B7074));

      // Test High Contrast Theme Mapping
      final highTheme = buildTheme(ContrastOption.high);
      expect(highTheme.scaffoldBackgroundColor, Colors.white);
      expect(highTheme.colorScheme.primary, const Color(0xFF0B7074));

      // Test Extra High Contrast Theme Mapping
      final xHighTheme = buildTheme(ContrastOption.xhigh);
      expect(xHighTheme.scaffoldBackgroundColor, Colors.white);
      expect(xHighTheme.colorScheme.primary, Colors.black);
    });
  });
}