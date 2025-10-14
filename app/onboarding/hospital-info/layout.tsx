// app/onboarding/layout.tsx
"use client";

import { SignupProvider } from "@context/SignUpContext";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SignupProvider>{children}</SignupProvider>;
}
