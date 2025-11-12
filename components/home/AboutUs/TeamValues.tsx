"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const values = [
  { 
    title: "Passion", 
    desc: "We're passionate about technology and its power to transform businesses and lives.", 
    img: "/icons/passion.svg" 
  },
  { 
    title: "Innovation", 
    desc: "We continuously explore new technologies and approaches to solve complex challenges.", 
    img: "/icons/innovation.svg" 
  },
  { 
    title: "Collaboration", 
    desc: "We believe in the power of teamwork and building strong partnerships with our clients.", 
    img: "/icons/collaboration.svg" 
  },
  { 
    title: "Excellence", 
    desc: "We strive for excellence in everything we do, from code quality to customer service.", 
    img: "/icons/excellence.svg" 
  },
];

export default function TeamValues() {
  return (
    <motion.section
      className="relative py-24 text-center font-sans"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Decorative vector on the right of heading */}
      <motion.img
        src="/circular-vector.svg"
        alt="decorative vector"
        className="absolute right-[19rem] top-20 w-[115px] h-[104px] hidden md:block"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      {/* Heading */}
      <div className="relative inline-block text-4xl md:text-5xl font-bold mb-16">
        Our{" "}
        <span className="bg-gradient-to-l from-[#00B8A8] to-[#1A2380] bg-clip-text text-transparent">
          Team Values
        </span>
      </div>

      {/* Values Grid */}
  <div className="flex flex-wrap justify-center gap-8 sm:gap-10 px-4 sm:px-6 md:px-12">
        {values.map((v, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-2xl p-8 max-w-xs flex flex-col items-center text-center 
                       transition-transform duration-300 hover:scale-105"
          >
            {/* Icon */}
            <div className="relative w-20 h-20 mb-5">
              <Image 
                src={v.img} 
                alt={v.title} 
                fill 
                className="object-contain" 
                sizes="80px"
              />
            </div>

            {/* Text */}
            <h4 className="font-semibold text-[black] text-lg mb-2">{v.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}