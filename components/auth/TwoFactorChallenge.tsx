"use client";

import axios from "axios";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { authService, type TwoFactorMethod } from "@services/api";
import TwoFactorCodeInput from "@components/security/TwoFactorCodeInput";

type TwoFactorChallengeProps = {
  method: TwoFactorMethod;
  onVerified: () => Promise<void>;
  onCancel: () => void;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback;
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object" && "message" in detail) {
    return String(detail.message);
  }
  return fallback;
};

export default function TwoFactorChallenge({
  method,
  onVerified,
  onCancel,
}: TwoFactorChallengeProps) {
  const [code, setCode] = useState("");
  const [usingBackupCode, setUsingBackupCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const submittedCode = code.trim();
    if ((!usingBackupCode && submittedCode.length !== 6) || (usingBackupCode && submittedCode.length < 8)) {
      setError(
        usingBackupCode
          ? "Enter one of your unused backup codes."
          : "Enter the complete 6-digit code.",
      );
      return;
    }

    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      if (usingBackupCode) {
        await authService.recoverTwoFactor(submittedCode);
      } else {
        await authService.verifyTwoFactor(submittedCode);
      }
      await onVerified();
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          usingBackupCode
            ? "That backup code could not be accepted. Try another unused code."
            : "That code could not be verified. Enter the newest code and try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resendEmailCode = async () => {
    if (resending) return;
    setResending(true);
    setError("");
    setNotice("");
    try {
      await authService.resendTwoFactorCode();
      setNotice("A new sign-in code has been sent to your email.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to resend the code right now."));
    } finally {
      setResending(false);
    }
  };

  const switchCodeType = () => {
    setUsingBackupCode((current) => !current);
    setCode("");
    setError("");
    setNotice("");
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F1FF] text-[#1E237E]">
          {method === "email" && !usingBackupCode ? (
            <Mail aria-hidden="true" size={24} />
          ) : (
            <ShieldCheck aria-hidden="true" size={24} />
          )}
        </div>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">Two-factor authentication</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {usingBackupCode
            ? "Enter one of the backup codes you saved when you enabled 2FA."
            : method === "email"
              ? "Enter the 6-digit code sent to your email."
              : "Enter the current 6-digit code from your authenticator app."}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {usingBackupCode ? (
          <div>
            <label htmlFor="login-backup-code" className="text-sm font-medium text-slate-800">
              Backup code
            </label>
            <input
              id="login-backup-code"
              type="text"
              autoComplete="one-time-code"
              autoFocus
              value={code}
              disabled={submitting}
              aria-invalid={Boolean(error)}
              aria-describedby="login-two-factor-feedback"
              onChange={(event) => {
                setCode(event.target.value);
                setError("");
              }}
              className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-mono text-sm text-slate-900 outline-none focus:border-[#1E237E] focus-visible:ring-2 focus-visible:ring-[#1E237E]/20 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>
        ) : (
          <TwoFactorCodeInput
            id="login-two-factor-code"
            label={method === "email" ? "Email sign-in code" : "Authenticator code"}
            value={code}
            onChange={(nextCode) => {
              setCode(nextCode);
              setError("");
            }}
            autoFocus
            disabled={submitting}
            invalid={Boolean(error)}
          />
        )}

        <div id="login-two-factor-feedback" aria-live="polite" className="min-h-6 text-center text-sm">
          {error ? <p role="alert" className="text-red-700">{error}</p> : null}
          {notice ? <p className="text-emerald-700">{notice}</p> : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 w-full rounded-full bg-[#1E237E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#171B65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E237E] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Verifying…" : "Continue"}
        </button>
      </form>

      <div className="flex flex-col items-center gap-1 text-sm">
        {method === "email" && !usingBackupCode ? (
          <button
            type="button"
            onClick={() => void resendEmailCode()}
            disabled={resending}
            className="min-h-11 rounded-lg px-3 font-semibold text-[#1E237E] hover:bg-[#1E237E]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E237E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend email code"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={switchCodeType}
          className="min-h-11 rounded-lg px-3 font-semibold text-[#1E237E] hover:bg-[#1E237E]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E237E]"
        >
          {usingBackupCode
            ? method === "email"
              ? "Use email code"
              : "Use authenticator code"
            : "Use a backup code"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E237E]"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Back to sign in
        </button>
      </div>
    </div>
  );
}
