"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import auth_logo from "@public/auth_logo.svg";
import { authService } from "@services/api";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-white"
    >
      <ResetPasswordForm />
    </motion.div>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || ""; // If backend requires token from URL

  const [new_password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!new_password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (new_password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (new_password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword(email, code, new_password); 

      toast.success("Password successfully changed!");
      router.push("/auth/forgot_password/new_password/successPage");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 flex items-center space-x-2">
       <Image src={auth_logo} alt="PrivaCure" width={110} height={70} />
                  </div>

      <div className="flex flex-col items-center text-center space-y-6">
        {/* Icon */}
        <Image
          src="/icons/forgotpassword-icon.svg"
          alt="Password Lock Icon"
          width={70}
          height={70}
        />

        <h2 className="text-3xl font-bold text-gray-900">Set new password</h2>
        <p className="text-gray-500 text-sm">
          Your new password must be different from previously used passwords.
        </p>

        <form
          onSubmit={handleReset}
          className="w-full max-w-md flex flex-col gap-5 text-left"
        >
          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={new_password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border px-4 py-3 pr-10 focus:ring-2 focus:ring-[#1E237E]"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-full border px-4 py-3 pr-10 focus:ring-2 focus:ring-[#1E237E]"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowConfirmPassword((p) => !p)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E237E] text-white py-3 rounded-full font-semibold hover:bg-[#151b5e] transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <Link
          href="/auth/login"
          className="mt-8 flex items-center gap-2 text-gray-600 hover:underline"
        >
          ← Back to log in
        </Link>
      </div>
    </>
  );
}
