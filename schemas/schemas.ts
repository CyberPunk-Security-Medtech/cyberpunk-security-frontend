import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  hospital: z.string().min(1, "Hospital name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  countryCode: z.string().min(1, "Country code is required"),
  agreeToTerms: z.boolean().refine((val) => val, "You must agree to the terms"),
});

export const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  mm: z.string().min(2, "Month is required").max(2),
  yy: z.string().min(2, "Year is required").max(2),
  cvc: z.string().min(3, "CVC is required").max(4),
  cardholder: z.string().min(1, "Cardholder name is required"),
});

export const addPatientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  condition: z.string().min(1, "Condition is required"),
});
