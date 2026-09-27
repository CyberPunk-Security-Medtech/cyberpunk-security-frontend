"use client";

import { AlertTriangle } from "lucide-react";
import { useCallback, useRef, useState, type ReactNode } from "react";
import DialogPortal from "@components/DialogPortal";

export type ConfirmOptions = {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  // Destructive actions (delete, remove, overwrite) get a red confirm button.
  destructive?: boolean;
};

type ConfirmDialogProps = ConfirmOptions & {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <DialogPortal
      title={title}
      isOpen={isOpen}
      onClose={onCancel}
      backdropClassName="bg-black/50"
      panelClassName="w-full max-w-md rounded-md bg-white p-6 shadow-lg"
    >
      <div className="flex gap-4">
        {destructive ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle size={20} aria-hidden="true" />
          </div>
        ) : null}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {message ? (
            <div className="mt-1 text-sm leading-6 text-slate-600">{message}</div>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-10 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          autoFocus
          onClick={onConfirm}
          className={`min-h-10 rounded-md px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            destructive
              ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
              : "bg-[var(--dashboard-accent,#1A2380)] hover:bg-[var(--dashboard-accent-hover,#11185F)] focus-visible:ring-[var(--dashboard-accent,#1A2380)]"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </DialogPortal>
  );
}

// Promise-based replacement for window.confirm:
//   const { confirm, confirmDialog } = useConfirm();
//   if (!(await confirm({ title: "Delete file?", destructive: true }))) return;
//   ...render {confirmDialog} somewhere in the component.
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    resolverRef.current?.(false);
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const settle = (value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOptions(null);
  };

  const confirmDialog = (
    <ConfirmDialog
      isOpen={options !== null}
      title={options?.title ?? ""}
      message={options?.message}
      confirmLabel={options?.confirmLabel}
      cancelLabel={options?.cancelLabel}
      destructive={options?.destructive}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  );

  return { confirm, confirmDialog };
}
