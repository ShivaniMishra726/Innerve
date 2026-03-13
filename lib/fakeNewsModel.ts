// TruthGuard Fake News Detection Model (v2)
// ML-inspired multi-layer classifier using:
//   1. Feature extraction (emotionality, sensationalism, urgency, authority misuse, credibility)
//   2. Category classification (scam, health_misinfo, election_misinfo, viral_hoax, credible)
//   3. Composite fake-likelihood score

export type ContentCategory =
  | "scam"
  | "health_misinfo"
  | "election_misinfo"
  | "viral_hoax"
  | "credible";

export interface ModelFeatures {
  emotionality: number;      // 0-100
  sensationalism: number;    // 0-100
  urgencySignals: number;    // 0-100
  authorityMisuse: number;   // 0-100
  credibilitySignals: number;// 0-100 (higher = more credible signals)
}

export interface ModelPrediction {
  category: ContentCategory;
  categoryLabel: string;
  modelScore: number;        // 0-100 (higher = more likely fake)
  confidence: number;        // 0-100
  categoryScores: Record<ContentCategory, number>;
  features: ModelFeatures;
}

// ---- Category classifiers: keyword → weight --------------------------------

type Classifier = { keywords: string[]; weight: number };

const CATEGORY_CLASSIFIERS: Record<ContentCategory, Classifier[]> = {
  scam: [
    {
      keywords: [
        "free recharge", "free data", "you have won", "congratulations you won",
        "lottery winner", "click to claim", "limited time offer", "act now",
        "today only", "apply now", "subsidy link", "pm kisan link",
        "free money", "government scheme apply", "claim your prize",
      ],
      weight: 15,
    },
    {
      keywords: [
        "kyc pending", "bank account blocked", "account deactivate",
        "verify aadhaar", "update kyc", "otp share",
        "rbi notification", "bank alert", "account suspended",
        "आधार कार्ड बंद", "खाता बंद होगा", "रिजर्व बैंक सूचना",
      ],
      weight: 12,
    },
    {
      keywords: [
        "bit.ly", "tinyurl.com", "forward to 10", "send this to",
        "share with 10", "pm modi announced free", "whatsapp gold",
        "whatsapp plus", "free internet hack", "मुफ्त recharge",
        "सरकारी योजना लिंक", "मुफ्त राशन लिंक",
      ],
      weight: 10,
    },
  ],
  health_misinfo: [
    {
      keywords: [
        "cure covid", "cure cancer", "cure diabetes instantly",
        "100% guaranteed cure", "miracle cure", "secret remedy",
        "doctors hate this", "big pharma hiding", "home remedy cure",
        "lemon kills virus", "instant cure", "permanent cure",
      ],
      weight: 15,
    },
    {
      keywords: [
        "kadha cures", "turmeric cures covid", "neem cures",
        "immunity boost guaranteed", "detox your body", "herbal cure guaranteed",
        "ayurvedic cure guaranteed", "drink this to cure",
        "vaccine dangerous secret", "vaccine microchip", "vaccine kills",
        "who hiding cure", "चमत्कारी इलाज",
      ],
      weight: 12,
    },
    {
      keywords: [
        "drink hot water cure", "sunlight kills virus", "garlic cure",
        "onion cure virus", "doctor friend told secret", "hospital hiding",
        "medical mafia", "natural cure suppressed",
      ],
      weight: 8,
    },
  ],
  election_misinfo: [
    {
      keywords: [
        "evm rigged", "evm hacked", "votes manipulated", "election rigged",
        "booth capturing", "ballot stuffing", "fake ballots", "election fraud",
        "election commission corrupt", "ec compromised", "votes stolen",
      ],
      weight: 15,
    },
    {
      keywords: [
        "exit poll rigged", "election results fake", "voting manipulated",
        "democracy destroyed", "party paid media", "government suppressing votes",
        "election authority bribed", "ballot box fraud",
        "चुनाव धांधली", "ईवीएम हैक",
      ],
      weight: 12,
    },
    {
      keywords: [
        "deep state election", "foreign interference election",
        "election commission hidden agenda", "voter roll manipulation",
        "fake voter id", "ghost voters",
      ],
      weight: 8,
    },
  ],
  viral_hoax: [
    {
      keywords: [
        "share before deleted", "government will delete this",
        "this will be removed soon", "forward this fast",
        "share with 10 people or", "viral truth",
        "they are hiding this", "mainstream media ignoring",
        "mainstream media won't show", "सरकार छुपा रही", "जरूर शेयर करें",
      ],
      weight: 12,
    },
    {
      keywords: [
        "shocking revelation", "truth finally out", "finally exposed",
        "whistleblower reveals", "nobody is talking about this",
        "you won't believe", "what they don't want you to know",
        "wake up sheeple", "open your eyes",
        "बड़ा खुलासा", "सच्चाई सामने",
      ],
      weight: 10,
    },
    {
      keywords: [
        "5g causes cancer", "5g covid link", "chemtrails poison",
        "flat earth proof", "moon landing fake", "illuminati control",
        "new world order", "bill gates microchip",
      ],
      weight: 14,
    },
  ],
  credible: [
    {
      keywords: [
        "pib.gov.in", "rbi.org.in", "mohfw.gov.in", "mygov.in", "eci.gov.in",
        "ndtv.com", "thehindu.com", "reuters.com", "bbc.com", "pti.in",
        "indianexpress.com", "hindustantimes.com", "timesofindia.com",
        "ani.in", "scroll.in", "thewire.in",
      ],
      weight: -18,
    },
    {
      keywords: [
        "official statement", "press conference", "government spokesperson",
        "ministry confirmed", "pib confirmed", "official spokesperson said",
        "according to official sources", "published study", "research shows",
        "peer-reviewed", "scientists confirmed",
      ],
      weight: -12,
    },
    {
      keywords: [
        "altnews verified", "boomlive fact check", "fact checked by",
        "verified by ec", "confirmed by rbi", "health ministry confirms",
        "who confirmed", "icmr study", "aiims doctors say",
      ],
      weight: -10,
    },
  ],
};

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  scam: "Financial / Government Scam",
  health_misinfo: "Health Misinformation",
  election_misinfo: "Election Misinformation",
  viral_hoax: "Viral Hoax / Conspiracy",
  credible: "Credible Content",
};

