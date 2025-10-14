"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function VisionSection() {
  const features = [
    {
      title: "Accessible",
      desc: "Healthcare data available when and where you need it.",
      icon: "/icons/globe.svg",
    },
    {
      title: "Secure",
      desc: "Bank-grade security protecting your medical privacy.",
      icon: "/icons/lock.svg",
    },
    {
      title: "Portable",
      desc: "Your health data travels with you across Africa.",
      icon: "/icons/shield.svg",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-white">
      {/* ===== Dotted Curve Line (hidden on mobile) ===== */}
      <motion.img
        src="/vision-curve-line.svg"
        alt="curve connector"
        className="absolute left-0 w-full hidden md:block opacity-80"
        style={{
          top: "8%",
          left: "-5%",
          width: "110%",
          transform: "translateY(-10%) rotate(-1deg)",
          zIndex: 1,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 tracking-tight relative inline-flex items-center justify-center gap-4 sm:gap-6">
            {/* "Our" with splash */}
            <span className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="pointer-events-none absolute left-[45%] top-[55%] -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <Image
                  src="/vision-splash.svg"
                  alt="splash effect"
                  width={140}
                  height={140}
                  className="opacity-90"
                />
              </motion.div>
              <span className="relative z-20">Our</span>
            </span>

            <span className="text-[#00A9B7] relative z-20">Vision</span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto px-2 sm:px-4">
            “To make healthcare data accessible, secure, and portable for every
            African patient — creating a continent where your medical history
            travels with you, your privacy is protected, and your healthcare
            decisions are informed by complete, trusted information.”
          </p>
        </motion.div>

        {/* ===== Feature Cards ===== */}
        <div className="relative flex flex-col md:flex-row justify-center md:justify-between items-center md:items-stretch gap-8 md:gap-6 mb-20 sm:mb-28">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative z-20 bg-white shadow-md rounded-2xl p-6 sm:p-8 text-center w-full max-w-[300px] md:max-w-[280px]"
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={40}
                height={40}
                className="mx-auto mb-4 sm:mb-5"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Decorative wavy line (hidden on mobile) */}
        <Image
          src="/vision-wavy-line.svg"
          alt=""
          width={166}
          height={52}
          className="absolute right-0 bottom-10 opacity-60 pointer-events-none hidden sm:block"
        />
      </div>
    </section>
  );
}
