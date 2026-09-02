"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import auth_logo from "@public/auth_logo.svg";
import { authService } from "@services/api";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@utils/apiError";

// Mirrors the backend password policy: minimum 12 characters, no common
// breach-list words (the breach check runs server-side and comes back as a
// normal reset error).
const PASSWORD_RULES: Array<{ label: string; test: (value: string) => boolean }> = [
  { label: "At least 12 characters", test: (value) => value.length >= 12 },
];

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
  const router = useRouter();

  const [new_password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  useEffect(() => {
    // The single-use reset token is stashed in sessionStorage by the OTP
    // verification step — it must never travel in the URL.
    if (!sessionStorage.getItem("passwordResetToken")) {
      router.replace("/auth/forgot_password");
    }
  }, [router]);

  const passwordErrors = passwordTouched
    ? PASSWORD_RULES.filter((rule) => !rule.test(new_password)).map((rule) => rule.label)
    : [];

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordTouched(true);

    if (!new_password || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (new_password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(new_password));
    if (failedRules.length > 0) {
      const message = `Password must contain ${failedRules.map((r) => r.label.toLowerCase()).join(", ")}.`;
      toast.error(message);
      return;
    }

    const reset_token = sessionStorage.getItem("passwordResetToken");
    if (!reset_token) {
      toast.error("Your reset session has expired. Please start again.");
      router.replace("/auth/forgot_password");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword(reset_token, new_password);

      // The token is single-use — clear it (and anything else from this
      // flow) now that the password has been changed.
      sessionStorage.removeItem("passwordResetToken");
      sessionStorage.removeItem("passwordResetEmail");

      toast.success("Password reset successfully");
      router.push("/auth/forgot_password/new_password/successPage");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to reset password. Please try again."));
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
                onBlur={() => setPasswordTouched(true)}
                aria-describedby="reset-password-rules"
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

          {passwordTouched && passwordErrors.length > 0 ? (
            <ul id="reset-password-rules" className="-mt-3 space-y-1 text-xs text-gray-500">
              {PASSWORD_RULES.map((rule) => {
                const satisfied = !passwordErrors.includes(rule.label);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 ${
                      satisfied ? "text-emerald-600" : "text-gray-500"
                    }`}
                  >
                    <span aria-hidden="true">{satisfied ? "✓" : "•"}</span>
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          ) : null}

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
