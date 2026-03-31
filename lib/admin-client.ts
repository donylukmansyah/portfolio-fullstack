type ApiErrorPayload =
  | string
  | {
      error?: unknown;
      details?: unknown;
      message?: string;
    }
  | null;

function stringifyApiError(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const payload = value as Record<string, unknown>;

  if (typeof payload.error === "string") {
    return payload.error;
  }

  if (payload.error) {
    if (typeof payload.error === "object" && payload.error !== null) {
      const nestedError = payload.error as Record<string, unknown>;
      const formErrors = nestedError.formErrors;

      if (Array.isArray(formErrors) && typeof formErrors[0] === "string") {
        return formErrors[0];
      }
    }

    return JSON.stringify(payload.error);
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  if (payload.details) {
    return JSON.stringify(payload.details);
  }

  return null;
}

async function readResponsePayload(response: Response): Promise<ApiErrorPayload> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as ApiErrorPayload;
  } catch {
    return text;
  }
}

function buildApiErrorMessage(payload: ApiErrorPayload, status: number) {
  return (
    stringifyApiError(payload) ??
    `Request failed with status ${status}. Please try again.`
  );
}

export async function requestAdminJson<TResult>(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const response = await fetch(input, init);
  const payload = await readResponsePayload(response);

  if (!response.ok) {
    throw new Error(buildApiErrorMessage(payload, response.status));
  }

  return payload as TResult;
}

export function submitAdminForm<TResult>(
  url: string,
  method: "POST" | "PUT" | "PATCH",
  payload: unknown
) {
  return requestAdminJson<TResult>(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminRecord(url: string) {
  return requestAdminJson<{ success: boolean }>(url, { method: "DELETE" });
}
