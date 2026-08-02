"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getApiErrorMessage } from "@utils/apiError";


export default function LoginForm() {
  const { login,user, workspaces, workspaceLoading, authLoading, hydrated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formError, setFormError] = useState("");


 useEffect(() => {
  if (!hydrated) return;
  if (authLoading || workspaceLoading) return;

  if(!hasSubmitted) return;

  if (!user) return;

if(redirect){
  router.replace(redirect);
  return;
}

  if (workspaces.length === 0) {
    router.replace("/onboarding/hospital-info");
  } else {
    router.replace("/auth/workspace-select");
  }
}, [
  hydrated,
  authLoading,
  workspaceLoading,
  user,
  workspaces,
  hasSubmitted,
  redirect,
  router,
]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFormError("");
  if (!email.trim() || !password) {
    setFormError("Enter your email address and password to continue.");
    return;
  }
  setLoading(true);

  try {
    await login(email, password);

    setHasSubmitted(true);

    toast.success("Login successful!");
  } catch (err: any) {
    const message = getApiErrorMessage(err, "Unable to sign in. Please try again.");
    setFormError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError && <p id="login-error" role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
      <label htmlFor="login-email" className="sr-only">
        Email address
      </label>
      <input
        id="login-email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setFormError(""); }}
        aria-invalid={Boolean(formError)}
        aria-describedby={formError ? "login-error" : undefined}
        className="min-h-11 w-full rounded-full border px-4 py-2 outline-none focus-visible:border-[#1E237E] focus-visible:ring-2 focus-visible:ring-[#1E237E]/20"
        placeholder="Email Address"
        required
      />

      <div className="relative">
        <label htmlFor="login-password" className="sr-only">
          Password
        </label>
        <input
          id="login-password"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setFormError(""); }}
          aria-invalid={Boolean(formError)}
          className="min-h-11 w-full rounded-full border px-4 py-2 pr-12 outline-none focus-visible:border-[#1E237E] focus-visible:ring-2 focus-visible:ring-[#1E237E]/20"
          placeholder="Password"
          required
        />
        <button
          type="button"
          className="absolute right-1.5 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E237E]"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="min-h-11 w-full rounded-full bg-[#1E237E] py-2 text-white transition-colors hover:bg-[#171B65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E237E] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="remember"
            className="rounded border-gray-300 text-blue-600"
          />
          <span>Remember for 30 days</span>
        </label>
        <Link
          href="/auth/forgot_password"
          className="rounded-sm text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
        >
          Forgot password
        </Link>
      </div>
    </form>
  );
}
