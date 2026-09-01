type ApiErrorPayload = {
  detail?: unknown;
  message?: unknown;
  error?: unknown;
  errors?: unknown;
};

// Human-friendly labels for known field names used by the backend.
const FIELD_LABELS: Record<string, string> = {
  email: "Email address",
  first_name: "First name",
  last_name: "Last name",
  password: "Password",
  password_confirm: "Password confirmation",
  new_password: "New password",
  old_password: "Current password",
  phone_number: "Phone number",
  full_name: "Full name",
  institution_name: "Institution name",
  code: "Verification code",
};

const labelFor = (field: string) =>
  FIELD_LABELS[field] ??
  field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

// Turns raw validation strings like "Field required" into readable,
// user-facing messages tied to the offending field.
const humanizeFieldMessage = (raw: string, field?: string): string => {
  let message = raw.trim();
  const label = field ? labelFor(field) : undefined;

  // Strip pydantic's "Value error, " prefix, e.g.
  // "Value error, Password must be at least 12 characters".
  message = message.replace(/^value error,\s*/i, "");

  if (/^field required$/i.test(message)) {
    return label ? `${label} is required.` : "This field is required.";
  }
  if (/value is not a valid email address/i.test(message)) {
    return `${label ?? "Email address"} must be a valid email address.`;
  }
  if (label && message.toLowerCase().startsWith(label.toLowerCase())) {
    return message.endsWith(".") ? message : `${message}.`;
  }

  const sentence =
    message.charAt(0).toUpperCase() + message.slice(1);
  return label ? `${label}: ${sentence}` : sentence;
};

const asMessage = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value.trim();

  // FastAPI 422 arrays, e.g.
  // [{ type: "missing", loc: ["body", "email"], msg: "Field required" }]
  if (Array.isArray(value)) {
    const messages = value
      .map((entry) => {
        if (entry && typeof entry === "object") {
          const item = entry as {
            msg?: unknown;
            message?: unknown;
            loc?: unknown;
          };
          const msg = asMessage(item.msg ?? item.message);
          if (!msg) return null;
          const loc = Array.isArray(item.loc)
            ? item.loc[item.loc.length - 1]
            : undefined;
          const field =
            typeof loc === "string" && loc !== "body" ? loc : undefined;
          return humanizeFieldMessage(msg, field);
        }
        return asMessage(entry);
      })
      .filter((entry): entry is string => Boolean(entry));
    if (messages.length > 0) return messages.join(" ");
    return null;
  }

  if (value && typeof value === "object") {
    const record = value as {
      msg?: unknown;
      message?: unknown;
      detail?: unknown;
    };
    const direct = asMessage(record.msg ?? record.message ?? record.detail);
    if (direct) return direct;

    // Field-keyed validation errors, e.g. { email: "Field required" }
    const fieldMessages = Object.entries(record)
      .map(([field, entry]) => {
        const msg = asMessage(entry);
        return msg ? humanizeFieldMessage(msg, field) : null;
      })
      .filter((entry): entry is string => Boolean(entry));
    if (fieldMessages.length > 0) return fieldMessages.join(" ");
  }
  return null;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const response = (error as { response?: { status?: number; data?: ApiErrorPayload }; message?: unknown })?.response;
  const data = response?.data;
  const message =
    asMessage(data?.detail) ??
    asMessage(data?.message) ??
    asMessage(data?.error) ??
    asMessage(data?.errors) ??
    // Some endpoints return field-keyed errors as the whole body,
    // e.g. { password: "Value error, Password must be at least 12 characters" }
    asMessage(data);
  if (message) return message;

  // Network errors (no response) have no body — surface axios's message
  // (e.g. "Network Error"). For HTTP errors with an unparseable body,
  // prefer the caller's friendly fallback over axios's
  // "Request failed with status code 422".
  if (!response) {
    return asMessage((error as { message?: unknown })?.message) ?? fallback;
  }
  return fallback;
};
