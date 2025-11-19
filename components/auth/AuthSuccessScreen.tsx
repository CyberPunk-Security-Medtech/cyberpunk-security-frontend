"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import auth_logo from "@public/auth_logo.svg";

interface SuccessScreenProps {
  iconSrc?: string; 
  title: string;
  description?: string;
  buttonText: string;
  redirectTo: string;
}

export default function SuccessScreen({
  iconSrc,
  title,
  description,
  buttonText,
  redirectTo,
}: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-white"
    >
      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 flex items-center space-x-2">
        <Image src={auth_logo} alt="PrivaCure" width={130} height={70} />
      </div>

      <div className="flex flex-col items-center text-center space-y-6">
         {/* Icon */}
        {/* <Image src={iconSrc} alt="Success Icon" width={70} height={70} /> */}

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>

        {/* Description */}
        {description && (
          <p className="text-gray-500 text-sm">{description}</p>
        )}

        {/* CTA Button */}
        <Link
          href={redirectTo}
          className="w-full md:w-64 bg-[#1E237E] text-white py-3 rounded-full font-semibold hover:bg-[#151b5e] transition"
        >
          {buttonText}
        </Link>
      </div>
    </motion.div>
  );
}
