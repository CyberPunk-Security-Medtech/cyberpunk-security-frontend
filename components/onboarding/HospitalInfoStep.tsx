"use client";

import { useState } from "react";

export type HospitalInformation = {
  name: string;
  logoFile: File | null;
  logoPreview: string | null;
};

type HospitalInfoStepProps = {
  defaultValues?: Partial<HospitalInformation>;
  onNext: (data: HospitalInformation) => Promise<void>;
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to preview this image."));
  });

export default function HospitalInfoStep({
  defaultValues,
  onNext,
}: HospitalInfoStepProps) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [logoFile, setLogoFile] = useState<File | null>(
    defaultValues?.logoFile ?? null,
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    defaultValues?.logoPreview ?? null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    try {
      const preview = await readFileAsDataUrl(selectedFile);
      setLogoFile(selectedFile);
      setLogoPreview(preview);
    } catch (previewError) {
      setError(
        previewError instanceof Error
          ? previewError.message
          : "Unable to preview this image.",
      );
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Organization name is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onNext({
        name: trimmedName,
        logoFile,
        logoPreview,
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save the hospital information. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label
          htmlFor="organization-name"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Organization Name
        </label>
        <input
          id="organization-name"
          type="text"
          autoComplete="organization"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#1A2380] focus:ring-2 focus:ring-[#1A2380]/20 motion-reduce:transition-none"
          placeholder="Enter organization name"
          aria-describedby={error ? "hospital-information-error" : undefined}
          required
        />
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-gray-800">
          Organization Logo{" "}
          <span className="font-normal text-gray-500">(Optional)</span>
        </span>
        <div className="flex flex-wrap items-center gap-4">
          {logoPreview ? (
            // The preview is a local data URL selected by the user.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoPreview}
              className="h-20 w-20 rounded-xl border border-gray-200 object-cover"
              alt="Selected organization logo preview"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-gray-300 text-xs text-gray-500">
              No logo
            </div>
          )}

          <label
            htmlFor="organization-logo"
            className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus-within:ring-2 focus-within:ring-[#1A2380] focus-within:ring-offset-2 motion-reduce:transition-none"
          >
            Choose logo
            <input
              id="organization-logo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
          </label>
        </div>
      </div>

      {error ? (
        <p
          id="hospital-information-error"
          className="text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 w-full rounded-full bg-[#1A2380] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#151C6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving hospital…" : "Continue"}
        </button>
      </div>
    </form>
  );
}
