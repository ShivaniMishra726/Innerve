"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-extrabold text-xl text-gray-900 tracking-tight">
              Truth<span className="text-orange-500">Guard</span>
            </span>
            <p className="text-[10px] text-gray-500 -mt-1 hidden sm:block">
              AI Misinformation Detector
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <a
            href="#quiz"
            className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors hidden sm:block"
          >
            Quiz
          </a>
          <a
            href="#verify"
            className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors hidden sm:block"
          >
            Verify
          </a>
          <a
            href="#scanner"
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Scan Now
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
