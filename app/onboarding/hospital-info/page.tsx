"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import HospitalInfoStep, {
  type HospitalInformation,
} from "@components/onboarding/HospitalInfoStep";
import VerifyHospitalStep from "@components/onboarding/VerifyHospitalStep";
import ComplianceSetup from "@components/onboarding/ComplianceSetup";
import StepIndicator from "@components/onboarding/StepIndicator";
import SuccessScreen from "@components/onboarding/SuccessScreen";
import { useAuth } from "@context/AuthContext";
import {
  organizationService,
  uploadService,
  verificationService,
  type VerificationDocument,
  type VerificationDocumentType,
  type VerificationStatus,
} from "@services/api";
import authLogo from "@public/auth_logo.svg";

type OnboardingStep = 1 | 2 | 3;
type RequiredVerificationDocumentType =
  | "business_registration"
  | "medical_license";

const ONBOARDING_ORGANIZATION_KEY =
  "privacure:onboarding-organization-id";

const requiredDocumentTypes = new Set<VerificationDocumentType>([
  "business_registration",
  "medical_license",
]);

const hasRequiredDocuments = (documents: VerificationDocument[]) =>
  [...requiredDocumentTypes].every((documentType) =>
    documents.some((document) => document.document_type === documentType),
  );

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data;
  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;

  if (Array.isArray(data?.detail)) {
    const firstMessage = data.detail.find(
      (item: unknown): item is { msg: string } =>
        typeof item === "object" &&
        item !== null &&
        "msg" in item &&
        typeof item.msg === "string",
    );
    if (firstMessage) return firstMessage.msg;
  }

  return fallback;
};

