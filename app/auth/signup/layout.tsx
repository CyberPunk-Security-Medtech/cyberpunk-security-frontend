"use client";

import {SignUpProvider, UserData} from "@context/SignUpContext";



export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <SignUpProvider> {children}</SignUpProvider>;
}
