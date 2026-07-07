// Calls our own local proxy server (server/index.js) instead of the AI
// provider directly — Gemini's API is meant to be called server-side with a
// server-held key, so the actual API call happens behind this proxy.
export async function analyzeResumeWithAI({ resumeText, targetRole }) {
  let res;
  try {
    res = await fetch("/api/analyze-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, targetRole }),
    });
  } catch {
    throw new Error(
      "Could not reach the AI analysis server — make sure it is running (npm run server, or npm run dev:all).",
    );
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `AI analysis failed (${res.status}).`);
  }
  return data;
}
