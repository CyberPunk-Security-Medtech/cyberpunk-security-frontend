"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import Modal from "@components/Modal";
import { hmoService, type Hmo } from "@services/api";
import { getApiErrorMessage } from "@utils/apiError";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  orgId: string | null;
  onCreated: (hmo: Hmo) => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass =
  "w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#051466] disabled:bg-slate-50";

export default function AddHmoModal({ isOpen, onClose, orgId, onCreated }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName("");
    setCode("");
    setEmail("");
    setPhone("");
    setError(null);
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!orgId) {
      setError("No active workspace. Reload the page and try again.");
      return;
    }
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      setError("HMO name is required.");
      return;
    }
    if (trimmedEmail && !EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Enter a valid contact email or leave it blank.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await hmoService.createHmo(orgId, {
        name: trimmedName,
        code: code.trim() || null,
        contact_email: trimmedEmail || null,
        contact_phone: phone.trim() || null,
      });
      toast.success(`${created.name} added`);
      onCreated(created);
      onClose();
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Failed to add HMO. Ensure your account has admin access."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Add an HMO" isOpen={isOpen} onClose={saving ? () => {} : onClose} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">
            HMO name <span className="text-red-600">*</span>
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={255}
            required
            disabled={saving}
            placeholder="e.g. AXA Mansard"
            className={inputClass}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Code</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={50}
            disabled={saving}
            placeholder="Optional"
            className={inputClass}
          />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Contact email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
              placeholder="Optional"
              className={inputClass}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Contact phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={50}
              disabled={saving}
              placeholder="Optional"
              className={inputClass}
            />
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="min-h-10 rounded-md border px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="min-h-10 rounded-md bg-[#051466] px-4 text-sm font-semibold text-white hover:bg-[#020B44] disabled:opacity-60"
          >
            {saving ? "Adding…" : "Add HMO"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
