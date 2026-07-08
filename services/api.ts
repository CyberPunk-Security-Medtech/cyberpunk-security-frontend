import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export type InviteDetailsResponse = {
  email: string;
  role: string;
  user_exists: boolean;
  organization: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
  };
};

type WrappedData<T> = {
  data: T;
};

const unwrap = <T>(payload: T | WrappedData<T>): T => {
  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    return (payload as WrappedData<T>).data;
  }
  return payload as T;
};

const isNotFoundError = (error: unknown): boolean => {
  const status = (error as { response?: { status?: number } })?.response
    ?.status;
  return status === 404;
};

// Auth endpoints
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/api/v1/auth/logout");
    return response.data;
  },
  refresh: async () => {
    const response = await api.post("/api/v1/auth/refresh");
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signup: async (userData: any) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  requestPasswordReset: async (email: string) => {
    const response = await api.post("/api/v1/auth/request-password-reset", {
      email,
    });
    return response.data;
  },
  verifyEmail: async (code: string, email: string) => {
    const response = await api.post("/api/v1/auth/verify-user", {
      code,
      email,
    });
    return response.data;
  },
  verifyPasswordReset: async (code: string, email: string) => {
    const res = await api.post("/api/v1/auth/verify-reset-code", {
      code,
      email,
    });
    return res.data;
  },
  resendOtp: async (email: string) => {
    return (await api.post("/api/v1/auth/resend-verification", { email })).data;
  },
  resetPassword: async (email: string, code: string, new_password: string) => {
    const response = await api.post("/api/v1/auth/reset-password", {
      email,
      code,
      new_password,
    });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/v1/users/me", {
      withCredentials: true,
    });
    return response.data;
  },
};

export interface CreateOrganizationPayload {
  name: string;
  image_url?: string | null;
}

export type OrganizationDirectoryEntry = {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  accepts_referrals: boolean;
};

export type OrganizationDirectoryParams = {
  q?: string;
  accepts_referrals?: boolean;
  limit?: number;
  offset?: number;
};

export type Department = {
  id: string;
  name: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
};

export type Membership = {
  role: string;
  joined_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
  department?: Department | null;
};

export const organizationService = {
  createOrganization: async (payload: CreateOrganizationPayload) => {
    const response = await api.post("/api/v1/organizations", payload, {
      withCredentials: true,
    });
    return response.data;
  },

  getOrganizations: async () => {
    const response = await api.get("/api/v1/organizations");
    return response.data;
  },

  getOrganization: async (org_id: string) => {
    const response = await api.get(`/api/v1/organizations/${org_id}`);
    return unwrap(response.data);
  },

  getDirectory: async (
    params?: OrganizationDirectoryParams,
  ): Promise<OrganizationDirectoryEntry[]> => {
    const response = await api.get("/api/v1/organizations/directory", {
      params,
    });
    return unwrap(response.data);
  },

  updateOrganization: async (
    org_id: string,
    payload: { name?: string | null; accepts_referrals?: boolean | null },
  ) => {
    const response = await api.patch(`/api/v1/organizations/${org_id}`, payload);
    return unwrap(response.data);
  },

  getMyMembership: async (org_id: string): Promise<Membership | null> => {
    const response = await api.get(`/api/v1/membership/${org_id}`);
    return unwrap(response.data);
  },

  getDepartments: async (org_id: string): Promise<Department[]> => {
    const response = await api.get(
      `/api/v1/organizations/${org_id}/departments`,
    );
    return unwrap(response.data);
  },

  createDepartment: async (org_id: string, payload: { name: string }) => {
    const response = await api.post(
      `/api/v1/organizations/${org_id}/departments`,
      payload,
    );
    return unwrap(response.data);
  },
};

