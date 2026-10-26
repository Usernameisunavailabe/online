/**
 * Validates whether an imported JSON object matches the expected Practise export schema.
 */
export function validateImportedData(data) {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Imported file must contain a valid JSON object." };
  }

  if (typeof data.version !== "number") {
    return { valid: false, error: "Invalid or missing data version format." };
  }

  if (data.questions && !Array.isArray(data.questions)) {
    return { valid: false, error: "'questions' must be an array." };
  }

  if (data.revisions && !Array.isArray(data.revisions)) {
    return { valid: false, error: "'revisions' must be an array." };
  }

  if (data.interviewHistory && !Array.isArray(data.interviewHistory)) {
    return { valid: false, error: "'interviewHistory' must be an array." };
  }

  if (data.activityLog && !Array.isArray(data.activityLog)) {
    return { valid: false, error: "'activityLog' must be an array." };
  }

  return { valid: true };
}
