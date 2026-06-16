"use client";

import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Droplets,
  FileText,
  HeartPulse,
  Lock,
  MapPin,
  Scale,
  Thermometer,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { IncomingRecord } from "./IncomingRecordTypes";

export default function IncomingRecordDetails({
  record,
  onBack,
  onAccept,
  onReject,
}: {
  record: IncomingRecord;
  onBack: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  const canAct = record.status === "Pending";

  return (
    <div className="px-6 py-6 md:px-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#211783]"
      >
        <ArrowLeft size={18} />
        Back to Incoming Records
      </button>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EFFFFC] font-semibold text-[#008C83]">
              {record.initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[#111827]">
                  {record.patientName}
                </h1>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium text-white ${
                    record.priority === "Urgent" ? "bg-red-500" : "bg-[#211783]"
                  }`}
                >
                  {record.priority}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Patient ID: {record.gpid}
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                {record.condition}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {canAct ? (
              <>
                <button
                  onClick={onAccept}
                  className="inline-flex items-center gap-2 rounded bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800"
                >
                  <Check size={18} />
                  Accept
                </button>

                <button
                  onClick={onReject}
                  className="inline-flex items-center gap-2 rounded border border-red-500 px-5 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  <X size={18} />
                  Decline
                </button>
              </>
            ) : (
              <span
                className={`inline-flex items-center rounded px-5 py-2 text-sm font-medium ${
                  record.status === "Accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {record.status}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#111827]">
          <p>
            <span className="font-semibold">Gender:</span> {record.gender}
          </p>
          <p>
            <span className="font-semibold">Age:</span> {record.age}
          </p>
          <p>
            <span className="font-semibold">Blood Group:</span>{" "}
            {record.bloodGroup}
          </p>
          <p>
            <span className="font-semibold">Genotype:</span> {record.genotype}
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <VitalCard
            icon={<Activity size={16} />}
            label="Blood Pressure"
            value={record.vitals?.bloodPressure}
            unit="mmHg"
          />
          <VitalCard
            icon={<Thermometer size={16} />}
            label="Temperature"
            value={record.vitals?.temperature}
            unit="°C"
          />
          <VitalCard
            icon={<HeartPulse size={16} />}
            label="Heart Rate"
            value={record.vitals?.heartRate}
            unit="bpm"
          />
          <VitalCard
            icon={<Scale size={16} />}
            label="Weight"
            value={record.vitals?.weight}
            unit="kg"
          />
          <VitalCard
            icon={<Droplets size={16} />}
            label="Sugar Level"
            value={record.vitals?.sugarLevel}
            unit="mmol/L"
          />
        </div>

        {record.vitals?.raw && (
          <p className="mt-4 rounded-lg bg-[#F8FAFC] px-4 py-3 text-xs leading-5 text-gray-500">
            Raw vitals note: {record.vitals.raw}
          </p>
        )}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={<MapPin size={18} />}
          label="Sending Hospital"
          value={record.fromHospital}
        />
        <InfoCard
          icon={<CalendarDays size={18} />}
          label="Requested"
          value={record.requestedAt}
        />
        <InfoCard
          icon={<FileText size={18} />}
          label="Access Type"
          value={record.fileSize}
        />
      </section>

      <SharedMedicalContent record={record} />

      {record.clinicalSummary && (
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#111827]">
            Clinical Summary
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {record.clinicalSummary}
          </p>
        </section>
      )}
    </div>
  );
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
};

const formatDateValue = (value: unknown) => {
  if (typeof value !== "string" || !value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const getRecordValue = (record: Record<string, unknown>, key: string) =>
  formatValue(record[key]);

const hasContent = (value: unknown) => {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
};

function SharedMedicalContent({ record }: { record: IncomingRecord }) {
  const content = record.sharedContent;
  const [openSection, setOpenSection] = useState<string | null>(
    record.records[0] ?? null,
  );
  const canOpenSharedRecords = record.status === "Accepted";

  if (!content) {
    return (
      <EmptySharedSection message="Shared clinical details are not available yet for this referral." />
    );
  }

  const renderSection = (label: string) => {
    if (label === "Patient biodata") {
      if (!content.biodata) {
        return (
          <EmptyAccordionContent message="Patient biodata was shared, but the API did not return the patient details yet." />
        );
      }

      return (
        <AccordionPanelSection description="Basic patient information shared for identification and care continuity.">
          <InfoGrid
            items={[
              ["Full Name", record.patientName],
              ["Patient ID", record.gpid],
              ["Gender", record.gender],
              ["Age", record.age],
              ["Blood Group", record.bloodGroup],
              ["Genotype", record.genotype],
              ["Email", record.patientEmail ?? getRecordValue(content.biodata, "email")],
              [
                "Phone",
                record.patientPhone ?? getRecordValue(content.biodata, "phone_number"),
              ],
              ["Date of Birth", formatDateValue(content.biodata.dob)],
              [
                "Marital Status",
                getRecordValue(content.biodata, "marital_status"),
              ],
            ]}
          />
        </AccordionPanelSection>
      );
    }

    if (label === "Medical history") {
      return (
        <AccordionPanelSection description="Background information the receiving doctor should know before treatment.">
          {content.medicalHistory ? (
            <InfoGrid
              items={[
                [
                  "Allergies",
                  getRecordValue(content.medicalHistory, "allergies"),
                ],
                [
                  "Past Medical History",
                  getRecordValue(content.medicalHistory, "past_medical_history"),
                ],
                [
                  "Family Medical History",
                  getRecordValue(
                    content.medicalHistory,
                    "family_medical_history",
                  ),
                ],
                ["Symptoms", getRecordValue(content.medicalHistory, "symptoms")],
                [
                  "Current Medications",
                  getRecordValue(content.medicalHistory, "current_medications"),
                ],
                [
                  "Immunizations",
                  getRecordValue(content.medicalHistory, "immunizations"),
                ],
                [
                  "Lifestyle Info",
                  getRecordValue(content.medicalHistory, "lifestyle_info"),
                ],
              ]}
            />
          ) : (
            <EmptyAccordionContent message="No background medical history was returned for this shared permission." />
          )}

          <div className="mt-4">
            <RecordListSection
              emptyMessage="No diagnosis records were returned for this shared permission."
              records={content.diagnoses ?? []}
              renderItem={(item) => (
                <>
                  <p className="font-semibold text-[#111827]">
                    {getRecordValue(item, "primary_diagnosis")}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {getRecordValue(item, "secondary_diagnosis") !== "N/A"
                      ? getRecordValue(item, "secondary_diagnosis")
                      : getRecordValue(item, "symptoms")}
                  </p>
                  <p className="mt-3 text-xs text-gray-400">
                    Updated: {formatDateValue(item.updated_at)}
                  </p>
                </>
              )}
            />
          </div>
        </AccordionPanelSection>
      );
    }

    if (label === "Consultation notes") {
      if (!content.consultation) {
        return (
          <EmptyAccordionContent message="Consultation notes were shared, but the consultation details were not returned by the API yet." />
        );
      }

      return (
        <AccordionPanelSection description="Details from the consultation that caused or supports this referral.">
          <InfoGrid
            items={[
              [
                "Reason for Visit",
                getRecordValue(content.consultation, "reason_for_visit"),
              ],
              ["Status", getRecordValue(content.consultation, "status")],
              ["Priority", getRecordValue(content.consultation, "priority")],
              [
                "Clinical Notes",
                getRecordValue(content.consultation, "clinical_notes"),
              ],
              ["Doctor Notes", getRecordValue(content.consultation, "doctor_notes")],
              [
                "Assessment",
                getRecordValue(content.consultation, "assessment"),
              ],
              [
                "Treatment Plan",
                getRecordValue(content.consultation, "treatment_plan"),
              ],
              ["Vitals", getRecordValue(content.consultation, "vitals")],
              ["Created", formatDateValue(content.consultation.created_at)],
              ["Updated", formatDateValue(content.consultation.updated_at)],
            ]}
          />
        </AccordionPanelSection>
      );
    }

    if (label === "Lab results") {
      return (
        <AccordionPanelSection description="Laboratory tests and statuses shared with this referral.">
          <RecordListSection
          emptyMessage="No lab records were returned for this shared permission."
          records={content.labResults ?? []}
          renderItem={(item) => (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-[#111827]">
                  {getRecordValue(item, "test_name")}
                </p>
                <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#211783]">
                  {getRecordValue(item, "status")}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {getRecordValue(item, "test_category")}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {getRecordValue(item, "clinical_notes")}
              </p>
            </>
          )}
          />
        </AccordionPanelSection>
      );
    }

    if (label === "Prescriptions") {
      return (
        <AccordionPanelSection description="Medication instructions shared for continuity of care.">
          <RecordListSection
          emptyMessage="No prescription records were returned for this shared permission."
          records={content.prescriptions ?? []}
          renderItem={(item) => (
            <>
              <p className="font-semibold text-[#111827]">
                {getRecordValue(item, "medication_name")}
              </p>
              <div className="mt-2 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <p>Dosage: {getRecordValue(item, "dosage")}</p>
                <p>Frequency: {getRecordValue(item, "frequency")}</p>
                <p>Duration: {getRecordValue(item, "duration")}</p>
                <p>Route: {getRecordValue(item, "route")}</p>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {getRecordValue(item, "instructions")}
              </p>
            </>
          )}
          />
        </AccordionPanelSection>
      );
    }

    return (
      <EmptyAccordionContent message="No detailed renderer is available yet for this shared record type." />
    );
  };

  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111827]">Records Shared</h2>
      <p className="mt-1 text-sm text-gray-500">
        {canOpenSharedRecords
          ? "Click each shared record type to view the actual information sent with this referral."
          : "These records are available through patient consent, but full access opens after accepting the referral."}
      </p>

      {!canOpenSharedRecords && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          For patient safety and audit control, accept the referral before
          opening the full medical record. The clinical summary remains visible
          below to help you decide.
        </div>
      )}

      <div className="mt-5 space-y-3">
        {record.records.map((item) => {
          const isOpen = canOpenSharedRecords && openSection === item;

          return (
            <div
              key={item}
              className="overflow-hidden rounded-xl border border-[#DDF5F2] bg-[#F8FEFD]"
            >
              <button
                type="button"
                disabled={!canOpenSharedRecords}
                onClick={() => setOpenSection(isOpen ? null : item)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-lg bg-[#E7FAF7] p-2 text-[#008C83]">
                    {canOpenSharedRecords ? (
                      <FileText size={16} />
                    ) : (
                      <Lock size={16} />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">
                      {item}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {canOpenSharedRecords
                        ? isOpen
                          ? "Click to close details."
                          : "Click to view details."
                        : "Accept referral to view details."}
                    </p>
                  </div>
                </div>

                {canOpenSharedRecords ? (
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                ) : (
                  <Lock size={16} className="shrink-0 text-gray-400" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-[#DDF5F2] bg-white p-4">
                  {renderSection(item)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!hasContent(content.biodata) &&
        !hasContent(content.medicalHistory) &&
        !hasContent(content.consultation) &&
        !hasContent(content.diagnoses) &&
        !hasContent(content.labResults) &&
        !hasContent(content.prescriptions) && (
          <div className="mt-4">
            <EmptyAccordionContent message="The permission exists, but no clinical records were returned by the API yet." />
          </div>
        )}
    </section>
  );
}

function AccordionPanelSection({
  description,
  children,
}: {
  description: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function InfoGrid({ items }: { items: Array<[string, unknown]> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {label}
          </p>
          <p className="mt-2 break-words text-sm font-medium text-gray-800">
            {formatValue(value)}
          </p>
        </div>
      ))}
    </div>
  );
}

function RecordListSection({
  emptyMessage,
  records,
  renderItem,
}: {
  emptyMessage: string;
  records: Record<string, unknown>[];
  renderItem: (item: Record<string, unknown>) => ReactNode;
}) {
  return (
    <>
      {records.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {records.map((item, index) => (
            <div
              key={String(item.id ?? index)}
              className="rounded-xl border border-gray-100 p-4"
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
          {emptyMessage}
        </p>
      )}
    </>
  );
}

function EmptyAccordionContent({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
      {message}
    </p>
  );
}

function EmptySharedSection({ message }: { message: string }) {
  return (
    <section className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
      {message}
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-[#211783]">
        {icon}
        <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
      </div>
      <p className="break-words text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

function VitalCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  unit: string;
}) {
  const displayValue = value || "N/A";

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-[#111827]">
            {displayValue}{" "}
            {value && <span className="text-xs font-medium text-[#008C83]">{unit}</span>}
          </p>
          <p className="mt-1 text-xs text-gray-500">{label}</p>
        </div>
        <span className="rounded-lg bg-[#EEF2FF] p-2 text-[#211783]">
          {icon}
        </span>
      </div>
    </div>
  );
}
