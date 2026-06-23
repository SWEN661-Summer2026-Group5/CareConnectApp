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
        details: 'Take 2 blue pills and 1 white pill with water',
        dueDate: today.add(const Duration(hours: 9)),
        caregiverName: 'Dr. Sarah Johnson',
        caregiverPhone: '(555) 123-4567',
        caregiverEmail: 'sarah.johnson@careconnect.com',
      ),
      Task(
        id: '2',
        title: 'Physical therapy appointment',
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

  List<Task> get activeTasks {
    final list = tasks.where((t) => !t.completed).toList()
      ..sort((a, b) => _sortTasksAsc
          ? a.dueDate.compareTo(b.dueDate)
          : b.dueDate.compareTo(a.dueDate));
    return list;
  }

  List<Task> get completedTasks => tasks.where((t) => t.completed).toList();

  bool get sortTasksAsc => _sortTasksAsc;
  bool get sortContactsAsc => _sortContactsAsc;

  List<Contact> get sortedContacts {
    final list = List<Contact>.from(contacts)
      ..sort((a, b) => _sortContactsAsc
          ? a.name.compareTo(b.name)
          : b.name.compareTo(a.name));
    return list;
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

  void markTaskResolved(String id) {
    tasks.firstWhere((t) => t.id == id).completed = true;
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

// ─── Utility ──────────────────────────────────────────────────────────────────

String formatDueDate(DateTime dt) {
  final now = DateTime.now();
  final isToday = dt.year == now.year && dt.month == now.month && dt.day == now.day;
  final h = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
  final m = dt.minute.toString().padLeft(2, '0');
  final ampm = dt.hour < 12 ? 'AM' : 'PM';
  return '${isToday ? "Today" : "Tomorrow"} at $h:$m $ampm';
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