export const uploadService = {
  uploadImage: async (org_id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/api/v1/organizations/${org_id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },
};

export const invitationService = {
  async sendInvitation(
    email: string,
    role: string,
    org_id: string,
    department_id?: string | null,
  ) {
    const res = await api.post(`/api/v1/organizations/${org_id}/invitations`, {
      email,
      role,
      ...(department_id ? { department_id } : {}),
    });
    return res.data;
  },

  async getInviteDetails(
    invitation_id: string,
  ): Promise<InviteDetailsResponse> {
    const res = await api.get(`/api/v1/invitations/${invitation_id}`);
    return res.data.data;
  },

  async acceptInvite(invitation_id: string): Promise<void> {
    await api.post(`/api/v1/invitations/${invitation_id}/accept`);
  },

  async revokeInvitation(org_id: string, inv_id: string) {
    await api.post(
      `/api/v1/organizations/${org_id}/invitations/${inv_id}/revoke`,
    );
  },

  async registerInvitedUser(
    invitation_id: string,
    payload: {
      email: string;
      first_name: string;
      last_name: string;
      password: string;
    },
  ): Promise<void> {
    await api.post(
      `/api/v1/invitations/${invitation_id}/register-user`,
      payload,
    );
  },

  async getOrganizationInvitations(orgId: string) {
    const res = await api.get(`/api/v1/organizations/${orgId}/invitations`);
    return res.data.data;
  },
};

export type PatientCreatePayload = {
  first_name: string;
  last_name: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  marital_status?: "Single" | "Married" | "Divorced" | "Widowed" | null;
  blood_group?: string | null;
  email: string;
  phone_number: string;
  allergies?: string | null;
  past_medical_history?: string | null;
  family_medical_history?: string | null;
  symptoms?: string | null;
  current_medications?: string | null;
  immunizations?: string | null;
  lifestyle_info?: string | null;
  enrollee_type?: string | null;
  hmo_provider?: string | null;
  hmo_plan?: string | null;
  hmo_number?: string | null;
  policy_start_date?: string | null;
  policy_expiry_date?: string | null;
};

export type ShareScope =
  | "demographics"
  | "history"
  | "consultations"
  | "lab_results"
  | "prescriptions"
  | "immunizations";

export type SharePurpose =
  | "referral"
  | "continuity_of_care"
  | "lab_fulfillment"
  | "second_opinion"
  | "emergency";

export type ConsentMethod =
  | "email_link"
  | "sms_link"
  | "in_person_attestation"
  | "voice";

export type GrantStatus =
  | "pending_patient"
  | "active"
  | "revoked"
  | "expired"
  | "verification_failed";

export type ReferralPriority = "routine" | "urgent" | "emergency";

export type ReferralStatus =
  | "sent"
  | "accepted"
  | "declined"
  | "completed"
  | "cancelled";

export type DataShareGrantCreatePayload = {
  patient_id: string;
  recipient_org_id: string;
  scopes: ShareScope[];
  purpose: SharePurpose;
  consent_method: ConsentMethod;
  patient_email?: string | null;
  attestation_note?: string | null;
  expires_at?: string | null;
};

export type DataShareGrant = {
  id: string;
  patient_id: string;
  source_org_id: string;
  recipient_org_id: string;
  scopes: string[];
  purpose: string;
  consent_method: string;
  status: string;
  granted_by_patient_at?: string | null;
  expires_at: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export type ShareGrantListParams = {
  role?: "source" | "recipient" | "either";
  status?: GrantStatus;
  limit?: number;
  offset?: number;
};

export type ConsentConfirmResponse = {
  grant_id: string;
  status: string;
};

export type ReferralCreatePayload = {
  patient_id: string;
  recipient_org_id: string;
  reason: string;
  clinical_summary?: string | null;
  priority?: ReferralPriority;
  source_consultation_id?: string | null;
  scopes: ShareScope[];
  consent_method: ConsentMethod;
  patient_email?: string | null;
};

export type Referral = {
  id: string;
  patient_id: string;
  source_org_id: string;
  recipient_org_id: string;
  source_consultation_id?: string | null;
  grant_id: string;
  reason: string;
  clinical_summary?: string | null;
  priority: string;
  status: string;
  created_by_user_id: string;
  accepted_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type ReferralListParams = {
  direction?: "outgoing" | "incoming" | "either";
  status?: ReferralStatus;
  limit?: number;
  offset?: number;
};

export type CrossTenantAccessLog = {
  id: string;
  user_id: string;
  viewer_org_id: string;
  patient_id: string;
  resource_type: string;
  resource_id?: string | null;
  grant_id: string;
  accessed_at: string;
};

export type CrossTenantAccessParams = {
  as?: "viewer" | "source";
  patient_id?: string;
  limit?: number;
  offset?: number;
};

export const patientService = {
  getPatients: async (
    org_id: string,
    params?: { include_shared?: boolean },
  ) => {
    const response = await api.get(`/api/v1/organizations/${org_id}/patients`, {
      params,
    });
    return unwrap(response.data);
  },

  createPatient: async (org_id: string, payload: PatientCreatePayload) => {
    const response = await api.post(
      `/api/v1/organizations/${org_id}/patients`,
      payload,
    );
    return unwrap(response.data);
  },

  getPatient: async (org_id: string, patient_id: string) => {
    const response = await api.get(
      `/api/v1/organizations/${org_id}/patients/${patient_id}`,
    );
    return unwrap(response.data);
  },

  getPatientDiagnoses: async (org_id: string, patient_id: string) => {
    const response = await api.get(
      `/api/v1/organizations/${org_id}/patients/${patient_id}/diagnoses`,
    );
    return unwrap(response.data);
  },

  getPatientLabTests: async (org_id: string, patient_id: string) => {
    const response = await api.get(
      `/api/v1/organizations/${org_id}/patients/${patient_id}/lab-tests`,
    );
    return unwrap(response.data);
  },

  getPatientPrescriptions: async (org_id: string, patient_id: string) => {
    const response = await api.get(
      `/api/v1/organizations/${org_id}/patients/${patient_id}/prescriptions`,
    );
    return unwrap(response.data);
  },

};

export const dataSharingService = {
  createShareGrant: async (
    org_id: string,
    payload: DataShareGrantCreatePayload,
  ): Promise<DataShareGrant> => {
    const response = await api.post("/api/v1/share-grants", payload, {
      params: { org_id },
    });
    return unwrap(response.data);
  },

  listShareGrants: async (
    org_id: string,
    params?: ShareGrantListParams,
  ): Promise<DataShareGrant[]> => {
    const response = await api.get("/api/v1/share-grants", {
      params: { ...params, org_id },
    });
    return unwrap(response.data);
  },

  getShareGrant: async (
    org_id: string,
    grant_id: string,
  ): Promise<DataShareGrant> => {
    const response = await api.get(`/api/v1/share-grants/${grant_id}`, {
      params: { org_id },
    });
    return unwrap(response.data);
  },

  revokeShareGrant: async (
    org_id: string,
    grant_id: string,
  ): Promise<DataShareGrant> => {
    const response = await api.post(
      `/api/v1/share-grants/${grant_id}/revoke`,
      {},
      { params: { org_id } },
    );
    return unwrap(response.data);
  },

  confirmConsent: async (token: string): Promise<ConsentConfirmResponse> => {
    const response = await api.post("/api/v1/share-grants/confirm", { token });
    return unwrap(response.data);
  },
};

export const referralService = {
  createReferral: async (
    org_id: string,
    payload: ReferralCreatePayload,
  ): Promise<Referral> => {
    const response = await api.post("/api/v1/referrals", payload, {
      params: { org_id },
    });
    return unwrap(response.data);
  },

  listReferrals: async (
    org_id: string,
    params?: ReferralListParams,
  ): Promise<Referral[]> => {
    const response = await api.get("/api/v1/referrals", {
      params: { ...params, org_id },
    });
    return unwrap(response.data);
  },

  getReferral: async (org_id: string, referral_id: string): Promise<Referral> => {
    const response = await api.get(`/api/v1/referrals/${referral_id}`, {
      params: { org_id },
    });
    return unwrap(response.data);
  },

  acceptReferral: async (
    org_id: string,
    referral_id: string,
  ): Promise<Referral> => {
    const response = await api.post(
      `/api/v1/referrals/${referral_id}/accept`,
      {},
      { params: { org_id } },
    );
    return unwrap(response.data);
  },

  declineReferral: async (
    org_id: string,
    referral_id: string,
  ): Promise<Referral> => {
    const response = await api.post(
      `/api/v1/referrals/${referral_id}/decline`,
      {},
      { params: { org_id } },
    );
    return unwrap(response.data);
  },

  completeReferral: async (
    org_id: string,
    referral_id: string,
  ): Promise<Referral> => {
    const response = await api.post(
      `/api/v1/referrals/${referral_id}/complete`,
      {},
      { params: { org_id } },
    );
    return unwrap(response.data);
  },

  cancelReferral: async (
    org_id: string,
    referral_id: string,
  ): Promise<Referral> => {
    const response = await api.post(
      `/api/v1/referrals/${referral_id}/cancel`,
      {},
      { params: { org_id } },
    );
    return unwrap(response.data);
  },
};

export const auditService = {
  listCrossTenantAccess: async (
    org_id: string,
    params?: CrossTenantAccessParams,
  ): Promise<CrossTenantAccessLog[]> => {
    const response = await api.get("/api/v1/audit/cross-tenant-access", {
      params: { ...params, org_id },
    });
    return unwrap(response.data);
  },
};

export const consultationService = {
  createConsultation: async (
    org_id: string,
    payload: {
      patient_id: string;
      department_id: string;
      reason_for_visit: string;
      priority?: "Routine" | "Urgent" | "Emergency";
      vitals?: string | null;
    },
  ) => {
    const response = await api.post(
      `/api/v1/organizations/${org_id}/consultations`,
      payload,
    );
    return unwrap(response.data);
  },

  listConsultations: async (
    org_id: string,
    params?: {
      status_filter?: "Pending" | "In Progress" | "Completed" | "Cancelled";
      department_id?: string;
       patient_id?: string;
    },
  ) => {
    const response = await api.get(
      `/api/v1/organizations/${org_id}/consultations`,
      {
        params,
      },
    );
    return unwrap(response.data);
  },

  getPatientConsultations: async (
  org_id:string,
  patient_id:string
)=>{

 const response = await api.get(
 `/api/v1/organizations/${org_id}/consultations`,
 {
   params:{
     patient_id,
     status_filter:"In Progress"
   }
 }
 );


 return unwrap(response.data);

},

  getConsultation: async (org_id: string, consultation_id: string) => {
    const response = await api.get(
      `/api/v1/organizations/${org_id}/consultations/${consultation_id}`,
    );
    return unwrap(response.data);
  },

  attendConsultation: async (org_id: string, consultation_id: string) => {
    const response = await api.post(
      `/api/v1/organizations/${org_id}/consultations/${consultation_id}/attend`,
      {},
    );
    return unwrap(response.data);
  },

  completeConsultation: async (
    org_id: string,
    consultation_id: string,
    payload?: {
      status?: "Pending" | "In Progress" | "Completed" | "Cancelled";
      clinical_notes?: string | null;
      doctor_id?: string | null;
    },
  ) => {
    const response = await api.post(
      `/api/v1/organizations/${org_id}/consultations/${consultation_id}/complete`,
      payload ?? {},
    );
    return unwrap(response.data);
  },

  addDiagnosis: async (
    org_id: string,
    consultation_id: string,
    diagnosisData: {
      primary_diagnosis: string;
      secondary_diagnosis?: string | null;
      symptoms?: string | null;
    },
  ) => {
    const response = await api.post(
      `/api/v1/organizations/${org_id}/consultations/${consultation_id}/diagnoses`,
      diagnosisData,
    );
    return unwrap(response.data);
  },

  orderLabTest: async (
    org_id: string,
    consultation_id: string,
    labData: {
      test_name: string;
      test_category?: string | null;
      priority?: string;
      clinical_notes?: string | null;
    },
  ) => {
    const response = await api.post(
      `/api/v1/organizations/${org_id}/consultations/${consultation_id}/lab-tests`,
      labData,
    );
    return unwrap(response.data);
  },

  createPrescription: async (
    org_id: string,
    consultation_id: string,
    prescriptionData: {
      medication_name: string;
      dosage: string;
      frequency: string;
      duration: string;
      route?: string | null;
      start_date?: string | null;
      instructions?: string | null;
    },
  ) => {
    const response = await api.post(
      `/api/v1/organizations/${org_id}/consultations/${consultation_id}/prescriptions`,
      prescriptionData,
    );
    return unwrap(response.data);
  },

  listPrescriptions: async (
  org_id:string,
  consultation_id:string
)=>{
  const response = await api.get(
    `/api/v1/organizations/${org_id}/consultations/${consultation_id}/prescriptions`
  );

  return unwrap(response.data);
},

};

const requestWithFallback = async <T>(
  paths: string[],
  request: (path: string) => Promise<T>,
): Promise<T> => {
  let lastError: unknown;

  for (const path of paths) {
    try {
      return await request(path);
    } catch (error) {
      lastError = error;
      if (!isNotFoundError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
};

export type LabOrderStatusFilter = "pending" | "in_progress" | "completed";

export const waitlistService = {
  joinWaitlist: async (payload: {
    email: string;
    institution_name: string;
    phone_number: string;
    full_name: string;
  }) => {
    const response = await api.post("/api/v1/waitlist", payload);
    return response.data;
  },
};

// export const labService = {
//   listLabOrders: async (org_id: string, status?: LabOrderStatusFilter) => {
//     const paths = [
//       `/api/v1/organizations/${org_id}/dashboard/lab/lab-orders`,
//       `/api/v1/dashboard/lab/lab-orders`,
//       `/dashboard/lab/lab-orders`,
//     ];

//     return requestWithFallback(paths, async (path) => {
//       const response = await api.get(path, {
//         params: status ? { status } : undefined,
//       });
//       return unwrap(response.data);
//     });
//   },

//   getLabOrderDetails: async (org_id: string, lab_order_id: string) => {
//     const paths = [
//       `/api/v1/organizations/${org_id}/dashboard/lab/lab-orders/${lab_order_id}`,
//       `/api/v1/organizations/${org_id}/lab-orders/${lab_order_id}`,
//       `/api/v1/dashboard/lab/lab-orders/${lab_order_id}`,
//       `/api/v1/lab-orders/${lab_order_id}`,
//       `/dashboard/lab/lab-orders/${lab_order_id}`,
//       `/lab-orders/${lab_order_id}`,
//     ];

//     return requestWithFallback(paths, async (path) => {
//       const response = await api.get(path);
//       return unwrap(response.data);
//     });
//   },
//   startLabOrder: async (org_id: string, lab_order_id: string) => {
//     const paths = [
//       `/api/v1/organizations/${org_id}/dashboard/lab/lab-orders/${lab_order_id}/start`,
//       `/api/v1/organizations/${org_id}/lab-orders/${lab_order_id}/start`,
//       `/api/v1/dashboard/lab/lab-orders/${lab_order_id}/start`,
//       `/api/v1/lab-orders/${lab_order_id}/start`,
//       `/dashboard/lab/lab-orders/${lab_order_id}/start`,
//       `/lab-orders/${lab_order_id}/start`,
//     ];

//     return requestWithFallback(paths, async (path) => {
//       const response = await api.post(path, {});
//       return unwrap(response.data);
//     });
//   },
// };

export const labService = {
async createLabTest(
  orgId: string,
  consultationId: string,
  payload: {
    test_type: string;
    priority: string;
    notes?: string;
    test_name: string
  }
) {
  const res = await api.post(
    `/api/v1/organizations/${orgId}/consultations/${consultationId}/lab-tests`,
    payload
  );
  return res.data;
},
async listOrganizationLabTests(orgId: string, params?: {statuses?: string[]}){
  const res = await api.get(`api/v1/organizations/${orgId}/lab-tests`,{
    params: {statuses: params?.statuses?.join(",")},
  });
  return res.data;
},
  
 async listLabTests(orgId: string, consultationId: string) {
    const res = await api.get(
      `/api/v1/organizations/${orgId}/consultations/${consultationId}/lab-tests`
    );
    return res.data;
  },

async updateLabTestStatus(
  orgId: string,
  labTestId: string,
  status: "Pending" | "In Progress" | "Completed"
) {
  const res = await api.patch(
    `/api/v1/organizations/${orgId}/lab-tests/${labTestId}/status`,
    {
      status,
    }
  );

  return res.data;
},

  async getLabTestDetails(
    orgId: string,
    consultationId: string,
    labTestId: string
  ) {
    const res = await api.get(
      `/api/v1/organizations/${orgId}/consultations/${consultationId}/lab-tests`
    );

    // Find the specific test inside the list
  const tests = res.data?.data ?? [];
return tests.find((item: any) => item.id === labTestId);
  },
};

// Backward-compatible aliases for older dashboard components.
// Prefer patientService / organizationService / consultationService in new code.
export const PatientService = {
  createPatient: async (org_id: string, payload: Record<string, unknown>) => ({
    data: await patientService.createPatient(
      org_id,
      payload as PatientCreatePayload,
    ),
  }),
  getPatients: async (org_id: string) => ({
    data: await patientService.getPatients(org_id),
  }),
  getPatient: async (org_id: string, patient_id: string) => ({
    data: await patientService.getPatient(org_id, patient_id),
  }),
  getMedicalHistory: async (org_id: string, patient_id: string) => ({
    data: await patientService.getPatientDiagnoses(org_id, patient_id),
  }),
  createConsultation: async (
    org_id: string,
    payload: {
      patient_id: string;
      department_id?: string;
      reason_for_visit?: string;
      priority?: string;
      vitals?: string;
    },
  ) => {
    return {
      data: await consultationService.createConsultation(org_id, {
        patient_id: payload.patient_id,
        department_id: payload.department_id ?? "",
        reason_for_visit: payload.reason_for_visit ?? "",
        priority:
          (payload.priority as
            | "Routine"
            | "Urgent"
            | "Emergency"
            | undefined) ?? "Routine",
        vitals: payload.vitals ?? null,
      }),
    };
  },
  addDiagnosis: async (
    org_id: string,
    consultation_id: string,
    payload: {
      primary_diagnosis: string;
      secondary_diagnosis?: string | null;
      symptoms?: string | null;
    },
  ) => ({
    data: await consultationService.addDiagnosis(
      org_id,
      consultation_id,
      payload,
    ),
  }),
  createDepartment: async (org_id: string, payload: { name: string }) => {
    const response = await api.post(
      `/api/v1/organizations/${org_id}/departments`,
      payload,
    );
    return { data: unwrap(response.data) };
  },
  getDepartments: async (org_id: string) => ({
    data: await organizationService.getDepartments(org_id),
  }),
};
