"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      {/* Scanning animation */}
      <div className="relative w-24 h-24">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-orange-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            borderTopColor: "#FF7722",
            borderRightColor: "#FF9955",
          }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-3 rounded-full border-4 border-blue-100"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            borderTopColor: "#1E3A8A",
            borderLeftColor: "#3B5FC0",
          }}
        />
        {/* Shield icon center */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Shield className="w-8 h-8 text-orange-500" />
        </motion.div>
      </div>

      {/* Scanning text */}
      <div className="text-center">
        <motion.p
          className="font-semibold text-gray-700 text-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          Scanning for Truth...
        </motion.p>
        <div className="flex items-center gap-2 mt-3 justify-center">
          {["Analyzing language", "Checking patterns", "Computing score"].map(
            (step, i) => (
              <motion.div
                key={step}
                className="flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.6, duration: 0.4 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-orange-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
                <span className="text-xs text-gray-500 hidden sm:block">{step}</span>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-400 to-blue-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
