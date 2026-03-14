"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { EDUCATION_TIPS } from "@/lib/dummyData";

/**
 * EducationPanel — Inline misinformation awareness carousel.
 * Displays one tip at a time with left/right navigation.
 * Uses Claymorphism styling consistent with the rest of TruthGuard.
 */
export default function EducationPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const tip = EDUCATION_TIPS[currentIndex];

  const SLIDE_DISTANCE = 60;

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((i) => (i - 1 + EDUCATION_TIPS.length) % EDUCATION_TIPS.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((i) => (i + 1) % EDUCATION_TIPS.length);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? SLIDE_DISTANCE : -SLIDE_DISTANCE, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE, opacity: 0 }),
  };

  return (
    <div className="clay-card p-6" aria-label="Misinformation awareness tips">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">Fake News 101</h2>
            <p className="text-sm text-gray-500">
              Tip {currentIndex + 1} of {EDUCATION_TIPS.length}
            </p>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous tip"
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next tip"
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tip card with slide animation */}
      <div className="overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={tip.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="bg-blue-50 rounded-2xl p-5 border border-blue-100"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 flex-shrink-0 bg-gradient-to-br ${tip.color} rounded-2xl flex items-center justify-center shadow-md text-xl`}
                aria-hidden="true"
              >
                {tip.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
                {tip.source && (
                  <p className="mt-2 text-xs text-blue-500 font-medium">
                    Source: {tip.source}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Tip indicators">
        {EDUCATION_TIPS.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Tip ${i + 1}: ${t.title}`}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              i === currentIndex
                ? "bg-blue-500 w-5"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
