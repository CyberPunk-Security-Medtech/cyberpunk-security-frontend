

"use client"

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { authService } from "@services/api";
import { useRouter } from "next/navigation";


export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // confirmPassword: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // if (formData.password !== formData.confirmPassword) {
    //   setError("Passwords do not match.");
    //   return;
    // }

    try {
      setLoading(true);

      const userData = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
      };

      const response = await authService.signup(userData);

      setSuccess("Account created successfully!");
      console.log("Signup successful:", response);


     router.push(`/auth/signup/verify?email=${formData.email}`);


    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email Address"
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

       <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter Password"
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-9 text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Confirm Password */}
      {/* <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Enter Confirm Password"
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-9 text-gray-500"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div> */}

      

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600"
          />
          <span>Remember for 30 days</span>
        </label>
        <Link href="/auth/forgot_password" className="text-blue-700 hover:underline">
          Forgot password
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-900 text-white py-2 rounded-full font-semibold hover:bg-blue-800 transition"
      >
        {loading ? "Creating..." : "Create account"}
      </button>

      {/* Info Box */}
      <div className="mt-6 p-3 border border-teal-400 text-sm text-gray-700 rounded-lg bg-teal-50">
        Admins can register new hospitals. Staff accounts are created by
        Admins. Patients cannot log in.
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-sm">
        I am a staff.{" "}
        <Link href="/auth/login" className="text-blue-800 font-medium hover:underline">
          Log into account
        </Link>
      </p>

      {/* Error Message */}
    
    </form>
  );
}
