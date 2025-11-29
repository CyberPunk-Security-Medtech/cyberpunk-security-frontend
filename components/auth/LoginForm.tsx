
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { api, authService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { useRoleRedirect } from "@hooks/useRoleRedirect";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAuthData } = useAuth();
  // const { redirectUser } = useRoleRedirect();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await authService.login({ email, password });
    toast.success("Login successful!");

    // await authService.refresh();
    await new Promise((res) => setTimeout(res, 50));

    const user = await authService.getMe(); 
    const workspaces = await authService.getOrganizations();

    if (!user) throw new Error("Failed to load user");
    if (!workspaces) throw new Error("Failed to load workspace");

    setAuthData(user, workspaces, workspaces.length === 1 ? workspaces[0] : null);

  
   router.push("/auth/workspace-select");
    

  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    toast.error(err?.message || "Invalid login credentials");
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
            // checked={formData.remember}
            // onChange={handleChange}
            className="rounded border-gray-300 text-blue-600"
          />
          <span>Remember for 30 days</span>
        </label>
        <Link href="/auth/forgot_password" className="text-blue-700 hover:underline">
          Forgot password
        </Link>
      </div>
    </form>
  );
}
