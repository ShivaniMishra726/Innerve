// Heuristic scoring engine for TruthGuard
// Local detection: no external API calls needed for primary scoring

export interface HeuristicResult {
  score: number; // 0-100, higher = more suspicious
  flags: string[];
  details: Record<string, number>;
}

// Emotional / sensational language that often appears in misinformation
const EMOTIONAL_KEYWORDS = [
  "breaking", "urgent", "shocking", "must share", "share immediately",
  "share before deleted", "viral", "exposed", "secret", "banned",
  "government hiding", "they don't want you to know", "wake up",
  "100%", "guaranteed", "miracle", "cure", "instant",
  "अभी शेयर करें", "तुरंत शेयर", "सरकार छुपा रही", "चमत्कारी",
  "जरूर शेयर", "खतरा", "आपातकाल", "बड़ी खबर",
];

// Known scam / phishing patterns common in Indian context
const SCAM_PATTERNS = [
  "free recharge", "free data", "click here to claim",
  "you have won", "congratulations you won", "lottery",
  "send this to", "forward to", "pm modi announced",
  "whatsapp gold", "whatsapp update", "deactivate",
  "bank account blocked", "kyc pending", "verify your account",
  "limited time offer", "act now", "today only",
  "सरकारी योजना", "मुफ्त राशन", "मुफ्त recharge",
  "रिजर्व बैंक", "आधार कार्ड बंद", "खाता बंद होगा",
  "pm kisan", "subsidy link", "apply now",
];

// Clickbait phrases
const CLICKBAIT_PHRASES = [
  "you won't believe", "what happened next", "this will shock you",
  "nobody is talking about", "mainstream media won't show",
  "finally revealed", "the truth about", "what they're hiding",
  "doctors hate", "one weird trick", "this simple trick",
];

// Fake authority markers
const FAKE_AUTHORITY_MARKERS = [
  "according to whatsapp", "whatsapp message says", "forward this message",
  "a doctor friend told", "source: whatsapp", "verified by",
  "according to nasa", "according to who", "as per government",
  "ministry of health confirms", "rbi has announced",
  "supreme court ordered", "pm modi personally",
];

// URL credibility - suspicious domains / patterns
const SUSPICIOUS_URL_PATTERNS = [
  /\b\w+\.blogspot\./i,
  /\b\w+\.wordpress\.com/i,
  /bit\.ly\//i,
  /tinyurl\.com/i,
  /\bfreegov\w*\./i,
  /\bgovindia\w*\./i,
  /\bpmkisan\w*\./i,
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
];

// Trusted Indian news domains
const TRUSTED_DOMAINS = [
  "ndtv.com", "thehindu.com", "hindustantimes.com", "timesofindia.com",
  "indianexpress.com", "bbc.com", "reuters.com", "pti.in",
  "pib.gov.in", "mohfw.gov.in", "rbi.org.in", "mygov.in",
  "ani.in", "theprint.in", "scroll.in", "thewire.in",
  "altnews.in", "boomlive.in",
];

// Excessive capitalization / punctuation pattern
const CAPS_PATTERN = /[A-Z]{3,}/g;
const EXCLAMATION_PATTERN = /!{2,}/g;
const QUESTION_PATTERN = /\?{2,}/g;

function countMatches(text: string, patterns: string[]): number {
  const lower = text.toLowerCase();
  return patterns.filter((p) => lower.includes(p.toLowerCase())).length;
}

function detectLanguage(text: string): "hindi" | "english" | "mixed" {
  const hindiChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  const total = text.length;
  if (hindiChars / total > 0.4) return "hindi";
  if (hindiChars / total > 0.1) return "mixed";
  return "english";
}

