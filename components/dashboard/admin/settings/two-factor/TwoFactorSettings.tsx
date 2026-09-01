"use client";

import axios from "axios";
import Image from "next/image";
import QRCode from "qrcode";
import { Check, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import {
  authService,
  type TwoFactorSetupResult,
  type TwoFactorStatus,
} from "@services/api";
import BackupCodesDisplay from "@components/security/BackupCodesDisplay";
import TwoFactorCodeInput from "@components/security/TwoFactorCodeInput";
import TwoFactorDialog from "./TwoFactorDialog";

type FlowStep =
  | "closed"
  | "enable-password"
  | "enable-confirm"
  | "enable-backup-codes"
  | "enable-success"
  | "disable-password"
  | "disable-code"
  | "disable-success"
  | "regenerate-password"
  | "regenerated-codes";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback;

  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object" && "message" in detail) {
    return String(detail.message);
  }

  const message = error.response?.data?.message;
  return typeof message === "string" ? message : fallback;
};

const primaryButtonClass =
  "dashboard-button min-h-11 w-full rounded-lg bg-[#1A2380] px-5 text-sm font-semibold text-white hover:bg-[#11185F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const inputClass =
  "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#1A2380] focus-visible:ring-2 focus-visible:ring-[#1A2380]/25 disabled:cursor-not-allowed disabled:bg-slate-100";

