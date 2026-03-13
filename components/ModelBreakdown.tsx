"use client";

import { motion } from "framer-motion";
import { Brain, Tag } from "lucide-react";
import type { ModelPrediction } from "@/lib/fakeNewsModel";

interface ModelBreakdownProps {
  prediction: ModelPrediction;
}

const FEATURE_LABELS: Record<string, string> = {
  emotionality: "Emotional Language",
  sensationalism: "Sensationalism",
  urgencySignals: "Urgency / Pressure",
  authorityMisuse: "Authority Misuse",
  credibilitySignals: "Credibility Signals",
};

const FEATURE_COLORS: Record<string, { bar: string; text: string }> = {
  emotionality:      { bar: "from-orange-400 to-orange-500", text: "text-orange-600" },
  sensationalism:    { bar: "from-red-400 to-red-500",    text: "text-red-600" },
  urgencySignals:    { bar: "from-amber-400 to-amber-500", text: "text-amber-600" },
  authorityMisuse:   { bar: "from-purple-400 to-purple-500", text: "text-purple-600" },
  credibilitySignals:{ bar: "from-emerald-400 to-emerald-500", text: "text-emerald-600" },
};

const CATEGORY_COLORS: Record<string, string> = {
  scam:             "bg-red-100 text-red-700 border-red-200",
  health_misinfo:   "bg-purple-100 text-purple-700 border-purple-200",
  election_misinfo: "bg-amber-100 text-amber-700 border-amber-200",
  viral_hoax:       "bg-orange-100 text-orange-700 border-orange-200",
  credible:         "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const CATEGORY_EMOJI: Record<string, string> = {
  scam:             "🎣",
  health_misinfo:   "💊",
  election_misinfo: "🗳️",
  viral_hoax:       "🦠",
  credible:         "✅",
};

export default function ModelBreakdown({ prediction }: ModelBreakdownProps) {
  const features = prediction.features;

  return (
    <div className="clay-card p-5">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Brain className="w-4 h-4 text-orange-500" />
        AI Model Analysis
      </h3>

      {/* Category Badge */}
      <div className="flex items-center gap-2 mb-5">
        <Tag className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Detected Category:</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[prediction.category]}`}
        >
          {CATEGORY_EMOJI[prediction.category]} {prediction.categoryLabel}
        </span>
      </div>

      {/* Model Score */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Fake-Likelihood Score</span>
          <span className="font-semibold">{prediction.modelScore}/100</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.modelScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${
              prediction.modelScore >= 60
                ? "from-red-400 to-red-600"
                : prediction.modelScore >= 30
                ? "from-amber-400 to-amber-500"
                : "from-emerald-400 to-emerald-500"
            }`}
          />
        </div>
      </div>

      {/* Feature Breakdown */}
      <div className="space-y-3">
        {Object.entries(features).map(([key, value], i) => {
          const label = FEATURE_LABELS[key] || key;
          const colors = FEATURE_COLORS[key] || { bar: "from-gray-300 to-gray-400", text: "text-gray-600" };
          const barColor =
            key === "credibilitySignals"
              ? "from-emerald-400 to-emerald-500"
              : colors.bar;

          return (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{label}</span>
                <span className={`font-medium ${colors.text}`}>{value}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 * i }}
                  className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        🤖 Feature scores computed by TruthGuard ML model v2
      </p>
    </div>
  );
}
