"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { organizationService, authService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { setAuthData } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Log in
      await authService.login({ email, password });

      // 2️⃣ Fetch current user
      const meRes = await authService.getMe();
      const me = meRes?.data || meRes;
      setUser(me);

      // 3️⃣ Fetch user's organizations
      const orgRes = await organizationService.getOrganizations();
      const orgs = Array.isArray(orgRes) ? orgRes : orgRes?.data || [];

      // 4️⃣ Update AuthContext
      setAuthData(me, orgs, orgs[0] || null);

      toast.success("Login successful!");
    localStorage.setItem("email", email)
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect based on organization existence
  useEffect(() => {
    if (!user) return;

    const checkOrganization = async () => {
      try {
        const orgs = await organizationService.getOrganizations();
        const myOrgs = Array.isArray(orgs) ? orgs : orgs?.data || [];

        if (myOrgs.length === 0) {
          // No org → first admin onboarding
          router.replace("/onboarding/hospital-info");
        } else {
          // Org exists → normal user dashboard
          router.replace("/auth/workspace-select");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error checking organization.");
      }
    };

    checkOrganization();
  }, [user, router]);

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