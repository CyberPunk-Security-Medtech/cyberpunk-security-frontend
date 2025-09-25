import axios from "axios";

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
    const response = await api.post("/api/v1/users/login/", credentials);
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signup: async (userData: any) => {
    const response = await api.post("/api/v1/users/signup/", userData);
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },
  verifyOtp: async (otp: string, email: string) => {
    const response = await api.post("/auth/verify-otp", { otp, email });
    return response.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
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
