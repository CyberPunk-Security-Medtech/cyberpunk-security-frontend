"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
  className,
  headerClassName = "bg-[#1A2380]",
}: ModalProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50"
        >
          <DialogBackdrop
            as={motion.div}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            className="fixed inset-0 bg-black/50"
          />

          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
            <DialogPanel
              as={motion.div}
              initial={reduceMotion ? false : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 1 } : { y: 24, opacity: 0 }}
              className={`flex max-h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-lg sm:max-h-[calc(100dvh-2rem)] ${className ?? ""}`}
            >
              <div
                className={`sticky top-0 z-10 flex items-center justify-between px-4 py-4 text-white sm:px-6 ${headerClassName}`}
              >
                <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                {children}
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
