import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

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


// Auth endpoints
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/api/v1/auth/login/", credentials);
    return response.data;
  },
  refresh: async () => {
    const response = await api.post("/api/v1/auth/refresh");
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signup: async (userData: any) => {
    const response = await api.post("/api/v1/auth/register/", userData);
    return response.data;
  },
  requestPasswordReset: async (email: string) => {
    const response = await api.post("/api/v1/auth/request-password-reset/", { email });
    return response.data;
  },
  verifyEmail: async (code: string, email: string) => {
    const response = await api.post("/api/v1/auth/verify-user/", { code, email });
    return response.data;
  },
  verifyPasswordReset: async (code: string, email: string) => {
    const res = await api.post("/api/v1/auth/verify-reset-code/", { code, email });
    return res.data;
  },
  resendOtp: async (email: string) => {
    return (
      await api.post("/api/v1/auth/resend-verification/", { email })
    ).data;
  },
  resetPassword: async (email: string, code: string, new_password: string) => {
    const response = await api.post("/api/v1/auth/reset-password/", {
      email,
      code,
      new_password,
    });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/v1/users/me/", {
      withCredentials: true,
    });
    return response.data.data;
  },
};



export interface CreateOrganizationPayload {
  name: string;
  image_url?: string | null;
}

export const organizationService = {
  createOrganization: async (payload: CreateOrganizationPayload) => {
    const response = await api.post("/api/v1/organizations/", payload, {
      withCredentials: true,
    })
    return response.data;
  },

  getOrganizations: async () => {
    const response = await api.get("/api/v1/organizations/");
    return response.data;
  },

  getMyMembership: async (org_id: string) => {
    const response = await api.get(`/api/v1/membership/${org_id}/`);
    return response.data?.data
  },

};



export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      "/api/v1/organizations/{org_id}/image/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};



export const invitationService = {
  async sendInvitation(email: string, role: string, org_id: string) {
    const res = await api.post(`/api/v1/organizations/${org_id}/invitations`, { email, role });;
    return res.data; // should include invitation.id
  },
  // 1️⃣ Fetch invitation details (used when page loads)
  async getInviteDetails(invitation_id: string): Promise<InviteDetailsResponse> {
    const res = await api.get(`api/v1/invitations/${invitation_id}`);
    return res.data.data;
  },

  // 2️⃣ Accept invitation
  async acceptInvite(invitation_id: string): Promise<void> {
    await api.post(`api/v1/invitations/${invitation_id}/accept`);
  },

  async revokeInvitation(org_id: string, inv_id: string) {
    await api.post(
      `/api/v1/organizations/${org_id}/invitations/${inv_id}/revoke`
    );
  },


  async registerInvitedUser(invitation_id: string, payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }): Promise<void> {
    await api.post(`/api/v1/invitations/${invitation_id}/register-user`, payload)
  },

  async getOrganizationInvitations(orgId: string) {
    const res = await api.get(
      `/api/v1/organizations/${orgId}/invitations`
    );
    return res.data.data;
  }
};



export const PatientService = {
createPatient: async (orgId: string, patientData: any) => {
  const res = await api.post(
    `/api/v1/organizations/${orgId}/patients`,
    patientData);
  return res.data;
},
getPatients: async (orgId: string) => {
  const res = await api.get(`/api/v1/organizations/${orgId}/patients`);
  return res.data;
},
getPatient: async (orgId: string, patientId: string) => {
  const res = await api.get(`/api/v1/organizations/${orgId}/patients/${patientId}`);
  return res.data;
},
getMedicalHistory: async (orgId: string, patientId: string) => {
  const res = await api.get(`/api/v1/organizations/${orgId}/patients/${patientId}/diagnoses`);
  return res.data;
},
createConsultation: async (orgId: string, consultationData: any) => {
  const res = await api.post(`/api/v1/organizations/${orgId}/consultations`, consultationData);
  return res.data;
},
addDiagnosis: async (orgId: string, consultationId: string, payload: any) =>{
  const res = await api.post(`/api/v1/organizations/${orgId}/consultations/${consultationId}/diagnoses/`, payload);
  return res.data;
},
createDepartment: async (orgId: string, payload: { name: string }) => {
  const res = await api.post(`/api/v1/organizations/${orgId}/departments`, payload);
  return res.data;
},
getDepartments: async (orgId: string) => {
  const res = await api.get(`/api/v1/organizations/${orgId}/departments`);
  return res.data;
},
}
