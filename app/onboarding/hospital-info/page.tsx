"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HospitalInfoStep from "@components/onboarding/HospitalInfoStep";
import ComplianceSetup from "@components/onboarding/ComplianceSetup";
import StepIndicator from "@components/onboarding/StepIndicator";
import SuccessScreen from "@components/onboarding/SuccessScreen";
import { useSignup } from "@context/SignUpContext";
import { useRouter } from "next/navigation";
import { organizationService } from "@services/api";
import Image from "next/image";
import auth_logo from "@public/auth_logo.svg";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hospitalData, setHospitalData] = useState<{ name?: string; image_url?: string }>({});
  const [user, setUser] = useState<{ email: string } | null>(null);

useEffect(() => {
  localStorage.removeItem("user")
  localStorage.removeItem("workspaces")
    const storedUser = localStorage.getItem("email");
    if (!storedUser) {
      router.replace("/auth/signup");
      return;
    }
    setUser({email: storedUser});
  }, [router]);

  const handleNextFromHospital = (data: any) => {
    setHospitalData(data);
    setStep(2);
  };

  const handleFinish = async () => {
    try {
      if (!user) throw new Error("User not available");

      await organizationService.createOrganization({
        name: hospitalData.name!,
        image_url: hospitalData.image_url || null,
        // user_id: user.id, // ✅ assign to correct user
      });

      localStorage.removeItem("verifiedEmail");
      localStorage.removeItem("signupEmail")
      setIsSuccess(true);
      router.replace("/auth/workspace-select");
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete onboarding");
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
        onDashboard={() => router.push("/dashboard/admin-dashboard")}
        onAddStaff={() => router.push("/dashboard/admin-dashboard/staff-management")}
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
            

          // ) : step === 2 ? (
          //     <motion.div
          //       key="step2"
          //       initial={{ opacity: 0, x: 20 }}
          //       animate={{ opacity: 1, x: 0 }}
          //       exit={{ opacity: 0, x: -20 }}
          //     >
          //       <AdminInfoStep onBack={() => setStep(1)} onNext={handleNextFromAdmin} defaultValues={adminData} />
          //     </motion.div>
            

           ): step === 2 && (
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