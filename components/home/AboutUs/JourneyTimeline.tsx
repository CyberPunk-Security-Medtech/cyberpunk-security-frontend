"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function JourneyTimelineSection() {
  const milestones = [
    {
      year: "2024",
      title: "Founded",
      text: "PrivaCure was born to solve the challenge of secure, seamless patient data sharing between African hospitals.",
    },
    {
      year: "2024",
      title: "Concept & Research",
      text: "We mapped out the platform and studied global health data standards.",
    },
    {
      year: "2025",
      title: "Design & Development",
      text: "Seamlessly built the user experience, role-based dashboards and patient consent flow.",
    },
    {
      year: "2025",
      title: "AI Integration",
      text: "Launched AI-powered solutions for automated business processes",
    },
    {
      year: "2025",
      title: "Pilot (Planned)",
      text: "Begin pilot tests with selected hospitals and professionals.",
    },
    {
      year: "2026",
      title: "Future - Full Launch",
      text: "Full Launch Expand into Africa’s trusted health information network.",
    },

  ];

  return (
    <section className="relative py-24 md:py-32 font-sans overflow-hidden">
      {/* Floating vectors */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="hidden md:block absolute left-10 top-20 opacity-70 pointer-events-none"
      >
        <Image src="/vision-wavy-line.svg" alt="wave" width={100} height={50} />
      </motion.div>

      {/* <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute right-16 top-28 opacity-80 pointer-events-none"
      >
        <Image src="/vision-wavy-line.svg" alt="wave" width={100} height={50} />
      </motion.div> */}
      
      {/* Wavy line on the right below Design & Development */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.2 }}
className="hidden md:block absolute right-0 md:right-16 top-[57%] opacity-50 pointer-events-none z-0"
>
  <Image
    src="/vision-wavy-line.svg"
    alt="wave"
    width={100}
    height={50}
  />
</motion.div>

      {/* Section header */}
      <div className="text-center mb-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1A2380] to-[#00B8A8] bg-clip-text text-transparent"
        >
          Our Journey
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#555] max-w-2xl mx-auto mt-3"
        >
          From concept to pilot, each milestone shows our progress in building
          ethical, intelligent, and human-centered solutions.
        </motion.p>
      </div>

      {/* Timeline */}
      <ul className="max-w-4xl mx-auto space-y-16 px-6">
        {milestones.map((m, i) => (
          <motion.li
            key={m.title}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: i * 0.15,
            }}
            className="flex flex-col"
          >
            {/* Title Row (Year + Title on one line) */}
            <div className="flex items-center gap-4">
              {/* Perfectly rounded badge */}
              <div
              className="flex items-center justify-center bg-[#00B8A8] text-white 
                         font-semibold text-lg w-[87px] h-[80px] rounded-[64px] 
                         shadow-md flex-shrink-0"
            >
              {m.year}
            </div>

              <h3 className="text-xl md:text-2xl font-bold">
                {m.title}
              </h3>
            </div>

            {/* Description exactly under title */}
            <p className="text-[#555] text-[15px] leading-relaxed max-w-[640px] mt-2 ml-[calc(75px+1rem)] md:ml-[calc(95px+1rem)]">

              {m.text}
            </p>
          </motion.li>
   ))}
      </ul>
    </section>
  );
}
