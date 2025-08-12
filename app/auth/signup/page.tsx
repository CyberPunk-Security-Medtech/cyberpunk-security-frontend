"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, paymentSchema } from "@schemas/schemas";
import { SignupFormData, PaymentFormActivationData } from "@forms/forms";
// import { Button } from "@components/Button";
import { PaymentForm } from "@components/auth/PaymentActivationForm";
import { SignupForm } from "@components/auth/SignupForm";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [activationKey, setActivationKey] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        formState: { errors: signupErrors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const {
        register: registerPayment,
        handleSubmit: handlePaymentSubmit,
        formState: { errors: paymentErrors },
    } = useForm<PaymentFormActivationData>({
        resolver: zodResolver(paymentSchema),
    });

    const handleGetActivationKey = () => {
        setActivationKey("12345678"); // Replace with API call
    };

    const onSignupSubmit: SubmitHandler<SignupFormData> = async (data) => {
        try {
            console.log("Signup form submitted", data);
            setStep(2);
        } catch (error) {
            setSubmitError("Failed to submit signup form");
        }
    };

    const onPaymentSubmit: SubmitHandler<PaymentFormActivationData> = async (data) => {
        try {
            console.log("Payment form submitted", data);
            router.push("/dashboard");
        } catch (error) {
            setSubmitError("Failed to submit payment info");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            {step === 1 ? (
                <SignupForm
                    register={registerSignup}
                    errors={signupErrors}
                    onSubmit={handleSignupSubmit(onSignupSubmit)}
                    activationKey={activationKey}
                    onGetActivationKey={handleGetActivationKey}
                    submitError={submitError}
                />
            ) : (
                <PaymentForm
                    register={registerPayment}
                    errors={paymentErrors}
                    onSubmit={handlePaymentSubmit(onPaymentSubmit)}
                    submitError={submitError}
                />
            )}
        </div>
    );
}
