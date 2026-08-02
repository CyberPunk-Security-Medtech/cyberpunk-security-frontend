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
  return fallback;
};
