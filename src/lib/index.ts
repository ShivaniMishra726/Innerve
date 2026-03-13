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
