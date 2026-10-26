import { apiClient } from "./apiClient.js";

/**
 * Service boundary for GitHub integration.
 * Communicates with the future Express backend which will handle OAuth tokens securely server-side.
 */

export async function checkGitHubAuthStatus() {
  try {
    const data = await apiClient.get("/api/github/status");
    return { connected: true, data };
  } catch (err) {
    return {
      connected: false,
      reason: "backend_unavailable",
      message: "GitHub authentication requires the Express backend server with GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET configured."
    };
  }
}

export async function fetchUserRepositories() {
  try {
    const repos = await apiClient.get("/api/github/repos");
    return { success: true, repos };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Failed to load repositories from backend"
    };
  }
}

export async function publishSolutionToGitHub({
  repoName,
  branch = "main",
  filePath,
  commitMessage,
  fileContent,
  problemMetadata
}) {
  const payload = {
    repoName,
    branch,
    filePath,
    commitMessage,
    fileContent,
    problemMetadata
  };

  try {
    const result = await apiClient.post("/api/github/publish", payload);
    return { success: true, result };
  } catch (err) {
    return {
      success: false,
      error: {
        code: "BACKEND_UNAVAILABLE",
        message: "Unable to publish to GitHub without the active backend service.",
        detail: `Proposed endpoint: POST /api/github/publish\nTarget file: ${filePath}\nCommit message: "${commitMessage}"\n\nSecurity notice: Practise never collects user tokens or secrets client-side. Complete server implementation with GitHub App or OAuth app before publishing.`,
        httpStatus: err.status
      }
    };
  }
}

/**
 * Formats standard repository file path based on problem taxonomy
 */
export function generateDefaultFilePath(problem, language) {
  const extMap = {
    javascript: "js",
    python: "py",
    cpp: "cpp",
    java: "java"
  };
  const ext = extMap[language] || "txt";
  const primaryTopic = (problem.topics && problem.topics[0]) || "General";
  const slug = problem.id || "problem";
  return `${primaryTopic}/${slug}/solution.${ext}`;
}

export function generateDefaultCommitMessage(problem, language) {
  return `feat(${problem.id}): add ${language} solution [${problem.difficulty}]`;
}
