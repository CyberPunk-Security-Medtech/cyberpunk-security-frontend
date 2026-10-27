"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return <section className="relative overflow-hidden bg-gradient-to-br from-[#15BDB0]/20 via-[#F8FCFF]/40 to-white px-4 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36">
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65 }} className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
      {/* <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mb-5 h-2.5 w-2.5 rounded-full bg-[#00B8A8] shadow-[0_0_0_8px_rgba(0,184,168,0.12)]" /> */}
      <h1 className="max-w-4xl text-[2.15rem] font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">Trusted <span className="text-[#0066CC]">Healthcare Data</span> Infrastructure for Every Care Team.</h1>
      <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-gray-600 sm:mt-6 sm:text-lg">PrivaCure brings secure, interoperable health records, workflow tools, and patient-centred collaboration into one connected platform.</p>
      <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:gap-5"><button onClick={() => router.push("/#waitlist")} className="w-full rounded-md bg-gradient-to-l from-[#00B8A8] to-[#1A2380] px-6 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90 sm:w-auto sm:text-base">Join the Waitlist</button><button onClick={() => router.push("/#platform-demo")} className="w-full rounded-md border border-[#00A9B7] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#00A9B710] sm:w-auto sm:text-base">Explore the Platform</button></div>
    </motion.div>
    <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#00B8A8]/10 blur-3xl" />
  </section>;
}
