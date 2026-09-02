"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import type { ReactNode } from "react";

interface DialogPortalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  panelClassName?: string;
  containerClassName?: string;
  backdropClassName?: string;
  dismissible?: boolean;
}

const ignoreClose = () => undefined;

export default function DialogPortal({
  title,
  isOpen,
  onClose,
  children,
  panelClassName = "",
  containerClassName = "px-4 py-6",
  backdropClassName = "bg-black/40",
  dismissible = true,
}: DialogPortalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={dismissible ? onClose : ignoreClose}
      className="relative z-modal"
    >
      <DialogBackdrop
        transition
        className={`fixed inset-0 transition-opacity duration-200 data-closed:opacity-0 motion-reduce:transition-none ${backdropClassName}`}
      />

      <div className={`fixed inset-0 overflow-y-auto ${containerClassName}`}>
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            transition
            className={`transition duration-200 data-closed:translate-y-4 data-closed:opacity-0 motion-reduce:transform-none motion-reduce:transition-none ${panelClassName}`}
          >
            <DialogTitle className="sr-only">{title}</DialogTitle>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
