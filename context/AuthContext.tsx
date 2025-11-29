
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


"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Workspace {
  id: string;
  name: string;
  role: string;
  lastActive?: string;
  img?: string
}

interface User {
  id: string;
  email: string;
  name?: string;
  token: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setUser: (user: User | null) => void;
  setAuthData: (user: User, workspaces: Workspace[], activeWorkspace?: Workspace | null) => void;
  setWorkspace: (workspace: Workspace) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedWorkspaces = localStorage.getItem("workspaces");
    const savedActiveWorkspace = localStorage.getItem("activeWorkspace");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedWorkspaces) setWorkspaces(JSON.parse(savedWorkspaces));
    if (savedActiveWorkspace) setActiveWorkspace(JSON.parse(savedActiveWorkspace));
  }, []);

  const setAuthData = (userData: User, workspacesData: Workspace[], workspace?: Workspace | null) => {
    setUser(userData);
    setWorkspaces(workspacesData);
    if (workspace) setActiveWorkspace(workspace);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("workspaces", JSON.stringify(workspacesData));
    if (workspace) localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
  };

  const setWorkspace = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth/logout";
  };

  return (
    <AuthContext.Provider value={{ user, workspaces, activeWorkspace, setAuthData, setUser, setWorkspace, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
