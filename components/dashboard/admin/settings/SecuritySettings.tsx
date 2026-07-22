"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { authService } from "@services/api";
import SettingsSection from "./SettingsSection";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const emptyForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SecuritySettings() {
  const [form, setForm] = useState<PasswordForm>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof PasswordForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return "Enter your current password, new password, and confirmation.";
    }
    if (form.newPassword.length < 8 || !/\d/.test(form.newPassword)) {
      return "The new password must be at least 8 characters and contain a number.";
    }
    if (form.newPassword === form.currentPassword) {
      return "The new password must be different from the current password.";
    }
    if (form.newPassword !== form.confirmPassword) {
      return "The new password and confirmation do not match.";
    }
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await authService.changePassword({
        old_password: form.currentPassword,
        new_password: form.newPassword,
      });
      setForm(emptyForm);
      setSuccess("Your password has been updated successfully.");
      toast.success("Password updated successfully");
    } catch (requestError) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.detail ||
          requestError.response?.data?.message ||
          "Unable to update your password."
        : "Unable to update your password.";
      setError(String(message));
      toast.error(String(message));
    } finally {
      setSubmitting(false);
    }
  };

  const passwordFields = [
    { key: "currentPassword", label: "Current password", autoComplete: "current-password" },
    { key: "newPassword", label: "New password", autoComplete: "new-password" },
    { key: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
  ] as const;

  return (
    <SettingsSection id="security-settings" title="Security">
      <form onSubmit={handleSubmit} noValidate>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Password</h3>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Use at least 8 characters and include a number.
        </p>

        <div className="mt-1">
          {passwordFields.map((field, index) => (
            <div
              key={field.key}
              className={`grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(220px,300px)] sm:items-center ${index < passwordFields.length - 1 ? "border-b border-slate-300" : ""}`}
            >
              <label htmlFor={field.key} className="text-sm font-medium text-slate-800">
                {field.label}
              </label>
              <input
                id={field.key}
                type="password"
                autoComplete={field.autoComplete}
                value={form[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby="password-feedback password-requirements"
                className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 px-3 text-sm text-slate-800 outline-none focus:border-[#051466] focus-visible:ring-2 focus-visible:ring-[#051466]"
              />
            </div>
          ))}
        </div>

        <p id="password-requirements" className="sr-only">
          The new password must be at least 8 characters, contain a number, differ from the current password, and match the confirmation.
        </p>
        <div id="password-feedback" aria-live="polite" className="min-h-6">
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          {success && <p className="text-sm text-emerald-700">{success}</p>}
        </div>

        <div className="mt-3 flex justify-stretch sm:justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="dashboard-button min-h-11 w-full rounded-lg bg-[#1A2380] px-5 text-sm font-semibold text-white hover:bg-[#11185F] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10 sm:w-auto"
          >
            {submitting ? "Updating password..." : "Update password"}
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-slate-300 pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Two-factor authentication
        </h3>
        <div className="mt-2 flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">Email verification</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">One-time code sent to your email</p>
            <p id="two-factor-unavailable" className="mt-1 text-xs leading-5 text-slate-500">
              Two-factor setup is not available yet.
            </p>
          </div>
          <button
            type="button"
            disabled
            aria-describedby="two-factor-unavailable"
            className="dashboard-button min-h-11 rounded-full border border-[#00B8A8] px-8 text-sm font-medium text-[#008F83] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10"
          >
            Enable
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
