"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";
import DialogPortal from "@components/DialogPortal";

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
  return (
    <DialogPortal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      backdropClassName="bg-black/50"
      panelClassName={`flex max-h-[calc(100dvh-2rem)] w-[95%] max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-lg ${className ?? ""}`}
    >
      <div
        className={`flex shrink-0 items-center justify-between px-6 py-4 text-white ${headerClassName || "bg-[#1A2380]"}`}
      >
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {header ? <p className="text-sm text-slate-200">{header}</p> : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="rounded-md p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {children}
      </div>
    </DialogPortal>
  );
}
