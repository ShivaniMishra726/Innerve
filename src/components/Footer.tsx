"use client";

import { Shield, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-12 mt-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">
                Truth<span className="text-orange-400">Guard</span>
              </span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Empowering 1 billion Indians to fight digital misinformation.
            </p>
          </div>

          {/* Fact Check Resources */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-blue-300 mb-3">
              Fact Check Resources
            </h3>
            <ul className="space-y-2">
              {[
                { name: "AltNews", url: "https://www.altnews.in" },
                { name: "BoomLive", url: "https://www.boomlive.in" },
                { name: "FactCheck India", url: "https://factcheck.afp.com/afp-india" },
                { name: "PIB Fact Check", url: "https://pib.gov.in/factcheck.aspx" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-200 hover:text-orange-300 transition-colors"
                  >
                    {link.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Report Cybercrime */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-blue-300 mb-3">
              Report Misinformation
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Cybercrime Portal", url: "https://cybercrime.gov.in" },
                { name: "MHA Cyber Cell", url: "https://www.mha.gov.in" },
                { name: "Boom Helpline: 7700906588", url: "https://wa.me/917700906588" },
                { name: "PIB WhatsApp: 8799711259", url: "https://wa.me/918799711259" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-200 hover:text-orange-300 transition-colors"
                  >
                    {link.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-300 text-sm">
            © 2024 TruthGuard. Built for Innerve Hackathon.
          </p>
          <p className="text-blue-300 text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for India
          </p>
        </div>
      </div>
    </footer>
  );
}
