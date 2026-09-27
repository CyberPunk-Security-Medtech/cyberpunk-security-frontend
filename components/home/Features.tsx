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
        rounded-md bg-white/90 backdrop-blur shadow-md border border-gray-100
        px-3 sm:px-8 py-5 sm:py-6
        grid grid-cols-4 gap-2 sm:gap-4
        relative z-20
      "
    >
      {/* Four equal columns that shrink with the card — never wider than the screen. */}
      {items.map((it) => (
        <div
          key={it.label}
          className="flex min-w-0 flex-col items-center"
        >
          <div
            className={`h-11 w-11 sm:h-14 sm:w-14 rounded-full flex items-center justify-center ${it.bg}`}
          >
            <Image src={it.icon} alt="" width={26} height={26} className="h-5 w-5 sm:h-[26px] sm:w-[26px]" />
          </div>
          <p className="mt-2 w-full truncate text-[11px] sm:text-sm font-medium text-gray-800 text-center">
            {it.label}
          </p>
        </div>
      ))}
    </motion.div>
  );
}
