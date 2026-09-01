"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { authService } from "@services/api";
import SettingsSection from "./SettingsSection";
import TwoFactorSettings from "./two-factor/TwoFactorSettings";

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
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof PasswordForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
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
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await authService.changePassword({
        old_password: form.currentPassword,
        new_password: form.newPassword,
      });
      setForm(emptyForm);
      toast.success("Password updated successfully");
    } catch (requestError) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.detail ||
          requestError.response?.data?.message ||
          "Unable to update your password."
        : "Unable to update your password.";
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
                aria-describedby="password-requirements"
                className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 px-3 text-sm text-slate-800 outline-none focus:border-[#051466] focus-visible:ring-2 focus-visible:ring-[#051466]"
              />
            </div>
          ))}
        </div>

        <p id="password-requirements" className="sr-only">
          The new password must be at least 8 characters, contain a number, differ from the current password, and match the confirmation.
        </p>

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
        <TwoFactorSettings />
      </div>
    </SettingsSection>
  );
}
