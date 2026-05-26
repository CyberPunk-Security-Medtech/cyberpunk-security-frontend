"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";


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

const getErrorMessage = (err: any) => {
  return (
    err?.response?.data?.detail ||
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.data?.detail ||
    err?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again."
  );
};



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await login(email, password);

    setHasSubmitted(true);

    toast.success("Login successful!");
  } catch (err: any) {
    toast.error(getErrorMessage(err));
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-full border px-4 py-2"
        placeholder="Email Address"
        required
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-full border px-4 py-2 pr-10"
          placeholder="Password"
          required
        />
        <button
          type="button"
          className="absolute right-3 top-2.5"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button
        disabled={loading}
        className="w-full bg-[#1E237E] text-white rounded-full py-2"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="remember"
            className="rounded border-gray-300 text-blue-600"
          />
          <span>Remember for 30 days</span>
        </label>
        <a
          href="/auth/forgot_password"
          className="text-blue-700 hover:underline"
        >
          Forgot password
        </a>
      </div>
    </form>
  );
}