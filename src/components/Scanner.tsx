"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clipboard, ArrowRight, FlaskConical } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

type DemoCategory = "fake" | "credible";

const DEMO_SAMPLES: Record<DemoCategory, { label: string; emoji: string; text: string }[]> = {
  fake: [
    {
      label: "PM Subsidy Scam",
      emoji: "🏛️",
      text: "URGENT! PM Modi has announced FREE ₹5000 subsidy for all Indians! Share immediately before this is deleted! Click here to claim: bit.ly/pmsubsidy2024. Forward to 10 friends to get your money! Limited time offer — apply now! Government hiding this from mainstream media!",
    },
    {
      label: "COVID Health Hoax",
      emoji: "💊",
      text: "BREAKING: Doctors don't want you to know this! Drink kadha with tulsi, ginger and turmeric 3 times a day to cure COVID-19 in 24 hours! 100% guaranteed! A doctor friend told me this secret cure. WhatsApp message says this works! Share with all your family members before they delete this!",
    },
    {
      label: "Election Rumor",
      emoji: "🗳️",
      text: "SHOCKING: EVMs have been manipulated in upcoming elections! Government hiding the truth! A whistleblower has exposed how votes are being rigged. Mainstream media won't show you this. Share before it's banned! Wake up India! The truth about election fraud finally revealed!",
    },
    {
      label: "Fake Banking Alert",
      emoji: "🏦",
      text: "URGENT: Your bank account will be blocked in 24 hours! KYC pending! Click here immediately to verify your Aadhaar: bit.ly/bankkyc2024. RBI has announced mandatory verification. Act now or lose access to your account! Forward this to help your family members too!",
    },
    {
      label: "5G Conspiracy",
      emoji: "📡",
      text: "SHOCKING revelation! 5G towers are spreading COVID-19! Government hiding this from you! Scientists who exposed this are being silenced. Mainstream media won't show you this truth. Share this before it's deleted! Wake up — they don't want you to know! Forward to everyone immediately!",
    },
  ],
  credible: [
    {
      label: "RBI Rate Cut",
      emoji: "📊",
      text: "The Reserve Bank of India (RBI) cut the repo rate by 25 basis points to 6.25% on Wednesday, according to an official press statement published on rbi.org.in. The decision was unanimous by the Monetary Policy Committee. The RBI governor confirmed the move in a press conference.",
    },
    {
      label: "ISRO Launch",
      emoji: "🚀",
      text: "ISRO successfully launched the PSLV-C60 mission from Sriharikota on Sunday. The launch was confirmed by ISRO chairman Dr. S. Somanath at an official press conference. Full details and live coverage available at isro.gov.in and ndtv.com.",
    },
    {
      label: "PIB Health Advisory",
      emoji: "🏥",
      text: "The Ministry of Health and Family Welfare (MoHFW) has issued updated COVID-19 guidelines. Citizens are advised to follow official guidelines at mohfw.gov.in. The advisory was published on pib.gov.in and confirmed by the Health Secretary in a briefing.",
    },
  ],
};

interface ScannerProps {
  onScanComplete: (result: object) => void;
}

export default function Scanner({ onScanComplete }: ScannerProps) {
  const [text, setText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [demoTab, setDemoTab] = useState<DemoCategory>("fake");

  const handleScan = async () => {
    if (!text.trim() || text.trim().length < 10) {
      setError("Please enter at least 10 characters to scan.");
      return;
    }
    setError("");
    setIsScanning(true);

    // Add a minimum delay for UX (scanning animation)
    const [result] = await Promise.all([
      fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      }).then((r) => r.json()),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);

    setIsScanning(false);
    onScanComplete(result);
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
    } catch {
      setError("Could not access clipboard. Please paste manually.");
    }
  };

  const handleSample = (sampleText: string) => {
    setText(sampleText);
    setError("");
  };

  if (isScanning) {
    return (
      <div className="clay-card p-6 sm:p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      id="scanner"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="clay-card p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-900">Scan for Truth</h2>
          <p className="text-sm text-gray-500">Paste a suspicious message or news article</p>
        </div>
      </div>

      {/* Demo Input System */}
      <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50 p-3">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="w-3.5 h-3.5 text-gray-500" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Try Demo Examples
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 mb-3">
          <button
            onClick={() => setDemoTab("fake")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              demoTab === "fake"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-500"
            }`}
          >
            🚫 Fake Examples
          </button>
          <button
            onClick={() => setDemoTab("credible")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              demoTab === "credible"
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-500"
            }`}
          >
            ✅ Credible Examples
          </button>
        </div>

        {/* Sample buttons */}
        <div className="flex flex-wrap gap-2">
          {DEMO_SAMPLES[demoTab].map((sample) => (
            <button
              key={sample.label}
              onClick={() => handleSample(sample.text)}
              className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition-colors ${
                demoTab === "fake"
                  ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              {sample.emoji} {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          placeholder="Paste a WhatsApp message, news article, or suspicious claim here..."
          className="w-full h-40 p-4 text-sm text-gray-700 bg-orange-50/50 border-2 border-orange-100 rounded-2xl resize-none focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-400"
          aria-label="Text to scan for misinformation"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-xs text-gray-400">{text.length}/10000</span>
          <button
            onClick={handlePaste}
            className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
            title="Paste from clipboard"
            aria-label="Paste from clipboard"
          >
            <Clipboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}

      {/* Scan button */}
      <motion.button
        onClick={handleScan}
        disabled={!text.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-5 w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <Search className="w-5 h-5" />
        Scan for Truth
        <ArrowRight className="w-4 h-4" />
      </motion.button>

      <p className="mt-3 text-center text-xs text-gray-400">
        🔒 Your content is never stored. Analysis happens locally.
      </p>
    </motion.div>
  );
}

