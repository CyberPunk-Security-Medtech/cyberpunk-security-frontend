"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LoginForm from "@components/auth/LoginForm";
import auth_logo from "@public/auth_logo.svg";


export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side (form) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full md:w-1/2 items-start justify-center p-8 md:p-16 bg-white"
      >
        <div className="max-w-sm w-full mt-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <Image src={auth_logo} alt="PrivaCure" width={110} height={70} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Welcome back! Please enter your details.</p>
          </div>
          <LoginForm />
        </div>
      </motion.div>

      {/* Right side (image section) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full md:w-1/2 h-64 md:h-auto"
      >
        <Image
          src="/surgery_signup_img.jpg"
          alt="Lab Image"
          // width={720}
          // height={960}
          fill
        //   className="object-cover"
          priority
        />
      </motion.div>
    </div>
  );
}
