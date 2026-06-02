import 'package:flutter/material.dart';
import '../main.dart';
import 'menu.dart';

class OptionsScreen extends StatelessWidget {
  const OptionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Options', style: theme.textTheme.headlineLarge),
              const Divider(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Font Size', style: theme.textTheme.titleLarge),
                      const SizedBox(height: 16),
                      GridView.count(
                        crossAxisCount: 2,
                        shrinkWrap: true,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        childAspectRatio: 2.8,
                        physics: const NeverScrollableScrollPhysics(),
                        children: [
                          _OptionButton(
                            label: 'Small',
                            selected: state.fontSizeOption == FontSizeOption.small,
                            onTap: () => state.setFontSize(FontSizeOption.small),
                          ),
                          _OptionButton(
                            label: 'Medium',
                            selected: state.fontSizeOption == FontSizeOption.medium,
                            onTap: () => state.setFontSize(FontSizeOption.medium),
                          ),
                          _OptionButton(
                            label: 'Large',
                            selected: state.fontSizeOption == FontSizeOption.large,
                            onTap: () => state.setFontSize(FontSizeOption.large),
                          ),
                          _OptionButton(
                            label: 'XL',
                            selected: state.fontSizeOption == FontSizeOption.xl,
                            onTap: () => state.setFontSize(FontSizeOption.xl),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Contrast', style: theme.textTheme.titleLarge),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _OptionButton(
                              label: 'Normal',
                              selected: state.contrastOption == ContrastOption.normal,
                              onTap: () => state.setContrast(ContrastOption.normal),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _OptionButton(
                              label: 'High',
                              selected: state.contrastOption == ContrastOption.high,
                              onTap: () => state.setContrast(ContrastOption.high),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _OptionButton(
                              label: 'XHigh',
                              selected: state.contrastOption == ContrastOption.xhigh,
                              onTap: () => state.setContrast(ContrastOption.xhigh),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
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

class _OptionButton extends StatelessWidget {
  const _OptionButton({
    required this.label,
    required this.selected,
    required this.onTap,
  });
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    if (selected) {
      return ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, 56),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        child: Text(label),
      );
    }
    return OutlinedButton(
      onPressed: onTap,
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(double.infinity, 56),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      child: Text(label),
    );
  }
}