export function runHeuristics(text: string): HeuristicResult {
  const flags: string[] = [];
  const details: Record<string, number> = {};
  let totalScore = 0;

  // 1. Emotional language check (0-25 pts)
  const emotionalMatches = countMatches(text, EMOTIONAL_KEYWORDS);
  const emotionalScore = Math.min(emotionalMatches * 7, 25);
  details.emotional = emotionalScore;
  totalScore += emotionalScore;
  if (emotionalMatches >= 2) {
    flags.push("High emotional language detected");
  } else if (emotionalMatches === 1) {
    flags.push("Emotional language detected");
  }

  // 2. Scam patterns (0-30 pts)
  const scamMatches = countMatches(text, SCAM_PATTERNS);
  const scamScore = Math.min(scamMatches * 10, 30);
  details.scam = scamScore;
  totalScore += scamScore;
  if (scamMatches >= 2) {
    flags.push("Multiple known scam patterns found");
  } else if (scamMatches === 1) {
    flags.push("Known scam pattern detected");
  }

  // 3. Clickbait phrases (0-15 pts)
  const clickbaitMatches = countMatches(text, CLICKBAIT_PHRASES);
  const clickbaitScore = Math.min(clickbaitMatches * 8, 15);
  details.clickbait = clickbaitScore;
  totalScore += clickbaitScore;
  if (clickbaitMatches > 0) {
    flags.push("Clickbait phrases detected");
  }

  // 4. Fake authority markers (0-20 pts)
  const authorityMatches = countMatches(text, FAKE_AUTHORITY_MARKERS);
  const authorityScore = Math.min(authorityMatches * 10, 20);
  details.fakeAuthority = authorityScore;
  totalScore += authorityScore;
  if (authorityMatches > 0) {
    flags.push("Unverified authority claims detected");
  }

  // 5. URL analysis (0-20 pts)
  const urlMatches = text.match(/https?:\/\/[^\s]+/gi) || [];
  const textLower = text.toLowerCase();
  let urlScore = 0;
  let hasTrustedSource = false;
  let hasSuspiciousUrl = false;

  for (const url of urlMatches) {
    const lowerUrl = url.toLowerCase();
    if (TRUSTED_DOMAINS.some((d) => lowerUrl.includes(d))) {
      hasTrustedSource = true;
    }
    if (SUSPICIOUS_URL_PATTERNS.some((p) => p.test(url))) {
      hasSuspiciousUrl = true;
      urlScore += 10;
    }
  }

  // Also check for bare domain mentions (without http://) e.g. "rbi.org.in"
  if (!hasTrustedSource) {
    hasTrustedSource = TRUSTED_DOMAINS.some((d) => textLower.includes(d));
  }

  // Check for suspicious patterns (bit.ly, tinyurl) in bare text too
  if (!hasSuspiciousUrl) {
    hasSuspiciousUrl = SUSPICIOUS_URL_PATTERNS.some((p) => p.test(text));
    if (hasSuspiciousUrl) urlScore += 10;
  }

  if (hasTrustedSource) {
    urlScore = Math.max(urlScore - 15, 0);
    flags.push("Contains trusted source reference");
  } else if (urlMatches.length === 0 && !hasSuspiciousUrl) {
    urlScore += 5;
    flags.push("No verifiable source provided");
  }

  if (hasSuspiciousUrl) {
    flags.push("Suspicious or shortened URL detected");
  }

  urlScore = Math.min(urlScore, 20);
  details.url = urlScore;
  totalScore += urlScore;

  // 6. Excessive caps / punctuation (0-10 pts)
  const capsMatches = (text.match(CAPS_PATTERN) || []).length;
  const exclMatches = (text.match(EXCLAMATION_PATTERN) || []).length;
  const questMatches = (text.match(QUESTION_PATTERN) || []).length;
  const formattingScore = Math.min((capsMatches + exclMatches + questMatches) * 2, 10);
  details.formatting = formattingScore;
  totalScore += formattingScore;
  if (formattingScore >= 4) {
    flags.push("Excessive use of capitals or punctuation");
  }

  // 7. "Forward" chain indicators (0-10 pts)
  const forwardIndicators = [
    "forwarded", "forward this", "please share", "share with all",
    "पोस्ट शेयर", "सभी को भेजें", "फॉरवर्ड",
  ];
  const forwardMatches = countMatches(text, forwardIndicators);
  const forwardScore = Math.min(forwardMatches * 5, 10);
  details.forward = forwardScore;
  totalScore += forwardScore;
  if (forwardMatches > 0) {
    flags.push("Suspicious WhatsApp forward format");
  }

  // 8. Length-based suspicion: very short content (0-5 pts)
  if (text.trim().length < 100) {
    details.length = 3;
    totalScore += 3;
    flags.push("Very short content — difficult to verify");
  } else {
    details.length = 0;
  }

  // Normalize score to 0-100
  const normalizedScore = Math.min(Math.round(totalScore), 100);

  return {
    score: normalizedScore,
    flags,
    details,
  };
}

export function detectLanguage2(text: string) {
  return detectLanguage(text);
}
