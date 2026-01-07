
// 'use client';

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// interface User {
//     id?: string;
//     email: string;
//     role?: string;
//     name?: string;
//     refreshToken: string;
//     token: string;
// }

// interface AuthContextType {
//     user: User | null;
//     setUser: (user: User | null) => void;
//     logout: () => void;
//     isAuthenticated: boolean;
// }




// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [user, setUser] = useState<User | null>(null);

//     useEffect(() => {
//         // Check for saved user in localStorage
//         const savedUser = localStorage.getItem('user');
//         if (savedUser) {
//             setUser(JSON.parse(savedUser));
//         }
//     }, []);

//     const handleSetUser = (userData: User | null) => {
//         if (userData) {
//             localStorage.setItem('user', JSON.stringify(userData));
//         } else {
//             localStorage.removeItem('user');
//         }
//         setUser(userData);
//     };

//     const logout = () => {
//         handleSetUser(null);
//         window.location.href = '/login';
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 setUser: handleSetUser,
//                 logout,
//                 isAuthenticated: !!user,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

// "use client";

// import { authService, organizationService } from "@services/api";
// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface Workspace {
//   id: string;
//   name: string;
//   role: string;
//   lastActive?: string;
//   img?: string
// }

// interface User {
//   id: string;
//   email: string;
//   name?: string;
//   token: string;
//   refreshToken?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   workspaces: Workspace[];
//   activeWorkspace: Workspace | null;
//   setUser: (user: User | null) => void;
//   setAuthData: (user: User, workspaces: Workspace[], activeWorkspace?: Workspace | null) => void;
//   setWorkspace: (workspace: Workspace) => void;
//   refreshWorkspaces: () => Promise<void>;
//   logout: () => void;
// }






// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);

//     // ✅ Fetch user + workspaces on app load
//   useEffect(() => {
//     initAuth();
//   }, []);

//   const initAuth = async () => {
//     try {
//       const me = await authService.getMe();
//       setUser(me);

//       const orgs = await organizationService.getOrganizations();

//       // ✅ IMPORTANT: your API most likely wraps data
//       const workspaceArray = Array.isArray(orgs) ? orgs : orgs?.data || [];

//       setWorkspaces(workspaceArray);
//     } catch (err) {
//       console.error("Auth init failed:", err);
//       setWorkspaces([]);
//     }
//   };

//   // ✅ This is what your WorkspaceSelectPage should call
//   const refreshWorkspaces = async () => {
//     const orgs = await organizationService.getOrganizations();
//     const workspaceArray = Array.isArray(orgs) ? orgs : orgs?.data || [];
//     setWorkspaces(workspaceArray);
//   };

 
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     const savedWorkspaces = localStorage.getItem("workspaces");
//     const savedActiveWorkspace = localStorage.getItem("activeWorkspace");

//     if (savedUser) setUser(JSON.parse(savedUser));
//     if (savedWorkspaces) setWorkspaces(JSON.parse(savedWorkspaces));
//     if (savedActiveWorkspace) setActiveWorkspace(JSON.parse(savedActiveWorkspace));
//   }, []);

//   const setAuthData = (userData: User, workspacesData: Workspace[], workspace?: Workspace | null) => {
//     setUser(userData);
//     setWorkspaces(workspacesData);
//     if (workspace) setActiveWorkspace(workspace);

//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("workspaces", JSON.stringify(workspacesData));
//     if (workspace) localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
//   };

//   const setWorkspace = (workspace: Workspace) => {
//     setActiveWorkspace(workspace);
//     localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
//   };

//   const logout = () => {
//     localStorage.clear();
//     window.location.href = "/auth/logout";
//   };

//   return (
//     <AuthContext.Provider value={{ user, workspaces, activeWorkspace, setAuthData, setUser, setWorkspace, refreshWorkspaces, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };




// "use client";

// import { authService, organizationService } from "@services/api";
// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface Workspace {
//   id: string;
//   name: string;
//   role: string;
//   lastActive?: string;
//   img?: string;
// }

