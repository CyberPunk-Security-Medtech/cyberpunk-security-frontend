"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getApiErrorMessage } from "@utils/apiError";
import type {
  TwoFactorChallenge as TwoFactorChallengeResponse,
  TwoFactorMethod,
} from "@services/api";
import TwoFactorChallenge from "./TwoFactorChallenge";

const getTwoFactorMethod = (error: unknown): TwoFactorMethod | null => {
  if (!axios.isAxiosError(error) || error.response?.status !== 401) return null;

  const detail = error.response.data?.detail as
    | Partial<TwoFactorChallengeResponse>
    | undefined;
  if (detail?.action !== "TWO_FACTOR_REQUIRED") return null;

  return detail.method === "totp" || detail.method === "email" ? detail.method : null;
};

export default function LoginForm() {
  const {
    login,
    completeTwoFactorLogin,
    user,
    workspaces,
    workspaceLoading,
    authLoading,
    hydrated,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [challengeMethod, setChallengeMethod] =
    useState<TwoFactorMethod | null>(null);

  useEffect(() => {
    if (!hydrated || authLoading || workspaceLoading || !hasSubmitted || !user) {
      return;
    }

    if (redirect) {
      router.replace(redirect);
      return;
    }

    router.replace(
      workspaces.length === 0
        ? "/onboarding/hospital-info"
        : "/auth/workspace-select",
    );
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!email.trim() || !password) {
      const message = "Please enter your email address and password.";
      setFormError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      setHasSubmitted(true);
      toast.success("Login successful!");
    } catch (error: unknown) {
      const requiredMethod = getTwoFactorMethod(error);
      if (requiredMethod) {
        setChallengeMethod(requiredMethod);
        return;
      }
      const message = getApiErrorMessage(
        error,
        "Unable to sign in. Please try again.",
      );
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorVerified = async () => {
    await completeTwoFactorLogin();
    setHasSubmitted(true);
    toast.success("Login successful!");
  };

  if (challengeMethod) {
    return (
      <TwoFactorChallenge
        method={challengeMethod}
        onVerified={handleTwoFactorVerified}
        onCancel={() => {
          setChallengeMethod(null);
          setPassword("");
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError ? (
        <p
          id="login-error"
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {formError}
        </p>
      ) : null}
      <label htmlFor="login-email" className="sr-only">
        Email address
      </label>
      <input
        id="login-email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setFormError("");
        }}
        aria-invalid={Boolean(formError)}
        aria-describedby={formError ? "login-error" : undefined}
        className="min-h-11 w-full rounded-full border px-4 py-2 outline-none focus-visible:border-[#1E237E] focus-visible:ring-2 focus-visible:ring-[#1E237E]/20"
        placeholder="Email Address"
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
          onChange={(event) => {
            setPassword(event.target.value);
            setFormError("");
          }}
          aria-invalid={Boolean(formError)}
          className="min-h-11 w-full rounded-full border px-4 py-2 pr-12 outline-none focus-visible:border-[#1E237E] focus-visible:ring-2 focus-visible:ring-[#1E237E]/20"
          placeholder="Password"
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
