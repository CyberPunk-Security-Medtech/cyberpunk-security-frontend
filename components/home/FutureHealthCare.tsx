"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { waitlistService } from "@services/api";

export default function FutureHealthCare() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    institution_name: "",
    phone_number: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.institution_name || !formData.phone_number) {
      toast.error("Please complete all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);
      await waitlistService.joinWaitlist({
        full_name: formData.full_name,
        email: formData.email,
        institution_name: formData.institution_name,
        phone_number: formData.phone_number,
      });

      toast.success("Successfully joined the waitlist!");
      setFormData({
        full_name: "",
        email: "",
        institution_name: "",
        phone_number: "",
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to join waitlist. Please try again.";
      toast.error(errorMessage);
      console.error("Waitlist error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: "/early_access_benefits.svg",
      title: "Early Access Benefits",
      desc: "Priority onboarding, dedicated support, and influence on feature development.",
    },
    {
      icon: "/special_pricing.svg",
      title: "Special Pricing",
      desc: "Exclusive early adopter pricing and extended trial periods for pilot programs.",
    },
    {
      icon: "/community_access_pricing.svg",
      title: "Community Access Pricing",
      desc: "Join our exclusive community of healthcare innovators and early adopters.",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden px-4 sm:px-6">
      {/* === Decorative elements (hidden on mobile) === */}
      <Image
        src="/vision-splash.svg"
        alt=""
        width={220}
        height={220}
        className="absolute top-8 left-6 sm:left-[12%] opacity-40 pointer-events-none hidden sm:block"
      />
      <Image
        src="/circular-vector.svg"
        alt=""
        width={160}
        height={160}
        className="absolute right-6 sm:right-12 top-24 opacity-50 pointer-events-none hidden sm:block"
      />

      <div className="max-w-6xl mx-auto text-center relative z-10" id="waitlist">
        {/* === Heading === */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-[28px] md:text-[34px] font-bold text-[#0F1C2E] leading-snug px-2"
        >
          Be Among the First to Experience the{" "}
          <span className="text-[#00A9B7]">Future of Healthcare</span>
        </motion.h2>

        {/* === Subtitle === */}
        <p className="mt-3 text-sm sm:text-base text-[#4A5D6A] max-w-2xl mx-auto leading-relaxed px-2">
          PrivaCure is currently in the MVP stage. We’re inviting forward-thinking
          hospitals, HMOs, and clinics to join our early access program and shape
          the future of African healthcare interoperability.
        </p>

        {/* === Benefits cards === */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-[#DCE8F2] bg-white shadow-sm p-6 sm:p-8 hover:shadow-md transition"
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={48}
                height={48}
                className="mx-auto mb-4"
              />
              <h3 className="font-semibold text-[#0F1C2E] mb-2 text-base sm:text-lg">
                {item.title}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#5B6C7C] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* === Waitlist Form === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 mx-auto max-w-lg bg-gradient-to-r from-[#0040C1] to-[#00A9B7] rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-left text-white relative overflow-hidden"
        >
          {/* dotted decorative in top-left of form */}
          <Image
            src="/vectors/dots.svg"
            alt=""
            width={100}
            height={100}
            className="absolute -top-8 left-4 opacity-40 pointer-events-none hidden sm:block"
          />

          <h3 className="text-center text-lg sm:text-xl font-semibold mb-6 relative z-10">
            Join Our Waitlist
          </h3>

          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            <input
              type="text"
              name="full_name"
              placeholder="Your name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full rounded-[30px] px-4 py-3 bg-white/15 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Work email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-[30px] px-4 py-3 bg-white/15 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
              required
            />
            <input
              type="text"
              name="institution_name"
              placeholder="Organization name"
              value={formData.institution_name}
              onChange={handleChange}
              className="w-full rounded-[30px] px-4 py-3 bg-white/15 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
              required
            />
            <input
              type="tel"
              name="phone_number"
              placeholder="Phone number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full rounded-[30px] px-4 py-3 bg-white/15 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-[#0040C1] font-semibold py-3 rounded-[30px] hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Joining..." : "Join the waitlist"}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] sm:text-[12px] text-white/80 leading-snug relative z-10">
            We respect your privacy. Your information will only be used to contact
            you about PrivaCure updates.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
