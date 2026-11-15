"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return <section className="relative overflow-hidden bg-gradient-to-br from-[#15BDB0]/20 via-[#F8FCFF]/40 to-white px-4 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36">
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65 }} className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
      {/* <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mb-5 h-2.5 w-2.5 rounded-full bg-[#00B8A8] shadow-[0_0_0_8px_rgba(0,184,168,0.12)]" /> */}
      <h1 className="max-w-4xl text-[2.15rem] font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">Trusted <span className="text-[#0066CC]">Healthcare Data</span> Infrastructure for Every Care Team.</h1>
      <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-gray-600 sm:mt-6 sm:text-lg">PrivaCure brings secure, interoperable health records, workflow tools, and patient-centred collaboration into one connected platform.</p>
    </motion.div>
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.2 }} className="relative z-10 mx-auto mt-12 w-full max-w-5xl sm:mt-16">
      <video src="/VID-20261113-WA0169.mp4" className="aspect-video w-full rounded-md bg-black object-cover shadow-[0_12px_40px_rgba(0,0,0,0.12)]" controls playsInline muted autoPlay={!reduceMotion} loop preload="metadata" aria-label="PrivaCure platform video" />
    </motion.div>
    <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#00B8A8]/10 blur-3xl" />
  </section>;
}
