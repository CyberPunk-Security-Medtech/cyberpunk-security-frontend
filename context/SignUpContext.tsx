"use client";

import { createContext, useContext, useState } from "react";

interface HospitalData {
  name?: string;
  address?: string;
   type?: string;
 
}

interface AdminData {
  fullname?: string;
  phone?: string;
  email?: string;
  password?: string;
}

interface SignupContextType {
  hospitalData: HospitalData;
  setHospitalData: React.Dispatch<React.SetStateAction<HospitalData>>;
  adminData: AdminData;
  setAdminData: React.Dispatch<React.SetStateAction<AdminData>>;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [hospitalData, setHospitalData] = useState<HospitalData>({});
  const [adminData, setAdminData] = useState<AdminData>({});

  return (
    <SignupContext.Provider
      value={{ hospitalData, setHospitalData, adminData, setAdminData }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within SignupProvider");
  }
  return context;
};
