import SuccessScreen from "@components/auth/AuthSuccessScreen";

export default function PasswordResetSuccessPage() {
  return (
    <SuccessScreen
      title="Password reset"
      description="Your password has been successfully reset. Click below to log in."
      buttonText="Go back to Login"
      redirectTo="/auth/login"
    />
  );
}
