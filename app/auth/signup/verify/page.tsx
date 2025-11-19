"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import OTPInput from "@components/OTPInput";
import auth_logo from "@public/auth_logo.svg";
import { useAuth } from "@context/AuthContext";
import { authService } from "@services/api";
import { toast } from "react-toastify";
import { verify } from "crypto";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyPageContent />
    </Suspense>
  );
}

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
    toast.error("Enter the full verification code");
    }

    try {
      setLoading(true);

      const data = await authService.verifyEmail(code, email);

      if (data.user && data.token) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          token: data.token,
          refreshToken: data.refreshToken ?? "",
        });
      }

      // router.push(
      //   data.firstTimeLogin
      //     ? "/onboarding/hospital-info"
      //     : "/dashboard/admin"
      // );

      router.push("/auth/signup/verify/successPage")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await authService.resendOtp(email);
      toast.success("Verification code resent!");
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

      <div className="flex flex-col items-center text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>

        <p className="text-gray-500 text-sm">
          We sent a verification code to{" "}
          <span className="text-blue-700 font-medium">{email}</span>
        </p>

        <OTPInput otp={otp} setOtp={setOtp} />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full md:w-64 bg-blue-900 text-white py-2 rounded-full font-semibold hover:bg-blue-800 transition"
        >
          {loading ? "Verifying..." : "Verify Account"}
        </button>

        <p className="text-gray-500 text-sm">
          Didn’t receive the email?{" "}
          <button onClick={resendCode} className="text-blue-700 font-medium hover:underline">
            Click to resend
          </button>
        </p>

        <Link href="/auth/signup" className="text-gray-600 text-sm mt-4 hover:underline">
          ← Back to signup
        </Link>
      </div>
    </motion.div>
  );
}
