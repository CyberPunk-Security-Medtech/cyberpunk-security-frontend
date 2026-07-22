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
  header?: ReactNode;
  headerClassName?: string;
}

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
  className,
  header,
  headerClassName,
}: ModalProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className={`bg-white rounded-xl shadow-lg w-[95%] max-w-3xl max-h-[95vh] flex flex-col ${className ?? ""}`}
          >
            {/* Header - Updated to apply headerClassName or fallback to default blue */}
            <div className={`flex justify-between items-center text-white px-6 py-4 sticky top-0 z-10 ${headerClassName || "bg-[#1A2380]"}`}>
              <div>
                <h3 className="text-base font-semibold">{title}</h3>
                {header ? <p className="text-sm text-slate-200">{header}</p> : null}
              </div>
              <button onClick={onClose} className="hover:opacity-80">
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}