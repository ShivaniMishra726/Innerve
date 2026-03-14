// Cloud-based analysis module for TruthGuard
// Integrates HuggingFace Inference API and Google Fact Check API
// as an optional cloud-powered layer when local model confidence is low.
//
// Both integrations are opt-in: set environment variables to enable them.
// If no API keys are configured the function returns `used: false` and the
// local analysis result is used unchanged.
//
// Server-side only — never import this module from client components.

/** A single fact-check result returned by the Google Fact Check API. */
export interface FactCheck {
  /** The claim that was fact-checked. */
  claimText: string;
  /** Who made the claim. */
  claimant: string;
  /** The rating assigned by the fact-checker (e.g. "False", "Misleading"). */
  rating: string;
  /** URL of the full fact-check article. */
  url: string;
  /** Name of the fact-checking organisation. */
  publisher: string;
}

/** Aggregated result from all cloud analysis providers. */
export interface CloudAnalysisResult {
  /** Whether at least one cloud provider contributed a result. */
  used: boolean;
  /** Comma-separated list of providers that contributed ("huggingface", "google_factcheck"). */
  provider: string;
  /**
   * Misinformation likelihood score (0–100) from HuggingFace zero-shot
   * classification.  `null` when the API was not called or the call failed.
   */
  huggingfaceScore: number | null;
  /** Up to 3 matching fact-check records from the Google Fact Check API. */
  factChecks: FactCheck[];
  /** Human-readable error string when a call partially fails, otherwise null. */
  error: string | null;
}

// ---------------------------------------------------------------------------
// HuggingFace Inference API
// Model: facebook/bart-large-mnli (zero-shot text classification)
// ---------------------------------------------------------------------------

const HF_API_URL =
  "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

async function callHuggingFace(
  text: string,
  apiKey: string
): Promise<number | null> {
  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // HuggingFace token limit: truncate to first 500 chars
        inputs: text.slice(0, 500),
        parameters: {
          candidate_labels: ["misinformation", "fake news", "credible news"],
          multi_label: false,
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      labels?: string[];
      scores?: number[];
    };

    const labels = data.labels ?? [];
    const scores = data.scores ?? [];

    // Sum the probability mass assigned to misinformation-related labels.
    const riskScore = labels.reduce((acc, label, i) => {
      if (label === "misinformation" || label === "fake news") {
        return acc + (scores[i] ?? 0);
      }
      return acc;
    }, 0);

    return Math.round(riskScore * 100);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Google Fact Check Tools API
// ---------------------------------------------------------------------------

const GOOGLE_FACTCHECK_URL =
  "https://factchecktools.googleapis.com/v1alpha1/claims:search";

async function callGoogleFactCheck(
  text: string,
  apiKey: string
): Promise<FactCheck[]> {
  try {
    // Use the first 100 characters as the search query
    const query = text.slice(0, 100).trim();
    const url = new URL(GOOGLE_FACTCHECK_URL);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("query", query);
    url.searchParams.set("pageSize", "3");

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) return [];

    const data = (await response.json()) as {
      claims?: Array<{
        text?: string;
        claimant?: string;
        claimReview?: Array<{
          url?: string;
          textualRating?: string;
          publisher?: { name?: string };
        }>;
      }>;
    };

    return (data.claims ?? [])
      .map((claim) => ({
        claimText: claim.text ?? "",
        claimant: claim.claimant ?? "Unknown",
        rating: claim.claimReview?.[0]?.textualRating ?? "Unrated",
        url: claim.claimReview?.[0]?.url ?? "",
        publisher: claim.claimReview?.[0]?.publisher?.name ?? "",
      }))
      .filter((fc) => fc.claimText.length > 0);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Run cloud-based analysis using HuggingFace and/or Google Fact Check APIs.
 *
 * Triggered when the local model confidence is below the threshold (< 70).
 * Both integrations are optional: if the corresponding environment variable
 * (`HUGGINGFACE_API_KEY` or `GOOGLE_FACT_CHECK_API_KEY`) is not set the call
 * is skipped.
 *
 * When a HuggingFace score is returned it is blended into the risk score by
 * the caller (20 % weight) to produce a cloud-enhanced final result.
 *
 * @param text - Sanitized (PII-scrubbed) text to analyse.
 */
export async function runCloudAnalysis(
  text: string
): Promise<CloudAnalysisResult> {
  const hfKey = process.env.HUGGINGFACE_API_KEY;
  const googleKey = process.env.GOOGLE_FACT_CHECK_API_KEY;

  if (!hfKey && !googleKey) {
    return {
      used: false,
      provider: "none",
      huggingfaceScore: null,
      factChecks: [],
      error: null,
    };
  }

  const [hfResult, fcResult] = await Promise.allSettled([
    hfKey ? callHuggingFace(text, hfKey) : Promise.resolve(null),
    googleKey ? callGoogleFactCheck(text, googleKey) : Promise.resolve([]),
  ]);

  const huggingfaceScore =
    hfResult.status === "fulfilled" ? hfResult.value : null;
  const factChecks =
    fcResult.status === "fulfilled" ? (fcResult.value as FactCheck[]) : [];

  const activeProviders: string[] = [];
  if (hfKey && huggingfaceScore !== null) activeProviders.push("huggingface");
  if (googleKey && factChecks.length > 0)
    activeProviders.push("google_factcheck");

  return {
    used: activeProviders.length > 0,
    provider: activeProviders.join("+") || "none",
    huggingfaceScore,
    factChecks,
    error: null,
  };
}
