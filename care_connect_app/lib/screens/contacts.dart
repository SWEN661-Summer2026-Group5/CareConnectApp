import 'package:flutter/material.dart';
import '../main.dart';
import 'menu.dart';

// ─── Contact List ─────────────────────────────────────────────────────────────

class ContactListScreen extends StatelessWidget {
  const ContactListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);
    final theme = Theme.of(context);
    final contacts = state.sortedContacts;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Contacts', style: theme.textTheme.headlineLarge),
              const Divider(height: 24),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute(
                            builder: (_) => const AddContactScreen()),
                      ),
                      child: const Text('Add Contact'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  _SortButton(
                    ascending: state.sortContactsAsc,
                    onTap: state.toggleContactSort,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView.separated(
                  itemCount: contacts.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (_, i) {
                    final c = contacts[i];
                    return Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(c.name, style: theme.textTheme.titleLarge),
                            if (c.role.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(
                                c.role,
                                style: theme.textTheme.bodyMedium?.copyWith(
                                    color: theme.colorScheme.secondary),
                              ),
                            ],
                            if (c.phone.isNotEmpty) ...[
                              const SizedBox(height: 8),
                              Text(
                                c.phone,
                                style: theme.textTheme.bodyMedium?.copyWith(
                                    color: theme.colorScheme.secondary),
                              ),
                            ],
                            if (c.email.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(
                                c.email,
                                style: theme.textTheme.bodyMedium?.copyWith(
                                    color: theme.colorScheme.secondary),
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
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

// ─── Add Contact ──────────────────────────────────────────────────────────────

class AddContactScreen extends StatefulWidget {
  const AddContactScreen({super.key});

  @override
  State<AddContactScreen> createState() => _AddContactScreenState();
}

class _AddContactScreenState extends State<AddContactScreen> {
  final _nameCtrl = TextEditingController();
  final _roleCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _roleCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    super.dispose();
  }

  void _confirm() {
    if (_nameCtrl.text.trim().isEmpty) return;
    AppStateScope.of(context).addContact(Contact(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: _nameCtrl.text.trim(),
      role: _roleCtrl.text.trim(),
      phone: _phoneCtrl.text.trim(),
      email: _emailCtrl.text.trim(),
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
              Text('Add Contact', style: theme.textTheme.headlineLarge),
              const Divider(height: 24),
              Text('Contact Name', style: theme.textTheme.bodyMedium),
              const SizedBox(height: 8),
              TextField(controller: _nameCtrl),
              const SizedBox(height: 16),
              Text('Role (optional)', style: theme.textTheme.bodyMedium),
              const SizedBox(height: 8),
              TextField(
                controller: _roleCtrl,
                decoration:
                    const InputDecoration(hintText: 'Doctor, Nurse, etc.'),
              ),
              const SizedBox(height: 16),
              Text('Phone Number', style: theme.textTheme.bodyMedium),
              const SizedBox(height: 8),
              TextField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration:
                    const InputDecoration(hintText: '(555) 123-4567'),
              ),
              const SizedBox(height: 16),
              Text('Email Address', style: theme.textTheme.bodyMedium),
              const SizedBox(height: 8),
              TextField(
                controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                decoration:
                    const InputDecoration(hintText: 'email@example.com'),
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
