"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowDown,
  Search,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Scanner from "@/components/Scanner";
import ResultsPanel from "@/components/ResultsPanel";
import EducationPanel from "@/components/EducationPanel";
import QuizCard from "@/components/QuizCard";
import TruthBadge from "@/components/TruthBadge";

import type { ModelPrediction } from "@/lib/fakeNewsModel";

interface ScanResult {
  score: number;
  riskScore: number;
  verdict: "credible" | "suspicious" | "misinfo";
  flags: string[];
  explanation: string;
  language: string;
  confidence: number;
  educationTips: string[];
  modelPrediction: ModelPrediction;
}

export default function HomePage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScanComplete = (result: object) => {
    setScanResult(result as ScanResult);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setScanResult(null);
    document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pb-8">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center pt-10 pb-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2rem] flex items-center justify-center shadow-[0_8px_32px_rgba(255,119,34,0.35)]">
              <Shield className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
            Stop Fake News in India —{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Scan Before You Share
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto mb-6 leading-relaxed">
            AI-powered misinformation detection for WhatsApp forwards, viral
            messages, and suspicious news.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { icon: "🛡️", label: "100% Private" },
              { icon: "⚡", label: "Instant Results" },
              { icon: "🇮🇳", label: "Built for India" },
              { icon: "🤖", label: "AI Powered" },
            ].map((badge) => (
              <span
                key={badge.label}
                className="px-3 py-1.5 bg-white rounded-2xl text-sm font-medium text-gray-700 shadow-sm border border-gray-100"
              >
                {badge.icon} {badge.label}
              </span>
            ))}
          </div>

          <a
            href="#scanner"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" />
            Scroll to scan
          </a>
        </motion.section>

        {!scanResult ? (
          <Scanner onScanComplete={handleScanComplete} />
        ) : (
          <div id="results" className="space-y-4">
            <ResultsPanel result={scanResult} onReset={handleReset} />
            <TruthBadge verdict={scanResult.verdict} score={scanResult.score} />
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <EducationPanel />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <QuizCard />
        </motion.section>

        <motion.section
          id="verify"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <div className="clay-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">Verify Tools</h2>
                <p className="text-sm text-gray-500">Quick fact-checking resources</p>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Reverse Image Search
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    name: "Google Lens",
                    url: "https://images.google.com",
                    icon: "🔍",
                    color: "from-blue-400 to-blue-500",
                  },
                  {
                    name: "TinEye",
                    url: "https://tineye.com",
                    icon: "👁️",
                    color: "from-purple-400 to-purple-500",
                  },
                ].map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-3 bg-gradient-to-r ${tool.color} text-white rounded-2xl text-sm font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95`}
                  >
                    <span className="text-lg">{tool.icon}</span>
                    {tool.name}
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Indian Fact-Checkers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    name: "AltNews",
                    url: "https://www.altnews.in",
                    desc: "Independent fact-checking",
                    icon: "📰",
                  },
                  {
                    name: "BoomLive",
                    url: "https://www.boomlive.in",
                    desc: "Digital misinformation",
                    icon: "💥",
                  },
                  {
                    name: "PIB Fact Check",
                    url: "https://pib.gov.in/factcheck.aspx",
                    desc: "Government official",
                    icon: "🏛️",
                  },
                  {
                    name: "Vishvas News",
                    url: "https://www.vishvasnews.com",
                    desc: "Hindi fact-checking",
                    icon: "🇮🇳",
                  },
                ].map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group"
                  >
                    <span className="text-2xl">{resource.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-800 group-hover:text-orange-600">
                        {resource.name} ↗
                      </p>
                      <p className="text-xs text-gray-500">{resource.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4 clay-card p-6 bg-gradient-to-br from-blue-900 to-blue-950 text-white text-center"
        >
          <div className="text-4xl mb-3">🇮🇳</div>
          <h3 className="text-xl font-bold mb-2">
            TruthGuard empowers 1B Indians
          </h3>
          <p className="text-blue-200 text-sm leading-relaxed">
            to fight digital misinformation, one fact-check at a time.
          </p>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
