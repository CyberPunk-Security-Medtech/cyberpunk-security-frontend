"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Profile",
      desc: "Hospitals sign up securely and Admins create staff accounts, assign roles, and set permissions. This ensures every user accesses only what they need.",
      icon: "/icons/profile.svg",
    },
    {
      title: "Manage & Transfer Records",
      desc: "Doctors, Nurses, Pharmacists and Lab Techs create and update patient records within their dashboards. When another hospital needs the data, a secure transfer is initiated.",
      icon: "/icons/folder-transfer.svg",
    },
    {
      title: "Consent & Access",
      desc: "Patients or guardians approve the transfer through a secure SMS/OTP link. The receiving hospital gets temporary, encrypted access — everything is logged automatically.",
      icon: "/icons/consent.svg",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24">
      {/* ===== Background Wavy Line (behind text & image) ===== */}
      <motion.img
        src="/how-our-platform-works-wavy-line.svg"
        alt="decorative curve"
        className="absolute left-0 w-full opacity-70 hidden sm:block"
        style={{
          top: "10%",
          transform: "translateY(-15%)",
          zIndex: 1, // Behind content
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How<span className="text-[#00A9B7]">  our platform</span> works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
            Navigating your healthcare journey with <strong>PrivaCure</strong> is seamless.
            Just follow these steps mentioned below to proceed with your selected services.
            You can also see our FAQ section for more guidance.
          </p>
        </motion.div>

        {/* ===== Steps and Illustration ===== */}
        <div className="grid md:grid-cols-2 gap-12 items-center text-left">
          {/* Steps List */}
          <div>
            <div className="space-y-6">
     {steps.map((step, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.2, duration: 0.5 }}
    viewport={{ once: true }}
    className="flex flex-col gap-2"
  >
    {/* === ICON + TITLE on the same line === */}
    <div className="flex items-center gap-3">
      <Image
        src={step.icon}
        alt={step.title}
        width={30}
        height={30}
        className="flex-shrink-0"
      />
      <h4 className="text-lg font-semibold text-gray-800">{step.title}</h4>
    </div>

    {/* === DESCRIPTION === */}
    <p className="text-gray-600 text-sm leading-relaxed pl-11">
      {step.desc}
    </p>
  </motion.div>
))}
            </div>
          </div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <Image
              src="/nurse-pic.png"
              alt="Certified Team"
              width={400}
              height={400}
              className="rounded-2xl shadow-lg relative z-20"
            />
            {/* Overlay Tag */}
            <div className="absolute bottom-4 right-4 z-20">
              <Image
                src="/how-our-platform-works-specialist.svg"
                alt="specialist tag"
                width={349}
                height={44}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
