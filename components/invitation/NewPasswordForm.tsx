// 'use client'

// import { invitationService} from "@services/api";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "react-toastify";

//  function SetPasswordForm({ email }: { email: string }) {
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const router = useRouter();

//   const submit = async () => {
//     if (password !== confirm) return toast.error("Passwords do not match");

//     await invitationService.registerInvitedUser({
//       email,
//       password,
//     });

//     router.refresh(); 
//   };

//   return (
//     <div className="mt-6 space-y-4">
//       <input value={email} disabled className="w-full rounded-full border px-4 py-2 bg-gray-100" />
    



//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full rounded-full border px-4 py-2"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Confirm Password"
//         className="w-full rounded-full border px-4 py-2"
//         onChange={(e) => setConfirm(e.target.value)}
//       />
//       <button onClick={submit} className="w-full bg-blue-900 text-white py-2 rounded-full">
//         Create Account
//       </button>
//     </div>
//   );
// }

// export default SetPasswordForm;


"use client";

import { useState } from "react";
import { invitationService } from "@services/api";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

interface Props {
  email: string ;
  invitationId: string;
  onSuccess?: () => void;
}

export default function SetPasswordForm({ email, invitationId, onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const[showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password,
    remember: false,
  });

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
    
    if(!email){
      setError("Invitation email is missing")
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // Call your endpoint to register invited user
      await invitationService.registerInvitedUser(invitationId , {email, first_name:formData.firstName, last_name:formData.lastName, password},
    );

      if (onSuccess) onSuccess();
    } catch (err) {
      let message = "Failed to register user.";
      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          message;
      }
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">

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

<div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter Password"
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
        onChange={(e) => setPassword(e.target.value)}
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
          value={confirmPassword}
         onChange={(e) => setConfirmPassword(e.target.value)}
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
        
      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-2 rounded-full"
        disabled={loading}
      >
        {loading ? "Registering..." : "Create Account"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}