// interface User {
//   id: string;
//   email: string;
//   first_name?: string;
//   last_name?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   workspaces: Workspace[];
//   activeWorkspace: Workspace | null;
//   setAuthData: (
//     user: User,
//     workspaces: Workspace[],
//     activeWorkspace?: Workspace | null
//   ) => void;
//   setWorkspace: (workspace: Workspace) => void;
//   refreshWorkspaces: () => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
//   const [hydrated, setHydrated] = useState(false);

//   // ✅ SINGLE HYDRATION SOURCE (localStorage → API)
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const storedUser = localStorage.getItem("user");
//         const storedWorkspaces = localStorage.getItem("workspaces");
//         const storedActiveWorkspace = localStorage.getItem("activeWorkspace");

//         if (storedUser) setUser(JSON.parse(storedUser));
//         if (storedWorkspaces) setWorkspaces(JSON.parse(storedWorkspaces));
//         if (storedActiveWorkspace) setActiveWorkspace(JSON.parse(storedActiveWorkspace));

//         // ✅ ALWAYS VERIFY FROM API AFTER
//         const meRes = await authService.getMe();
//         const me = meRes?.data || meRes;

//         setUser(me);
//         localStorage.setItem("user", JSON.stringify(me));

//         const orgRes = await organizationService.getOrganizations();
//         const orgs = Array.isArray(orgRes) ? orgRes : orgRes?.data || [];

//         setWorkspaces(orgs);
//         localStorage.setItem("workspaces", JSON.stringify(orgs));

//       } catch (err) {
//         console.error("Auth init failed:", err);
//         logout();
//       } finally {
//         setHydrated(true);
//       }
//     };

//     init();
//   }, []);

//   const refreshWorkspaces = async () => {
//     const orgRes = await organizationService.getOrganizations();
//     const orgs = Array.isArray(orgRes) ? orgRes : orgRes?.data || [];
//     setWorkspaces(orgs);
//     localStorage.setItem("workspaces", JSON.stringify(orgs));
//   };

//   const setAuthData = (
//     userData: User,
//     workspacesData: Workspace[],
//     workspace?: Workspace | null
//   ) => {
//     setUser(userData);
//     setWorkspaces(workspacesData);

//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("workspaces", JSON.stringify(workspacesData));

//     if (workspace) {
//       setActiveWorkspace(workspace);
//       localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
//     }
//   };

//   const setWorkspace = (workspace: Workspace) => {
//     setActiveWorkspace(workspace);
//     localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
//   };

//   const logout = () => {
//     localStorage.clear();
//     window.location.href = "/auth/login";
//   };

//   if (!hydrated) return null; // ✅ blocks UI flicker

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         workspaces,
//         activeWorkspace,
//         setAuthData,
//         setWorkspace,
//         refreshWorkspaces,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };


// "use client";

// import { authService, organizationService } from "@services/api";
// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface Workspace {
//   id: string;
//   name: string;
//   role: string;
//   lastActive?: string;
//   img?: string;
// }

// interface User {
//   id: string;
//   email: string;
//   first_name?: string;
//   last_name?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   workspaces: Workspace[];
//   activeWorkspace: Workspace | null;
//   setAuthData: (user: User, workspaces: Workspace[], workspace?: Workspace | null) => void;
//   setWorkspace: (workspace: Workspace) => void;
//   refreshWorkspaces: () => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
//   const [hydrated, setHydrated] = useState(false);

//   // Initialize AuthContext
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const storedUser = localStorage.getItem("user");
//         const storedWorkspaces = localStorage.getItem("workspaces");
//         // const storedActiveWorkspace = localStorage.getItem("activeWorkspace");
//         const storedActiveWorkspaceRaw = localStorage.getItem("activeWorkspace");

//         const parsedActiveWorkspace: Workspace | null =
//           storedActiveWorkspaceRaw ? JSON.parse(storedActiveWorkspaceRaw) : null;

