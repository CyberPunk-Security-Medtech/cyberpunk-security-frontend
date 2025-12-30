'use client'

import { Suspense } from 'react' 
import VerifyForm from "@components/auth/VerifyForm"

export default function VerifyPage(){
  return(
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Suspense fallback={<div className="text-gray-500">Loading verification...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  )
}