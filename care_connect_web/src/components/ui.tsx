import React, { forwardRef, useId } from 'react';

// ─── Buttons ────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function PrimaryButton({ label, ...rest }: ButtonProps) {
  return (
    <button type="button" className="btn btn--primary" {...rest}>
      {label}
    </button>
  );
}

interface SecondaryButtonProps extends ButtonProps {
  /** Toggle state → announced as aria-selected (option buttons). */
  selected?: boolean;
}

export function SecondaryButton({ label, selected, ...rest }: SecondaryButtonProps) {
  return (
    <button
      type="button"
      className="btn btn--secondary"
      aria-selected={selected === undefined ? undefined : selected}
      {...rest}
    >
      {label}
    </button>
  );
}

// ─── Text field (label + input, associated & required-aware) ────────────────

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, required, error, multiline, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="field">
      <label className="field__label" htmlFor={fieldId}>
        {label}
        {required && (
          <>
            {' '}
            <span className="field__required" aria-hidden="true">
              *
            </span>
          </>
        )}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref}
          id={fieldId}
          className="field__input"
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
      )}
      {error && (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
});

// ─── Card ───────────────────────────────────────────────────────────────────

export function Card({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="card" {...rest}>
      {children}
    </div>
  );
}

// ─── Status badge (icon + text + colour → WCAG 1.4.1) ───────────────────────

export type BadgeVariant = 'active' | 'priority' | 'followup';

export function Badge({
  variant,
  icon,
  label,
}: {
  variant: BadgeVariant;
  icon: string;
  label: string;
}) {
  return (
    <span className={`badge badge--${variant}`}>
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}

// ─── Status region (aria-live) ──────────────────────────────────────────────

export function StatusRegion({ message }: { message: string }) {
  return (
    <div className="status-message" role="status" aria-live="polite">
      {message}
    </div>
  );
}
