export function getGeminiModel() {
  return process.env.GEMINI_MODEL || "gemini-3.8-flash";
}

export function getGeminiProviderError(status: number) {
  if (status === 401 || status === 403) {
    return "Gemini rejected the API key. Check GEMINI_API_KEY and the key's API access.";
  }
  if (status === 404) {
    return "The configured Gemini model was not found. Check GEMINI_MODEL in your deployment environment.";
  }
  if (status === 429) {
    return "Gemini's request limit or quota was reached. Check the project quota and try again later.";
  }
  return `Gemini could not complete the request (HTTP ${status}). Please try again later.`;
}

export function getGeminiText(payload: unknown) {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return "";
  const candidates = (payload as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates)) return "";
  const firstCandidate = candidates[0];
  if (typeof firstCandidate !== "object" || firstCandidate === null || Array.isArray(firstCandidate)) return "";
  const content = (firstCandidate as { content?: unknown }).content;
  if (typeof content !== "object" || content === null || Array.isArray(content)) return "";
  const parts = (content as { parts?: unknown }).parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .flatMap((part: unknown) => {
      if (typeof part !== "object" || part === null || Array.isArray(part)) return [];
      const text = (part as { text?: unknown }).text;
      return typeof text === "string" ? [text] : [];
    })
    .join("")
    .trim();
}
