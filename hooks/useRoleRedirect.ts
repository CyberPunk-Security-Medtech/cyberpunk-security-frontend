"use client";

import { useRouter } from "next/navigation";

export type UserRole = "admin" | "doctor" | "nurse" | "lab" | "pharmacist";

// Map roles → dashboards
const roleRoutes: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  doctor: "/dashboard/doctor",
  nurse: "/dashboard/nurse",
  lab: "/dashboard/lab",
  pharmacist: "/dashboard/pharmacist",
};

export function toUserRole(role: string): UserRole | null {
  const allowed: UserRole[] = ["admin", "doctor", "nurse", "lab", "pharmacist"];
  return allowed.includes(role as UserRole) ? (role as UserRole) : null;
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
