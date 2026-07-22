export type StatusType = "Active" | "Discharged" | "Pending" | "Normal" | "High" | "Low" | "Abnormal" | "Completed";

export interface Patient {
    id: string;
    initials: string;
    name: string;
    age: number;
    gender: string;
    condition: string;
    status: StatusType;
    date: string; // Last Visit
}

export interface MenuItem {
    name: string;
    icon?: any; // Using any for Lucide icons for simplicity, or ideally React.ElementType
    href: string;
    children?: MenuItem[];
}

export interface UserProfile {
    name: string;
    role: string;
    avatar: string;
}

export interface User {
  first_name?: string;
  last_name?: string;
  email?: string;
}
