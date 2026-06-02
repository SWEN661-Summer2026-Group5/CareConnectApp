import 'package:flutter/material.dart';
import '../main.dart';
import 'menu.dart';

// ─── Task List ────────────────────────────────────────────────────────────────

class TaskListScreen extends StatefulWidget {
  const TaskListScreen({super.key});

  @override
  State<TaskListScreen> createState() => _TaskListScreenState();
}

class _TaskListScreenState extends State<TaskListScreen> {
  bool _showCompleted = false;

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);
    final theme = Theme.of(context);
    final active = state.activeTasks;
    final completed = state.completedTasks;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Tasks', style: theme.textTheme.headlineLarge),
              const Divider(height: 24),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const NewTaskScreen()),
                      ),
                      child: const Text('Add New Task'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  _SortButton(
                    ascending: state.sortTasksAsc,
                    onTap: state.toggleTaskSort,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text('Active (${active.length})', style: theme.textTheme.bodyMedium),
              const SizedBox(height: 8),
              Expanded(
                child: ListView(
                  children: [
                    ...active.map((task) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _TaskCard(
                            title: task.title,
                            timeLabel: formatDueDate(task.dueDate),
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(
                                  builder: (_) =>
                                      TaskDetailScreen(taskId: task.id)),
                            ),
                          ),
                        )),
                    if (completed.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      _CompletedToggle(
                        count: completed.length,
                        expanded: _showCompleted,
                        onTap: () =>
                            setState(() => _showCompleted = !_showCompleted),
                      ),
                      if (_showCompleted)
                        ...completed.map((task) => Padding(
                              padding: const EdgeInsets.only(top: 12),
                              child: _TaskCard(
                                title: task.title,
                                timeLabel: formatDueDate(task.dueDate),
                                muted: true,
                                onTap: () {},
                              ),
                            )),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 8),
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

class _TaskCard extends StatelessWidget {
  const _TaskCard({
    required this.title,
    required this.timeLabel,
    required this.onTap,
    this.muted = false,
  });
  final String title;
  final String timeLabel;
  final VoidCallback onTap;
  final bool muted;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: theme.textTheme.titleLarge?.copyWith(
                  color: muted
                      ? theme.colorScheme.onSurface.withValues(alpha: 0.45)
                      : null,
                  decoration: muted ? TextDecoration.lineThrough : null,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                timeLabel,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: muted
                      ? theme.colorScheme.onSurface.withValues(alpha: 0.45)
                      : theme.colorScheme.secondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CompletedToggle extends StatelessWidget {
  const _CompletedToggle({
    required this.count,
    required this.expanded,
    required this.onTap,
  });
  final int count;
  final bool expanded;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          border: Border.all(color: const Color(0xFFCCD5DC)),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            '$count Completed',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
            ),
          ),
        ),
      ),
    );
  }
}

class _SortButton extends StatelessWidget {
  const _SortButton({required this.ascending, required this.onTap});
  final bool ascending;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 56,
      height: 56,
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          padding: EdgeInsets.zero,
          minimumSize: const Size(56, 56),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        child: Icon(
          ascending ? Icons.arrow_upward : Icons.arrow_downward,
          size: 24,
        ),
      ),
    );
  }
}

// ─── Task Detail ──────────────────────────────────────────────────────────────

class TaskDetailScreen extends StatelessWidget {
  const TaskDetailScreen({super.key, required this.taskId});
  final String taskId;

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);
    final theme = Theme.of(context);
    final task = state.tasks.firstWhere((t) => t.id == taskId);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Task Details', style: theme.textTheme.headlineLarge),
              const Divider(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(task.title, style: theme.textTheme.titleLarge),
                      const SizedBox(height: 8),
                      Text(
                        'Due: ${formatDueDate(task.dueDate)}',
                        style: theme.textTheme.bodyMedium
                            ?.copyWith(color: theme.colorScheme.secondary),
                      ),
                      if (task.details.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text(
                          task.details,
                          style: theme.textTheme.bodyMedium
                              ?.copyWith(color: theme.colorScheme.secondary),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              if (task.caregiverName.isNotEmpty) ...[
                const SizedBox(height: 16),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Caregiver', style: theme.textTheme.bodyMedium),
                        const SizedBox(height: 8),
                        Text(task.caregiverName,
                            style: theme.textTheme.titleLarge),
                        if (task.caregiverPhone.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Text(
                            task.caregiverPhone,
                            style: theme.textTheme.bodyMedium
                                ?.copyWith(color: theme.colorScheme.secondary),
                          ),
                        ],
                        if (task.caregiverEmail.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Text(
                            task.caregiverEmail,
                            style: theme.textTheme.bodyMedium
                                ?.copyWith(color: theme.colorScheme.secondary),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
              const Spacer(),
              if (!task.completed) ...[
                ElevatedButton(
                  onPressed: () {
                    state.markTaskResolved(taskId);
                    Navigator.of(context).pop();
                  },
                  child: const Text('Mark as Resolved'),
                ),
                const SizedBox(height: 12),
              ],
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

// ─── New Task ─────────────────────────────────────────────────────────────────

class NewTaskScreen extends StatefulWidget {
  const NewTaskScreen({super.key});

  @override
  State<NewTaskScreen> createState() => _NewTaskScreenState();
}

class _NewTaskScreenState extends State<NewTaskScreen> {
  final _titleCtrl = TextEditingController();
  final _detailsCtrl = TextEditingController();
  DateTime? _date;
  TimeOfDay? _time;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _detailsCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) setState(() => _date = picked);
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null) setState(() => _time = picked);
  }

  void _confirm() {
    if (_titleCtrl.text.trim().isEmpty) return;
    final state = AppStateScope.of(context);
    final d = _date ?? DateTime.now();
    final t = _time ?? TimeOfDay.now();
    state.addTask(Task(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: _titleCtrl.text.trim(),
      details: _detailsCtrl.text.trim(),
      dueDate: DateTime(d.year, d.month, d.day, t.hour, t.minute),
    ));
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Add New Task', style: theme.textTheme.headlineLarge),
              const Divider(height: 24),
              Text('Task Title', style: theme.textTheme.bodyMedium),
              const SizedBox(height: 8),
              TextField(controller: _titleCtrl),
              const SizedBox(height: 16),
              Text('Details (optional)', style: theme.textTheme.bodyMedium),
              const SizedBox(height: 8),
              TextField(controller: _detailsCtrl, maxLines: 3),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text('Date', style: theme.textTheme.bodyMedium),
                        const SizedBox(height: 8),
                        OutlinedButton(
                          onPressed: _pickDate,
                          style: OutlinedButton.styleFrom(
                              minimumSize: const Size(double.infinity, 56)),
                          child: Text(
                            _date != null
                                ? '${_date!.month}/${_date!.day}/${_date!.year}'
                                : 'mm/dd/yyyy',
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text('Time', style: theme.textTheme.bodyMedium),
                        const SizedBox(height: 8),
                        OutlinedButton(
                          onPressed: _pickTime,
                          style: OutlinedButton.styleFrom(
                              minimumSize: const Size(double.infinity, 56)),
                          child: Text(
                            _time != null
                                ? _time!.format(context)
                                : '--:-- --',
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _confirm,
                child: const Text('Confirm'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Discard Changes'),
              ),
              const SizedBox(height: 12),
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
