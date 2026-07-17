"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import LoginForm from "@components/auth/LoginForm";
import auth_logo from "@public/auth_logo.svg";

export default function LoginPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="flex min-h-[100dvh] w-full overflow-y-auto bg-white px-4 py-8 sm:px-6">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.35 }}
        className="my-auto flex w-full items-center justify-center"
      >
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mb-2 flex justify-center">
              <Image src={auth_logo} alt="PrivaCure" width={110} height={70} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>
          <LoginForm />
        </div>
      </motion.div>
    </main>
  );
}
