"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import IncomingRecordDetails from "@components/patient-transfers/incomingRecords/IncomingRecordDetails";
import IncomingRecordsList from "@components/patient-transfers/incomingRecords/IncomingRecordsList";
import {
  IncomingRecord,
  IncomingRecordSharedContent,
  IncomingRecordVitals,
  IncomingRecordStatus,
} from "@components/patient-transfers/incomingRecords/IncomingRecordTypes";
import RejectTransferModal from "@components/patient-transfers/incomingRecords/RejectTransferModal";
import { useAuth } from "@context/AuthContext";
import {
  consultationService,
  dataSharingService,
  organizationService,
  patientService,
  referralService,
  type DataShareGrant,
  type Referral,
} from "@services/api";
import { resolvePatientAge } from "@utils/patientAge";

type FilterType = "All" | IncomingRecordStatus;

const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "PT";

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getStringField = (value: unknown, key: string) => {
  if (!value || typeof value !== "object") return "";
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" ? field : "";
};

const getField = (value: unknown, key: string) => {
  if (!value || typeof value !== "object") return undefined;
  return (value as Record<string, unknown>)[key];
};

const toRecordObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const toRecordArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          !!item && typeof item === "object" && !Array.isArray(item),
      )
    : [];

const getNumberField = (value: unknown, key: string) => {
  if (!value || typeof value !== "object") return undefined;
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "number" ? field : undefined;
};

const formatPatientName = (patient: unknown, fallback: string) => {
  const firstName = getStringField(patient, "first_name");
  const lastName = getStringField(patient, "last_name");
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || getStringField(patient, "name") || fallback;
};

const scopeLabels: Record<string, string> = {
  demographics: "Patient biodata",
  history: "Medical history",
  consultations: "Consultation notes",
  lab_results: "Lab results",
  prescriptions: "Prescriptions",
  immunizations: "Immunizations",
};

const formatScopes = (grant?: DataShareGrant | null) => {
  if (!grant?.scopes?.length) return ["Shared records"];
  return grant.scopes.map((scope) => scopeLabels[scope] ?? scope);
};

const hasScope = (grant: DataShareGrant | null | undefined, scope: string) =>
  grant?.scopes?.includes(scope) ?? false;

const canViewSharedMedicalContent = (referral: Referral) =>
  referral.status === "accepted" || referral.status === "completed";

const canReadTriageVitals = (
  referral: Referral,
  grant: DataShareGrant | null | undefined,
) =>
  canViewSharedMedicalContent(referral) ||
  (grant?.status === "active" && hasScope(grant, "consultations"));

const buildMedicalHistory = (patient: unknown) => {
  const historyFields = [
    "allergies",
    "past_medical_history",
    "family_medical_history",
    "symptoms",
    "current_medications",
    "immunizations",
    "lifestyle_info",
  ];

  const values = historyFields.reduce<Record<string, unknown>>((acc, key) => {
    const value = getField(patient, key);
    if (value) acc[key] = value;
    return acc;
  }, {});

  return Object.keys(values).length ? values : null;
};

const normalizeVitalValue = (value: unknown) => {
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value.trim();
  return "";
};

const pickVital = (
  vitals: Record<string, unknown>,
  keys: string[],
  fallbackPattern?: RegExp,
  raw?: string,
) => {
  for (const key of keys) {
    const value = normalizeVitalValue(vitals[key]);
    if (value) return value;
  }

  if (fallbackPattern && raw) {
    const match = raw.match(fallbackPattern);
    const matchedValue = match?.slice(1).find(Boolean);
    if (matchedValue) return matchedValue.trim();
  }

  return "";
};

