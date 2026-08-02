import 'package:flutter/material.dart';
import 'screens/auth.dart';

// ─── Models ───────────────────────────────────────────────────────────────────

class Task {
  final String id;
  String title;
  String details;
  DateTime dueDate;
  bool completed;
  String caregiverName;
  String caregiverPhone;
  String caregiverEmail;

  Task({
    required this.id,
    required this.title,
    this.details = '',
    required this.dueDate,
    this.completed = false,
    this.caregiverName = '',
    this.caregiverPhone = '',
    this.caregiverEmail = '',
  });
}

class Contact {
  final String id;
  String name;
  String role;
  String phone;
  String email;

  Contact({
    required this.id,
    required this.name,
    this.role = '',
    this.phone = '',
    this.email = '',
  });
}

// ─── State ────────────────────────────────────────────────────────────────────

enum FontSizeOption { small, medium, large, xl }
enum ContrastOption { normal, high, xhigh }

class AppState extends ChangeNotifier {
  final List<Task> tasks;
  final List<Contact> contacts;
  FontSizeOption fontSizeOption;
  ContrastOption contrastOption;
  bool _sortTasksAsc = true;
  bool _sortContactsAsc = true;
  String _searchQuery = '';

  AppState()
      : tasks = _seedTasks(),
        contacts = _seedContacts(),
        fontSizeOption = FontSizeOption.medium,
        contrastOption = ContrastOption.normal;

  static List<Task> _seedTasks() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return [
      Task(
        id: '1',
        title: 'Take morning medication',
        details: 'Take 2 blue pills and 1 white pill with water.',
        dueDate: today.add(const Duration(hours: 9)),
        caregiverName: 'Dr. Sarah Johnson',
        caregiverPhone: '(555) 123-4567',
        caregiverEmail: 'sarah.johnson@careconnect.com',
      ),
      Task(
        id: '2',
        title: 'Physical therapy appointment',
        details: 'Bring the exercise log from last week.',
        dueDate: today.add(const Duration(hours: 14)),
        caregiverName: 'Mike Chen',
        caregiverPhone: '(555) 234-5678',
        caregiverEmail: 'mike.chen@careconnect.com',
      ),
      Task(
        id: '3',
        title: 'Take evening medication',
        dueDate: today.add(const Duration(hours: 19)),
      ),
      Task(
        id: '4',
        title: 'Doctor checkup',
        dueDate: today.add(const Duration(days: 1, hours: 10)),
      ),
      Task(
        id: '5',
        title: 'Morning walk',
        dueDate: today.subtract(const Duration(hours: 1)),
        completed: true,
      ),
    ];
  }

  static List<Contact> _seedContacts() => [
        Contact(
          id: '1',
          name: 'Dr. Sarah Johnson',
          role: 'Primary Care Physician',
          phone: '(555) 123-4567',
          email: 'sarah.johnson@careconnect.com',
        ),
        Contact(
          id: '2',
          name: 'Mike Chen',
          role: 'Physical Therapist',
          phone: '(555) 234-5678',
          email: 'mike.chen@careconnect.com',
        ),
        Contact(
          id: '3',
          name: 'Emily Rodriguez',
          role: 'Home Care Nurse',
          phone: '(555) 345-6789',
          email: 'emily.rodriguez@careconnect.com',
        ),
      ];

  static bool _matches(String query, List<String> fields) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return true;
    return fields.any((f) => f.toLowerCase().contains(q));
  }

  List<Task> get activeTasks {
    final list = tasks
        .where((t) => !t.completed)
        .where((t) => _matches(_searchQuery, [t.title, t.details]))
        .toList()
      ..sort((a, b) => _sortTasksAsc
          ? a.dueDate.compareTo(b.dueDate)
          : b.dueDate.compareTo(a.dueDate));
    return list;
  }

  List<Task> get completedTasks => tasks
      .where((t) => t.completed)
      .where((t) => _matches(_searchQuery, [t.title, t.details]))
      .toList();

  bool get sortTasksAsc => _sortTasksAsc;
  bool get sortContactsAsc => _sortContactsAsc;
  String get searchQuery => _searchQuery;

  List<Contact> get sortedContacts {
    final list = contacts
        .where((c) => _matches(_searchQuery, [c.name, c.role, c.phone, c.email]))
        .toList()
      ..sort((a, b) => _sortContactsAsc
          ? a.name.compareTo(b.name)
          : b.name.compareTo(a.name));
    return list;
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void toggleTaskSort() {
    _sortTasksAsc = !_sortTasksAsc;
    notifyListeners();
  }

  void toggleContactSort() {
    _sortContactsAsc = !_sortContactsAsc;
    notifyListeners();
  }

  void addTask(Task task) {
    tasks.add(task);
    notifyListeners();
  }

  Task? taskById(String id) {
    for (final t in tasks) {
      if (t.id == id) return t;
    }
    return null;
  }

  void markTaskResolved(String id) {
    final task = taskById(id);
    if (task == null) return;
    task.completed = true;
    notifyListeners();
  }

  void addContact(Contact contact) {
    contacts.add(contact);
    notifyListeners();
  }

  void setFontSize(FontSizeOption size) {
    fontSizeOption = size;
    notifyListeners();
  }

  void setContrast(ContrastOption level) {
    contrastOption = level;
    notifyListeners();
  }

  double get fontScale => switch (fontSizeOption) {
        FontSizeOption.small => 0.85,
        FontSizeOption.medium => 1.0,
        FontSizeOption.large => 1.2,
        FontSizeOption.xl => 1.4,
      };
}

