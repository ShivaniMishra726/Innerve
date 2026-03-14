// Barrel export — import any lib util from "@/lib"
export { scanContent } from "./misinfoEngine";
export type { ScanResult, Verdict } from "./misinfoEngine";

export { runHeuristics, detectLanguage2 } from "./heuristics";
export type { HeuristicResult } from "./heuristics";

export { runFakeNewsModel } from "./fakeNewsModel";
export type {
  ModelPrediction,
  ModelFeatures,
  ContentCategory,
} from "./fakeNewsModel";

export { runCloudAnalysis } from "./cloudAnalysis";
export type { CloudAnalysisResult, FactCheck } from "./cloudAnalysis";

export {
  DUMMY_SCAN_EXAMPLES,
  FAKE_EXAMPLES,
  CREDIBLE_EXAMPLES,
  EDUCATION_TIPS,
  QUIZ_QUESTIONS,
} from "./dummyData";
export type { DummyScanExample, EducationTip, QuizQuestion } from "./dummyData";

export {
  scrubPII,
  scoreToVerdict,
  verdictToColor,
  verdictToBg,
  buildWhatsAppShareUrl,
  wordCount,
  truncate,
  clamp,
  formatScore,
  REDACTED_TOKEN,
} from "./utils";
