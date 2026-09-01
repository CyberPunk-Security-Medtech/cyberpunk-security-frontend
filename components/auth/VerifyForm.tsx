"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams} from "next/navigation";
import { toast } from "react-toastify";
import OTPInput from "@components/OTPInput";
import { authService } from "@services/api";
import { getApiErrorMessage } from "@utils/apiError";
import { motion } from "framer-motion";
import Image from "next/image";
import auth_logo from "@public/auth_logo.svg";
import Link from "next/link";

export default function VerifyForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  // Load email safely
  useEffect(() => {

    if(!searchParams) return;
    const qEmail = searchParams.get("email");
    const stored = typeof window !== "undefined"
      ? localStorage.getItem("signupEmail")
      : "";

    const finalEmail = qEmail || stored || "";
    setEmail(finalEmail);

    if (!finalEmail) router.push("/auth/signup");
  }, [searchParams, router]);

  // const handleVerify = async () => {
  //   const code = otp.join("");
  //   if (code.length < 6) return toast.error("Enter full code");

  //   try {
  //     setLoading(true);

  //     const data = await authService.verifyEmail(code, email);

  //     // Redirect ALWAYS when successful
  //     localStorage.setItem("verifiedEmail", email);

  //     router.replace("/auth/signup/verify/successPage");
  //   } catch (err: any) {
  //     toast.error(err?.response?.data?.message || "Verification failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter full verification code");

    try {
      setLoading(true);
      const data = await authService.verifyEmail(code, email);

      // Clear old user/workspaces
      localStorage.removeItem("user");
      localStorage.removeItem("workspaces");
      localStorage.removeItem("activeWorkspace");

      //  Mark verified for onboarding
      localStorage.setItem("verifiedEmail", email);

      router.replace("/auth/signup/verify/successPage");
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Verification failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };


  const resendCode = async () => {
    if (!email) return;

    try {
      await authService.resendOtp(email);
      toast.success("Verification code resent!");
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Failed to resend code. Please try again."));
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