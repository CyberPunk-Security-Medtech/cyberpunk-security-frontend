export type PatientAge = number | "-";

const parseDateOfBirth = (value?: string | null): Date | null => {
  if (!value) return null;

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const parsed = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      )
    : new Date(value);

  if (Number.isNaN(parsed.getTime())) return null;

  if (
    dateOnlyMatch &&
    (parsed.getFullYear() !== Number(dateOnlyMatch[1]) ||
      parsed.getMonth() !== Number(dateOnlyMatch[2]) - 1 ||
      parsed.getDate() !== Number(dateOnlyMatch[3]))
  ) {
    return null;
  }

  return parsed;
};

export const calculatePatientAge = (
  dob?: string | null,
  today = new Date(),
): PatientAge => {
  const birthDate = parseDateOfBirth(dob);
  if (!birthDate || birthDate > today) return "-";

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : "-";
};

export const resolvePatientAge = (
  age: number | string | null | undefined,
  dob?: string | null,
): PatientAge => {
  if (typeof age === "number" && Number.isFinite(age) && age >= 0) return age;

  if (typeof age === "string" && age.trim() !== "") {
    const numericAge = Number(age);
    if (Number.isFinite(numericAge) && numericAge >= 0) return numericAge;
  }

  return calculatePatientAge(dob);
};

export const isValidPatientDateOfBirth = (
  dob?: string | null,
  today = new Date(),
) => {
  const birthDate = parseDateOfBirth(dob);
  return Boolean(birthDate && birthDate <= today);
};

export const getTodayDateInputValue = (today = new Date()) => {
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
