import OpenAI from "openai";

/**
 * Server-side OpenRouter client factory.
 * Verifies that the API key exists in server environment variables.
 */
export function getOpenRouterClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === "your_openrouter_api_key_here" || apiKey.trim() === "") {
    throw new Error(
      "OPENROUTER_API_KEY is not configured on the server. Please add a valid OpenRouter API key to your .env.local file."
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Bolna Graph Agent Validator",
    },
  });
}

export function getOpenRouterModel(): string {
  return process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";
}

