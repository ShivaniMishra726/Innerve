// Main misinformation detection engine
// Pipeline: language detect → heuristic scan → ML model → fuse scores → verdict

import { runHeuristics, detectLanguage2 } from "./heuristics";
import { runFakeNewsModel, type ModelPrediction } from "./fakeNewsModel";

export type Verdict = "credible" | "suspicious" | "misinfo";

export interface ScanResult {
  score: number;          // 0-100 factuality/trust score (higher = more trustworthy)
  riskScore: number;      // 0-100 risk score (higher = more suspicious)
  verdict: Verdict;
  flags: string[];
  explanation: string;
  language: string;
  confidence: number;     // 0-100 confidence in verdict
  educationTips: string[];
  modelPrediction: ModelPrediction; // ML model output for UI breakdown
}

// Fusion weights: heuristic engine carries more weight (pattern-matching is very reliable
// for Indian misinformation), ML model is supplementary.
const HEURISTIC_WEIGHT = 0.6;
const MODEL_WEIGHT = 0.4;

// Education tips mapped to common red flags
const EDUCATION_TIPS: Record<string, string[]> = {
  default: [
    "Check official government sources like pib.gov.in before believing claims.",
    "Look for emotional manipulation — real news is usually calm and factual.",
    "Verify images using Google Reverse Image Search or TinEye.",
    "Check multiple trusted news sources before sharing.",
    "If a message says 'Share immediately', be extra skeptical.",
  ],
  scam: [
    "Government schemes are never announced via WhatsApp forwards.",
    "Official subsidy links come from .gov.in domains only.",
    "RBI/banks never ask for OTP or passwords via messages.",
    "Check official websites: rbi.org.in, mygov.in for genuine schemes.",
    "Report suspected scams at cybercrime.gov.in.",
  ],
  health: [
    "Always verify health information from mohfw.gov.in or WHO.",
    "No food or drink can 'cure' COVID, cancer, or other diseases.",
    "Consult a qualified doctor before following any home remedy.",
    "The Health Ministry's official WhatsApp number is 9013151515.",
    "Fake health tips often use celebrity endorsements — verify them.",
  ],
  election: [
    "Check the Election Commission website at eci.gov.in for official info.",
    "Political misinformation spikes before elections — be extra vigilant.",
    "Use factchecker.in and AltNews for election-related fact checks.",
    "Screenshot and report misleading content to the EC.",
    "Don't share exit poll data — it's prohibited before official announcement.",
  ],
  forward: [
    "Most viral WhatsApp forwards contain some misinformation.",
    "Check if the 'Forwarded many times' label appears — extra caution needed.",
    "WhatsApp's fact-check feature can help verify suspicious messages.",
    "Use Boom's WhatsApp helpline: 7700906588 to verify.",
    "Think before you forward — you could be spreading misinformation.",
  ],
};

// Sample misinformation examples for context matching
const MISINFO_EXAMPLES = [
  {
    keywords: ["pm modi", "subsidy", "1000", "apply", "free"],
    type: "scam",
    explanation: "This matches a known pattern of fake government subsidy scams that impersonate PM Modi or government schemes.",
  },
  {
    keywords: ["covid", "cure", "drink", "kadha", "immunity boost"],
    type: "health",
    explanation: "This matches known COVID-era health misinformation patterns. No food or drink has been proven to cure COVID-19.",
  },
  {
    keywords: ["election", "booth", "vote", "evm", "manipulate", "rigged"],
    type: "election",
    explanation: "This contains election-related claims. Such unverified claims can undermine democratic processes.",
  },
  {
    keywords: ["rbi", "bank", "account", "block", "kyc", "link", "click"],
    type: "scam",
    explanation: "This matches known banking phishing scam patterns. RBI and banks never send such messages.",
  },
  {
    keywords: ["whatsapp gold", "whatsapp plus", "new version", "forward"],
    type: "scam",
    explanation: "This is a known WhatsApp scam chain message. No such official WhatsApp upgrade exists.",
  },
];

