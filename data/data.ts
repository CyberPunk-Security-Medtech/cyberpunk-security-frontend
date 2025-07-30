import {
  ArrowLeftStartOnRectangleIcon,
  BeakerIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/16/solid";
// import text from "@public/text.svg";
// import textArea from "@public/paragraph.svg";
// import tel from "@public/tel.svg";
// import radio from "@public/radio.svg";
// import checkbox from "@public/check.svg";
// import attachment from "@public/attachment.svg";
// import select from "@public/select.svg";

export const formElements = [
  {
    // icon: text,
    title: "Text Field",
    structure: {
      name: "Text",
      type: "text",
    },
  },
  {
    // icon: textArea,
    title: "Paragraph",
    structure: {
      name: "Paragraph",
      type: "textarea",
    },
  },

  {
    // icon: radio,
    title: "Email",
    structure: {
      name: "Email",
      type: "email",
    },
  },

  {
    // icon: tel,
    title: "Phone Number",
    structure: {
      name: "Phone Number",
      type: "tel",
    },
  },

  {
    // icon: select,
    title: "Dropdown",
    structure: {
      name: "Dropdown",
      type: "select",
      options: ["Option 1", "Option 2"],
    },
  },
  {
    // icon: attachment,
    title: "Attachment",
    structure: {
      name: "Attachment",
      type: "file",
    },
  },
];

export const navigation = [
  {
    name: "Compliance",
    href: "/dashboard/compliance",
    icon: ShieldCheckIcon,
    current: true,
  },
  {
    name: "Patients",
    href: "/dashboard/patients",
    icon: UserGroupIcon,
    current: false,
  },
  {
    name: "Appointments",
    href: "/dashboard/appointments",
    icon: CalendarDaysIcon,
    current: false,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: ChartBarIcon,
    current: false,
  },
  {
    name: "Lab",
    href: "/dashboard/lab",
    icon: BeakerIcon,
    current: false,
  },
  {
    name: "Pharmacy",
    href: "/dashboard/pharmacy",
    icon: ClipboardDocumentListIcon,
    current: false,
  },
  {
    name: "Procedure",
    href: "/dashboard/procedure",
    icon: Cog6ToothIcon,
    current: false,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCardIcon,
    current: false,
  },
  {
    name: "Tasks",
    href: "/dashboard/task",
    icon: CheckCircleIcon,
    current: false,
  },
  {
    name: "Help",
    href: "/dashboard/help",
    icon: QuestionMarkCircleIcon,
    current: false,
  },
  {
    name: "Logout",
    href: "#",
    icon: ArrowLeftStartOnRectangleIcon,
    current: false,
  },
];

export const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];
