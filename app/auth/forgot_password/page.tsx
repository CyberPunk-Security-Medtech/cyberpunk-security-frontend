"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authService } from "@services/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import auth_logo from "@public/auth_logo.svg";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await authService.requestPasswordReset(email);

      toast.success("Password reset instructions sent to your email");
        router.push(`/auth/forgot_password/otp_verification?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send reset instructions"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 bg-white">
      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
       <Image src={auth_logo} alt="PrivaCure" width={110} height={70} />
                  </div>

      {/* Centered Content */}
      <div className="flex flex-col items-center text-center mt-20 w-full">
        {/* Icon */}
        <div className="mb-6">
          <Image
            src="/icons/forgotpassword-icon.svg"
            alt="Forgot Password Icon"
            width={56}
            height={56}
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#0A0A0A]">Forgot password?</h2>

        {/* Subtitle */}
        <p className="text-gray-500 mt-2 mb-10">
          No worries, we’ll send you reset instructions.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-5"
        >
          {/* Staff ID */}
          <div className="text-left">
            <label className="text-sm font-medium text-gray-700">
              Email addresss
            </label>
            <input
              type="text"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1E237E] transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E237E] text-white py-3 rounded-full font-semibold hover:bg-[#151b5e] transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        {/* Back link */}
        <Link
          href="/auth/login"
          className="mt-8 flex items-center gap-2 text-gray-600 hover:underline"
        >
          ← Back to log in
        </Link>
      </div>
    </div>
  );
}
