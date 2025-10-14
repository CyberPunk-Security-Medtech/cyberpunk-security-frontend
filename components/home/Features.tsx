"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FeaturesCard() {
  const items = [
    { icon: "/feature-hospital-icon.svg", label: "Hospital", bg: "bg-[#E6F2FF]" },
    { icon: "/feature-hmo.svg", label: "HMOs", bg: "bg-[#E8FFF2]" },
    { icon: "/feature-lab.svg", label: "Labs", bg: "bg-[#F3E9FF]" },
    { icon: "/feature-patient.svg", label: "Patients", bg: "bg-[#FFECEC]" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        mx-auto -mt-12 w-[92%] max-w-4xl
        rounded-3xl bg-white/90 backdrop-blur shadow-md border border-gray-100
        px-4 sm:px-8 py-6 flex items-center justify-between gap-4
        overflow-x-auto scrollbar-hide
        relative z-20
      "
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="flex flex-col items-center flex-shrink-0 min-w-[70px] sm:min-w-[80px]"
        >
          <div
            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center ${it.bg}`}
          >
            <Image src={it.icon} alt={it.label} width={26} height={26} />
          </div>
          <p className="mt-2 text-xs sm:text-sm font-medium text-gray-800 text-center">
            {it.label}
          </p>
        </div>
      ))}
    </motion.div>
  );
}
