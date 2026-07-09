import { X } from "lucide-react";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            {/* Header */}
            <div
              className={`flex justify-between items-center ${headerClassName} text-white px-6 py-4 sticky top-0 z-10`}
            >
              <h3 className="text-base font-semibold">{title}</h3>
              <button onClick={onClose} className="hover:opacity-80">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
