// components/onboarding/AdminInfoStep.tsx
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";

const schema = z.object({
  fullname: z.string().min(2, "Enter full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter phone number"),
  password: z.string().min(6, "Password min 6 chars"),
});

type FormData = z.infer<typeof schema>;

export default function AdminInfoStep({ onBack, onNext, defaultValues }: { onBack: () => void; onNext: (d: FormData) => void; defaultValues?: Partial<FormData> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { fullname: "", email: "", phone: "", password: "" }
  });
  const [show, setShow] = useState(false);

  return (
    <motion.form onSubmit={handleSubmit(onNext)} className="space-y-5">
        <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Admin Account Setup
        </h2>
        <p className="text-gray-500 text-sm mt-1">Create Your Admin Account</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-700">Full name</label>
          <input {...register("fullname")} className={`w-full px-4 py-3 rounded-full border ${errors.fullname ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-blue-700`} />
          {errors.fullname && <p className="text-xs text-red-500 mt-1">{errors.fullname.message}</p>}
        </div>

  <div>
          <label className="text-sm text-gray-700">Phone</label>
          <input {...register("phone")} className={`w-full px-4 py-3 rounded-full border ${errors.phone ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-blue-700`} />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700">Email</label>
          <input {...register("email")} className={`w-full px-4 py-3 rounded-full border ${errors.email ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-blue-700`} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

      

     <div>
  <label className="text-sm text-gray-700">Password</label>
  <div className="relative">
    <input
      {...register("password")}
      type={show ? "text" : "password"}
      className={`w-full px-4 py-3 rounded-full border ${
        errors.password ? "border-red-500" : "border-gray-200"
      } focus:ring-2 focus:ring-blue-700 pr-12`}
    />
    <button
      type="button"
      onClick={() => setShow((v) => !v)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
    >
      {show ? (
        // Eye open icon (show password)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ) : (
        // Eye closed icon (hide password)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.06 10.06 0 012.383-3.544m1.67-1.575A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.964 9.964 0 01-1.523 2.774M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
        </svg>
      )}
    </button>
  </div>
  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
</div>

      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button type="button" onClick={onBack} className="px-4 py-2 rounded-full border border-gray-300 text-gray-700">Back</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-[#1A2380] text-white font-semibold">{isSubmitting ? "Saving..." : "Continue"}</button>
      </div>
    </motion.form>
  );
}
