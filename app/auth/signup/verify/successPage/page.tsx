import SuccessScreen from "@components/auth/AuthSuccessScreen";

export default function VerificationSuccesPage() {
  return (
    <SuccessScreen
      title="Email Verified"
      description="Your email has been verified successfully. Click below to get started."
      buttonText="Get started"
      redirectTo="/auth/login"
    />
  );
}
