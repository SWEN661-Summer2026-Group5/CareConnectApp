import 'package:flutter/material.dart';
import 'auth.dart';
import 'home.dart';
import 'tasks.dart';
import 'contacts.dart';
import 'options.dart';

class MenuScreen extends StatelessWidget {
  const MenuScreen({super.key});

  void _go(BuildContext context, Widget screen) {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => screen),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Menu', style: theme.textTheme.headlineLarge),
              const Divider(height: 24),
              _MenuButton(
                label: 'Home',
                onTap: () => _go(context, const HomeScreen()),
              ),
              const SizedBox(height: 16),
              _MenuButton(
                label: 'Tasks',
                onTap: () => _go(context, const TaskListScreen()),
              ),
              const SizedBox(height: 16),
              _MenuButton(
                label: 'Contacts',
                onTap: () => _go(context, const ContactListScreen()),
              ),
              const SizedBox(height: 16),
              _MenuButton(
                label: 'Options',
                onTap: () => _go(context, const OptionsScreen()),
              ),
              const SizedBox(height: 32),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFFCCD5DC)),
                ),
                onPressed: () => Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (_) => false,
                ),
                child: const Text('Sign Out'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MenuButton extends StatelessWidget {
  const _MenuButton({required this.label, required this.onTap});
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return OutlinedButton(
      onPressed: onTap,
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          label,
          style: theme.textTheme.titleLarge
              ?.copyWith(color: theme.colorScheme.primary),
        ),
      ),
    );
  }
}
