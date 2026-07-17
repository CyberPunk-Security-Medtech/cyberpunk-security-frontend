"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SignupForm from "@components/auth/SignupForm";
import auth_logo from "@public/auth_logo.svg";

export default function SignupPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="flex min-h-[100dvh] w-full overflow-y-auto bg-white px-4 py-8 sm:px-6">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.35 }}
        className="my-auto flex w-full items-center justify-center"
      >
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <Image
              src={auth_logo}
              alt="PrivaCure"
              width={100}
              height={60}
              className="mx-auto"
            />

            <h2 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">
              Create Account
            </h2>

            <p className="text-sm text-gray-500">Register your Hospital</p>
          </div>

          <SignupForm />
        </div>
      </motion.div>
    </main>
  );
}


