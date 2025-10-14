"use client";

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import OTPInput from "@components/OTPInput";
import auth_logo from "@public/auth_logo.svg";
import { useAuth } from "@context/AuthContext";


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
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth ? useAuth() : { setUser: (u: any) => {} };

  useEffect(() => {
    if (!email) {
      router.replace("/auth/signup");
    }
  }, [email, router]);

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 4) {
      return alert("Please enter the full verification code.");
    }
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) throw new Error(await res.text() || "Invalid or expired code");

      const data = await res.json();
      if (data.token && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          refreshToken: data.refreshToken ?? "",
          token: data.token,
        });
      }

      router.push(data.firstTimeLogin ? "/onboarding/hospital-info" : "/dashboard/admin");
    } catch (err: any) {
      alert(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      const res = await fetch("https://your-api-url.com/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to resend code");
      alert("Verification code resent!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-white"
    >
      {/* Logo */}
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