const parseVitals = (value: unknown): IncomingRecordVitals | undefined => {
  if (!value) return undefined;

  if (typeof value === "object") {
    const vitals = value as Record<string, unknown>;
    return {
      bloodPressure: pickVital(vitals, [
        "bloodPressure",
        "blood_pressure",
        "bloodPressureReading",
        "blood_pressure_reading",
        "bp",
        "BP",
      ]),
      temperature: pickVital(vitals, ["temperature", "temp", "Temperature"]),
      heartRate: pickVital(vitals, [
        "heartRate",
        "heart_rate",
        "pulse",
        "Heart Rate",
      ]),
      weight: pickVital(vitals, ["weight", "Weight"]),
      sugarLevel: pickVital(vitals, [
        "sugarLevel",
        "sugar_level",
        "glucose",
        "blood_sugar",
        "Sugar Level",
      ]),
    };
  }

  if (typeof value !== "string") return undefined;

  const raw = value.trim();
  if (!raw) return undefined;

  try {
    return parseVitals(JSON.parse(raw));
  } catch {
    return {
      bloodPressure: pickVital(
        {},
        [],
        /(?:blood pressure|bp)\s*[:=-]?\s*([0-9]{2,3}\s*\/\s*[0-9]{2,3})|(?:^|\s)([0-9]{2,3}\s*\/\s*[0-9]{2,3})(?:\s|$)/i,
        raw,
      ),
      temperature: pickVital(
        {},
        [],
        /(?:temperature|temp)\s*[:=-]\s*([0-9.]+)/i,
        raw,
      ),
      heartRate: pickVital(
        {},
        [],
        /(?:heart rate|pulse)\s*[:=-]\s*([0-9]+)/i,
        raw,
      ),
      weight: pickVital({}, [], /weight\s*[:=-]\s*([0-9.]+)/i, raw),
      sugarLevel: pickVital(
        {},
        [],
        /(?:sugar|glucose|blood sugar)\s*[:=-]\s*([0-9.]+)/i,
        raw,
      ),
      raw,
    };
  }
};

const getVitalsFromConsultation = (consultation: unknown) => {
  const directVitals = getField(consultation, "vitals");
  if (directVitals) {
    const parsedVitals = parseVitals(directVitals);
    return parsedVitals;
  }

  const nestedVitals =
    getField(consultation, "vital_signs") ??
    getField(consultation, "vitalSigns") ??
    getField(consultation, "triage_vitals");

  const parsedVitals = parseVitals(nestedVitals);
  return parsedVitals;
};

const getOrganizationName = async (
  organizationId: string,
  orgNames: Map<string, string>,
) => {
  const directoryName = orgNames.get(organizationId);
  if (directoryName) return directoryName;

  const organization = await getSafe(() =>
    organizationService.getOrganization(organizationId),
  );
  const name = getStringField(organization, "name");
  return name || undefined;
};

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
    if (detail && typeof detail === "object") return JSON.stringify(detail);
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.status) {
      return `Request failed with status ${error.response.status}. Please try again.`;
    }
  }

  if (error instanceof Error && error.message) return error.message;

  return "Something went wrong. Please try again.";
};

const mapReferralToRecord = (
  referral: Referral,
  options?: {
    patient?: unknown;
    sourceHospitalName?: string;
    grant?: DataShareGrant | null;
    consultation?: unknown;
    sharedContent?: IncomingRecordSharedContent;
  },
): IncomingRecord => {
  const patientLabel = `Patient ${referral.patient_id.slice(0, 8)}`;
  const patientName = formatPatientName(options?.patient, patientLabel);
  const vitals = getVitalsFromConsultation(options?.consultation);
  const statusMap: Record<string, IncomingRecordStatus> = {
    sent: "Pending",
    accepted: "Accepted",
    declined: "Rejected",
    completed: "Accepted",
    cancelled: "Rejected",
  };

  return {
    id: referral.id,
    initials: getInitials(patientName),
    patientName,
    gpid: referral.patient_id.slice(0, 8),
    priority: referral.priority === "urgent" || referral.priority === "emergency" ? "Urgent" : "Normal",
    condition: referral.reason,
    fromHospital:
      options?.sourceHospitalName ??
      `Source org ${referral.source_org_id.slice(0, 8)}`,
    requestedAt: formatDate(referral.created_at),
    records: formatScopes(options?.grant),
    fileSize:
      options?.grant?.status === "active"
        ? "Granted controlled access"
        : "Controlled access",
    status: statusMap[referral.status] ?? "Pending",
    age: resolvePatientAge(
      getNumberField(options?.patient, "age"),
      getStringField(options?.patient, "dob"),
    ),
    gender: getStringField(options?.patient, "gender") || "N/A",
    bloodGroup: getStringField(options?.patient, "blood_group") || "N/A",
    genotype: getStringField(options?.patient, "genotype") || "N/A",
    patientEmail: getStringField(options?.patient, "email") || undefined,
    patientPhone: getStringField(options?.patient, "phone_number") || undefined,
    sourceHospitalName: options?.sourceHospitalName,
    clinicalSummary: referral.clinical_summary,
    vitals,
    sharedContent: options?.sharedContent,
  };
};

