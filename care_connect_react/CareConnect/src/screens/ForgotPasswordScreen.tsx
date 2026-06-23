import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card, Field, PrimaryButton, SecondaryButton } from '../components/ui';

export interface ForgotPasswordScreenProps {
  onBack?: () => void;
}

export default function ForgotPasswordScreen({
  onBack,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text accessibilityRole="header" style={styles.brand}>
        CareConnect
      </Text>
      <Text style={styles.tagline}>Your personal health companion</Text>
      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Reset Password
        </Text>
        {sent ? (
          <Text testID="reset-confirmation" style={styles.success}>
            Reset link sent! Check your email.
          </Text>
        ) : (
          <>
            <Text style={styles.body}>
              Enter your email address and we'll send you instructions to reset
              your password.
            </Text>
            <Field
              label="Email Address"
              testID="reset-email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityHint="Enter the email address for your CareConnect account"
            />
            <PrimaryButton
              label="Send Reset Link"
              accessibilityHint="Sends password reset instructions to your email"
              testID="reset-submit"
              onPress={() => setSent(true)}
            />
          </>
        )}
        <SecondaryButton
          label="Back to Login"
          accessibilityHint="Returns to the sign in screen"
          testID="reset-back"
          onPress={() => onBack?.()}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  brand: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0B7074',
    textAlign: 'center',
    marginTop: 48,
  },
  tagline: {
    textAlign: 'center',
    color: '#17B5C3',
    marginTop: 8,
    marginBottom: 48,
  },
  heading: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  body: { color: '#17B5C3', marginBottom: 16 },
  success: { color: '#3B8C5C', marginBottom: 12 },
});