export default function TwoFactorSettings() {
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [flow, setFlow] = useState<FlowStep>("closed");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [usingBackupCode, setUsingBackupCode] = useState(false);
  const [setup, setSetup] = useState<TwoFactorSetupResult | null>(null);
  const [qrImage, setQrImage] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [codesSaved, setCodesSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadStatus = useCallback(async () => {
    setStatusLoading(true);
    setStatusError("");
    try {
      setStatus(await authService.getTwoFactorStatus());
    } catch (requestError) {
      setStatusError(
        getErrorMessage(requestError, "Unable to load two-factor authentication status."),
      );
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    let cancelled = false;

    if (!setup?.otpauth_uri) {
      setQrImage("");
      return;
    }

    void QRCode.toDataURL(setup.otpauth_uri, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 224,
    })
      .then((dataUrl) => {
        if (!cancelled) setQrImage(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to display the QR code. Use the setup key below instead.");
      });

    return () => {
      cancelled = true;
    };
  }, [setup?.otpauth_uri]);

  const resetFlowState = () => {
    setPassword("");
    setCode("");
    setUsingBackupCode(false);
    setSetup(null);
    setQrImage("");
    setBackupCodes([]);
    setCodesSaved(false);
    setError("");
  };

  const openFlow = (nextFlow: FlowStep) => {
    resetFlowState();
    setFlow(nextFlow);
  };

  const closeFlow = () => {
    if (busy) return;
    setFlow("closed");
    resetFlowState();
  };

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || !password) {
      if (!password) setError("Enter your password to continue.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      if (flow === "enable-password") {
        const setupResult = await authService.setupTwoFactor({
          password,
          method: "totp",
        });
        if (!setupResult.otpauth_uri && !setupResult.secret) {
          throw new Error("The setup response did not include authenticator details.");
        }
        setSetup(setupResult);
        setPassword("");
        setFlow("enable-confirm");
      } else if (flow === "disable-password") {
        setFlow("disable-code");
      } else if (flow === "regenerate-password") {
        const result = await authService.regenerateTwoFactorBackupCodes(password);
        setBackupCodes(result.codes);
        setPassword("");
        setFlow("regenerated-codes");
        await loadStatus();
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error && !axios.isAxiosError(requestError)
          ? requestError.message
          : getErrorMessage(requestError, "Unable to continue. Check your password and try again."),
      );
    } finally {
      setBusy(false);
    }
  };

  const confirmEnable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (code.length !== 6) {
      setError("Enter the complete 6-digit code from your authenticator app.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await authService.confirmTwoFactor(code);
      setBackupCodes(result.codes);
      setCode("");
      setFlow("enable-backup-codes");
      await loadStatus();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "That code could not be verified. Try the newest code."));
    } finally {
      setBusy(false);
    }
  };

  const confirmDisable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    const submittedCode = code.trim();
    if ((!usingBackupCode && submittedCode.length !== 6) || (usingBackupCode && submittedCode.length < 8)) {
      setError(
        usingBackupCode
          ? "Enter one of your unused backup codes."
          : "Enter the complete 6-digit authenticator code.",
      );
      return;
    }

    setBusy(true);
    setError("");
    try {
      await authService.disableTwoFactor({ password, code: submittedCode });
      setPassword("");
      setCode("");
      setFlow("disable-success");
      await loadStatus();
      toast.success("Two-factor authentication disabled");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to disable two-factor authentication."));
    } finally {
      setBusy(false);
    }
  };

  const finishEnableFlow = () => {
    setFlow("enable-success");
    toast.success("Two-factor authentication enabled");
  };

  const renderFeedback = () => (
    <div aria-live="polite" className="min-h-6 pt-2">
      {error ? <p role="alert" className="text-center text-sm text-red-700">{error}</p> : null}
    </div>
  );

  return (
    <>
      <div className="mt-2 divide-y divide-slate-300">
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">Email verification</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Your account email is managed separately from authenticator-app 2FA.
            </p>
          </div>
          <span className="w-fit rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600">
            Account security
          </span>
        </div>

        <div className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Two-factor authentication</p>
              {statusLoading ? (
                <p className="mt-1 text-xs leading-5 text-slate-500">Checking your security status…</p>
              ) : status?.enabled ? (
                <>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {status.method === "email"
                      ? "Email codes are protecting your account."
                      : "Authenticator app is protecting your account."}
                  </p>
                  <p className="mt-1 text-xs font-medium text-emerald-700">
                    {status.backup_codes_remaining} backup codes remaining
                  </p>
                </>
              ) : (
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Add a changing 6-digit authenticator code to your login.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 min-[420px]:flex-row">
              {status?.enabled ? (
                <>
                  <button
                    type="button"
                    onClick={() => openFlow("regenerate-password")}
                    disabled={statusLoading}
                    className="dashboard-button min-h-11 rounded-full border border-[#1A2380] px-5 text-sm font-medium text-[#1A2380] hover:bg-[#1A2380]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Regenerate backup codes
                  </button>
                  <button
                    type="button"
                    onClick={() => openFlow("disable-password")}
                    disabled={statusLoading}
                    className="dashboard-button min-h-11 rounded-full border border-red-500 px-7 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Disable
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => openFlow("enable-password")}
                  disabled={statusLoading || Boolean(statusError)}
                  className="dashboard-button min-h-11 rounded-full border border-[#00B8A8] px-8 text-sm font-medium text-[#008F83] hover:bg-[#00B8A8]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008F83] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Enable
                </button>
              )}
            </div>
          </div>

          {statusError ? (
            <div className="mt-3 flex flex-wrap items-center gap-3" role="alert">
              <p className="text-sm text-red-700">{statusError}</p>
              <button
                type="button"
                onClick={() => void loadStatus()}
                className="min-h-11 rounded-lg px-3 text-sm font-semibold text-[#1A2380] hover:bg-[#1A2380]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380]"
              >
                Try again
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <TwoFactorDialog
        open={flow === "enable-password" || flow === "disable-password" || flow === "regenerate-password"}
        title="Input Your Password"
        description="Let’s confirm it is you."
        onClose={closeFlow}
        busy={busy}
      >
        <form onSubmit={submitPassword} className="space-y-4">
          <div>
            <label htmlFor="two-factor-password" className="text-sm font-medium text-slate-800">
              Password
            </label>
            <input
              id="two-factor-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              disabled={busy}
              aria-invalid={Boolean(error)}
              aria-describedby="two-factor-password-feedback"
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div id="two-factor-password-feedback">{renderFeedback()}</div>
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busy ? "Please wait…" : "Continue"}
          </button>
        </form>
      </TwoFactorDialog>

      <TwoFactorDialog
        open={flow === "enable-confirm"}
        title="Scan QR Code"
        description="Connect PrivaCure to your authenticator app."
        onClose={closeFlow}
        busy={busy}
      >
        <form onSubmit={confirmEnable} className="space-y-4">
          <div className="flex min-h-56 items-center justify-center rounded-xl bg-slate-50 p-3">
            {qrImage ? (
              <Image
                src={qrImage}
                alt="QR code for adding PrivaCure to an authenticator app"
                width={224}
                height={224}
                unoptimized
                className="h-auto w-full max-w-56"
              />
            ) : (
              <RefreshCw aria-hidden="true" className="animate-spin text-slate-400 motion-reduce:animate-none" />
            )}
          </div>

          <ol className="list-decimal space-y-1 pl-5 text-xs leading-5 text-slate-600">
            <li>Open an authenticator app on your phone.</li>
            <li>Scan the QR code or enter the setup key manually.</li>
            <li>Enter the newest 6-digit code below.</li>
          </ol>

          {setup?.secret ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500">Manual setup key</p>
              <code className="mt-1 block break-all text-sm font-semibold text-slate-900">{setup.secret}</code>
            </div>
          ) : null}

          <div>
            <p className="mb-3 text-center text-sm font-medium text-slate-800">Enter your 6-digit code</p>
            <TwoFactorCodeInput
              id="enable-two-factor-code"
              label="Authenticator code"
              value={code}
              onChange={(nextCode) => {
                setCode(nextCode);
                setError("");
              }}
              disabled={busy}
              invalid={Boolean(error)}
            />
          </div>
          {renderFeedback()}
          <button type="submit" disabled={busy || code.length !== 6} className={primaryButtonClass}>
            {busy ? "Verifying…" : "Continue"}
          </button>
        </form>
      </TwoFactorDialog>

      <TwoFactorDialog
        open={flow === "enable-backup-codes" || flow === "regenerated-codes"}
        title={`${backupCodes.length} Backup codes`}
        description="Save these codes somewhere safe. Each code can be used only once."
        onClose={closeFlow}
        dismissible={false}
      >
        <BackupCodesDisplay codes={backupCodes} />
        <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-center gap-3 rounded-lg px-2 text-sm text-slate-700 focus-within:ring-2 focus-within:ring-[#1A2380]">
          <input
            type="checkbox"
            checked={codesSaved}
            onChange={(event) => setCodesSaved(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#1A2380] focus:ring-[#1A2380]"
          />
          I have saved these backup codes
        </label>
        <button
          type="button"
          onClick={flow === "enable-backup-codes" ? finishEnableFlow : closeFlow}
          disabled={!codesSaved}
          className={`mt-2 ${primaryButtonClass}`}
        >
          Done
        </button>
      </TwoFactorDialog>

      <TwoFactorDialog
        open={flow === "disable-code"}
        title="Confirm two-factor code"
        description="Enter a current authenticator code or an unused backup code."
        onClose={closeFlow}
        busy={busy}
      >
        <form onSubmit={confirmDisable} className="space-y-4">
          {usingBackupCode ? (
            <div>
              <label htmlFor="disable-backup-code" className="text-sm font-medium text-slate-800">
                Backup code
              </label>
              <input
                id="disable-backup-code"
                type="text"
                autoComplete="one-time-code"
                autoFocus
                value={code}
                disabled={busy}
                aria-invalid={Boolean(error)}
                onChange={(event) => {
                  setCode(event.target.value);
                  setError("");
                }}
                className={`mt-2 font-mono ${inputClass}`}
              />
            </div>
          ) : (
            <TwoFactorCodeInput
              id="disable-two-factor-code"
              label="Authenticator code"
              value={code}
              onChange={(nextCode) => {
                setCode(nextCode);
                setError("");
              }}
              disabled={busy}
              invalid={Boolean(error)}
            />
          )}

          <button
            type="button"
            onClick={() => {
              setUsingBackupCode((current) => !current);
              setCode("");
              setError("");
            }}
            className="mx-auto block min-h-11 rounded-lg px-3 text-sm font-semibold text-[#1A2380] hover:bg-[#1A2380]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380]"
          >
            {usingBackupCode ? "Use authenticator code" : "Use a backup code"}
          </button>

          {renderFeedback()}
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busy ? "Turning off 2FA…" : "Continue"}
          </button>
        </form>
      </TwoFactorDialog>

      <TwoFactorDialog
        open={flow === "enable-success" || flow === "disable-success"}
        title={flow === "enable-success" ? "2FA has been turned on" : "2FA has been turned off"}
        onClose={closeFlow}
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#DDF9F4] text-[#00A99A]">
            {flow === "enable-success" ? (
              <ShieldCheck aria-hidden="true" size={64} strokeWidth={1.6} />
            ) : (
              <Check aria-hidden="true" size={64} strokeWidth={1.6} />
            )}
          </div>
          <p className="text-sm leading-6 text-slate-600">
            {flow === "enable-success"
              ? "Your account now requires an authenticator code when you sign in."
              : "Your account will no longer request a second factor when you sign in."}
          </p>
          <button type="button" onClick={closeFlow} className={primaryButtonClass}>
            Done
          </button>
        </div>
      </TwoFactorDialog>
    </>
  );
}
