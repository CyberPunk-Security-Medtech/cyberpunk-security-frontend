"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OTPInput from "@components/OTPInput";
import auth_logo from "@public/auth_logo.svg"
import { useAuth } from "@context/AuthContext";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth ? useAuth() : { setUser: (u:any)=>{} };

  useEffect(() => {
    if (!email) {
      router.replace("/auth/signup/verify");
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

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Invalid or expired code");
    }

    const data = await res.json();
    // expected shape: { token: string, user: { ... }, firstTimeLogin: boolean }
    // Save into AuthContext
    if (data.token && data.user) {
      setUser({
        id: data.user.id ?? undefined,
        email: data.user.email,
        name: data.user.name ?? undefined,
        refreshToken: data.refreshToken ?? "",
        token: data.token,
      });
    } else {
      // fallback: store token minimally
      setUser({
        email,
        token: data.token ?? "",
        refreshToken: data.refreshToken ?? "",
      } as any);
    }

    // Persist to localStorage as your provider expects (your provider already does that in effect)
    // Then redirect:
    if (data.firstTimeLogin) {
      router.push("/onboarding/hospital-info");
    } else {
      router.push("/dashboard/admin");
    }
  } catch (err: any) {
    console.error(err);
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
        <Image
          src={auth_logo}
          alt="PrivaCure"
          width={110}
          height={70}
        />
        {/* <span className="text-lg font-semibold text-blue-900">
          Priva<span className="text-emerald-500">Cure</span>
        </span> */}
      </div>

      {/* Center Section */}
      <div className="flex flex-col items-center text-center space-y-6">
        {/* <Image
          src="/images/mail-icon.png"
          alt="Mail icon"
          width={50}
          height={50}
          className="mb-2"
        /> */}

        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
        <p className="text-gray-500 text-sm">
          We sent a verification code to{" "}
          <span className="text-blue-700 font-medium">{email}</span>
        </p>

        {/* OTP Input */}
        <OTPInput otp={otp} setOtp={setOtp} />

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full md:w-64 bg-blue-900 text-white py-2 rounded-full font-semibold hover:bg-blue-800 transition"
        >
          {loading ? "Verifying..." : "Verify Account"}
        </button>

        {/* Resend */}
        <p className="text-gray-500 text-sm">
          Didn’t receive the email?{" "}
          <button
            onClick={resendCode}
            className="text-blue-700 font-medium hover:underline"
          >
            Click to resend
          </button>
        </p>

        {/* Back */}
        <Link
          href="/auth/signup"
          className="flex items-center space-x-2 text-gray-600 text-sm mt-4 hover:underline"
        >
          <span>←</span>
          <span>Back to signup</span>
        </Link>
      </div>
    </motion.div>
  );
}
