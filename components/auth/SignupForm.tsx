// import { UseFormRegister, FieldErrors } from "react-hook-form";
// import { SignupFormData } from "@/types/forms";
// import Button from "@components/Button";


// interface SignupFormProps {
//     register: UseFormRegister<SignupFormData>;
//     errors: FieldErrors<SignupFormData>;
//     onSubmit: () => void;
//     activationKey: string | null;
//     onGetActivationKey: () => void;
//     submitError: string | null;
// }

// export const SignupForm = ({
//     register,
//     errors,
//     onSubmit,
//     activationKey,
//     onGetActivationKey,
//     submitError,
// }: SignupFormProps) => {
//     return (
//         <form onSubmit={onSubmit} className="space-y-4">
//             <div>
//                 <label htmlFor="email">Email</label>
//                 <input id="email" type="email" {...register("email")} />
//                 {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//             </div>

//             <div>
//                 <label htmlFor="password">Password</label>
//                 <input id="password" type="password" {...register("password")} />
//                 {errors.password && <p className="text-red-500">{errors.password.message}</p>}
//             </div>

//             <div>
//                 <label htmlFor="confirmPassword">Confirm Password</label>
//                 <input id="confirmPassword" type="password" {...register("confirmPassword")} />
//                 {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
//             </div>

//             <div>
//                 <Button type="button" onSubmitHandler={onGetActivationKey}>
//                     {activationKey ? "Resend Activation Key" : "Get Activation Key"}
//                 </Button>
//                 {activationKey && <p className="text-sm text-green-600">Key: {activationKey}</p>}
//             </div>

//             <Button type="submit">Continue</Button>

//             {submitError && <p className="text-red-500">{submitError}</p>}
//         </form>
//     );
// };

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://your-api-url.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) throw new Error("Signup failed");
      alert("Account created successfully!");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
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
      <div className="relative">
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
      </div>

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
        <Link href="/forgot-password" className="text-blue-700 hover:underline">
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
        <Link href="/login" className="text-blue-800 font-medium hover:underline">
          Log into account
        </Link>
      </p>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
  );
}