function computeVerdictAndExplanation(
  riskScore: number,
  modelScore: number,
  flags: string[],
  text: string,
  modelPrediction: ModelPrediction
): { verdict: Verdict; explanation: string; type: string; confidence: number } {
  // Fuse heuristic risk score with ML model score
  const fusedScore = Math.round(riskScore * HEURISTIC_WEIGHT + modelScore * MODEL_WEIGHT);

  // Check against known misinformation examples
  const lowerText = text.toLowerCase();
  let matchedExample: (typeof MISINFO_EXAMPLES)[0] | null = null;
  let maxMatches = 0;

  for (const example of MISINFO_EXAMPLES) {
    const matches = example.keywords.filter((k) => lowerText.includes(k)).length;
    if (matches > maxMatches && matches >= 2) {
      maxMatches = matches;
      matchedExample = example;
    }
  }

  let verdict: Verdict;
  let confidence: number;
  let explanation: string;

  // Use modelPrediction category for explanation type
  const type = modelPrediction.category === "credible"
    ? (matchedExample?.type || "default")
    : modelPrediction.category;

  if (fusedScore >= 55) {
    verdict = "misinfo";
    confidence = Math.min(55 + fusedScore * 0.4, 95);
    explanation = matchedExample
      ? matchedExample.explanation
      : `This content shows ${flags.length} red flags including ${flags.slice(0, 2).join(" and ").toLowerCase()}. It has patterns commonly found in misinformation (category: ${modelPrediction.categoryLabel}).`;
  } else if (fusedScore >= 28) {
    verdict = "suspicious";
    confidence = Math.min(45 + fusedScore * 0.5, 85);
    explanation = matchedExample
      ? `Potentially suspicious: ${matchedExample.explanation}`
      : `This content has some concerning signals: ${flags.slice(0, 2).join(" and ").toLowerCase()}. Verify before sharing.`;
  } else {
    verdict = "credible";
    confidence = Math.min(65 + (55 - fusedScore) * 0.5, 90);
    explanation = flags.length > 0
      ? `Content appears relatively credible, but note: ${flags[0].toLowerCase()}. Always verify from official sources.`
      : "This content shows no major misinformation signals. Still, always cross-check important claims with trusted sources.";
  }

  return { verdict, explanation, type, confidence };
}

function getEducationTips(type: string, flags: string[]): string[] {
  const tips: string[] = [];
  const baseType = EDUCATION_TIPS[type] || EDUCATION_TIPS.default;

  // Add type-specific tips first
  tips.push(...baseType.slice(0, 2));

  // Add flag-based tips
  if (flags.some((f) => f.toLowerCase().includes("forward"))) {
    tips.push(...(EDUCATION_TIPS.forward?.slice(0, 2) || []));
  }
  if (flags.some((f) => f.toLowerCase().includes("scam"))) {
    tips.push(...(EDUCATION_TIPS.scam?.slice(0, 1) || []));
  }

  // Fill with default tips to ensure 3-5 tips
  const defaultTips = EDUCATION_TIPS.default;
  while (tips.length < 3) {
    const remaining = defaultTips.filter((t) => !tips.includes(t));
    if (remaining.length === 0) break;
    tips.push(remaining[0]);
  }

  // Deduplicate and limit to 5
  const unique = Array.from(new Set(tips));
  return unique.slice(0, 5);
}

export async function scanContent(text: string): Promise<ScanResult> {
  // Step 1: Detect language
  const language = detectLanguage2(text);

  // Step 2: Run heuristic scan
  const heuristicResult = runHeuristics(text);
  const riskScore = heuristicResult.score;

  // Step 3: Run ML-inspired fake news model
  const modelPrediction = runFakeNewsModel(text);

  // Step 4: Fuse scores and compute verdict
  const { verdict, explanation, type, confidence } = computeVerdictAndExplanation(
    riskScore,
    modelPrediction.modelScore,
    heuristicResult.flags,
    text,
    modelPrediction
  );

  // Step 5: Convert fused risk to factuality score (inverse)
  const fusedRisk = Math.round(riskScore * HEURISTIC_WEIGHT + modelPrediction.modelScore * MODEL_WEIGHT);
  const factualityScore = Math.max(0, 100 - fusedRisk);

  // Step 6: Get education tips
  const educationTips = getEducationTips(type, heuristicResult.flags);

  return {
    score: factualityScore,
    riskScore: fusedRisk,
    verdict,
    flags: heuristicResult.flags,
    explanation,
    language,
    confidence,
    educationTips,
    modelPrediction,
  };
}
