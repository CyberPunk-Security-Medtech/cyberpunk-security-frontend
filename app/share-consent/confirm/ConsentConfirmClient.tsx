"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { dataSharingService } from "@services/api";

type ConsentState = "choice" | "submitting" | "success" | "declined" | "error";

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  }

  return "This consent link is invalid or has expired.";
};

export default function ConsentConfirmClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<ConsentState>(token ? "choice" : "error");
  const [message, setMessage] = useState(
    token
      ? "Review this request before approving record sharing."
      : "No consent token was found in this link.",
  );

  const approveConsent = async () => {
    if (!token) {
      setState("error");
      setMessage("No consent token was found in this link.");
      return;
    }

    setState("submitting");
    setMessage("Confirming your consent...");

    try {
      const response = await dataSharingService.confirmConsent(token);
      setState("success");
      setMessage(
        response.status === "active"
          ? "Consent approved. The receiving hospital can now access only the approved records."
          : `Consent updated. Current status: ${response.status}.`,
      );
    } catch (error) {
      setState("error");
      setMessage(getErrorMessage(error));
    }
  };

  const declineConsent = () => {
    setState("declined");
    setMessage(
      "Your records have not been approved from this page. Please contact the sending hospital to decline this request formally.",
    );
  };

  const isSubmitting = state === "submitting";
  const isSuccess = state === "success";
  const isError = state === "error";
  const isDeclined = state === "declined";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fbfb] px-4">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm">
        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
            isSubmitting
              ? "bg-[#effafa] text-[#19c7b6]"
              : isSuccess
                ? "bg-emerald-50 text-emerald-600"
                : isError || isDeclined
                  ? "bg-red-50 text-red-600"
                  : "bg-[#EEF0FF] text-[#211783]"
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : isSuccess ? (
            <CheckCircle2 className="h-11 w-11" />
          ) : isError || isDeclined ? (
            <XCircle className="h-11 w-11" />
          ) : (
            <ShieldCheck className="h-11 w-11" />
          )}
        </div>

        <div className="mb-2 flex items-center justify-center gap-2 text-[#211783]">
          <ShieldCheck size={18} />
          <span className="text-sm font-semibold">PrivaCure Consent</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          {isSubmitting
            ? "Confirming Consent"
            : isSuccess
              ? "Consent Approved"
              : isDeclined
                ? "Consent Not Approved"
                : isError
                  ? "Consent Link Failed"
                  : "Patient Data Sharing Consent"}
        </h1>

        {state === "choice" && (
          <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-5 text-left">
            <p className="text-sm font-semibold text-gray-900">
              Do you consent to share your selected medical records with the
              receiving hospital for this referral?
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-500">
              <li>Only the approved record categories can be shared.</li>
              <li>The access can expire or be revoked by the sending hospital.</li>
              <li>You should approve only if you understand this request.</li>
            </ul>
          </div>
        )}

        <p className="mt-4 text-sm leading-6 text-gray-500">{message}</p>

        {state === "choice" && (
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            <button
              onClick={declineConsent}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              No, I Do Not Consent
            </button>
            <button
              onClick={approveConsent}
              className="rounded-xl bg-[#211783] px-5 py-3 text-sm font-semibold text-white hover:bg-[#18105f]"
            >
              Yes, I Consent
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
