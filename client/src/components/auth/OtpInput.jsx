import { useId, useMemo, useRef } from 'react';
import { normalizeOtp } from '../../utils/authValidation.js';
import { cn } from '../../utils/cn.js';

const OTP_LENGTH = 6;

function OtpInput({ error, label = 'Six-digit verification code', onChange, value }) {
  const generatedId = useId();
  const idPrefix = useMemo(() => `otp-${generatedId.replace(/:/g, '')}`, [generatedId]);
  const inputRefs = useRef([]);
  const digits = normalizeOtp(value).padEnd(OTP_LENGTH, ' ').split('').slice(0, OTP_LENGTH);
  const errorId = error ? `${idPrefix}-error` : undefined;
  const helpId = `${idPrefix}-help`;

  const updateDigit = (index, nextValue) => {
    const nextDigits = [...digits].map((digit) => (digit === ' ' ? '' : digit));
    nextDigits[index] = nextValue;
    onChange(nextDigits.join('').slice(0, OTP_LENGTH));
  };

  const fillFromIndex = (index, pastedValue) => {
    const pastedDigits = normalizeOtp(pastedValue).split('');

    if (!pastedDigits.length) {
      return;
    }

    const nextDigits = [...digits].map((digit) => (digit === ' ' ? '' : digit));
    pastedDigits.forEach((digit, offset) => {
      const nextIndex = index + offset;
      if (nextIndex < OTP_LENGTH) {
        nextDigits[nextIndex] = digit;
      }
    });

    onChange(nextDigits.join('').slice(0, OTP_LENGTH));

    const nextFocusIndex = Math.min(index + pastedDigits.length, OTP_LENGTH - 1);
    window.requestAnimationFrame(() => inputRefs.current[nextFocusIndex]?.focus());
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-brand-text" htmlFor={`${idPrefix}-0`}>
          {label}
        </label>
        <p className="mt-1 text-sm text-brand-muted" id={helpId}>
          Enter the code using numbers only.
        </p>
      </div>
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <input
            aria-describedby={cn(helpId, errorId) || undefined}
            aria-invalid={error ? 'true' : undefined}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            className={cn(
              'h-12 w-full rounded-brand border bg-white text-center text-lg font-bold text-brand-text shadow-soft transition-all duration-200 sm:h-14 sm:text-xl',
              'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
              'focus:scale-[1.03]',
              error ? 'border-brand-error' : 'border-brand-border',
            )}
            id={`${idPrefix}-${index}`}
            inputMode="numeric"
            key={`${idPrefix}-${index}`}
            maxLength={1}
            onChange={(event) => {
              const nextValue = normalizeOtp(event.target.value);

              if (nextValue.length > 1) {
                fillFromIndex(index, nextValue);
                return;
              }

              updateDigit(index, nextValue);

              if (nextValue && index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && !digits[index].trim() && index > 0) {
                event.preventDefault();
                updateDigit(index - 1, '');
                inputRefs.current[index - 1]?.focus();
              }

              if (event.key === 'ArrowLeft' && index > 0) {
                event.preventDefault();
                inputRefs.current[index - 1]?.focus();
              }

              if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
                event.preventDefault();
                inputRefs.current[index + 1]?.focus();
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
              fillFromIndex(index, event.clipboardData.getData('text'));
            }}
            pattern="[0-9]*"
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            value={digits[index].trim()}
          />
        ))}
      </div>
      {error ? (
        <p className="text-sm font-medium text-brand-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default OtpInput;
