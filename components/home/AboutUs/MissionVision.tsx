"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MissionVisionSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden font-sans">
      {/* --- Floating Decorative Vectors --- */}
       <motion.img
        src="/vision-curve-line.svg"
        alt="curve connector"
        className="absolute left-0 w-full hidden md:block opacity-80"
        style={{
          top: "20%",
          left: "3%",
          width: "110%",
          transform: "translateY(-10%) rotate(-1deg)",
          zIndex: 0,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* --- Section Header --- */}
      <div className="text-center mb-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold"
        > Our{" "}
           <span className="bg-gradient-to-l  from-[#00B8A8] to-[#1A2380] bg-clip-text text-transparent">
          Mission & Vision
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-[#555] max-w-2xl mx-auto mt-3"
        >
        Driving Innovation and Excellence in everything we do.
        </motion.p>
      </div>

      {/* --- Mission and Vision --- */}
    <div className="mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-6xl">
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-start gap-6 bg-[white] shadow-lg rounded-2xl p-10 relative z-10"
        >
          <Image
            src="/icons/mission.svg"
            alt="mission"
            width={50}
            height={50}
            className="flex-shrink-0"
          />
          <div className="text-left">
            <h3 className="text-2xl font-semibold text-[#1A2380] mb-2">
              Our Mission
            </h3>
            <p className="text-[#444] leading-relaxed">
              To empower African healthcare institutions with secure, seamless and standardized access to patient information reducing delays, paperwork and duplicated tests — so that every patient receives faster, safer and more coordinated care.
            </p>
          </div>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-start gap-6 bg-[white] shadow-lg rounded-2xl p-10 relative z-10"
        >
          <Image
            src="/icons/vision.svg"
            alt="vision"
            width={50}
            height={50}
            className="flex-shrink-0"
          />
          <div className="text-left">
            <h3 className="text-2xl font-semibold text-[#00B8A8] mb-2">
              Our Vision
            </h3>
            <p className="text-[#444] leading-relaxed">
         To build Africa’s most trusted, interoperable health information network where hospitals, clinics and specialists can securely collaborate across borders, ensuring that every patient’s medical history follows them wherever they go.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
