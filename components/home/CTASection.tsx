"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function JoinCTA() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-visible px-4 sm:px-6">
      {/* === Decorative Vector (hidden on mobile) === */}
      <Image
        src="/circular-vector.svg"
        alt="decorative background"
        width={140}
        height={125}
        className="absolute bottom-[-50px] left-12 sm:left-56 opacity-80 pointer-events-none z-0 hidden sm:block"
      />

      {/* === CTA Card === */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl sm:max-w-5xl mx-auto bg-gradient-to-r from-[#0040C1] to-[#00A970] text-white rounded-2xl sm:rounded-3xl shadow-xl px-6 sm:px-10 py-10 sm:py-14 text-center"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 leading-snug">
          Join the Healthcare Revolution
        </h2>

        <p className="text-white/90 mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Be part of the movement transforming healthcare across Africa.
          Together, we can build a future where quality healthcare is accessible,
          secure, and efficient for everyone.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="bg-white text-[#0040C1] font-semibold px-6 py-3 rounded-[30px] shadow hover:opacity-90 transition text-sm sm:text-base w-full sm:w-auto">
            Learn more about our impact
          </button>
          <button className="border border-white px-6 py-3 rounded-[30px] hover:bg-white/10 transition text-sm sm:text-base w-full sm:w-auto">
            Partner with us
          </button>
        </div>
      </motion.div>
    </section>
  );
}
