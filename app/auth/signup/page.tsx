"use client";

import { useRouter } from "next/navigation";
import { signupSchema } from "@schemas/schemas";
import useFormHook from "@hooks/useFormHook";
import Button from "@components/Button";
import Image from "next/image";
import Link from "next/link";
import logo from "@public/auth_logo.svg";
import { authService } from "@services/api";
import { toast } from "react-toastify";

const SignupPage = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        submitError,
        setSubmitError,
    } = useFormHook(signupSchema, async (data) => {
        try {
            const response = await authService.signup(data);
            toast.success("Signup successful");
            router.push("/dashboard");
        } catch (error: any) {
            setSubmitError("Signup failed. Please try again.");
        }
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            {/* Logo above the card */}
            <div className="p-[37px] flex justify-center">
                <Image
                    src={logo}
                    alt="logo"
                    width={91}
                    height={75}
                    className="w-[91px] h-[75px]"
                />
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <p className="text-gray-500">Create your account</p>
                </div>

                {/* Error Message */}
                {submitError && (
                    <div className="p-3 bg-error/10 text-error rounded-lg text-sm">
                        {submitError}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Full Name
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-2.5 border ${errors.name ? "border-error" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-sm text-error">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Specialty */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Specialty
                        </label>
                        <input
                            {...register("specialty")}
                            type="text"
                            placeholder="Enter your specialty"
                            className={`w-full px-4 py-2.5 border ${errors.specialty ? "border-error" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        />
                        {errors.specialty && (
                            <p className="mt-1.5 text-sm text-error">
                                {errors.specialty.message}
                            </p>
                        )}
                    </div>

                    {/* Hospital */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Hospital
                        </label>
                        <input
                            {...register("hospital")}
                            type="text"
                            placeholder="Enter hospital name"
                            className={`w-full px-4 py-2.5 border ${errors.hospital ? "border-error" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        />
                        {errors.hospital && (
                            <p className="mt-1.5 text-sm text-error">
                                {errors.hospital.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter your email"
                            className={`w-full px-4 py-2.5 border ${errors.email ? "border-error" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-sm text-error">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Phone + Country Code */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Code
                            </label>
                            <input
                                {...register("countryCode")}
                                type="text"
                                placeholder="+1"
                                className={`w-full px-4 py-2.5 border ${errors.countryCode ? "border-error" : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                            />
                            {errors.countryCode && (
                                <p className="mt-1.5 text-sm text-error">
                                    {errors.countryCode.message}
                                </p>
                            )}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Phone
                            </label>
                            <input
                                {...register("phone")}
                                type="tel"
                                placeholder="1234567890"
                                className={`w-full px-4 py-2.5 border ${errors.phone ? "border-error" : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                            />
                            {errors.phone && (
                                <p className="mt-1.5 text-sm text-error">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center">
                        <input
                            {...register("agreeToTerms")}
                            type="checkbox"
                            id="agreeToTerms"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="agreeToTerms"
                            className="ml-2 text-sm text-gray-700"
                        >
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary-600 hover:underline">
                                Terms and Conditions
                            </Link>
                            {" "} and to the {" "}
                            <Link href="/terms" className="text-primary-600 hover:underline">
                                Privacy policy
                            </Link>
                        </label>
                    </div>
                    {errors.agreeToTerms && (
                        <p className="mt-1.5 text-sm text-error">
                            {errors.agreeToTerms.message}
                        </p>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                    >
                        {isSubmitting ? "Creating account..." : "Sign up"}
                    </Button>
                </form>

                {/* Login Link */}
                <div className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="font-medium text-primary-600 hover:text-primary-700"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