//         if (storedUser) setUser(JSON.parse(storedUser));
//         if (storedWorkspaces) setWorkspaces(JSON.parse(storedWorkspaces));
//         if (parsedActiveWorkspace) setActiveWorkspace(parsedActiveWorkspace);

//         // Always verify user from API
//         const meRes = await authService.getMe();
//         const me = meRes?.data || meRes;
//         setUser(me);
//         localStorage.setItem("user", JSON.stringify(me));

//         // Fetch workspaces for THIS user
//         const orgRes = await organizationService.getOrganizations();
//         const orgs = Array.isArray(orgRes) ? orgRes : Array.isArray(orgRes?.data) ? orgRes.data : [];
//         // setWorkspaces(orgs);
//         const workspacePool: Workspace[] = await Promise.all(orgs.map(async (org: any) => {
//           const membership = await organizationService.getMyMembership(org.id)
//           return {
//             id: org.id,
//             name: org.name,
//             img: org.image_url || null,
//             role:membership.role,
//             lastActive: membership.joined_at
// }
//         }));
//         setWorkspaces(workspacePool);
//         localStorage.setItem("workspaces", JSON.stringify(workspacePool));

//         // Reset activeWorkspace if it doesn't belong to current user
//         if (parsedActiveWorkspace && !workspacePool.find(w => w.id === parsedActiveWorkspace.id)
//         ){ 
//           setActiveWorkspace(null);
//           localStorage.removeItem("activeWorkspace");
//         }

//       } catch (err) {
//         console.error("Auth init failed:", err);
//         logout();
//       } finally {
//         setHydrated(true);
//       }
//     };

//     init();
//   }, []);

//   const refreshWorkspaces = async () => {
//    const orgRes = await organizationService.getOrganizations();

// const orgs = Array.isArray(orgRes)
//   ? orgRes
//   : Array.isArray(orgRes?.data)
//   ? orgRes.data
//   : [];

// const workspacePool: Workspace[] = await Promise.all(
//   orgs.map(async (org: any) => {
//     const membership = await organizationService.getMyMembership(org.id);

//     return {
//       id: org.id,
//       name: org.name,
//       img: org.image_url || undefined,
//        role: membership.role,
//       lastActive: membership?.joined_at,
//     };
//   })
// );

// setWorkspaces(workspacePool);
// localStorage.setItem("workspaces", JSON.stringify(workspacePool));
//   };

//   const setAuthData = (userData: User, workspacesData: Workspace[], workspace?: Workspace | null) => {
//     setUser(userData);
//     setWorkspaces(workspacesData);

//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("workspaces", JSON.stringify(workspacesData));

//     if (workspace) {
//       setActiveWorkspace(workspace);
//       localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
//     }
//   };

//   const setWorkspace = (workspace: Workspace) => {
//     setActiveWorkspace(workspace);
//     localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
//   };

//   const logout = () => {
//     setUser(null);
//     setWorkspaces([]);
//     setActiveWorkspace(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("workspaces");
//     localStorage.removeItem("activeWorkspace");
    
//   };

//   if (!hydrated) return null; // avoid flicker

//   return (
//     <AuthContext.Provider value={{ user, isLoading: !hydrated, workspaces, activeWorkspace, setAuthData, setWorkspace, refreshWorkspaces, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { authService, organizationService } from "@services/api";

// export interface Workspace {
//   id: string;
//   name: string;
//   role: string;
//   img: string;
//   lastActive?: string;
// }

// export interface User {
//   id: string;
//   email: string;
//   first_name?: string;
//   last_name?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   workspaces: Workspace[];
//   activeWorkspace: Workspace | null;
//   authLoading: boolean;
//   workspaceLoading: boolean;
//   isLoading: boolean;
//   setWorkspace: (ws: Workspace) => void;
//   refreshWorkspaces: () => Promise<void>;
//   setAuthData: (userData: User, workspacesData?: Workspace[], workspace?: Workspace | null) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);

