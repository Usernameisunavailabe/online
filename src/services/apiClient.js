const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const timeoutMs = options.timeout || 12000;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(id);

    const contentType = response.headers.get("content-type");
    let responseData = null;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        (responseData && responseData.message) || `HTTP error ${response.status}`,
        response.status,
        responseData
      );
    }

    return responseData;
  } catch (err) {
    clearTimeout(id);
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out after " + timeoutMs + "ms", 408);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || "Network failure or server unavailable", 0, null);
  }
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  del: (endpoint, options) => request(endpoint, { ...options, method: "DELETE" }),
  getBaseUrl: () => API_BASE_URL
};

export { ApiError };
