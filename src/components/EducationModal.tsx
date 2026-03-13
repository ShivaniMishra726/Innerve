"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, ChevronRight, ChevronLeft } from "lucide-react";

const TIPS = [
  {
    title: "Check Official Sources",
    icon: "🏛️",
    content:
      "Verify claims at pib.gov.in (PIB Fact Check), mohfw.gov.in for health, and rbi.org.in for banking news. Government schemes are never announced via WhatsApp forwards.",
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "Look for Emotional Manipulation",
    icon: "🧠",
    content:
      "Misinformation often uses fear, urgency, or outrage. If a message says 'Share immediately' or 'They don't want you to know this', be very skeptical.",
    color: "from-purple-400 to-purple-600",
  },
  {
    title: "Reverse Image Search",
    icon: "🔍",
    content:
      "Fake news often uses old or unrelated images. Right-click any image and 'Search image on Google' or use images.google.com to verify its original source.",
    color: "from-orange-400 to-orange-600",
  },
  {
    title: "Check Multiple Sources",
    icon: "📰",
    content:
      "Real news is reported by multiple credible outlets. If only one obscure website or a WhatsApp forward is the source, be very cautious about sharing.",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    title: "Verify Before Forwarding",
    icon: "📲",
    content:
      "The WhatsApp 'Forwarded many times' label is a warning sign. Use Boom (7700906588) or AltNews.in to verify before forwarding any suspicious message.",
    color: "from-red-400 to-red-600",
  },
];

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EducationModal({ isOpen, onClose }: EducationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () =>
    setCurrentIndex((i) => (i - 1 + TIPS.length) % TIPS.length);
  const handleNext = () =>
    setCurrentIndex((i) => (i + 1) % TIPS.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-xl hover:bg-gray-100"
              aria-label="Close education tips"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">Fake News 101</h2>
                <p className="text-sm text-gray-500">
                  {currentIndex + 1} of {TIPS.length}
                </p>
              </div>
            </div>

            {/* Tip card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="mb-6"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${TIPS[currentIndex].color} rounded-3xl flex items-center justify-center mb-4 shadow-lg text-3xl`}
                >
                  {TIPS[currentIndex].icon}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {TIPS[currentIndex].title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {TIPS[currentIndex].content}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mb-5">
              {TIPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-orange-500 w-6"
                      : "bg-gray-200"
                  }`}
                  aria-label={`Go to tip ${i + 1}`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-600 rounded-2xl hover:border-orange-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
