import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Card, Field, PrimaryButton} from '../components/ui';

export interface LoginScreenProps {
  onSignIn?: () => void;
  onForgotPassword?: () => void;
}

export default function LoginScreen({
  onSignIn,
  onForgotPassword,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mirrors auth.dart _signIn: navigation only happens when both fields are set.
  const signIn = () => {
    if (email.trim().length > 0 && password.length > 0) {
      onSignIn?.();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.brand}>CareConnect</Text>
      <Text style={styles.tagline}>Your personal health companion</Text>
      <Card>
        <Text style={styles.heading}>Sign In</Text>
        <Field
          label="Email Address"
          testID="login-email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <View>
          <Field
            label="Password"
            testID="login-password"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Text
            testID="login-toggle-password"
            accessibilityRole="button"
            style={styles.showToggle}
            onPress={() => setShowPassword(v => !v)}>
            {showPassword ? 'HIDE' : 'SHOW'}
          </Text>
        </View>
        <Text
          testID="login-forgot"
          accessibilityRole="button"
          style={styles.link}
          onPress={() => onForgotPassword?.()}>
          Forgot Password?
        </Text>
        <PrimaryButton label="Sign In" testID="login-submit" onPress={signIn} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 24},
  brand: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0B7074',
    textAlign: 'center',
    marginTop: 48,
  },
  tagline: {textAlign: 'center', color: '#17B5C3', marginTop: 8, marginBottom: 48},
  heading: {fontSize: 20, fontWeight: '600', marginBottom: 24},
  showToggle: {position: 'absolute', right: 12, top: 36, color: '#0B7074'},
  link: {color: '#0B7074', marginBottom: 8},
});
