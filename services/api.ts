import axios from "axios";
import { Code2 } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth endpoints
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/api/v1/auth/login/", credentials);
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signup: async (userData: any) => {
    const response = await api.post("/api/v1/auth/register/", userData);
    return response.data;
  },
  requestPasswordReset: async (email: string) => {
    const response = await api.post("/api/v1/auth/request-password-reset", { email });
    return response.data;
  },
  verifyEmail: async (code: string, email: string) => {
    const response = await api.post("/api/v1/auth/verify-user", { code, email });
    return response.data;
  },
  verifyPasswordReset: async (code: string, email: string) => {
  const res = await api.post("/api/v1/auth/verify-reset-code", { code, email });
  return res.data;
},
   resendOtp: async (email: string) => {
    return (
      await api.post("/api/v1/auth/resend-verification", { email })
    ).data;
  },
  resetPassword: async ( email: string, code: string, new_password: string) => {
    const response = await api.post("/api/v1/auth/reset-password", {
      email,
      code,
      new_password,
    });
    return response.data;
  },
};

// Payment endpoints
export const paymentService = {
  getActivationKey: async () => {
    const response = await api.get("/payment/activation-key");
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processPayment: async (paymentData: any) => {
    const response = await api.post("/payment/process", paymentData);
    return response.data;
  },
};
