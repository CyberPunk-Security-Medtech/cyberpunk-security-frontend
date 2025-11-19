"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import OTPInput from "@components/OTPInput";
import auth_logo from "@public/auth_logo.svg";
import { authService } from "@services/api";
import { toast } from "react-toastify";

export default function ResetVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetVerifyContent />
    </Suspense>
  );
}

function ResetVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Enter the full verification code");
      return;
    }

    try {
      setLoading(true);

      await authService.verifyPasswordReset(code, email);

      toast.success("Code verified. You can now reset your password.");
      router.push(`/auth/forgot_password/new_password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await authService.requestPasswordReset(email);
      toast.success("Code resent!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend code");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-white"
    >
      <div className="absolute top-8 left-8 flex items-center space-x-2">
        <Image src={auth_logo} alt="PrivaCure" width={110} height={70} />
      </div>

      <div className="flex flex-col items-center text-center space-y-6 w-full">
        <h2 className="text-2xl font-bold text-gray-900">Password reset</h2>

        <p className="text-gray-500 text-sm">
          We sent a reset code to{" "}
          <span className="text-blue-700 font-medium">{email}</span>
        </p>

        <OTPInput otp={otp} setOtp={setOtp} />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full md:w-64 bg-blue-900 text-white py-2 rounded-full font-semibold hover:bg-blue-800 transition"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>

        <p className="text-gray-500 text-sm">
          Didn’t receive the email?{" "}
          <button onClick={resendCode} className="text-blue-700 font-medium hover:underline">
            Click to resend
          </button>
        </p>

        <Link href="/auth/login" className="text-gray-600 text-sm mt-4 hover:underline">
          ← Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}
