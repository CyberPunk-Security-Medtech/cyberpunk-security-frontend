// "use client";

// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";

// export default function LoginForm() {
//   const [staffId, setStaffId] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ staffId, password }),
//       });

//       if (!res.ok) throw new Error("Invalid credentials");

//       // You can handle redirect or token storage here
//       console.log("✅ Login successful!");
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       <div>
//         <label className="text-sm font-medium text-gray-700">Staff ID</label>
//         <input
//           type="text"
//           value={staffId}
//           onChange={(e) => setStaffId(e.target.value)}
//           placeholder="Enter Staff ID"
//           className="w-full mt-2 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//       </div>

//       <div>
//         <label className="text-sm font-medium text-gray-700">Password</label>
//         <div className="relative mt-2">
//           <input
//             type={showPassword ? "text" : "password"}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter Password"
//             className="w-full rounded-full border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-2.5 text-gray-500"
//             onClick={() => setShowPassword((prev) => !prev)}
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//       </div>

//       <div className="flex justify-between items-center text-sm">
//         <label className="flex items-center space-x-2 text-gray-600">
//           <input type="checkbox" className="rounded" />
//           <span>Remember for 30 days</span>
//         </label>
//         <a href="#" className="text-blue-600 font-medium hover:underline">
//           Forgot password
//         </a>
//       </div>

//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-[#1E237E] text-white rounded-full py-2 font-medium hover:bg-[#151b5e] transition"
//       >
//         {loading ? "Signing in..." : "Sign in"}
//       </button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@services/api";
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

  const { setUser } = useAuth();
  // const { redirectUser } = useRoleRedirect();
  const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login({
        email,
        password,
      });

      // Save user globally
      setUser(res.user);

      toast.success("Login successful!");

      // Redirect based on role (TYPE SAFE)
      // redirectUser(res.user.role);
      router.push ("/dashboard/doctor-dashboard")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
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
