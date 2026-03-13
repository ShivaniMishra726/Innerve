"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, MessageCircle, Share2 } from "lucide-react";

type Verdict = "credible" | "suspicious" | "misinfo";

interface TruthBadgeProps {
  verdict: Verdict;
  score: number;
}

const BADGE_CONFIG = {
  credible: {
    label: "CREDIBLE",
    emoji: "✅",
    bgColor: "#10B981",
    textColor: "#FFFFFF",
    subColor: "#D1FAE5",
    message: "This content appears credible",
  },
  suspicious: {
    label: "SUSPICIOUS",
    emoji: "⚠️",
    bgColor: "#F59E0B",
    textColor: "#FFFFFF",
    subColor: "#FEF3C7",
    message: "Verify before sharing",
  },
  misinfo: {
    label: "LIKELY FAKE",
    emoji: "🚫",
    bgColor: "#EF4444",
    textColor: "#FFFFFF",
    subColor: "#FEE2E2",
    message: "Do NOT share this",
  },
};

export default function TruthBadge({ verdict, score }: TruthBadgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");
  const config = BADGE_CONFIG[verdict];

  const generateBadge = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 400;
    const H = 220;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = config.bgColor;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 20);
    ctx.fill();

    // Subtle pattern overlay
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * W,
        Math.random() * H,
        Math.random() * 60 + 20,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // TruthGuard branding strip
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.roundRect(0, H - 44, W, 44, [0, 0, 20, 20]);
    ctx.fill();

    // Shield emoji (large)
    ctx.font = "52px serif";
    ctx.textAlign = "left";
    ctx.fillText("🛡️", 20, 70);

    // Verdict emoji
    ctx.font = "36px serif";
    ctx.fillText(config.emoji, W - 70, 60);

    // Main verdict text
    ctx.fillStyle = config.textColor;
    ctx.font = "bold 36px Inter, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(config.label, 90, 55);

    // Message
    ctx.font = "16px Inter, Arial, sans-serif";
    ctx.globalAlpha = 0.9;
    ctx.fillText(config.message, 90, 80);
    ctx.globalAlpha = 1;

    // Score
    ctx.font = "bold 52px Inter, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${score}`, 26, 150);

    ctx.font = "14px Inter, Arial, sans-serif";
    ctx.globalAlpha = 0.8;
    ctx.fillText("TRUST SCORE", 26, 172);
    ctx.globalAlpha = 1;

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(100, 180);
    ctx.stroke();

    // AI verified text
    ctx.font = "13px Inter, Arial, sans-serif";
    ctx.fillStyle = config.textColor;
    ctx.textAlign = "left";
    ctx.globalAlpha = 0.85;
    ctx.fillText("🤖 AI-verified by TruthGuard", 115, 130);
    ctx.fillText("🇮🇳 Protecting India from Fake News", 115, 152);
    ctx.fillText("🔗 Share responsibly", 115, 174);
    ctx.globalAlpha = 1;

    // Bottom branding
    ctx.fillStyle = config.textColor;
    ctx.font = "bold 14px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TruthGuard — truthguard.vercel.app", W / 2, H - 15);

    setDataUrl(canvas.toDataURL("image/png"));
  };

  useEffect(() => {
    generateBadge();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verdict, score]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `truthguard-${verdict}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleWhatsApp = () => {
    const text = `I verified this with TruthGuard AI 🛡️\n\nVerdict: ${config.label} ${config.emoji}\nTrust Score: ${score}/100\n${config.message}\n\nVerify your news at: https://truthguard.vercel.app`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "TruthGuard Verification",
          text: `Verdict: ${config.label} (Trust Score: ${score}/100). Verified by TruthGuard AI.`,
          url: "https://truthguard.vercel.app",
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleWhatsApp();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="clay-card p-5"
    >
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-orange-500" />
        Share Your Verdict
      </h3>

      {/* Preview canvas */}
      <div className="relative rounded-2xl overflow-hidden mb-4 shadow-md">
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ display: "block" }}
          aria-label="Truth Badge preview"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleWhatsApp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl shadow-md transition-all text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </motion.button>
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md transition-all text-sm"
        >
          <Share2 className="w-4 h-4" />
          Share
        </motion.button>
        <motion.button
          onClick={handleDownload}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all text-sm"
        >
          <Download className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
