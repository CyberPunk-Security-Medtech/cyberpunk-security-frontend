// Patient records carry both a raw database UUID (id) and a human-readable
// patient code (patient_code, e.g. "PC-000123"). UIs should always show the
// code; this helper picks it with a safe fallback chain.
export const formatPatientCode = (
  patientCode?: string | null,
  patientId?: string | null,
): string => {
  const code = patientCode?.trim();
  if (code) return code;
  return patientId?.trim() || "-";
};
