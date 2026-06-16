"use client";

import type { ConsentMethod, ShareScope } from "@services/api";

const STORAGE_KEY = "privacure:onboarding-consents";

type StoredConsent = {
  status: "granted" | "declined" | "pending_patient";
  scopes: ShareScope[];
  consentMethod: Extract<ConsentMethod, "email_link" | "in_person_attestation">;
  recordedAt: string;
};

const readStore = (): Record<string, StoredConsent> => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredConsent>) : {};
  } catch {
    return {};
  }
};

const writeStore = (store: Record<string, StoredConsent>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const getOnboardingConsent = (patientId: string) =>
  readStore()[patientId] ?? null;

export const saveOnboardingConsent = (
  patientId: string,
  consent: Omit<StoredConsent, "recordedAt">,
) => {
  if (!patientId) return;

  const store = readStore();
  store[patientId] = {
    ...consent,
    recordedAt: new Date().toISOString(),
  };
  writeStore(store);
};

export const hasOnboardingConsentForScopes = (
  patientId: string,
  requiredScopes: ShareScope[],
) => {
  const consent = getOnboardingConsent(patientId);

  if (!consent || consent.status !== "granted") return false;
  return requiredScopes.every((scope) => consent.scopes.includes(scope));
};
