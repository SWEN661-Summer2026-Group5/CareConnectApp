import 'package:flutter/material.dart';
import '../main.dart';
import 'menu.dart';
import 'tasks.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // A leftover search query would silently change which task shows as
    // "Next Task", so Home always starts unfiltered.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) AppStateScope.of(context).setSearchQuery('');
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);
    final theme = Theme.of(context);
    final active = state.activeTasks;
    final next = active.isNotEmpty ? active[0] : null;
    final nextUp = active.length > 1 ? active[1] : null;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Home', style: theme.textTheme.headlineLarge),
              const Divider(height: 24),
              if (next != null)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text('Next Task', style: theme.textTheme.bodyMedium),
                        const SizedBox(height: 8),
                        Text(next.title, style: theme.textTheme.titleLarge),
                        const SizedBox(height: 4),
                        Text(
                          formatDueDate(next.dueDate),
                          style: theme.textTheme.bodyMedium
                              ?.copyWith(color: theme.colorScheme.secondary),
                        ),
                        const SizedBox(height: 12),
                        Align(
                          alignment: Alignment.centerLeft,
                          child: StatusBadge(status: taskStatus(next)),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () => Navigator.of(context).push(
                            MaterialPageRoute(
                                builder: (_) =>
                                    TaskDetailScreen(taskId: next.id)),
                          ),
                          child: const Text('View Task'),
                        ),
                      ],
                    ),
                  ),
                )
              else
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Text('No upcoming tasks.',
                        style: theme.textTheme.bodyLarge),
                  ),
                ),
              if (nextUp != null) ...[
                const SizedBox(height: 16),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Next Up', style: theme.textTheme.bodyMedium),
                        const SizedBox(height: 8),
                        Text(nextUp.title, style: theme.textTheme.titleLarge),
                        const SizedBox(height: 4),
                        Text(
                          formatDueDate(nextUp.dueDate),
                          style: theme.textTheme.bodyMedium
                              ?.copyWith(color: theme.colorScheme.secondary),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const TaskListScreen()),
                ),
                child: const Text('View All Tasks'),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const MenuScreen()),
                ),
                child: const Text('MENU'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
