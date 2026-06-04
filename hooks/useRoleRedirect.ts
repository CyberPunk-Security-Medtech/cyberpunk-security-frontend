"use client";

import { useRouter } from "next/navigation";

export type UserRole = "admin" | "doctor" | "nurse" | "lab" | "pharmacist";

const roleRoutes: Record<UserRole, string> = {
  admin: "/dashboard/admin-dashboard",
  doctor: "/dashboard/doctor-dashboard",
  nurse: "/dashboard/nurse-dashboard",
  lab: "/dashboard/lab-scientist",
  pharmacist: "/dashboard/pharmacy",
};

export function toUserRole(role: string): UserRole | null {
  const normalized = role.toLowerCase().trim();
  if (normalized === "admin") return "admin";
  if (normalized === "doctor") return "doctor";
  if (normalized === "nurse") return "nurse";
  if (normalized === "lab" || normalized === "lab_technician") return "lab";
  if (normalized === "pharmacist") return "pharmacist";
  return null;
}

export function useRoleRedirect() {
  const router = useRouter();

  const redirectUser = (role: string) => {
    const validatedRole = toUserRole(role);

    if (!validatedRole) {
      console.error("Invalid role:", role);
      router.push("/unauthorized");
      return;
    }

    router.push(roleRoutes[validatedRole]);
  };

  return { redirectUser };
}
