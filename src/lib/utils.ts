// TruthGuard Utility Functions

// ---------------------------------------------------------------------------
// PII Scrubber
// Removes personally identifiable information (PII) before content is sent to
// the AI inference engine. This ensures DPDP Act (Digital Personal Data
// Protection Act, 2023) compliance by not transmitting raw personal data.
//
// Redacts: Indian mobile numbers, email addresses, Aadhaar numbers,
// PAN numbers, generic personal names (heuristic), and URLs.
// ---------------------------------------------------------------------------

/** Replacement token used for redacted PII */
export const REDACTED_TOKEN = "[REDACTED]";

/**
 * Scrub PII from arbitrary text before AI inference.
 * Replaces phone numbers, emails, Aadhaar numbers, PAN cards, and URLs
 * with [REDACTED] so that no personal data leaves the browser/server.
 *
 * @example
 * scrubPII("Call Rahul at 9876543210")
 * // => "Call Rahul at [REDACTED]"
 */
export function scrubPII(text: string): string {
  let cleaned = text;

  // Indian mobile numbers: 10-digit starting with 6-9, with optional +91 / 0 prefix
  // Word boundaries prevent matching numbers embedded in larger sequences
  cleaned = cleaned.replace(
    /\b(?:\+91|0)?[6-9]\d{9}\b/g,
    REDACTED_TOKEN
  );

  // Email addresses
  cleaned = cleaned.replace(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    REDACTED_TOKEN
  );

  // Aadhaar numbers: 12-digit, sometimes space/hyphen separated.
  // Requires non-digit boundaries to avoid matching dates or other sequences.
  cleaned = cleaned.replace(
    /(?<!\d)\d{4}[\s\-]\d{4}[\s\-]\d{4}(?!\d)/g,
    REDACTED_TOKEN
  );

  // PAN card numbers: 5 letters + 4 digits + 1 letter (uppercase)
  cleaned = cleaned.replace(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g, REDACTED_TOKEN);

  // URLs (http/https/ftp or bare www. domains).
  // Excludes trailing punctuation (.,;:!?) that may end a sentence.
  cleaned = cleaned.replace(
    /https?:\/\/[^\s.,;:!?)]+|ftp:\/\/[^\s.,;:!?)]+|www\.[^\s.,;:!?)]+/gi,
    REDACTED_TOKEN
  );

  return cleaned;
}

// ---------------------------------------------------------------------------
// Credibility Score Utilities
// ---------------------------------------------------------------------------

/**
 * Convert a raw credibility score (0–100) to a human-readable label.
 * Score scale: higher = more credible.
 */
export function scoreToVerdict(score: number): "credible" | "suspicious" | "misinfo" {
  if (score >= 65) return "credible";
  if (score >= 35) return "suspicious";
  return "misinfo";
}

/**
 * Map a verdict string to a display color class (Tailwind).
 */
export function verdictToColor(
  verdict: "credible" | "suspicious" | "misinfo"
): string {
  switch (verdict) {
    case "credible":
      return "text-emerald-600";
    case "suspicious":
      return "text-amber-600";
    case "misinfo":
      return "text-red-600";
  }
}

/**
 * Map a verdict to a background color class for badge/card styling.
 */
export function verdictToBg(
  verdict: "credible" | "suspicious" | "misinfo"
): string {
  switch (verdict) {
    case "credible":
      return "bg-emerald-50 border-emerald-200";
    case "suspicious":
      return "bg-amber-50 border-amber-200";
    case "misinfo":
      return "bg-red-50 border-red-200";
  }
}

// ---------------------------------------------------------------------------
// WhatsApp Share URL Builder
// ---------------------------------------------------------------------------

/**
 * Build a WhatsApp share URL with a pre-filled message.
 * Uses the wa.me intent URL format which works on both mobile and desktop.
 */
export function buildWhatsAppShareUrl(text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/?text=${encoded}`;
}

// ---------------------------------------------------------------------------
// Text Analysis Helpers
// ---------------------------------------------------------------------------

/**
 * Count the number of words in a string.
 */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Truncate text to a maximum length, appending "…" if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

/**
 * Clamp a number between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format a credibility score percentage for display.
 * e.g. 73.2 => "73%"
 */
export function formatScore(score: number): string {
  return `${Math.round(clamp(score, 0, 100))}%`;
}
