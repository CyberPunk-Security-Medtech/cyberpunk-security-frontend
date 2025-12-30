// "use client";

// import { createContext, useContext, useState } from "react";

// interface HospitalData {
//   name?: string;
//   address?: string;
//    type?: string;
 
// }

// interface AdminData {
//   fullname?: string;
//   phone?: string;
//   email?: string;
//   password?: string;
// }

// interface SignupContextType {
//   hospitalData: HospitalData;
//   setHospitalData: React.Dispatch<React.SetStateAction<HospitalData>>;
//   adminData: AdminData;
//   setAdminData: React.Dispatch<React.SetStateAction<AdminData>>;
// }

// const SignupContext = createContext<SignupContextType | undefined>(undefined);

// export function SignupProvider({ children }: { children: React.ReactNode }) {
//   const [hospitalData, setHospitalData] = useState<HospitalData>({});
//   const [adminData, setAdminData] = useState<AdminData>({});

//   return (
//     <SignupContext.Provider
//       value={{ hospitalData, setHospitalData, adminData, setAdminData }}
//     >
//       {children}
//     </SignupContext.Provider>
//   );
// }

// export const useSignup = () => {
//   const context = useContext(SignupContext);
//   if (!context) {
//     throw new Error("useSignup must be used within SignupProvider");
//   }
//   return context;
// };

// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";

// type HospitalData = {
//   name?: string;
//   image_url?: string;
// };

// export type UserData = {
//   id?: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   password: string;
// };

// type SignupContextType = {
//   hospitalData: HospitalData;
//   setHospitalData: (data: HospitalData) => void;
//   userData: UserData;
// };

// const SignUpContext = createContext<SignupContextType | undefined>(undefined);

// export const SignUpProvider = ({ children, initialUserData }: { children: ReactNode; initialUserData: UserData }) => {
//   const [hospitalData, setHospitalData] = useState<HospitalData>({});

//   return (
//     <SignUpContext.Provider value={{ hospitalData, setHospitalData, userData: initialUserData }}>
//       {children}
//     </SignUpContext.Provider>
//   );
// };

// export const useSignup = () => {
//   const context = useContext(SignUpContext);
//   if (!context) throw new Error("useSignup must be used within SignUpProvider");
//   return context;
// };


// "use client";

// import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// type HospitalData = {
//   name?: string;
//   image_url?: string;
// };

// export type UserData = {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
// };

// type SignupContextType = {
//   hospitalData: HospitalData;
//   setHospitalData: (data: HospitalData) => void;
//   userData: UserData | null;
//   setUserData: (data: UserData) => void;
// };

// const SignUpContext = createContext<SignupContextType | undefined>(undefined);

// export const SignUpProvider = ({ children }: { children: ReactNode }) => {
//   const [hospitalData, setHospitalData] = useState<HospitalData>({});
//   const [userData, setUserData] = useState<UserData | null>(null);

//   // Restore userData from signup if page reloads
//   useEffect(() => {
//     const savedUser = localStorage.getItem("userData");
//     if (savedUser) setUserData(JSON.parse(savedUser));
//   }, []);

//   return (
//     <SignUpContext.Provider value={{ hospitalData, setHospitalData, userData, setUserData }}>
//       {children}
//     </SignUpContext.Provider>
//   );
// };

// export const useSignup = () => {
//   const context = useContext(SignUpContext);
//   if (!context) throw new Error("useSignup must be used within SignUpProvider");
//   return context;
// };


"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type HospitalData = {
  name?: string;
  image_url?: string;
};

type SignupContextType = {
  hospitalData: HospitalData;
  setHospitalData: (data: HospitalData) => void;
  userData: UserData | null;
  setUserData: (data: UserData) => void;
};

const SignUpContext = createContext<SignupContextType | undefined>(undefined);

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [hospitalData, setHospitalData] = useState<HospitalData>({});
  const [userData, setUserData] = useState<UserData | null>(null);

  // Restore userData from signup if page reloads
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) setUserData(JSON.parse(savedUser));
  }, []);

  return (
    <SignUpContext.Provider value={{ hospitalData, setHospitalData, userData, setUserData }}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignUpContext);
  if (!context) throw new Error("useSignup must be used within SignUpProvider");
  return context;
};