// ---- Feature extraction ----------------------------------------------------

const EMOTIONAL_WORDS = [
  "shocking", "outrage", "horrifying", "disgusting", "unbelievable",
  "incredible", "amazing", "must see", "can't believe", "breaking",
  "emergency", "danger", "catastrophe", "disaster", "scandal",
  "explosive", "bombshell", "devastating", "terrifying", "alarming",
  "खतरा", "बड़ी खबर", "आपातकाल", "चौंकाने वाला",
];

const URGENCY_WORDS = [
  "urgent", "immediately", "right now", "act fast", "limited time",
  "today only", "before it's too late", "share now", "forward immediately",
  "don't delay", "last chance", "expires soon", "deadline",
  "अभी शेयर", "तुरंत", "फौरन",
];

const AUTHORITY_MISUSE = [
  "pm modi announced free", "rbi has decided", "according to whatsapp",
  "doctor friend told", "government is hiding", "nasa hiding",
  "who hiding cure", "ministry of health said (unverified)",
  "supreme court secret order", "pm personally told",
  "secret government document", "leaked government file",
];

const TRUSTED_DOMAINS = [
  "ndtv.com", "thehindu.com", "reuters.com", "bbc.com", "pib.gov.in",
  "rbi.org.in", "mohfw.gov.in", "mygov.in", "eci.gov.in", "pti.in",
  "indianexpress.com", "hindustantimes.com", "timesofindia.com",
  "ani.in", "scroll.in", "thewire.in", "boomlive.in", "altnews.in",
];

const CAPS_RE = /[A-Z]{3,}/g;
const MULTI_EXCLAIM_RE = /!{2,}/g;
const MULTI_QUESTION_RE = /\?{2,}/g;

function countKeywords(lower: string, keywords: string[]): number {
  return keywords.filter((k) => lower.includes(k.toLowerCase())).length;
}