//   const [authLoading, setAuthLoading] = useState(true);
//   const [workspaceLoading, setWorkspaceLoading] = useState(true);

//   const isLoading = authLoading || workspaceLoading;

//   // 🔹 INITIAL HYDRATION
//   useEffect(() => {
//     const init = async () => {
//       try {
//         // 1️⃣ Restore from localStorage first
//         const storedUser = localStorage.getItem("user");
//         const storedWorkspaces = localStorage.getItem("workspaces");
//         const storedActive = localStorage.getItem("activeWorkspace");

//         if (storedUser) setUser(JSON.parse(storedUser));
//         if (storedWorkspaces) setWorkspaces(JSON.parse(storedWorkspaces));
//         if (storedActive) setActiveWorkspace(JSON.parse(storedActive));

//         // 2️⃣ Verify user from API
//         const meRes = await authService.getMe();
//         const me = meRes?.data ?? meRes;
//         setUser(me);
//         localStorage.setItem("user", JSON.stringify(me));

//         // 3️⃣ Load workspaces from API
//         await loadWorkspaces();
//       } catch (err) {
//         console.error("Auth init failed:", err);
//         logout();
//       } finally {
//         setAuthLoading(false);
//       }
//     };

//     init();
//   }, []);

//   // 🔹 WORKSPACE LOADER
//   const loadWorkspaces = async () => {
//     setWorkspaceLoading(true);
//     try {
//       const orgRes = await organizationService.getOrganizations();
//       const orgs = Array.isArray(orgRes?.data) ? orgRes.data : orgRes;

//       const workspacePool: Workspace[] = await Promise.all(
//         orgs.map(async (org: any) => {
//           const membership = await organizationService.getMyMembership(org.id);
//           return {
//             id: org.id,
//             name: org.name,
//             img: org.image_url || undefined,
//             role: membership?.role,
//             lastActive: membership?.joined_at,
//           };
//         })
//       );

//       setWorkspaces(workspacePool);
//       localStorage.setItem("workspaces", JSON.stringify(workspacePool));

//       // Reset activeWorkspace if it no longer exists
//       if (activeWorkspace && !workspacePool.find((w) => w.id === activeWorkspace.id)) {
//         setActiveWorkspace(null);
//         localStorage.removeItem("activeWorkspace");
//       }
//     } catch (err) {
//       console.error("Failed to load workspaces:", err);
//     } finally {
//       setWorkspaceLoading(false);
//     }
//   };

//   const refreshWorkspaces = async () => {
//     await loadWorkspaces();
//   };

//   // 🔹 SET ACTIVE WORKSPACE
//   const setWorkspace = (ws: Workspace) => {
//     setActiveWorkspace(ws);
//     localStorage.setItem("activeWorkspace", JSON.stringify(ws));
//   };

//   // 🔹 SET AUTH DATA (FULLY SAFE)
//   const setAuthData = async (
//     userData: User,
//     workspacesData?: Workspace[],
//     workspace?: Workspace | null
//   ) => {
//     setAuthLoading(true);
//     try {
//       // Set user immediately
//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));

//       // Set or fetch workspaces
//       if (workspacesData && workspacesData.length > 0) {
//         setWorkspaces(workspacesData);
//         localStorage.setItem("workspaces", JSON.stringify(workspacesData));
//       } else {
//         await loadWorkspaces();
//       }

//       // Set active workspace
//       if (workspace) {
//         setActiveWorkspace(workspace);
//         localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
//       }
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   // 🔹 LOGOUT
//   const logout = () => {
//     setUser(null);
//     setWorkspaces([]);
//     setActiveWorkspace(null);
//     localStorage.clear();
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         workspaces,
//         activeWorkspace,
//         authLoading,
//         workspaceLoading,
//         isLoading,
//         setWorkspace,
//         refreshWorkspaces,
//         setAuthData,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // 🔹 CUSTOM HOOK
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };



// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import { authService, organizationService } from "@services/api";

// /* ================= TYPES ================= */

