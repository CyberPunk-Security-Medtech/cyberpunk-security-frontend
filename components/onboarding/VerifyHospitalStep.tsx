"use client";

import { useMemo, useState } from "react";
import { isAxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import type {
  VerificationDocument,
  VerificationDocumentType,
  VerificationStatus,
} from "@services/api";

type RequiredVerificationDocumentType =
  | "business_registration"
  | "medical_license";

type VerifyHospitalStepProps = {
  documents: VerificationDocument[];
  status: VerificationStatus;
  rejectionReason: string | null;
  onUpload: (
    documentType: RequiredVerificationDocumentType,
    file: File,
  ) => Promise<void>;
  onRemove: (document: VerificationDocument) => Promise<void>;
  onBack: () => void;
  onNext: () => void;
  onExit: () => void;
};

type UploadRequirement = {
  type: RequiredVerificationDocumentType;
  title: string;
};

const uploadRequirements: UploadRequirement[] = [
  {
    type: "business_registration",
    title: "CAC Verification",
  },
  {
    type: "medical_license",
    title: "State Health Facility Registration/License",
  },
];

const acceptedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

const acceptedExtensions = new Set(["jpg", "jpeg", "png", "pdf"]);

const isAcceptedFile = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return acceptedMimeTypes.has(file.type) || acceptedExtensions.has(extension);
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const firstMessage = detail.find(
      (item): item is { msg: string } =>
        typeof item === "object" &&
        item !== null &&
        "msg" in item &&
        typeof item.msg === "string",
    );
    if (firstMessage) return firstMessage.msg;
  }

  return fallback;
};

const isRequiredDocumentType = (
  value: VerificationDocumentType,
): value is RequiredVerificationDocumentType =>
  value === "business_registration" || value === "medical_license";

export default function VerifyHospitalStep({
  documents,
  status,
  rejectionReason,
  onUpload,
  onRemove,
  onBack,
  onNext,
  onExit,
}: VerifyHospitalStepProps) {
  const [busyType, setBusyType] =
    useState<RequiredVerificationDocumentType | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredVerificationDocumentType, string>>
  >({});

  const documentsByType = useMemo(() => {
    const entries: Array<
      readonly [RequiredVerificationDocumentType, VerificationDocument]
    > = [];

    documents.forEach((document) => {
      if (isRequiredDocumentType(document.document_type)) {
        entries.push([document.document_type, document]);
      }
    });

    return new Map(entries);
  }, [documents]);

  const isLocked = status === "pending" || status === "verified";
  const hasAllDocuments = uploadRequirements.every((requirement) =>
    documentsByType.has(requirement.type),
  );

  const handleFileSelection = async (
    documentType: RequiredVerificationDocumentType,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    if (!isAcceptedFile(file)) {
      setErrors((current) => ({
        ...current,
        [documentType]: "Choose a JPG, PNG, or PDF document.",
      }));
      input.value = "";
      return;
    }

    setBusyType(documentType);
    setErrors((current) => ({ ...current, [documentType]: undefined }));

    try {
      await onUpload(documentType, file);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        [documentType]: getErrorMessage(
          error,
          "The document could not be uploaded. Please try again.",
        ),
      }));
    } finally {
      setBusyType(null);
      input.value = "";
    }
  };

  const handleRemove = async (document: VerificationDocument) => {
    if (!isRequiredDocumentType(document.document_type)) return;

    setBusyType(document.document_type);
    setErrors((current) => ({
      ...current,
      [document.document_type]: undefined,
    }));

    try {
      await onRemove(document);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        [document.document_type]: getErrorMessage(
          error,
          "The document could not be removed. Please try again.",
        ),
      }));
    } finally {
      setBusyType(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md" aria-labelledby="verify-title">
      <header className="mb-5 text-center">
        <h1
          id="verify-title"
          className="text-xl font-semibold text-gray-950 sm:text-2xl"
        >
          Verify Hospital
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Verify the authenticity of your hospital
        </p>
      </header>

      {status === "rejected" ? (
        <div
          className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-medium">Verification needs an update.</p>
          <p className="mt-1">
            {rejectionReason ||
              "Review your documents, make the required changes, and submit again."}
          </p>
        </div>
      ) : null}

      {isLocked ? (
        <div
          className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950"
          role="status"
        >
          {status === "verified"
            ? "This hospital has already been verified."
            : "Your hospital verification is awaiting review. Documents cannot be changed while the review is pending."}
        </div>
      ) : null}

      <fieldset className="space-y-3" disabled={isLocked || busyType !== null}>
        <legend className="sr-only">Hospital verification documents</legend>

        {uploadRequirements.map((requirement) => {
          const document = documentsByType.get(requirement.type);
          const isBusy = busyType === requirement.type;
          const error = errors[requirement.type];
          const inputId = `verification-${requirement.type}`;
          const errorId = `${inputId}-error`;

          return (
            <div key={requirement.type}>
              <div
                className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-2.5 transition focus-within:border-[#1A2380] focus-within:ring-2 focus-within:ring-[#1A2380]/20 motion-reduce:transition-none ${
                  error ? "border-red-500" : "border-gray-400"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {requirement.title}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {isBusy
                      ? document
                        ? "Removing document…"
                        : "Uploading document…"
                      : document
                        ? document.file_name || "Document uploaded"
                        : "Upload document · Supports JPG, PNG, PDF"}
                  </p>
                </div>

                {isBusy ? (
                  <LoaderCircle
                    className="h-5 w-5 shrink-0 animate-spin text-[#1A2380] motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : document ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <CheckCircle2
                      className="h-5 w-5 text-emerald-600"
                      aria-hidden="true"
                    />
                    {!isLocked ? (
                      <button
                        type="button"
                        onClick={() => void handleRemove(document)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] motion-reduce:transition-none"
                        aria-label={`Remove ${requirement.title}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <label
                    htmlFor={inputId}
                    className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 focus-within:ring-2 focus-within:ring-[#1A2380] focus-within:ring-offset-2 motion-reduce:transition-none"
                    aria-label={`Upload ${requirement.title}`}
                  >
                    <Upload className="h-5 w-5" aria-hidden="true" />
                    <input
                      id={inputId}
                      type="file"
                      className="sr-only"
                      accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                      aria-describedby={error ? errorId : undefined}
                      onChange={(event) =>
                        void handleFileSelection(requirement.type, event)
                      }
                    />
                  </label>
                )}
              </div>

              {error ? (
                <p
                  id={errorId}
                  className="mt-1.5 flex items-start gap-1.5 px-2 text-xs text-red-700"
                  role="alert"
                >
                  <AlertCircle
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </fieldset>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={isLocked ? onExit : onNext}
          disabled={
            !isLocked && (!hasAllDocuments || busyType !== null)
          }
          className="min-h-11 w-full rounded-full bg-[#1A2380] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#151C6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLocked ? "Continue to workspaces" : "Continue"}
        </button>
        {!isLocked ? (
          <button
            type="button"
            onClick={onBack}
            disabled={busyType !== null}
            className="min-h-11 w-full rounded-full px-6 py-2 text-sm font-medium text-[#1A2380] transition hover:bg-[#1A2380]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back to hospital information
          </button>
        ) : null}
      </div>

      {!hasAllDocuments && !isLocked ? (
        <p className="mt-2 text-center text-xs text-gray-500" role="status">
          Upload both documents to continue.
        </p>
      ) : null}
    </section>
  );
}
