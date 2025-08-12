export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PaymentFormActivationData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}
