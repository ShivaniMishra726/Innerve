// TruthGuard Dummy Data
// Pre-defined scan examples for demo and testing purposes.
// Categories: fake government scam, fake banking scheme, health misinfo, election rumor, WhatsApp chain.

export interface DummyScanExample {
  id: string;
  label: string;
  emoji: string;
  category: "scam" | "health_misinfo" | "election_misinfo" | "viral_hoax" | "credible";
  text: string;
  expectedVerdict: "misinfo" | "suspicious" | "credible";
}

export const DUMMY_SCAN_EXAMPLES: DummyScanExample[] = [
  {
    id: "pm-subsidy-scam",
    label: "Fake PM Subsidy Scam",
    emoji: "🏛️",
    category: "scam",
    expectedVerdict: "misinfo",
    text: "URGENT! PM Modi has announced FREE ₹5000 subsidy for all Indians! Share immediately before this is deleted! Click here to claim: bit.ly/pmsubsidy2024. Forward to 10 friends to get your money! Limited time offer — apply now! Government hiding this from mainstream media!",
  },
  {
    id: "fake-rbi-scheme",
    label: "Fake RBI Scheme",
    emoji: "🏦",
    category: "scam",
    expectedVerdict: "misinfo",
    text: "URGENT: Your bank account will be blocked in 24 hours! KYC pending! Click here immediately to verify your Aadhaar: bit.ly/bankkyc2024. RBI has announced mandatory verification for all account holders. Act now or lose access to your account! Forward this to help your family members too!",
  },
  {
    id: "fake-covid-cure",
    label: "Fake COVID Cure",
    emoji: "💊",
    category: "health_misinfo",
    expectedVerdict: "misinfo",
    text: "BREAKING: Doctors don't want you to know this! Drink kadha with tulsi, ginger and turmeric 3 times a day to cure COVID-19 in 24 hours! 100% guaranteed! A doctor friend told me this secret cure. WhatsApp message says this works! Share with all your family members before they delete this!",
  },
  {
    id: "election-rumor",
    label: "Election Rumor",
    emoji: "🗳️",
    category: "election_misinfo",
    expectedVerdict: "misinfo",
    text: "SHOCKING: EVMs have been manipulated in upcoming elections! Government hiding the truth! A whistleblower has exposed how votes are being rigged. Mainstream media won't show you this. Share before it's banned! Wake up India! The truth about election fraud finally revealed!",
  },
  {
    id: "whatsapp-chain",
    label: "WhatsApp Chain Message",
    emoji: "📲",
    category: "viral_hoax",
    expectedVerdict: "misinfo",
    text: "⚠️ WARNING ⚠️ A dangerous new virus is spreading through WhatsApp messages! If you receive a message from an unknown number saying 'Hello, I am a friend', DO NOT open it! Your phone will be hacked in seconds! Forward this message to ALL your contacts to protect them! This is not a joke!",
  },
  {
    id: "credible-rbi-rate",
    label: "RBI Rate Decision",
    emoji: "📊",
    category: "credible",
    expectedVerdict: "credible",
    text: "The Reserve Bank of India (RBI) cut the repo rate by 25 basis points to 6.25% on Wednesday, according to an official press statement published on rbi.org.in. The decision was unanimous by the Monetary Policy Committee. The RBI governor confirmed the move in a press conference at RBI headquarters.",
  },
];

/** Get only fake/misinformation examples */
export const FAKE_EXAMPLES = DUMMY_SCAN_EXAMPLES.filter(
  (e) => e.expectedVerdict !== "credible"
);

/** Get only credible examples */
export const CREDIBLE_EXAMPLES = DUMMY_SCAN_EXAMPLES.filter(
  (e) => e.expectedVerdict === "credible"
);

/** Misinformation awareness education tips */
export interface EducationTip {
  id: string;
  title: string;
  icon: string;
  content: string;
  color: string;
  source?: string;
}

export const EDUCATION_TIPS: EducationTip[] = [
  {
    id: "check-official-sources",
    title: "Check Official Sources",
    icon: "🏛️",
    content:
      "Always verify claims at pib.gov.in (PIB Fact Check), mohfw.gov.in for health news, and rbi.org.in for banking information. Government schemes are never announced via WhatsApp forwards.",
    color: "from-blue-400 to-blue-600",
    source: "pib.gov.in",
  },
  {
    id: "avoid-emotional-forwards",
    title: "Avoid Forwarding Emotional Claims",
    icon: "🧠",
    content:
      "Misinformation often triggers fear, urgency, or outrage. If a message says 'Share immediately' or 'They don't want you to know this', pause and verify before forwarding.",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "reverse-image-search",
    title: "Use Reverse Image Search",
    icon: "🔍",
    content:
      "Fake news often uses old or unrelated images. Use Google Lens or images.google.com to reverse-search any suspicious image and find its original source.",
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "check-multiple-sources",
    title: "Check Multiple Sources",
    icon: "📰",
    content:
      "Real news is covered by multiple credible outlets like NDTV, The Hindu, or ANI. If only one obscure website or WhatsApp forward is the source, be very cautious.",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    id: "forwarded-warning",
    title: "Beware the 'Forwarded Many Times' Tag",
    icon: "📲",
    content:
      "WhatsApp's 'Forwarded many times' label is a warning sign. Use Boom helpline (7700906588) or AltNews.in to verify suspicious messages before sharing.",
    color: "from-red-400 to-red-600",
    source: "altnews.in",
  },
];

/** Quiz questions for 'Spot the Fake' section */
export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "fake-subsidy",
    text: "PM has announced FREE ₹5,000 for all Indians — share now before deleted!",
    category: "Fake Government Subsidy",
    options: ["Real — share with friends", "Fake — classic forwarding scam", "Partially true", "Need more info"],
    correctIndex: 1,
    explanation:
      "Government subsidies are announced through official channels like pib.gov.in and official news. No legitimate scheme asks you to 'share before deletion' or click unknown links.",
  },
  {
    id: "fake-covid-cure",
    text: "Doctors hide the truth: turmeric + ginger cures COVID in 24 hours!",
    category: "Fake Health Cure",
    options: ["True — home remedies work", "Fake — dangerous health misinfo", "Possibly true", "Research ongoing"],
    correctIndex: 1,
    explanation:
      "No home remedy cures COVID-19. Only WHO/ICMR approved treatments are valid. Claims that 'doctors are hiding' cures are a hallmark of health misinformation. Consult mohfw.gov.in.",
  },
  {
    id: "election-rumor",
    text: "BREAKING: EVMs hacked — whistleblower exposes election fraud! Share now!",
    category: "Election Rumor",
    options: ["True — major scandal", "Fake — election conspiracy rumor", "Under investigation", "Partially true"],
    correctIndex: 1,
    explanation:
      "EVM manipulation claims circulate before every election without credible evidence. Election Commission of India (eci.gov.in) and court-ordered audits confirm EVM integrity. Sensational 'whistleblower' claims without proof are typically false.",
  },
];