function extractFeatures(text: string): ModelFeatures {
  const lower = text.toLowerCase();

  // Emotionality (0-100)
  const emoCount = countKeywords(lower, EMOTIONAL_WORDS);
  const emotionality = Math.min(emoCount * 14, 100);

  // Sensationalism: CAPS + !! + ??
  const capsCount = (text.match(CAPS_RE) || []).length;
  const exclCount = (text.match(MULTI_EXCLAIM_RE) || []).length;
  const questCount = (text.match(MULTI_QUESTION_RE) || []).length;
  const sensationalism = Math.min(capsCount * 10 + exclCount * 8 + questCount * 5, 100);

  // Urgency signals (0-100)
  const urgencyCount = countKeywords(lower, URGENCY_WORDS);
  const urgencySignals = Math.min(urgencyCount * 18, 100);

  // Authority misuse (0-100)
  const authCount = countKeywords(lower, AUTHORITY_MISUSE);
  const authorityMisuse = Math.min(authCount * 25, 100);

  // Credibility signals — trusted domains (0-100)
  const hasTrustedDomain = TRUSTED_DOMAINS.some((d) => lower.includes(d));
  const credibilitySignals = hasTrustedDomain ? 80 : 0;

  return { emotionality, sensationalism, urgencySignals, authorityMisuse, credibilitySignals };
}

// Baseline credible score given before any fake signals are detected.
// This represents the "innocent until proven guilty" prior for unclassified content.
const BASELINE_CREDIBLE_SCORE = 50;

// When a fake-category signal fires, the credible score is penalised by half the
// classifier weight — enough to move credible below fake categories without zeroing it.
const CREDIBLE_PENALTY_FACTOR = 0.5;

// Minimum score any fake category must reach before overriding the credible verdict.
// Below this threshold the text is unlikely to be clearly fake.
const FAKE_CATEGORY_THRESHOLD = 10;

function classifyCategory(text: string): {
  category: ContentCategory;
  categoryScores: Record<ContentCategory, number>;
} {
  const lower = text.toLowerCase();

  const scores: Record<ContentCategory, number> = {
    scam: 0,
    health_misinfo: 0,
    election_misinfo: 0,
    viral_hoax: 0,
    credible: BASELINE_CREDIBLE_SCORE,
  };

  for (const [category, classifiers] of Object.entries(CATEGORY_CLASSIFIERS)) {
    for (const clf of classifiers) {
      for (const kw of clf.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          scores[category as ContentCategory] = Math.max(
            0,
            Math.min(100, scores[category as ContentCategory] + clf.weight)
          );
          // Reduce credible score when fake signals are found
          if (category !== "credible") {
            scores.credible = Math.max(0, scores.credible - clf.weight * CREDIBLE_PENALTY_FACTOR);
          }
        }
      }
    }
  }

  // Determine winning category
  const fakeCategories: ContentCategory[] = [
    "scam",
    "health_misinfo",
    "election_misinfo",
    "viral_hoax",
  ];

  let bestFakeCategory: ContentCategory = "viral_hoax";
  let bestFakeScore = 0;

  for (const cat of fakeCategories) {
    if (scores[cat] > bestFakeScore) {
      bestFakeScore = scores[cat];
      bestFakeCategory = cat;
    }
  }

  const category: ContentCategory =
    bestFakeScore >= FAKE_CATEGORY_THRESHOLD ? bestFakeCategory : "credible";

  return { category, categoryScores: scores };
}

// ---- Main model entry point ------------------------------------------------

export function runFakeNewsModel(text: string): ModelPrediction {
  const features = extractFeatures(text);
  const { category, categoryScores } = classifyCategory(text);

  // Composite fake-likelihood score from features
  const featureScore =
    features.emotionality * 0.2 +
    features.sensationalism * 0.2 +
    features.urgencySignals * 0.25 +
    features.authorityMisuse * 0.2 +
    (100 - features.credibilitySignals) * 0.15;

  // Category contribution
  const fakeCategories: ContentCategory[] = [
    "scam",
    "health_misinfo",
    "election_misinfo",
    "viral_hoax",
  ];
  const maxCatScore = Math.max(...fakeCategories.map((c) => categoryScores[c]));

  // Weighted composite score
  const rawScore = featureScore * 0.55 + maxCatScore * 0.45;
  const modelScore = Math.min(Math.round(rawScore), 100);

  // Confidence calibration
  const confidence = Math.min(35 + modelScore * 0.55, 95);

  return {
    category,
    categoryLabel: CATEGORY_LABELS[category],
    modelScore,
    confidence,
    categoryScores,
    features,
  };
}
