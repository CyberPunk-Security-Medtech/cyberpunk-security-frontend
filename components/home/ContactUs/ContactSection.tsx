"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ContactInfoCard from "./ContactInfoCard";

export default function ContactSection() {
  return (
    <section className="relative z-10 overflow-hidden bg-transparent pb-24 pt-20 text-center md:pb-28 md:pt-28">
   <motion.div
  initial={{ y: 60, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
  className="pointer-events-none absolute left-6 top-[13%] z-10 hidden opacity-60 md:block md:top-[16%]"
>
  <Image src="/dot.svg" alt="" width={150} height={150} priority />
</motion.div>
    <motion.div
  initial={{ y: -40, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
  className="pointer-events-none absolute right-16 top-[-4rem] hidden opacity-80 md:block md:top-[1rem]"
>
  <Image src="/vision-wavy-line.svg" alt="" width={100} height={50} priority />
</motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative z-20 mx-auto mb-12 max-w-2xl px-4">
        <h1 className="bg-gradient-to-r from-[#1A2380] to-[#00B8A8] bg-clip-text text-4xl font-bold text-transparent">Contact Us</h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-3 text-[#717171]">
          Reach out to our team for product questions, support, or partnership opportunities.
        </motion.p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }} className="relative z-20 mx-auto max-w-xl px-4 text-left">
        <div className="rounded-md bg-[#000EA0] shadow-2xl">
          <ContactInfoCard />
        </div>
      </motion.div>
    </section>
  );
}