// export interface Workspace {
//   id: string;
//   name: string;
//   role: string;
//   img: string;
//   lastActive?: string;
// }

// export interface User {
//   id: string;
//   email: string;
//   first_name?: string;
//   last_name?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   workspaces: Workspace[];
//   activeWorkspace: Workspace | null;
//   authLoading: boolean;
//   workspaceLoading: boolean;
//   hydrated: boolean;
//   setWorkspace: (ws: Workspace) => void;
//   refreshWorkspaces: () => Promise<void>;
//   logout: () => void;
// }

// /* ================= CONTEXT ================= */

// const AuthContext = createContext<AuthContextType | null>(null);

// /* ================= PROVIDER ================= */

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [activeWorkspace, setActiveWorkspace] =
//     useState<Workspace | null>(null);

//   const [authLoading, setAuthLoading] = useState(true);
//   const [workspaceLoading, setWorkspaceLoading] = useState(false);
//   const [hydrated, setHydrated] = useState(false);

//   /* ================= LOAD WORKSPACES ================= */

//   const loadWorkspaces = useCallback(async () => {
//     setWorkspaceLoading(true);

//     try {
//       const orgRes = await organizationService.getOrganizations();
//       const orgs = Array.isArray(orgRes?.data) ? orgRes.data : orgRes;

//       if (!Array.isArray(orgs) || orgs.length === 0) {
//         setWorkspaces([]);
//         return;
//       }

//       const memberships = await Promise.allSettled(
//         orgs.map((org: any) =>
//           organizationService.getMyMembership(org.id)
//         )
//       );

//       const workspacePool: Workspace[] = orgs.map(
//         (org: any, index: number) => {
//           const result = memberships[index];

//           return {
//             id: org.id,
//             name: org.name,
//             img: org.image_url || "/workspace.svg",
//             role:
//               result.status === "fulfilled"
//                 ? result.value?.role ?? "member"
//                 : "member",
//             lastActive:
//               result.status === "fulfilled"
//                 ? result.value?.joined_at
//                 : undefined,
//           };
//         }
//       );

//       setWorkspaces(workspacePool);
//       localStorage.setItem("workspaces", JSON.stringify(workspacePool));

//       // validate active workspace
//       const storedActive = localStorage.getItem("activeWorkspace");
//       if (storedActive) {
//         const parsed = JSON.parse(storedActive);
//         const exists = workspacePool.find((w) => w.id === parsed.id);
//         if (!exists) {
//           setActiveWorkspace(null);
//           localStorage.removeItem("activeWorkspace");
//         }
//       }
//     } catch (err) {
//       console.error("Workspace loading failed:", err);
//     } finally {
//       setWorkspaceLoading(false);
//     }
//   }, []);

//   /* ================= INIT (HYDRATION) ================= */

//   useEffect(() => {
//     const init = async () => {
//       try {
//         // restore cache
//         const cachedUser = localStorage.getItem("user");
//         const cachedWorkspaces = localStorage.getItem("workspaces");
//         const cachedActive = localStorage.getItem("activeWorkspace");

//         if (cachedUser) setUser(JSON.parse(cachedUser));
//         if (cachedWorkspaces) setWorkspaces(JSON.parse(cachedWorkspaces));
//         if (cachedActive) setActiveWorkspace(JSON.parse(cachedActive));

//         // verify session
//         const meRes = await authService.getMe();
//         const me = meRes?.data ?? meRes;

//         setUser(me);
//         localStorage.setItem("user", JSON.stringify(me));

//         // load workspaces (NON-BLOCKING)
//         loadWorkspaces();
//       } catch (err) {
//         logout();
//       } finally {
//         setAuthLoading(false);
//         setHydrated(true);
//       }
//     };

//     init();
//   }, [loadWorkspaces]);

//   /* ================= ACTIONS ================= */

//   const setWorkspace = (ws: Workspace) => {
//     setActiveWorkspace(ws);
//     localStorage.setItem("activeWorkspace", JSON.stringify(ws));
//   };

