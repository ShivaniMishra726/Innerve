"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "Government Scam",
    emoji: "🏛️",
    message:
      "PM Modi has announced FREE ₹10,000 cash for all Aadhaar holders! Apply before Dec 31! Click: bit.ly/pmgift2024. Share with all family members to get this limited government subsidy!",
    options: [
      "Credible — Official government announcement",
      "Suspicious — Needs verification",
      "Fake — This is a scam",
      "Not sure",
    ],
    correctAnswer: 2,
    explanation:
      "🚫 This is a known scam pattern! Real government schemes are announced at official .gov.in websites, not via WhatsApp. The shortened URL (bit.ly) and urgency are classic scam red flags.",
    color: "from-red-400 to-red-600",
  },
  {
    id: 2,
    category: "Health Misinformation",
    emoji: "💊",
    message:
      "BREAKING: Boiling neem leaves and drinking the water every morning for 7 days will completely cure COVID-19! Doctors confirmed this. Share immediately before they ban this cure!",
    options: [
      "True — Natural remedies work",
      "Suspicious — No scientific proof",
      "Completely False — Dangerous misinformation",
      "Need more information",
    ],
    correctAnswer: 2,
    explanation:
      "🚫 This is dangerous health misinformation! No plant-based remedy has been proven to cure COVID-19. The WHO and MOHFW have not endorsed any such cure. Such messages can lead people to delay proper medical treatment.",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: 3,
    category: "Election Rumor",
    emoji: "🗳️",
    message:
      "NDTV reports that the Election Commission of India has postponed voting in 5 states due to security concerns. Check NDTV.com for full details.",
    options: [
      "Fake — ECI would not do this",
      "Credible — NDTV is a trusted source",
      "Suspicious — Verify at ECI website",
      "Cannot determine",
    ],
    correctAnswer: 2,
    explanation:
      "⚠️ This requires verification! While NDTV is a credible source, always verify election news directly at eci.gov.in. Election misinformation peaks near polls — check the official source.",
    color: "from-amber-400 to-amber-600",
  },
];

export default function QuizCard() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[currentQ];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    if (index === question.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="clay-card p-6 sm:p-8 text-center"
      >
        <div className="text-6xl mb-4">
          {score === 3 ? "🏆" : score === 2 ? "🥈" : "📚"}
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
          {score === 3
            ? "Perfect Score!"
            : score === 2
            ? "Great Job!"
            : "Keep Learning!"}
        </h3>
        <p className="text-gray-600 mb-2">
          You scored <strong className="text-orange-500">{score}/{QUIZ_QUESTIONS.length}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {score === 3
            ? "You're an expert at spotting misinformation! Share TruthGuard with others."
            : "Keep practicing — recognizing fake news protects you and your loved ones."}
        </p>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  const answeredCount = currentQ + (selected !== null ? 1 : 0);
  const progressPct = (answeredCount / QUIZ_QUESTIONS.length) * 100;

  return (
    <motion.div
      id="quiz"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="clay-card p-6 sm:p-8"
    >
      {/* Header */}
      <>
        <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">Spot the Fake</h2>
                <p className="text-sm text-gray-500">
                  Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-500">Score</p>
                <p className="font-bold text-orange-500 text-lg">{score}/{answeredCount}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="h-2 bg-gray-100 rounded-full mb-5">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{question.emoji}</span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${question.color}`}
            >
              {question.category}
            </span>
          </div>

          {/* Message */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed italic">
              &quot;{question.message}&quot;
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5 mb-4">
            {question.options.map((option, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.correctAnswer;
              const showResult = selected !== null;

              let optionClass =
                "w-full text-left p-3 rounded-2xl border-2 text-sm font-medium transition-all duration-200 ";
              if (!showResult) {
                optionClass +=
                  "border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700";
              } else if (isCorrect) {
                optionClass +=
                  "border-emerald-400 bg-emerald-50 text-emerald-700";
              } else if (isSelected && !isCorrect) {
                optionClass += "border-red-400 bg-red-50 text-red-700";
              } else {
                optionClass += "border-gray-200 text-gray-400 opacity-60";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={optionClass}
                >
                  <div className="flex items-center gap-2">
                    {showResult && isCorrect && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    {(!showResult || (!isCorrect && !isSelected)) && (
                      <span className="w-4 h-4 rounded-full border-2 border-current flex-shrink-0 inline-block" />
                    )}
                    {option}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-200"
              >
                <p className="text-sm text-blue-800 leading-relaxed">
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {selected !== null && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              {currentQ < QUIZ_QUESTIONS.length - 1 ? "Next Question →" : "See Results →"}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
