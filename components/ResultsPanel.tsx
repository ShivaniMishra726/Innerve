"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import confetti from "canvas-confetti";

type Verdict = "credible" | "suspicious" | "misinfo";

interface ScanResult {
  score: number;
  riskScore: number;
  verdict: Verdict;
  flags: string[];
  explanation: string;
  language: string;
  confidence: number;
  educationTips: string[];
}

interface ResultsPanelProps {
  result: ScanResult;
  onReset: () => void;
}

const VERDICT_CONFIG = {
  credible: {
    label: "Credible",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-emerald-600",
    badge: "bg-emerald-500",
    scoreColor: "text-emerald-600",
    emoji: "✅",
  },
  suspicious: {
    label: "Suspicious",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    gradientFrom: "from-amber-400",
    gradientTo: "to-amber-600",
    badge: "bg-amber-500",
    scoreColor: "text-amber-600",
    emoji: "⚠️",
  },
  misinfo: {
    label: "Likely Misinformation",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    gradientFrom: "from-red-400",
    gradientTo: "to-red-600",
    badge: "bg-red-500",
    scoreColor: "text-red-600",
    emoji: "🚫",
  },
};

export default function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  const config = VERDICT_CONFIG[result.verdict];
  const VerdictIcon = config.icon;
  const confettiFired = useRef(false);

  useEffect(() => {
    if (result.verdict === "credible" && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FF7722", "#1E3A8A", "#10B981", "#FFF7ED"],
      });
    }
  }, [result.verdict]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Verdict Card */}
      <div
        className={`clay-card p-6 ${config.bgColor} border-2 ${config.borderColor}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`w-12 h-12 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <VerdictIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Verdict
              </p>
              <h2 className={`text-2xl font-extrabold ${config.color}`}>
                {config.emoji} {config.label}
              </h2>
            </div>
          </div>

          {/* Score circle */}
          <div className="text-center flex-shrink-0">
            <div
              className={`w-16 h-16 rounded-full bg-white shadow-inner border-4 ${config.borderColor} flex items-center justify-center`}
            >
              <span className={`text-xl font-black ${config.scoreColor}`}>
                {result.score}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Trust Score</p>
          </div>
        </div>

        {/* Confidence & Language */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <span>Confidence: <strong>{Math.round(result.confidence)}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <span>🌐</span>
            <span>
              Language:{" "}
              <strong className="capitalize">
                {result.language === "mixed" ? "Hindi/English" : result.language}
              </strong>
            </span>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Risk Level</span>
            <span>{result.riskScore}/100</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.riskScore}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className={`h-full rounded-full bg-gradient-to-r ${
                result.verdict === "credible"
                  ? "from-emerald-400 to-emerald-500"
                  : result.verdict === "suspicious"
                  ? "from-amber-400 to-amber-500"
                  : "from-red-400 to-red-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="clay-card p-5">
        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          Analysis
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{result.explanation}</p>
      </div>

      {/* Red Flags */}
      {result.flags.length > 0 && (
        <div className="clay-card p-5">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Red Flags Detected ({result.flags.length})
          </h3>
          <ul className="space-y-2">
            {result.flags.map((flag, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="mt-0.5 text-red-400 font-bold">•</span>
                {flag}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Education Tips */}
      {result.educationTips.length > 0 && (
        <div className="clay-card p-5 bg-blue-50 border-2 border-blue-100">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            Tips to Spot Fake News
          </h3>
          <ul className="space-y-2.5">
            {result.educationTips.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-2 text-sm text-blue-700"
              >
                <span className="mt-0.5 text-blue-400">💡</span>
                {tip}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Reset button */}
      <motion.button
        onClick={onReset}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-orange-300 hover:text-orange-600 transition-all duration-200 shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Scan Another Message
      </motion.button>
    </motion.div>
  );
}