//   const refreshWorkspaces = async () => {
//     await loadWorkspaces();
//   };

//   const logout = () => {
//     setUser(null);
//     setWorkspaces([]);
//     setActiveWorkspace(null);
//     localStorage.clear();
//   };

//   /* ================= PROVIDER ================= */

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         workspaces,
//         activeWorkspace,
//         authLoading,
//         workspaceLoading,
//         hydrated,
//         setWorkspace,
//         refreshWorkspaces,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// /* ================= HOOK ================= */

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return ctx;
// };


"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authService, organizationService } from "@services/api";

/* ================= TYPES ================= */

export interface Workspace {
  id: string;
  name: string;
  role: string;
  img: string;
  lastActive?: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  hydrated: boolean;
  authLoading: boolean;
  workspaceLoading: boolean;
  refreshWorkspaces: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  setWorkspace: (ws: Workspace) => void;
  logout: () => void;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] =
    useState<Workspace | null>(null);

  const [authLoading, setAuthLoading] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* ================= LOAD WORKSPACES ================= */

  const loadWorkspaces = useCallback(async () => {
    setWorkspaceLoading(true);

    try {
      const orgRes = await organizationService.getOrganizations();
      const orgs = orgRes?.data ?? orgRes ?? [];

      const memberships = await Promise.allSettled(
        orgs.map((org: any) =>
          organizationService.getMyMembership(org.id)
        )
      );

      const normalized: Workspace[] = orgs.map(
        (org: any, idx: number) => ({
          id: org.id,
          name: org.name,
          img: org.image_url || "/workspace.svg",
          role:
            memberships[idx].status === "fulfilled"
              ? memberships[idx].value?.role ?? "member"
              : "member",
          lastActive:
            memberships[idx].status === "fulfilled"
              ? memberships[idx].value?.joined_at
              : undefined,
        })
      );

      setWorkspaces(normalized);
      localStorage.setItem("workspaces", JSON.stringify(normalized));
    } catch (e) {
      console.error("Workspace load failed", e);
    } finally {
      setWorkspaceLoading(false);
    }
  }, []);

  /* ================= HYDRATE ================= */

  useEffect(() => {
    const hydrate = async () => {
      try {
        // Restore cache
        const cachedUser = localStorage.getItem("user");
        const cachedWorkspaces = localStorage.getItem("workspaces");
        const cachedActive = localStorage.getItem("activeWorkspace");

        if (cachedUser) setUser(JSON.parse(cachedUser));
        if (cachedWorkspaces)
          setWorkspaces(JSON.parse(cachedWorkspaces));
        if (cachedActive)
          setActiveWorkspace(JSON.parse(cachedActive));

        // Verify session
        const meRes = await authService.getMe();
        const me = meRes?.data ?? meRes;

        setUser(me);
        localStorage.setItem("user", JSON.stringify(me));

        // Load fresh workspaces
        await loadWorkspaces();
      } catch {
        logout();
      } finally {
        setHydrated(true);
      }
    };

    hydrate();
  }, [loadWorkspaces]);

  /* ================= ACTIONS ================= */

  const login = async (email: string, password: string) => {
    setAuthLoading(true);

    try {
      await authService.login({ email, password });
      const meRes = await authService.getMe();
      const me = meRes?.data ?? meRes;

      setUser(me);
      localStorage.setItem("user", JSON.stringify(me));

      await loadWorkspaces();
    } finally {
      setAuthLoading(false);
    }
  };

  const setWorkspace = (ws: Workspace) => {
    setActiveWorkspace(ws);
    localStorage.setItem("activeWorkspace", JSON.stringify(ws));
  };

  const logout = () => {
    setUser(null);
    setWorkspaces([]);
    setActiveWorkspace(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspaces,
        activeWorkspace,
        hydrated,
        authLoading,
        workspaceLoading,
        refreshWorkspaces: loadWorkspaces,
        login,
        setWorkspace,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};