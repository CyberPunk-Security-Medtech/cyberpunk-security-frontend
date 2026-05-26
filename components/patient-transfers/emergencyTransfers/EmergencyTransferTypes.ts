export type EmergencyStep =
  | "bioDataOne"
  | "bioDataTwo"
  | "consentVerification"
  | "consentPending"
  | "consentSuccess"
  | "consentDeclined"
  | "adminAuthorization"
  | "transferSuccess";

export type PatientBioData = {
  fullName: string;
  dob: string;
  maritalStatus: string;
  gender: string;
  address: string;
  stateOfOrigin: string;
  phoneNumber: string;
  email: string;
};

export type ToastType = "success" | "failed" | null;