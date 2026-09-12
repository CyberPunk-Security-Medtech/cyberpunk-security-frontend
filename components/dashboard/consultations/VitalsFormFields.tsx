"use client";

import { FieldLabel, Input, Textarea } from "@components/Field";
import type { VitalsPayload } from "@services/api";

export type VitalsFormValues = {
  temperature: string;
  heart_rate: string;
  systolic_bp: string;
  diastolic_bp: string;
  respiratory_rate: string;
  oxygen_saturation: string;
  weight: string;
  height: string;
  notes: string;
};

type MeasurementName = Exclude<keyof VitalsFormValues, "notes">;
export type VitalsFormErrors = Partial<Record<MeasurementName, string>>;

type MeasurementField = {
  name: MeasurementName;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  integer?: boolean;
  placeholder: string;
};

export const EMPTY_VITALS_FORM: VitalsFormValues = {
  temperature: "",
  heart_rate: "",
  systolic_bp: "",
  diastolic_bp: "",
  respiratory_rate: "",
  oxygen_saturation: "",
  weight: "",
  height: "",
  notes: "",
};

const MEASUREMENT_FIELDS: MeasurementField[] = [
  {
    name: "temperature",
    label: "Temperature",
    unit: "°C",
    min: 20,
    max: 45,
    step: 0.1,
    placeholder: "36.8",
  },
  {
    name: "heart_rate",
    label: "Heart Rate",
    unit: "bpm",
    min: 10,
    max: 300,
    step: 1,
    integer: true,
    placeholder: "72",
  },
  {
    name: "systolic_bp",
    label: "Systolic BP",
    unit: "mmHg",
    min: 30,
    max: 300,
    step: 1,
    integer: true,
    placeholder: "120",
  },
  {
    name: "diastolic_bp",
    label: "Diastolic BP",
    unit: "mmHg",
    min: 20,
    max: 200,
    step: 1,
    integer: true,
    placeholder: "80",
  },
  {
    name: "respiratory_rate",
    label: "Respiratory Rate",
    unit: "/min",
    min: 1,
    max: 100,
    step: 1,
    integer: true,
    placeholder: "16",
  },
  {
    name: "oxygen_saturation",
    label: "Oxygen Saturation",
    unit: "%",
    min: 0,
    max: 100,
    step: 0.1,
    placeholder: "98",
  },
  {
    name: "weight",
    label: "Weight",
    unit: "kg",
    min: 0.2,
    max: 700,
    step: 0.1,
    placeholder: "70.5",
  },
  {
    name: "height",
    label: "Height",
    unit: "cm",
    min: 10,
    max: 300,
    step: 0.1,
    placeholder: "175",
  },
];

export const buildVitalRecord = (
  values: VitalsFormValues,
): { payload: VitalsPayload | null; errors: VitalsFormErrors } => {
  const payload: VitalsPayload = {};
  const errors: VitalsFormErrors = {};
  let hasValue = false;

  for (const field of MEASUREMENT_FIELDS) {
    const rawValue = values[field.name].trim();
    if (!rawValue) continue;

    hasValue = true;
    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      errors[field.name] = `${field.label} must be a number.`;
      continue;
    }

    if (field.integer && !Number.isInteger(value)) {
      errors[field.name] = `${field.label} must be a whole number.`;
      continue;
    }

    if (value < field.min || value > field.max) {
      errors[field.name] = `${field.label} must be between ${field.min} and ${field.max} ${field.unit}.`;
      continue;
    }

    payload[field.name] = value;
  }

  const notes = values.notes.trim();
  if (notes) {
    hasValue = true;
    payload.notes = notes;
  }

  return {
    payload: hasValue && Object.keys(errors).length === 0 ? payload : null,
    errors,
  };
};

type VitalsFormFieldsProps = {
  values: VitalsFormValues;
  errors: VitalsFormErrors;
  onChange: (name: keyof VitalsFormValues, value: string) => void;
  disabled?: boolean;
  idPrefix: string;
};

export default function VitalsFormFields({
  values,
  errors,
  onChange,
  disabled = false,
  idPrefix,
}: VitalsFormFieldsProps) {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <fieldset className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <legend className="text-sm font-semibold text-[#0B1227]">
        Vitals <span className="font-normal text-gray-500">(optional)</span>
      </legend>
      <p className="text-xs leading-5 text-gray-500">
        Record the patient&apos;s intake measurements if available.
      </p>

      {hasErrors && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          Review the highlighted vitals before creating the consultation.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MEASUREMENT_FIELDS.map((field) => {
          const inputId = `${idPrefix}-${field.name}`;
          const errorId = `${inputId}-error`;
          const error = errors[field.name];

          return (
            <div key={field.name} className="min-w-0">
              <FieldLabel htmlFor={inputId}>
                {field.label} ({field.unit})
              </FieldLabel>
              <Input
                id={inputId}
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                inputMode={field.integer ? "numeric" : "decimal"}
                placeholder={field.placeholder}
                value={values[field.name]}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className={`bg-white ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                onChange={(event) => onChange(field.name, event.target.value)}
              />
              {error && (
                <p id={errorId} className="mt-1 text-xs leading-5 text-red-700">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-notes`}>Notes</FieldLabel>
        <Textarea
          id={`${idPrefix}-notes`}
          rows={3}
          placeholder="Any observations about these intake readings"
          value={values.notes}
          disabled={disabled}
          className="bg-white"
          onChange={(event) => onChange("notes", event.target.value)}
        />
      </div>
    </fieldset>
  );
}
