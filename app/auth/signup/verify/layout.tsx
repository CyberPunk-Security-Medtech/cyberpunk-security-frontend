
import VerifyForm from '@components/auth/VerifyForm';
import React from 'react'




export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
return(


<div className="min-h-screen bg-gray-50 flex items-center justify-center"><VerifyForm/>{children}</div>
)
}