"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type TwoFactorDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  busy?: boolean;
  dismissible?: boolean;
  children: ReactNode;
};

export default function TwoFactorDialog({
  open,
  title,
  description,
  onClose,
  busy = false,
  dismissible = true,
  children,
}: TwoFactorDialogProps) {
  const canDismiss = dismissible && !busy;

  return (
    <Dialog open={open} onClose={canDismiss ? onClose : () => undefined} className="relative z-modal">
      <DialogBackdrop className="fixed inset-0 bg-slate-950/55 backdrop-blur-[1px]" />
      <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="relative w-full max-w-md rounded-2xl bg-white px-5 py-6 shadow-2xl sm:px-8 sm:py-8">
            {dismissible ? (
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                aria-label="Close two-factor authentication dialog"
                className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X aria-hidden="true" size={20} />
              </button>
            ) : null}

            <div className="pr-8 text-center">
              <DialogTitle className="text-xl font-semibold text-slate-950">{title}</DialogTitle>
              {description ? (
                <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
              ) : null}
            </div>

            <div className="mt-6">{children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
