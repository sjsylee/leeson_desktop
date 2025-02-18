type httpStatus = number;

export class ApiError extends Error {
  status: httpStatus;
  constructor(url: string, status: httpStatus) {
    super(`${url} returned ${status}`);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
    this.name = "ApiError";
    this.status = status;
  }
}

export async function fetchJson(url: string, options: any): Promise<any> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new ApiError(url, res.status);
  }
  return await res.json();
}
