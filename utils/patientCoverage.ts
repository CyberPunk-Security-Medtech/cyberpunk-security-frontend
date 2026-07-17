import type { PatientCreatePayload } from "@services/api";

export type CoverageType = "hmo" | "self_pay";

type HmoDetails = Pick<
  PatientCreatePayload,
  "hmo_provider" | "hmo_plan" | "hmo_number"
>;

export const hasRequiredHmoDetails = (details: HmoDetails) =>
  Boolean(
    details.hmo_provider?.trim() &&
      details.hmo_plan?.trim() &&
      details.hmo_number?.trim(),
  );

export const omitHmoDetails = (
  payload: PatientCreatePayload,
): PatientCreatePayload => {
  const patient = { ...payload };
  delete patient.enrollee_type;
  delete patient.hmo_provider;
  delete patient.hmo_plan;
  delete patient.hmo_number;
  delete patient.policy_start_date;
  delete patient.policy_expiry_date;

  return patient;
};
