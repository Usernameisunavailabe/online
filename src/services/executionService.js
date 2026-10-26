import { apiClient, ApiError } from "./apiClient.js";

/**
 * Expected Execution Response Shape:
 * {
 *   status: "passed" | "failed" | "runtime_error" | "compilation_error" | "time_limit_exceeded" | "service_unavailable",
 *   stdout: string,
 *   stderr: string,
 *   executionTimeMs?: number,
 *   memoryUsageKb?: number,
 *   testResults?: Array<{ id: number, passed: boolean, input: string, output: string, expected: string }>,
 *   message?: string
 * }
 */

export async function executeCode({
  problemId,
  language,
  sourceCode,
  testInput,
  options = {}
}) {
  const payload = {
    problemId,
    language,
    sourceCode,
    testInput,
    options: {
      timeoutLimitMs: options.timeoutLimitMs || 3000,
      memoryLimitMb: options.memoryLimitMb || 128,
      ...options
    }
  };

  try {
    const data = await apiClient.post("/api/execute", payload, { timeout: 15000 });
    return {
      success: true,
      data
    };
  } catch (err) {
    // When Express backend is not running or returns connection refused / 404 / 500
    const isOffline =
      err.status === 0 ||
      err.status === 404 ||
      err.status === 502 ||
      err.status === 503;

    return {
      success: false,
      error: {
        status: isOffline ? "service_unavailable" : "runtime_error",
        message: isOffline
          ? "Code Execution Backend is currently disconnected or in development mode."
          : (err.message || "Execution request failed"),
        detail: `The frontend submitted a structured POST /api/execute payload to ${apiClient.getBaseUrl()}/api/execute.\n\n` +
          `Arbitrary code execution requires a sandboxed backend runner (e.g. Docker / Judge0 / isolated Node worker) to ensure client security and prevent browser crashes.\n\n` +
          `Payload sent: problemId="${problemId}", language="${language}", codeLength=${sourceCode?.length || 0} chars.`,
        httpStatus: err.status,
        timestamp: new Date().toISOString()
      }
    };
  }
}
