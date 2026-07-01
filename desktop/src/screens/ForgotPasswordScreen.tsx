import React, { useEffect, useRef, useState } from 'react';
import { Card, Field, PrimaryButton, SecondaryButton, StatusRegion } from '../components/ui';

export interface ForgotPasswordScreenProps {
  onBack?: () => void;
}

export default function ForgotPasswordScreen({
  onBack,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="app-main" id="main-content">
      <h1 className="brand" tabIndex={-1} ref={headingRef}>
        CareConnect
      </h1>
      <p className="tagline">Your personal health companion</p>
      <Card>
        <h2 className="section-heading">Reset Password</h2>
        {sent ? (
          <StatusRegion message="Reset link sent! Check your email." />
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <p className="card__meta">
              Enter your email address and we&apos;ll send you instructions to
              reset your password.
            </p>
            <Field
              label="Email Address"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PrimaryButton label="Send Reset Link" type="submit" />
          </form>
        )}
        <div className="stack-gap" />
        <SecondaryButton label="Back to Login" onClick={() => onBack?.()} />
      </Card>
    </main>
  );
}
