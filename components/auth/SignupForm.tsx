

// "use client"

// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import { authService } from "@services/api";
// import { useRouter } from "next/navigation";


// export default function SignupForm() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     // confirmPassword: "",
//     remember: false,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setError("");
//   setSuccess("");

//   try {
//     setLoading(true);

//     const userDataPayload = {
//       email: formData.email,
//       first_name: formData.firstName,
//       last_name: formData.lastName,
//       password: formData.password,
//     };

//     const response = await authService.signup(userDataPayload);

//     // Save only to localStorage for verification page
//     localStorage.setItem("signupEmail", formData.email);
//     localStorage.removeItem("user");
//     localStorage.removeItem("workspaces");
//     localStorage.removeItem("activeWorkspace");
//     localStorage.removeItem("verifiedEmail");

//   localStorage.clear()
//     // Redirect to verify page
//     router.push(`/auth/signup/verify?email=${formData.email}`);
//   } catch (err: any) {
//     setError(err?.response?.data?.message || "Signup failed. Try again.");
//   } finally {
//     setLoading(false);
//   }
// };


"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { authService } from "@services/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@utils/apiError";

// Mirrors the backend password policy: minimum 12 characters, and it must
// not appear in public breach databases (the breach check runs server-side
// and is reported back as a regular signup error).
const PASSWORD_RULES: Array<{ label: string; test: (value: string) => boolean }> = [
  { label: "At least 12 characters", test: (value) => value.length >= 12 },
];

const getPasswordValidationErrors = (value: string) =>
  PASSWORD_RULES.filter((rule) => !rule.test(value)).map((rule) => rule.label);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateSignupForm = (form: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): string => {
  if (!form.firstName.trim()) return "First name is required.";
  if (!form.lastName.trim()) return "Last name is required.";
  if (!form.email.trim()) return "Email address is required.";
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    return "Email address must be a valid email address.";
  }
  const passwordErrors = getPasswordValidationErrors(form.password);
  if (passwordErrors.length > 0) {
    return `Password must contain ${passwordErrors.join(", ").toLowerCase()}.`;
  }
  return "";
};

export default function SignupForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const passwordErrors = passwordTouched
    ? getPasswordValidationErrors(formData.password)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setPasswordTouched(true);

    const validationMessage = validateSignupForm(formData);
    if (validationMessage) {
      setFormError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    try {
      setLoading(true);

      const userDataPayload = {
        email: formData.email.trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        password: formData.password,
      };

      const response = await authService.signup(userDataPayload);

      toast.success(
        response?.data?.message ||
          response?.data?.detail ||
          "Account created successfully"
      );

      localStorage.clear();
      localStorage.setItem("signupEmail", formData.email);

      router.push(`/auth/signup/verify?email=${formData.email}`);
    } catch (err: any) {
      const message = getApiErrorMessage(err, "Signup failed. Please try again.");
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 sm:space-y-5"
    >
      {formError && <p id="signup-error" role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
      <div>
        <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter Email Address"
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={(event) => { handleChange(event); setFormError(""); }}
          aria-invalid={Boolean(formError)}
          aria-describedby={formError ? "signup-error" : undefined}
        />
      </div>

      <div>
        <label htmlFor="signup-first-name" className="mb-1 block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          id="signup-first-name"
          type="text"
          name="firstName"
          autoComplete="given-name"
          placeholder="First Name"
          className="w-full px-4 py-1.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.firstName}
          onChange={(event) => { handleChange(event); setFormError(""); }}
        />
      </div>

      <div>
        <label htmlFor="signup-last-name" className="mb-1 block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          id="signup-last-name"
          type="text"
          name="lastName"
          autoComplete="family-name"
          placeholder="Last Name"
          className="w-full px-4 py-1.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.lastName}
          onChange={(event) => { handleChange(event); setFormError(""); }}
        />
      </div>

      <div className="relative">
        <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="signup-password"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="new-password"
          placeholder="Enter Password"
          className="w-full px-4 py-1.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          value={formData.password}
          onChange={(event) => { handleChange(event); setFormError(""); }}
          onBlur={() => setPasswordTouched(true)}
          aria-invalid={Boolean(formError) || passwordErrors.length > 0}
          aria-describedby={passwordErrors.length > 0 ? "signup-password-rules" : undefined}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-1 top-7 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {passwordTouched && passwordErrors.length > 0 ? (
        <ul id="signup-password-rules" className="-mt-2 space-y-1 text-xs text-gray-500">
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

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
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

        <Link
          href="/auth/forgot_password"
          className="text-blue-700 hover:underline"
        >
          Forgot password
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="min-h-11 w-full rounded-full bg-blue-900 py-1.5 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create account"}
      </button>

      <div className="mt-4 p-3 border border-teal-400 text-sm text-gray-700 rounded-lg bg-teal-50">
        Admins can register new hospitals. Staff accounts are created by Admins.
        Patients cannot log in.
      </div>

      <p className="text-center text-gray-500 text-sm">
        I am a staff.{" "}
        <Link
          href="/auth/login"
          className="text-blue-800 font-medium hover:underline"
        >
          Log into account
        </Link>
      </p>
    </form>
  );
}

// return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       {/* Email */}
//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Email Address
//         </label>
//         <input
//           type="email"
//           name="email"
//           placeholder="Enter Email Address"
//           className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//       </div>

//        <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           First Name
//         </label>
//         <input
//           type="text"
//           name="firstName"
//           placeholder="First Name"
//           className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={formData.firstName}
//           onChange={handleChange}
//           required
//         />
//       </div>
//        <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Last Name
//         </label>
//         <input
//           type="text"
//           name="lastName"
//           placeholder="Last Name"
//           className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={formData.lastName}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       {/* Password */}
//       <div className="relative">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Password
//         </label>
//         <input
//           type={showPassword ? "text" : "password"}
//           name="password"
//           placeholder="Enter Password"
//           className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-4 top-9 text-gray-500"
//         >
//           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       </div>

//       {/* Confirm Password */}
//       {/* <div className="relative">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Confirm Password
//         </label>
//         <input
//           type={showConfirmPassword ? "text" : "password"}
//           name="confirmPassword"
//           placeholder="Enter Confirm Password"
//           className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//         />
//         <button
//           type="button"
//           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//           className="absolute right-4 top-9 text-gray-500"
//         >
//           {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       </div> */}

      

//       {/* Remember + Forgot */}
//       <div className="flex items-center justify-between text-sm">
//         <label className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             name="remember"
//             checked={formData.remember}
//             onChange={handleChange}
//             className="rounded border-gray-300 text-blue-600"
//           />
//           <span>Remember for 30 days</span>
//         </label>
//         <Link href="/auth/forgot_password" className="text-blue-700 hover:underline">
//           Forgot password
//         </Link>
//       </div>

//       {/* Submit Button */}
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-900 text-white py-2 rounded-full font-semibold hover:bg-blue-800 transition"
//       >
//         {loading ? "Creating..." : "Create account"}
//       </button>

//       {/* Info Box */}
//       <div className="mt-6 p-3 border border-teal-400 text-sm text-gray-700 rounded-lg bg-teal-50">
//         Admins can register new hospitals. Staff accounts are created by
//         Admins. Patients cannot log in.
//       </div>

//       {/* Footer */}
//       <p className="text-center text-gray-500 text-sm">
//         I am a staff.{" "}
//         <Link href="/auth/login" className="text-blue-800 font-medium hover:underline">
//           Log into account
//         </Link>
//       </p>

//       {/* Error Message */}
    
//     </form>
//   );
// }
