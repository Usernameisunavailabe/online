import { getStoredItem, setStoredItem, STORAGE_KEYS } from "../utils/storage.js";

export const AI_PROVIDERS = {
  GEMINI: "gemini",
  OPENAI: "openai"
};

export function getAiConfig() {
  return getStoredItem(STORAGE_KEYS.AI_CONFIG, {
    provider: AI_PROVIDERS.GEMINI,
    apiKey: "",
    model: "gemini-1.5-flash"
  });
}

export function saveAiConfig(config) {
  setStoredItem(STORAGE_KEYS.AI_CONFIG, config);
}

export function clearAiConfig() {
  setStoredItem(STORAGE_KEYS.AI_CONFIG, {
    provider: AI_PROVIDERS.GEMINI,
    apiKey: "",
    model: "gemini-1.5-flash"
  });
}

/**
 * Builds appropriate prompt based on mode
 */
export function buildPrompt({ mode, problem, language, code, hintLevel = 1 }) {
  const problemContext = `Problem: ${problem.title}\nDifficulty: ${problem.difficulty}\nDescription:\n${problem.description}\n`;

  if (mode === "review") {
    return (
      `You are a strict, senior DSA interview reviewer. Analyze the following ${language} code for the problem below:\n\n` +
      problemContext +
      `\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\n` +
      `Please provide concise, structured feedback divided into:\n` +
      `1. Potential Bugs & Correctness\n` +
      `2. Edge Cases (unhandled scenarios)\n` +
      `3. Time Complexity Analysis\n` +
      `4. Space Complexity Analysis\n` +
      `5. Code Quality & Optimization Suggestions\n` +
      `Do NOT provide the complete corrected solution unless necessary.`
    );
  }

  if (mode === "hints") {
    return (
      `You are a DSA interview mentor. The user is solving: ${problem.title}.\n` +
      problemContext +
      `\nCurrent user code:\n\`\`\`${language}\n${code}\n\`\`\`\n\n` +
      `Provide HINT LEVEL ${hintLevel} (out of 3).\n` +
      (hintLevel === 1
        ? `Hint 1: Give a conceptual nudge or observation about the problem constraint or pattern without mentioning the data structure or algorithm directly.`
        : hintLevel === 2
        ? `Hint 2: Suggest the high-level data structure or algorithmic technique (e.g. two pointers, hash map, monotonic stack) and why it helps.`
        : `Hint 3: Detail the step-by-step invariant or transition, but do NOT give the full copy-paste code.`)
    );
  }

  if (mode === "generate_tests") {
    return (
      `Generate 5 challenging test cases for the problem: ${problem.title}.\n` +
      problemContext +
      `\nInclude:\n` +
      `- 1 Minimal/Boundary edge case\n` +
      `- 1 Large input scale / stress case\n` +
      `- 1 Duplicates or negative values case\n` +
      `- 2 Tricky algorithmic edge cases\n` +
      `Format each test with Input, Expected Output, and Explanation of what bug it catches.`
    );
  }

  if (mode === "explain") {
    return (
      `Explain the following ${language} solution for the problem: ${problem.title}.\n\n` +
      `Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\n` +
      `Provide:\n` +
      `1. High-level mental model and intuition\n` +
      `2. Step-by-step walkthrough of the key logic\n` +
      `3. Time & Space complexity summary`
    );
  }

  return `Explain this DSA problem: ${problem.title}`;
}

/**
 * Executes an AI query against configured provider
 */
export async function queryAiAssistant({ mode, problem, language, code, hintLevel }) {
  const config = getAiConfig();

  if (!config.apiKey || !config.apiKey.trim()) {
    return {
      success: false,
      error: {
        code: "NO_API_KEY",
        message: "No AI API key configured.",
        guidance: "Please add your Google Gemini or OpenAI API key in Settings or the key prompt above to activate live AI assistance. Your key is stored strictly in your browser's local storage and is never forwarded to third parties."
      }
    };
  }

  const prompt = buildPrompt({ mode, problem, language, code, hintLevel });

  try {
    if (config.provider === AI_PROVIDERS.GEMINI) {
      return await callGemini(config.apiKey, prompt, config.model || "gemini-1.5-flash");
    } else {
      return await callOpenAI(config.apiKey, prompt, config.model || "gpt-4o-mini");
    }
  } catch (err) {
    return {
      success: false,
      error: {
        code: "API_REQUEST_FAILED",
        message: err.message || "Failed to reach AI provider API.",
        guidance: "Verify your API key has sufficient quota and is valid for the selected provider."
      }
    };
  }
}

async function callGemini(apiKey, prompt, model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Gemini API error: HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");

  return { success: true, text };
}

async function callOpenAI(apiKey, prompt, model) {
  const url = "https://api.openai.com/v1/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: "You are an expert DSA technical interview assistant. Provide concise, accurate, developer-first responses in markdown." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `OpenAI API error: HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned an empty response.");

  return { success: true, text };
}
