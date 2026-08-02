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
  late final TextEditingController _searchCtrl;

  @override
  void initState() {
    super.initState();
    _searchCtrl = TextEditingController();
    // The query is global (it filters tasks AND contacts), so entering this
    // screen starts with a clean search rather than a leftover filter.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) AppStateScope.of(context).setSearchQuery('');
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final query = AppStateScope.of(context).searchQuery;
    if (_searchCtrl.text != query) _searchCtrl.text = query;
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

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
                        MaterialPageRoute(
                          builder: (_) => const NewTaskScreen(),
                        ),
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
              TextField(
                onChanged: state.setSearchQuery,
                controller: _searchCtrl,
                decoration: const InputDecoration(
                  labelText: 'Search tasks',
                  prefixIcon: Icon(Icons.search),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Active (${active.length})',
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: 8),
              Expanded(
                child: ListView(
                  children: [
                    if (active.isEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Text(
                          'No active tasks.',
                          style: theme.textTheme.bodyLarge,
                        ),
                      ),
                    ...active.map(
                      (task) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _TaskCard(
                          task: task,
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => TaskDetailScreen(taskId: task.id),
                            ),
                          ),
                        ),
                      ),
                    ),
                    if (completed.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      _CompletedToggle(
                        count: completed.length,
                        expanded: _showCompleted,
                        onTap: () =>
                            setState(() => _showCompleted = !_showCompleted),
                      ),
                      if (_showCompleted)
                        ...completed.map(
                          (task) => Padding(
                            padding: const EdgeInsets.only(top: 12),
                            child: _TaskCard(task: task, muted: true),
                          ),
                        ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: () => Navigator.of(
                  context,
                ).push(MaterialPageRoute(builder: (_) => const MenuScreen())),
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
  const _TaskCard({required this.task, this.onTap, this.muted = false});
  final Task task;
  final VoidCallback? onTap;
  final bool muted;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final status = taskStatus(task);
    final timeLabel = formatDueDate(task.dueDate);
    // Muted (completed) text stays at 60% alpha so it still meets WCAG AA
    // contrast on the white card.
    final mutedColor = theme.colorScheme.onSurface.withValues(alpha: 0.6);

    final content = Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            task.title,
            style: theme.textTheme.titleLarge?.copyWith(
              color: muted ? mutedColor : null,
              decoration: muted ? TextDecoration.lineThrough : null,
            ),
          ),
          if (task.details.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              task.details,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: muted ? mutedColor : theme.colorScheme.secondary,
              ),
            ),
          ],
          const SizedBox(height: 4),
          Text(
            timeLabel,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: muted ? mutedColor : theme.colorScheme.secondary,
            ),
          ),
          const SizedBox(height: 8),
          StatusBadge(status: status),
        ],
      ),
    );

    final label = '${task.title}. Due $timeLabel. ${status.label}';
    if (onTap == null) {
      // Completed rows are informational: no tap handler, no button semantics.
      return Semantics(
        label: label,
        excludeSemantics: true,
        child: Card(child: content),
      );
    }
    return Semantics(
      label: label,
      hint: 'Open task details',
      button: true,
      excludeSemantics: true,
      onTap: onTap,
      child: Card(
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: content,
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
    return Semantics(
      label: '$count completed ${count == 1 ? 'task' : 'tasks'}',
      hint: expanded ? 'Collapse completed tasks' : 'Expand completed tasks',
      button: true,
      expanded: expanded,
      excludeSemantics: true,
      onTap: onTap,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
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
    return Semantics(
      label: ascending
          ? 'Sort tasks. Current order earliest first'
          : 'Sort tasks. Current order latest first',
      hint: ascending
          ? 'Double tap to sort latest tasks first'
          : 'Double tap to sort earliest tasks first',
      button: true,
      excludeSemantics: true,
      onTap: onTap,
      child: SizedBox(
        width: 56,
        height: 56,
        child: OutlinedButton(
          onPressed: onTap,
          style: OutlinedButton.styleFrom(
            padding: EdgeInsets.zero,
            minimumSize: const Size(56, 56),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: Icon(
            ascending ? Icons.arrow_upward : Icons.arrow_downward,
            size: 24,
          ),
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
    final task = state.taskById(taskId);

    if (task == null) {
      return Scaffold(
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Task Details', style: theme.textTheme.headlineLarge),
                const Divider(height: 24),
                Text('Task not found.', style: theme.textTheme.bodyLarge),
                const Spacer(),
                OutlinedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Back'),
                ),
              ],
            ),
          ),
        ),
      );
    }

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
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.secondary,
                        ),
                      ),
                      if (task.details.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text(
                          task.details,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.secondary,
                          ),
                        ),
                      ],
                      const SizedBox(height: 12),
                      StatusBadge(status: taskStatus(task)),
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
                        Text(
                          task.caregiverName,
                          style: theme.textTheme.titleLarge,
                        ),
                        if (task.caregiverPhone.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Text(
                            task.caregiverPhone,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.colorScheme.secondary,
                            ),
                          ),
                        ],
                        if (task.caregiverEmail.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Text(
                            task.caregiverEmail,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.colorScheme.secondary,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
              const Spacer(),
              // Focus order matches desktop/web: Mark as Resolved, MENU, Back.
              if (!task.completed) ...[
                ElevatedButton(
                  onPressed: () async {
                    final ok = await showConfirmDialog(
                      context,
                      title: 'Mark task as resolved?',
                      message:
                          '"${task.title}" will be moved to your completed tasks.',
                      confirmLabel: 'Mark as Resolved',
                      cancelLabel: 'Cancel',
                    );
                    if (!ok || !context.mounted) return;
                    state.markTaskResolved(taskId);
                    Navigator.of(context).pop();
                  },
                  child: const Text('Mark as Resolved'),
                ),
                const SizedBox(height: 12),
              ],
              ElevatedButton(
                onPressed: () => Navigator.of(
                  context,
                ).push(MaterialPageRoute(builder: (_) => const MenuScreen())),
                child: const Text('MENU'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Back'),
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
  String? _titleError;

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

  Future<void> _discard() async {
    final dirty = _titleCtrl.text.trim().isNotEmpty ||
        _detailsCtrl.text.trim().isNotEmpty;
    if (dirty) {
      final ok = await showConfirmDialog(
        context,
        title: 'Discard this task?',
        message: 'Your entered details will not be saved.',
        confirmLabel: 'Discard',
        cancelLabel: 'Keep Editing',
        destructive: true,
      );
      if (!ok || !mounted) return;
    }
    if (mounted) Navigator.of(context).pop();
  }

  void _confirm() {
    if (_titleCtrl.text.trim().isEmpty) {
      setState(() => _titleError = 'A task title is required.');
      return;
    }
    setState(() => _titleError = null);
    final state = AppStateScope.of(context);
    final d = _date ?? DateTime.now();
    final t = _time ?? TimeOfDay.now();
    state.addTask(
      Task(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: _titleCtrl.text.trim(),
        details: _detailsCtrl.text.trim(),
        dueDate: DateTime(d.year, d.month, d.day, t.hour, t.minute),
      ),
    );
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
              TextField(
                controller: _titleCtrl,
                decoration: InputDecoration(
                  labelText: 'Task title',
                  errorText: _titleError,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _detailsCtrl,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Details, optional',
                ),
              ),
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
                            minimumSize: const Size(double.infinity, 56),
                          ),
                          child: Semantics(
                            label: _date != null
                                ? 'Due date ${_date!.month}/${_date!.day}/${_date!.year}'
                                : 'Due date not selected',
                            hint: 'Choose a due date',
                            excludeSemantics: true,
                            child: Text(
                              _date != null
                                  ? '${_date!.month}/${_date!.day}/${_date!.year}'
                                  : 'mm/dd/yyyy',
                            ),
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
                            minimumSize: const Size(double.infinity, 56),
                          ),
                          child: Semantics(
                            label: _time != null
                                ? 'Due time ${_time!.format(context)}'
                                : 'Due time not selected',
                            hint: 'Choose a due time',
                            excludeSemantics: true,
                            child: Text(
                              _time != null
                                  ? _time!.format(context)
                                  : '--:-- --',
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              ElevatedButton(onPressed: _confirm, child: const Text('Confirm')),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: _discard,
                child: const Text('Discard Changes'),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: () => Navigator.of(
                  context,
                ).push(MaterialPageRoute(builder: (_) => const MenuScreen())),
                child: const Text('MENU'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
