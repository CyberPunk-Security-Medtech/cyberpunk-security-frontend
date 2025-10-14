"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatsPrivaCure() {
  const features = [
    {
      icon: "/whats-privacure-admin.svg",
      title: "Admin Dashboard",
      desc: "Onboard hospitals, manage staff & roles, monitor compliance, start data transfers.",
    },
    {
      icon: "/whatsprivacure-rolebased.svg",
      title: "Role-Based Dashboards",
      desc: "Separate views for Doctors, Nurses, Pharmacists, and Lab Technicians.",
    },
    {
      icon: "/whatsprivacure-consent.svg",
      title: "Patient Consent Flow",
      desc: "Secure OTP approvals, temporary access tokens, and emergency overrides.",
    },
    {
      icon: "/whatsprivacure-electronic.svg",
      title: "Electronic Health Records",
      desc: "Create, view, update, and archive patient records seamlessly.",
    },
    {
      icon: "/whatsprivacure-collaboration.svg",
      title: "Collaboration & Accessibility",
      desc: "Interoperable APIs, notifications, and a mobile-friendly interface.",
    },
    {
      icon: "/whatsprivacure-security.svg",
      title: "Security & Compliance",
      desc: "Encrypted data, strict permissions, NDPR/HIPAA/GDPR compliant.",
    },
  ];

  return (
    <section className="relative pt-20 pb-24 bg-white overflow-hidden">
      {/* Background splash (hidden on mobile) */}
      <Image
        src="/vision-splash.svg"
        alt=""
        width={200}
        height={200}
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-30 hidden md:block"
      />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto px-4 sm:px-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug">
          What’s{" "}
          <span className="text-[#1A2380]">
            Priva<span className="text-[#00A9B7]">Cure</span>
          </span>
        </h2>

        <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed tracking-wide max-w-2xl mx-auto">
          PrivaCure is a secure, interoperable electronic health records (EHR) platform
          designed for African hospitals. It enables authorized doctors, nurses,
          pharmacists, and lab technicians to access and share patient records across
          hospitals — with encryption, patient consent, and strict role-based access control.
        </p>
      </motion.div>

      {/* Features grid */}
      <div className="relative z-10 mx-auto mt-14 grid w-[92%] max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, index) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl bg-white border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow text-center flex flex-col items-center"
          >
            <Image
              src={f.icon}
              alt={f.title}
              width={50}
              height={50}
              className="object-contain mb-4 sm:mb-6"
            />
            <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">
              {f.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {f.desc}
            </p>

            {/* Decorative vector - visible only on desktop */}
            {index === 0 && (
              <Image
                src="/dot.svg"
                alt="Admin Vector"
                width={162}
                height={94}
                className="absolute -left-24 top-1/2 -translate-y-1/2 hidden lg:block opacity-80 -z-10"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Decorative wavy line (hidden on small screens) */}
      <Image
        src="/vision-wavy-line.svg"
        alt=""
        width={166}
        height={52}
        className="absolute left-16 bottom-6 opacity-60 pointer-events-none hidden md:block"
      />
    </section>
  );
}
