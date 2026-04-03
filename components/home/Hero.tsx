"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#15BDB0]/20 via-[#F8FCFF]/40 to-white pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col-reverse md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 gap-10 sm:gap-16 md:gap-20">
        {/* LEFT TEXT COLUMN */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-xl text-center md:text-left"
        >
          <h1 className="text-[1.9rem] sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Building Africa’s Most Trusted{" "}
            <span className="text-[#0066CC]">Healthcare Data</span>{" "}
            Infrastructure.
          </h1>

          <p className="mt-4 sm:mt-6 text-gray-600 leading-relaxed text-[0.9rem] sm:text-base">
            Privacure combines cutting-edge technology with healthcare expertise
            to deliver a comprehensive platform that addresses Africa’s unique
            healthcare challenges.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto items-center justify-center md:justify-start">
            <button
              onClick={() => router.push("/#waitlist")}
              className="w-full sm:w-auto rounded-[15px] bg-gradient-to-l from-[#00B8A8] to-[#1A2380] px-6 py-3 text-white font-semibold shadow hover:opacity-90 transition text-sm sm:text-base"
            >
              Join the Waitlist
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto rounded-[15px] border border-[#00A9B7] px-6 py-3 font-semibold text-black hover:bg-[#00A9B710] transition text-sm sm:text-base"
            >
              Request Early Access
            </button>
          </div>
        </motion.div>

        {/* RIGHT VISUAL AREA (Hidden on Mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative hidden md:flex items-center justify-center w-full md:w-[50%] mt-10 md:mt-0"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative flex items-center justify-center w-[320px] h-[320px] md:w-[420px] md:h-[420px]"
          >
            <Image
              src="/orbit1.svg"
              alt="orbit line 1"
              fill
              className="object-contain"
            />
            <Image
              src="/orbit2.svg"
              alt="orbit line 2"
              fill
              className="object-contain opacity-90 scale-75"
            />

            <Image
              src="/outer-male-doc.svg"
              alt="Doctor 1"
              width={100}
              height={100}
              className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full border-4 border-white shadow-lg"
            />
            <Image
              src="/outer-female-doc.svg"
              alt="Doctor 3"
              width={100}
              height={100}
              className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full border-4 border-white shadow-lg"
            />
            <Image
              src="/inner-female-doc.svg"
              alt="Doctor 4"
              width={100}
              height={100}
              className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full border-4 border-white shadow-lg"
            />
            <Image
              src="/inner-female-doc-2.svg"
              alt="Doctor 5"
              width={100}
              height={100}
              className="absolute top-[18%] left-[15%] rounded-full border-4 border-white shadow-lg"
            />

            <Image
              src="/testimonial-hero.svg"
              alt="Badge"
              width={250}
              height={88}
              className="absolute bottom-[10%] right-[10%]"
            />
          </motion.div>

          {/* Center Cube */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/center-cube.svg"
              alt="Cube"
              width={150}
              height={150}
              className="z-20"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
