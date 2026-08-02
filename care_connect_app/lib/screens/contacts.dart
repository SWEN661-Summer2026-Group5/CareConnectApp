import 'package:flutter/material.dart';
import '../main.dart';
import 'menu.dart';

// ─── Contact List ─────────────────────────────────────────────────────────────

class ContactListScreen extends StatefulWidget {
  const ContactListScreen({super.key});

  @override
  State<ContactListScreen> createState() => _ContactListScreenState();
}

class _ContactListScreenState extends State<ContactListScreen> {
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
              TextField(
                onChanged: state.setSearchQuery,
                controller: _searchCtrl,
                decoration: const InputDecoration(
                  labelText: 'Search contacts',
                  prefixIcon: Icon(Icons.search),
                ),
              ),
              const SizedBox(height: 16),
              if (contacts.isEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Text(
                    'No contacts found.',
                    style: theme.textTheme.bodyLarge,
                  ),
                ),
              Expanded(
                child: ListView.separated(
                  itemCount: contacts.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 12),
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
          semanticLabel: ascending
              ? 'Sort contacts. Current order A to Z'
              : 'Sort contacts. Current order Z to A',
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
  String? _nameError;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _roleCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    super.dispose();
  }

  Future<void> _discard() async {
    final dirty = _nameCtrl.text.trim().isNotEmpty ||
        _roleCtrl.text.trim().isNotEmpty ||
        _phoneCtrl.text.trim().isNotEmpty ||
        _emailCtrl.text.trim().isNotEmpty;
    if (dirty) {
      final ok = await showConfirmDialog(
        context,
        title: 'Discard this contact?',
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
    if (_nameCtrl.text.trim().isEmpty) {
      setState(() => _nameError = 'A contact name is required.');
      return;
    }
    setState(() => _nameError = null);
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
              TextField(
                controller: _nameCtrl,
                decoration: InputDecoration(
                  labelText: 'Contact name',
                  errorText: _nameError,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _roleCtrl,
                decoration: const InputDecoration(
                  labelText: 'Role, optional',
                  hintText: 'Doctor, Nurse, etc.',
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Phone number',
                  hintText: '(555) 123-4567',
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  labelText: 'Email address',
                  hintText: 'email@example.com',
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _confirm,
                child: const Text('Confirm'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: _discard,
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
