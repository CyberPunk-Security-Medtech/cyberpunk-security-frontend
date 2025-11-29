"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SignupForm from "@components/auth/SignupForm";
import auth_logo from "@public/auth_logo.svg"
import left_signup_img from "@public/left_signup_image.jpg"

export default function SignupPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* LEFT SIDE - Image + Overlay Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full md:w-1/2 h-64 md:h-auto"
      >
        <Image
          src={left_signup_img}
          alt="Surgery background"
          fill
      
          />
      </motion.div>

      {/* RIGHT SIDE - Sign Up Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full md:w-1/2 items-start justify-center px-6 py-10 md:py-0 bg-white"
      >
        <div className="w-full max-w-sm space-y-6 mt-10">
          <div className="text-center">
            <Image
             src={auth_logo}
              alt="PrivaCure"
              width={110}
              height={70}
              className="mx-auto"
            />
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm">Register your Hospital</p>
          </div>

          <SignupForm />
        </div>
      </motion.div>
    </div>
  );
}


