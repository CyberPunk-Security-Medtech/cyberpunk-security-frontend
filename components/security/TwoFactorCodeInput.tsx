"use client";

import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

type TwoFactorCodeInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
};

const CODE_LENGTH = 6;

export default function TwoFactorCodeInput({
  id,
  label,
  value,
  onChange,
  disabled = false,
  invalid = false,
  autoFocus = false,
}: TwoFactorCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: CODE_LENGTH }, (_, index) => value[index] ?? "");

  const updateDigit = (index: number, nextValue: string) => {
    const numericValue = nextValue.replace(/\D/g, "");

    if (numericValue.length > 1) {
      const nextCode = numericValue.slice(0, CODE_LENGTH);
      onChange(nextCode);
      inputRefs.current[Math.min(nextCode.length, CODE_LENGTH) - 1]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = numericValue;
    onChange(nextDigits.join(""));

    if (numericValue && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!pastedCode) return;
    event.preventDefault();
    onChange(pastedCode);
    inputRefs.current[Math.min(pastedCode.length, CODE_LENGTH) - 1]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div
      id={id}
      role="group"
      aria-label={label}
      className="flex w-full justify-center gap-2 sm:gap-3"
      onPaste={handlePaste}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && index === 0}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`${label}, digit ${index + 1} of ${CODE_LENGTH}`}
          aria-invalid={invalid}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white text-center text-lg font-semibold text-slate-900 outline-none focus:border-[#1A2380] focus-visible:ring-2 focus-visible:ring-[#1A2380]/25 disabled:cursor-not-allowed disabled:bg-slate-100 sm:h-12 sm:max-w-12"
        />
      ))}
    </div>
  );
}
