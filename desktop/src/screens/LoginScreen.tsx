import React, { useEffect, useRef, useState } from 'react';
import { Card, Field, PrimaryButton } from '../components/ui';

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
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const signIn = () => {
    if (email.trim().length === 0 || password.length === 0) {
      setError('Enter both your email address and password to sign in.');
      return;
    }
    setError('');
    onSignIn?.();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn();
  };

  return (
    <main className="app-main" id="main-content">
      <h1 className="brand" tabIndex={-1} ref={headingRef}>
        CareConnect
      </h1>
      <p className="tagline">Your personal health companion</p>
      <Card>
        <h2 className="section-heading">Sign In</h2>
        <form onSubmit={onSubmit} noValidate>
          <Field
            label="Email Address"
            type="email"
            autoComplete="username"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrap">
            <Field
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              aria-pressed={showPassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          {error && (
            <p className="field__error" role="alert">
              {error}
            </p>
          )}
          <PrimaryButton label="Sign In" type="submit" />
        </form>
        <button
          type="button"
          className="inline-link"
          onClick={() => onForgotPassword?.()}
        >
          Forgot Password?
        </button>
      </Card>
    </main>
  );
}