// ─── State Provider ───────────────────────────────────────────────────────────

class AppStateScope extends InheritedNotifier<AppState> {
  const AppStateScope({
    super.key,
    required AppState state,
    required super.child,
  }) : super(notifier: state);

  static AppState of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<AppStateScope>()!.notifier!;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

const _primaryTeal = Color(0xFF0B7074);
const _accentCyan = Color(0xFF0C7585);
const _bgLight = Color(0xFFEEF2F6);

ThemeData buildTheme(ContrastOption contrast) {
  final isHigh = contrast != ContrastOption.normal;
  final isXHigh = contrast == ContrastOption.xhigh;

  final primary = isXHigh ? Colors.black : _primaryTeal;
  final accent = isXHigh ? Colors.black : _accentCyan;
  final bg = isHigh ? Colors.white : _bgLight;
  final textColor = isXHigh ? Colors.black : const Color(0xFF1A2B33);
  final cardBorder = isHigh ? textColor : const Color(0xFFCCD5DC);

  return ThemeData(
    colorScheme: ColorScheme.light(
      primary: primary,
      secondary: accent,
      surface: Colors.white,
      error: const Color(0xFFB52020),
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: textColor,
    ),
    scaffoldBackgroundColor: bg,
    appBarTheme: AppBarTheme(
      backgroundColor: bg,
      foregroundColor: textColor,
      elevation: 0,
    ),
    textTheme: TextTheme(
      headlineLarge: TextStyle(fontSize: 28, fontWeight: FontWeight.w600, color: textColor, height: 1.5),
      titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: textColor, height: 1.5),
      bodyLarge: TextStyle(fontSize: 18, color: textColor, height: 1.5),
      bodyMedium: TextStyle(fontSize: 16, color: textColor, height: 1.5),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: Colors.white,
        minimumSize: const Size(double.infinity, 56),
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primary,
        side: BorderSide(color: primary, width: 1.5),
        minimumSize: const Size(double.infinity, 56),
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: primary),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: primary, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
    ),
    cardTheme: CardThemeData(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(color: cardBorder),
      ),
      margin: EdgeInsets.zero,
    ),
  );
}

// ─── Task status (mirrors the desktop / web `taskStatus` helper) ─────────────
// Meaning is carried by label text and icon as well as colour, so it never
// depends on colour perception alone (WCAG 1.4.1).

class TaskStatus {
  final Color color;
  final String icon;
  final String label;
  const TaskStatus(this.color, this.icon, this.label);
}

