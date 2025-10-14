"use client";

import { useRef } from "react";

interface OTPInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
}

export default function OTPInput({ otp, setOtp }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex space-x-3 justify-center my-4">
      {otp.map((digit, i) => (
        <input
          key={i}
         ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-14 h-14 text-center border-2 border-gray-300 rounded-lg text-2xl font-semibold text-gray-700 focus:border-blue-700 focus:outline-none"
        />
      ))}
    </div>
  );
}