const getSafe = async <T,>(request: () => Promise<T>) => {
  try {
    return await request();
  } catch {
    return null;
  }
};

const getReferralConsultation = async (orgId: string, referral: Referral) => {
  if (!referral.source_consultation_id) return null;

  const recipientScopedConsultation = await getSafe(() =>
    consultationService.getConsultation(orgId, referral.source_consultation_id as string),
  );

  if (recipientScopedConsultation) return recipientScopedConsultation;

  return getSafe(() =>
    consultationService.getConsultation(
      referral.source_org_id,
      referral.source_consultation_id as string,
    ),
  );
};

export default function IncomingRecordsPage({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { activeWorkspace, hydrated } = useAuth();
  const [records, setRecords] = useState<IncomingRecord[]>([]);
  const [filter, setFilter] = useState<FilterType>("All");
  const [selectedRecord, setSelectedRecord] = useState<IncomingRecord | null>(null);
  const [recordToReject, setRecordToReject] = useState<IncomingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const orgId = activeWorkspace?.id;

  const loadIncomingReferrals = useCallback(
    async (options?: { showPageLoader?: boolean; showErrors?: boolean }) => {
      if (!orgId) return [];

      if (options?.showPageLoader ?? true) {
        setLoading(true);
      }
      if (options?.showErrors ?? true) {
        setError("");
      }

      try {
        const rows = await referralService.listReferrals(orgId, {
          direction: "incoming",
        });
        const organizations =
          (await getSafe(() => organizationService.getDirectory({ limit: 100 }))) ??
          [];

        const orgNames = new Map(
          organizations.map((organization) => [
            organization.id,
            organization.name,
          ]),
        );

        const enrichedRecords = await Promise.all(
          rows.map(async (referral) => {
            const [patient, grant] = await Promise.all([
              getSafe(() => patientService.getPatient(orgId, referral.patient_id)),
              getSafe(() =>
                dataSharingService.getShareGrant(orgId, referral.grant_id),
              ),
            ]);
            const consultation =
              canReadTriageVitals(referral, grant) &&
              referral.source_consultation_id
                ? await getReferralConsultation(orgId, referral)
                : null;
            const sourceHospitalName = await getOrganizationName(
              referral.source_org_id,
              orgNames,
            );
            const canFetchSharedContent = canViewSharedMedicalContent(referral);
            const [diagnoses, labResults, prescriptions] = await Promise.all([
              canFetchSharedContent && hasScope(grant, "history")
                ? getSafe(() =>
                    patientService.getPatientDiagnoses(orgId, referral.patient_id),
                  )
                : Promise.resolve(null),
              canFetchSharedContent && hasScope(grant, "lab_results")
                ? getSafe(() =>
                    patientService.getPatientLabTests(orgId, referral.patient_id),
                  )
                : Promise.resolve(null),
              canFetchSharedContent && hasScope(grant, "prescriptions")
                ? getSafe(() =>
                    patientService.getPatientPrescriptions(
                      orgId,
                      referral.patient_id,
                    ),
                  )
                : Promise.resolve(null),
            ]);

            return mapReferralToRecord(referral, {
              patient,
              grant,
              consultation,
              sourceHospitalName,
              sharedContent: {
                biodata:
                  canFetchSharedContent && hasScope(grant, "demographics")
                    ? toRecordObject(patient)
                    : null,
                medicalHistory:
                  canFetchSharedContent && hasScope(grant, "history")
                    ? buildMedicalHistory(patient)
                    : null,
                diagnoses: toRecordArray(diagnoses),
                consultation:
                  canFetchSharedContent && hasScope(grant, "consultations")
                    ? toRecordObject(consultation)
                    : null,
                labResults: toRecordArray(labResults),
                prescriptions: toRecordArray(prescriptions),
              },
            });
          }),
        );

        setRecords(enrichedRecords);
        return enrichedRecords;
      } catch (loadError) {
        if (options?.showErrors ?? true) {
          setError(getErrorMessage(loadError));
        }
        return [];
      } finally {
        setLoading(false);
      }
    },
    [orgId],
  );

  useEffect(() => {
    if (!hydrated || !orgId) return;
    loadIncomingReferrals();
  }, [hydrated, loadIncomingReferrals, orgId]);

  const updateReferral = (updatedReferral: Referral) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === updatedReferral.id
          ? {
              ...record,
              ...mapReferralToRecord(updatedReferral, {
                sourceHospitalName: record.sourceHospitalName,
              }),
              patientName: record.patientName,
              initials: record.initials,
              age: record.age,
              gender: record.gender,
              bloodGroup: record.bloodGroup,
              genotype: record.genotype,
              patientEmail: record.patientEmail,
              patientPhone: record.patientPhone,
              records: record.records,
              vitals: record.vitals,
              sharedContent: record.sharedContent,
            }
          : record,
      ),
    );

    setSelectedRecord((current) =>
      current?.id === updatedReferral.id
        ? {
            ...current,
            status:
              updatedReferral.status === "accepted" ||
              updatedReferral.status === "completed"
                ? "Accepted"
                : updatedReferral.status === "declined" ||
                    updatedReferral.status === "cancelled"
                  ? "Rejected"
                  : "Pending",
            priority:
              updatedReferral.priority === "urgent" ||
              updatedReferral.priority === "emergency"
                ? "Urgent"
                : "Normal",
            condition: updatedReferral.reason,
            clinicalSummary: updatedReferral.clinical_summary,
          }
        : current,
    );
  };

  const handleAccept = async (id: string) => {
    if (!orgId) return;
    setActionLoadingId(id);
    setError("");
    const record = records.find((item) => item.id === id);

    try {
      const updatedReferral = await referralService.acceptReferral(orgId, id);
      updateReferral(updatedReferral);
      const refreshedRecords = await loadIncomingReferrals({
        showPageLoader: false,
        showErrors: false,
      });
      const refreshedRecord = refreshedRecords.find((record) => record.id === id);
      if (refreshedRecord) setSelectedRecord(refreshedRecord);
    } catch (acceptError) {
      setError(getErrorMessage(acceptError));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!orgId || !recordToReject) return;
    setActionLoadingId(recordToReject.id);
    setError("");

    try {
      const updatedReferral = await referralService.declineReferral(
        orgId,
        recordToReject.id,
      );
      updateReferral(updatedReferral);
      setRecordToReject(null);
    } catch (declineError) {
      setError(getErrorMessage(declineError));
    } finally {
      setActionLoadingId(null);
    }
  };

  if (hydrated && !orgId) {
    return (
      <div
        className={
          embedded
            ? "min-h-full bg-[#F4FAFA] p-6 md:p-8"
            : "-mx-4 -my-4 min-h-full bg-[#F4FAFA] p-8 md:-mx-12"
        }
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Please select a workspace before viewing incoming referrals.
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        embedded
          ? "min-h-full bg-[#F4FAFA]"
          : "-mx-4 -my-4 min-h-full bg-[#F4FAFA] md:-mx-12"
      }
    >
      {error && (
        <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:mx-12">
          {error}
        </div>
      )}

      {loading ? (
        <div className="px-6 py-16 text-center text-sm text-gray-500 md:px-12">
          Loading incoming referrals...
        </div>
      ) : !selectedRecord ? (
        <IncomingRecordsList
          records={records}
          filter={filter}
          setFilter={setFilter}
          onView={setSelectedRecord}
          onAccept={handleAccept}
          onReject={setRecordToReject}
        />
      ) : (
        <IncomingRecordDetails
          record={selectedRecord}
          onBack={() => setSelectedRecord(null)}
          onAccept={() => handleAccept(selectedRecord.id)}
          onReject={() => setRecordToReject(selectedRecord)}
        />
      )}

      {actionLoadingId && (
        <div className="fixed bottom-6 right-6 z-[120] rounded-lg bg-[#211783] px-5 py-3 text-sm font-medium text-white shadow-lg">
          Updating referral...
        </div>
      )}

      {recordToReject && (
        <RejectTransferModal
          record={recordToReject}
          onClose={() => setRecordToReject(null)}
          onDecline={handleRejectSubmit}
        />
      )}
    </div>
  );
}