TaskStatus taskStatus(Task task) {
  if (task.completed) {
    return const TaskStatus(Color(0xFF059669), '✓', 'Completed');
  }
  if (task.dueDate.isBefore(DateTime.now())) {
    return const TaskStatus(Color(0xFFDC2626), '⚠', 'High Priority');
  }
  return const TaskStatus(Color(0xFFD97706), '♥', 'Follow-up');
}

class StatusBadge extends StatelessWidget {
  const StatusBadge({super.key, required this.status});
  final TaskStatus status;

  @override
  Widget build(BuildContext context) {
    final isXHigh =
        AppStateScope.of(context).contrastOption == ContrastOption.xhigh;
    final color = isXHigh ? Colors.black : status.color;
    return Semantics(
      label: status.label,
      excludeSemantics: true,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        decoration: BoxDecoration(
          border: Border.all(color: color, width: 1.5),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          '${status.icon} ${status.label.toUpperCase()}',
          style: TextStyle(
            color: color,
            fontSize: 12,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.4,
          ),
        ),
      ),
    );
  }
}

// ─── Confirmation dialog (mirrors the desktop / web confirm flows) ───────────
// Important or destructive actions get an explicit confirmation step so an
// accidental tap (the core tremor scenario) is always recoverable.

Future<bool> showConfirmDialog(
  BuildContext context, {
  required String title,
  required String message,
  required String confirmLabel,
  required String cancelLabel,
  bool destructive = false,
}) async {
  final theme = Theme.of(context);
  final result = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: Text(title, style: theme.textTheme.titleLarge),
      content: Text(message, style: theme.textTheme.bodyMedium),
      actions: [
        OutlinedButton(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(0, 56),
          ),
          onPressed: () => Navigator.of(ctx).pop(false),
          child: Text(cancelLabel),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            minimumSize: const Size(0, 56),
            backgroundColor:
                destructive ? theme.colorScheme.error : null,
          ),
          onPressed: () => Navigator.of(ctx).pop(true),
          child: Text(confirmLabel),
        ),
      ],
    ),
  );
  return result ?? false;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

// Same rules as the desktop and web apps:
//   same calendar day     → "Today at 9:00 AM"
//   next calendar day     → "Tomorrow at 2:30 PM"
//   previous calendar day → "Yesterday at 11:00 PM"
//   anything else         → "Mon, Aug 3 at 10:00 AM"
const _weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const _months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

String formatDueDate(DateTime dt) {
  final now = DateTime.now();
  // Hours-based then rounded so a DST-shortened day still counts as one day.
  final dayDiff = (DateTime(dt.year, dt.month, dt.day)
              .difference(DateTime(now.year, now.month, now.day))
              .inHours /
          24)
      .round();
  final h = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
  final m = dt.minute.toString().padLeft(2, '0');
  final ampm = dt.hour < 12 ? 'AM' : 'PM';
  final time = '$h:$m $ampm';

  return switch (dayDiff) {
    0 => 'Today at $time',
    1 => 'Tomorrow at $time',
    -1 => 'Yesterday at $time',
    _ =>
      '${_weekdays[dt.weekday - 1]}, ${_months[dt.month - 1]} ${dt.day} at $time',
  };
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

void main() => runApp(const CareConnectApp());

class CareConnectApp extends StatefulWidget {
  const CareConnectApp({super.key});

  @override
  State<CareConnectApp> createState() => _CareConnectAppState();
}

class _CareConnectAppState extends State<CareConnectApp> {
  final _appState = AppState();

  @override
  void dispose() {
    _appState.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppStateScope(
      state: _appState,
      child: MaterialApp(
        title: 'CareConnect',
        debugShowCheckedModeBanner: false,
        home: const LoginScreen(),
        builder: (ctx, child) => ListenableBuilder(
          listenable: _appState,
          builder: (_, _) => Theme(
            data: buildTheme(_appState.contrastOption),
            child: MediaQuery(
              data: MediaQuery.of(ctx).copyWith(
                textScaler: TextScaler.linear(_appState.fontScale),
              ),
              child: child!,
            ),
          ),
        ),
      ),
    );
  }
}
