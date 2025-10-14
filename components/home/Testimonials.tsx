"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Chidinma E.",
      role: "Registered Nurse",
      quote:
        "The dashboard is clear and secure. Updating vitals and notes has never been easier.",
      image: "/chidinma-testimonial.svg",
    },
    {
      name: "Dr. Tunde A.",
      role: "Consultant Physician",
      quote:
        "With PrivaCure, I can instantly access my patients’ full medical history even if they were treated in another state. It saves precious time in emergencies and helps me make safer, faster decisions.",
      image: "/tunde-testimonial.svg",
    },
    {
      name: "Michael K.",
      role: "Patient’s Son",
      quote:
        "When I moved my father from one hospital to another, PrivaCure made the transfer stress-free. We simply approved the data sharing via SMS, and his new doctors had everything they needed instantly.",
      image: "/michael-testimonial.svg",
    },
    {
      name: "Grace O.",
      role: "Hospital Administrator",
      quote:
        "PrivaCure makes onboarding and role assignment simple, with full visibility and secure logs.",
      image: "/grace-testimonial.svg",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Records Shared Securely" },
    { value: "2,500+", label: "Healthcare Professionals Connected" },
    { value: "98%", label: "Patient Consent Satisfaction" },
    { value: "200+", label: "Partner Hospitals" },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Decorative dashed line at top */}
      {/* <div className="absolute top-0 left-0 w-full h-[1px] bg-[repeating-linear-gradient(to_right,#00A9B7_0_6px,transparent_6px_14px)] opacity-40"></div> */}

      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[28px] md:text-[34px] font-bold text-[#0F1C2E]"
        >
          Patient <span className="text-[#00A9B7]">Testimonials:</span>
        </motion.h2>
        <p className="text-[18px] font-bold text-[#1F2D3D] mt-1">
          Hear from Those We’ve Cared For
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Discover the difference we make through the voices of those we’ve served
        </p>

        {/* Top 2 testimonials */}
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          {testimonials.slice(0, 2).map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#F8FDFF] border border-[#D8ECF3] rounded-2xl shadow-sm p-6 flex items-start text-left"
            >
              <Image
                src={t.image}
                alt={t.name}
                width={60}
                height={60}
                className="rounded-full mr-4 border border-white shadow"
              />
              <div>
                <p className="italic text-gray-700 text-[15px] leading-relaxed">
                  “{t.quote}”
                </p>
                <p className="mt-3 text-sm font-semibold text-gray-800">
                  - {t.name}, <span className="font-normal">{t.role}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="text-[28px] md:text-[32px] font-bold text-[#00A9B7]">
                {s.value}
              </p>
              <p className="text-sm text-gray-700 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom 2 testimonials */}
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          {testimonials.slice(2, 4).map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#F8FDFF] border border-[#D8ECF3] rounded-2xl shadow-sm p-6 flex items-start text-left"
            >
              <Image
                src={t.image}
                alt={t.name}
                width={60}
                height={60}
                className="rounded-full mr-4 border border-white shadow"
              />
              <div>
                <p className="italic text-gray-700 text-[15px] leading-relaxed">
                  “{t.quote}”
                </p>
                <p className="mt-3 text-sm font-semibold text-gray-800">
                  - {t.name}, <span className="font-normal">{t.role}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}