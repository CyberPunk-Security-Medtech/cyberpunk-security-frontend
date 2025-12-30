"use client";

import {SignUpProvider} from "@context/SignUpContext";



export default function HospitalinfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <SignUpProvider> {children}</SignUpProvider>;
}
