"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HospitalInfoStep from "@components/onboarding/HospitalInfoStep";
import AdminInfoStep from "@components/onboarding/AdminInfoStep";
import ComplianceSetup from "@components/onboarding/ComplianceSetup"; // keep your filename here
import StepIndicator from "@components/onboarding/StepIndicator";
import { useSignup } from "@context/SignUpContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import auth_logo from "@public/auth_logo.svg";
import SuccessScreen from "@components/onboarding/SuccessScreen";

export default function OnboardingPage() {
  const router = useRouter();
  const { hospitalData, adminData, setHospitalData, setAdminData } = useSignup();
  const [step, setStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState(false);


  // restore saved step
  useEffect(() => {
    const s = Number(localStorage.getItem("onboardingStep") || "1");
    if (s >= 1 && s <= 3) setStep(s);
  }, []);

  useEffect(() => {
    localStorage.setItem("onboardingStep", String(step));
  }, [step]);

  const handleNextFromHospital = (data: any) => {
    setHospitalData({
      name: data.name,
      address: data.address,
      type: data.type,
    });
    setStep(2);
  };

  const handleNextFromAdmin = (data: any) => {
    setAdminData({
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
    });
    setStep(3);
  };

 const handleFinish = async (data: any) => {
  try {
    const payload = {
      hospital: hospitalData,
      admin: adminData,
      compliance: data.docs || [],
    };

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || ""}/api/onboarding/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) throw new Error(await res.text());

    localStorage.removeItem("onboardingStep");
    setIsSuccess(true); // ✅ show success screen
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Failed to finish onboarding");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Centered Card */}
      <motion.div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* IMAGE inside the card, top centered */}
        <div className="flex justify-center mb-6">
          <Image src={auth_logo} alt="Privacure illustration" width={110} height={70} />
        </div>

        {/* Step indicator with connecting line */}
        <div className="mb-6">
          <StepIndicator currentStep={step} />
        </div>

      

        {/* Animated steps */}
        <div className="w-full">
          <AnimatePresence mode="wait">
             {isSuccess ? (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <SuccessScreen
        onDashboard={() => router.push("/dashboard/admin")}
        onAddStaff={() => router.push("/dashboard/admin/staff")}
      />
    </motion.div>
            ): step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <HospitalInfoStep onNext={handleNextFromHospital} defaultValues={hospitalData} />
              </motion.div>
            

          ) : step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AdminInfoStep onBack={() => setStep(1)} onNext={handleNextFromAdmin} defaultValues={adminData} />
              </motion.div>
            

           ): step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ComplianceSetup onBack={() => setStep(2)} onFinish={handleFinish} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
