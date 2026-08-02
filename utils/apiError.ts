type ApiErrorPayload = {
  detail?: unknown;
  message?: unknown;
  error?: unknown;
  errors?: unknown;
};

const asMessage = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    const first = value[0] as { msg?: unknown; message?: unknown } | undefined;
    return asMessage(first?.msg ?? first?.message);
  }
  if (value && typeof value === "object") {
    const record = value as { msg?: unknown; message?: unknown; detail?: unknown };
    return asMessage(record.msg ?? record.message ?? record.detail);
  }
  return null;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const response = (error as { response?: { status?: number; data?: ApiErrorPayload }; message?: unknown })?.response;
  const data = response?.data;
  const message = asMessage(data?.detail) ?? asMessage(data?.message) ?? asMessage(data?.error) ?? asMessage(data?.errors) ?? asMessage((error as { message?: unknown })?.message);
  if (message) return message;
  if (response?.status === 401) return "Invalid email or password.";
  if (response?.status === 409) return "An account with this email already exists.";
  if (response?.status === 429) return "Too many attempts. Please wait a moment and try again.";
  if (typeof response?.status === "number" && response.status >= 500) return "The service is temporarily unavailable. Please try again.";
  return fallback;
};