export default function OnboardingPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { user, hydrated, refreshWorkspaces } = useAuth();
  const hasStartedRestoration = useRef(false);

  const [step, setStep] = useState<OnboardingStep>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [hospitalData, setHospitalData] = useState<
    Partial<HospitalInformation>
  >({});
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("unverified");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [isRestoring, setIsRestoring] = useState(true);
  const [restorationError, setRestorationError] = useState<string | null>(null);

  const loadVerificationDraft = useCallback(async (orgId: string) => {
    const [organization, status, uploadedDocuments] = await Promise.all([
      organizationService.getOrganization(orgId),
      verificationService.getStatus(orgId),
      verificationService.listDocuments(orgId),
    ]);

    setOrganizationId(orgId);
    setHospitalData({
      name: organization.name,
      logoFile: null,
      logoPreview: organization.image_url,
    });
    setVerificationStatus(status.verification_status);
    setRejectionReason(status.verification_rejection_reason ?? null);
    setDocuments(uploadedDocuments);

    if (
      status.verification_status === "unverified" &&
      hasRequiredDocuments(uploadedDocuments)
    ) {
      setStep(3);
    } else {
      setStep(2);
    }
  }, []);

  const restoreDraft = useCallback(async () => {
    const draftOrganizationId = localStorage.getItem(
      ONBOARDING_ORGANIZATION_KEY,
    );

    if (!draftOrganizationId) {
      setIsRestoring(false);
      return;
    }

    setOrganizationId(draftOrganizationId);
    setRestorationError(null);
    setIsRestoring(true);

    try {
      await loadVerificationDraft(draftOrganizationId);
    } catch (error) {
      const responseStatus = isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (responseStatus === 403 || responseStatus === 404) {
        localStorage.removeItem(ONBOARDING_ORGANIZATION_KEY);
        setOrganizationId(null);
      } else {
        setRestorationError(
          getErrorMessage(
            error,
            "We could not restore the unfinished onboarding. You can retry without creating another hospital.",
          ),
        );
      }
    } finally {
      setIsRestoring(false);
    }
  }, [loadVerificationDraft]);

  useEffect(() => {
    if (!hydrated || hasStartedRestoration.current) return;

    if (!user) {
      router.replace("/auth/signup");
      setIsRestoring(false);
      return;
    }

    hasStartedRestoration.current = true;
    void restoreDraft();
  }, [hydrated, restoreDraft, router, user]);

  const handleNextFromHospital = async (data: HospitalInformation) => {
    let draftOrganizationId = organizationId;

    try {
      if (draftOrganizationId) {
        await organizationService.updateOrganization(draftOrganizationId, {
          name: data.name,
        });
      } else {
        const organization = await organizationService.createOrganization({
          name: data.name,
        });
        draftOrganizationId = organization.id;
        setOrganizationId(organization.id);
        localStorage.setItem(
          ONBOARDING_ORGANIZATION_KEY,
          organization.id,
        );
      }

      const savedOrganization = data.logoFile
        ? await uploadService.uploadImage(
            draftOrganizationId,
            data.logoFile,
          )
        : null;

      setHospitalData({
        name: data.name,
        logoFile: null,
        logoPreview:
          savedOrganization?.image_url ?? data.logoPreview ?? null,
      });

      const [status, uploadedDocuments] = await Promise.all([
        verificationService.getStatus(draftOrganizationId),
        verificationService.listDocuments(draftOrganizationId),
      ]);

      setVerificationStatus(status.verification_status);
      setRejectionReason(status.verification_rejection_reason ?? null);
      setDocuments(uploadedDocuments);
      setRestorationError(null);
      setStep(2);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to save the hospital information. Please try again.",
        ),
      );
    }
  };

  const handleDocumentUpload = async (
    documentType: RequiredVerificationDocumentType,
    file: File,
  ) => {
    if (!organizationId) {
      throw new Error(
        "The hospital information must be saved before uploading documents.",
      );
    }

    const uploadedDocument = await verificationService.uploadDocument(
      organizationId,
      documentType,
      file,
    );

    setDocuments((currentDocuments) => [
      ...currentDocuments.filter(
        (document) => document.document_type !== documentType,
      ),
      uploadedDocument,
    ]);
  };

  const handleDocumentRemove = async (
    document: VerificationDocument,
  ) => {
    if (!organizationId) {
      throw new Error("The hospital verification draft is unavailable.");
    }

    await verificationService.deleteDocument(organizationId, document.id);
    setDocuments((currentDocuments) =>
      currentDocuments.filter(
        (currentDocument) => currentDocument.id !== document.id,
      ),
    );
  };

  const handleFinish = async () => {
    if (!organizationId) {
      throw new Error("The hospital verification draft is unavailable.");
    }

    if (!hasRequiredDocuments(documents)) {
      throw new Error(
        "Upload both hospital verification documents before submitting.",
      );
    }

    try {
      await verificationService.submit(organizationId);
      setVerificationStatus("pending");
      localStorage.removeItem(ONBOARDING_ORGANIZATION_KEY);
      await refreshWorkspaces();
      setIsSuccess(true);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to submit the hospital for verification. Please try again.",
        ),
      );
    }
  };

  const stepTransition = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, x: 16 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 },
      };

  return (
    <main className="flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-gray-50 px-4 py-6 sm:py-10">
      <motion.div
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-5 shadow-xl sm:p-8"
        initial={{
          opacity: 0,
          y: shouldReduceMotion ? 0 : 12,
        }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6 flex justify-center">
          <Image
            src={authLogo}
            alt="PrivaCure"
            width={110}
            height={70}
            className="h-auto w-[110px]"
            priority
          />
        </div>

        {!isSuccess ? (
          <div className="mb-8">
            <StepIndicator currentStep={step} />
          </div>
        ) : null}

        {restorationError && !isSuccess ? (
          <div
            className="mb-5 flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between"
            role="alert"
          >
            <span className="flex items-start gap-2">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              {restorationError}
            </span>
            <button
              type="button"
              onClick={() => void restoreDraft()}
              className="min-h-11 shrink-0 rounded-lg border border-amber-500 px-4 py-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
            >
              Retry
            </button>
          </div>
        ) : null}

        {isRestoring ? (
          <div
            className="flex min-h-52 flex-col items-center justify-center gap-3 text-sm text-gray-600"
            role="status"
          >
            <LoaderCircle
              className="h-6 w-6 animate-spin text-[#1A2380] motion-reduce:animate-none"
              aria-hidden="true"
            />
            Restoring your onboarding…
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" {...stepTransition}>
                <SuccessScreen
                  onContinue={() => router.push("/auth/workspace-select")}
                />
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="hospital-information" {...stepTransition}>
                <HospitalInfoStep
                  onNext={handleNextFromHospital}
                  defaultValues={hospitalData}
                />
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="verify-hospital" {...stepTransition}>
                <VerifyHospitalStep
                  documents={documents}
                  status={verificationStatus}
                  rejectionReason={rejectionReason}
                  onUpload={handleDocumentUpload}
                  onRemove={handleDocumentRemove}
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                  onExit={() => router.push("/auth/workspace-select")}
                />
              </motion.div>
            ) : (
              <motion.div key="compliance" {...stepTransition}>
                <ComplianceSetup
                  onBack={() => setStep(2)}
                  onFinish={handleFinish}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </main>
  );
}
