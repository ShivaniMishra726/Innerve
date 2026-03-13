# 🛡️ TruthGuard — AI Misinformation Detector for India

> **Stop Fake News in India — Scan Before You Share**

TruthGuard empowers 1 billion Indians to fight digital misinformation on WhatsApp, social media, and viral forwards using AI-powered detection.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/truthguard)

---

## 🎯 Problem Statement

India faces a massive misinformation crisis:
- **500M+ WhatsApp users** receive and forward fake news daily
- Health scams, election rumors, financial fraud, and deepfake propaganda
- Rural users with limited digital literacy are most vulnerable

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🔍 **AI Scanner** | Paste any message/article → instant misinformation analysis |
| 🤖 **ML Model v2** | 5-feature fake-news classifier with category detection (scam / health / election / hoax / credible) |
| 📊 **Trust Score** | 0-100 factuality score fused from heuristics (60 %) + ML model (40 %) |
| 📈 **AI Model Breakdown** | Animated per-feature score bars + detected category badge |
| 📝 **Demo Input System** | Tabbed fake / credible examples (5 + 3 presets) — no typing required |
| 🚩 **Red Flags** | Detailed breakdown of suspicious signals |
| 📚 **Education Panel** | 5-tip carousel on spotting fake news |
| 🧩 **Spot the Fake Quiz** | 3 India-specific misinformation examples |
| 🛡️ **Truth Badge** | Shareable verification badge for WhatsApp |
| 🔗 **Verify Tools** | Links to AltNews, BoomLive, PIB Fact Check |
| 📱 **PWA** | Install as mobile app, offline capable |

## 🎨 Design

- **Claymorphism** design style (soft shadows, rounded blobs, elevated cards)
- **Mobile-first** responsive design
- **Indian civic-tech theme** (Saffron #FF7722, Trust Blue #1E3A8A, Cream #FFF7ED)
- **Framer Motion** animations with confetti for credible results
- **ARIA accessible** with keyboard navigation

## 🤖 AI Architecture

```
Input Text
    ↓
1. Language Detection (Hindi/English/Mixed)
    ↓
2. Local Heuristic Scoring (no API calls):
   - Emotional keyword detection (25 pts)
   - Scam pattern matching (30 pts)
   - Clickbait phrases (15 pts)
   - Fake authority markers (20 pts)
   - URL credibility scoring (20 pts)   ← bare-domain aware
   - Formatting analysis (10 pts)
   - Forward chain indicators (10 pts)
    ↓
3. ML-Inspired Fake News Model v2:
   - 5-feature extraction:
       emotionality · sensationalism · urgency · authority misuse · credibility
   - Category classification:
       scam | health_misinfo | election_misinfo | viral_hoax | credible
   - Composite model score (features 55% + category 45%)
    ↓
4. Score Fusion:
   - Final risk = heuristics × 0.6 + model × 0.4
    ↓
5. Verdict: credible | suspicious | misinfo
    ↓
6. AI Model Breakdown UI + Education tips + Shareable badge
```

**No external AI API calls** — runs entirely on-device heuristics + local model.
Designed to add HuggingFace inference fallback if confidence < 70%.

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** with custom Claymorphism utilities
- **Framer Motion** for animations
- **Lucide React** icons
- **Canvas API** for Truth Badge generation
- **Canvas Confetti** for credible results celebration

## 📁 Project Structure

```
truthguard/
├── app/
│   ├── page.tsx              # Home page with all sections
│   ├── layout.tsx            # Root layout with PWA metadata
│   ├── globals.css           # Claymorphism design system
│   └── api/
│       └── scan/
│           └── route.ts      # POST /api/scan endpoint
├── components/
│   ├── Header.tsx            # Sticky navigation header
│   ├── Footer.tsx            # Footer with resources
│   ├── Scanner.tsx           # Text input + scan trigger
│   ├── ResultsPanel.tsx      # Verdict + flags + tips display
│   ├── EducationModal.tsx    # 5-tip education carousel
│   ├── QuizCard.tsx          # "Spot the Fake" interactive quiz
│   ├── ModelBreakdown.tsx    # AI model feature breakdown (v2)
│   ├── TruthBadge.tsx        # Canvas-based shareable badge
│   └── LoadingSpinner.tsx    # AI scanning animation
├── lib/
│   ├── fakeNewsModel.ts      # ML-inspired fake-news classifier (v2)
│   ├── heuristics.ts         # Local scoring engine
│   └── misinfoEngine.ts      # Main detection pipeline
├── public/
│   └── manifest.json         # PWA manifest
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/truthguard
cd truthguard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

No environment variables required for basic operation!

Optional (for future AI fallback):
```env
# .env.local
HUGGINGFACE_API_KEY=your_key_here  # Optional: for HuggingFace model
GOOGLE_FACT_CHECK_API_KEY=your_key # Optional: Google Fact Check API
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

Or click the deploy button at the top of this README.

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm run start
```

The app is fully static-compatible except for the `/api/scan` route.

---

## 🎤 Demo Script (2 minutes for Hackathon Judges)

**[0:00-0:15] Hook**
> "Every day, 500 million Indians receive fake news on WhatsApp. PM Modi subsidy scams. COVID cure hoaxes. Election manipulation. TruthGuard is the solution."

**[0:15-0:45] Live Demo**
1. Open TruthGuard on mobile
2. In the "🚫 Fake Examples" tab, click "💊 COVID Health Hoax"
3. Hit "Scan for Truth"
4. Show verdict (⚠️ Suspicious or 🚫 Misinformation, score ~15-40/100)
5. Highlight AI Model Breakdown — category badge + 5 feature bars
6. Highlight red flags detected
7. Show education tips
8. Switch to "✅ Credible Examples", scan "📊 RBI Rate Cut" — watch confetti!
9. Generate Truth Badge → Share to WhatsApp

**[0:45-1:15] Technology**
> "Zero external API calls. Pure local heuristics fused with an ML-inspired 5-feature classifier — emotional keyword detection, scam pattern matching, URL credibility scoring, category classification. Runs entirely in the browser. Stateless, private, instant."

**[1:15-1:45] Impact**
> "We target India's 500M+ WhatsApp users. Mobile-first. Supports Hindi and English. Works offline as a PWA. AltNews, BoomLive, PIB Fact Check — all integrated."

**[1:45-2:00] Close**
> "TruthGuard empowers 1 billion Indians to fight digital misinformation. Stop Fake News. Scan Before You Share."

---

## 🤝 Contributing

Built for the **Innerve Hackathon**. 

To extend TruthGuard:
1. Add more scam patterns in `lib/heuristics.ts`
2. Tune feature weights or add new categories in `lib/fakeNewsModel.ts`
3. Integrate HuggingFace inference in `lib/misinfoEngine.ts`
4. Add Google Fact Check API in `app/api/scan/route.ts`

## 📄 License

MIT License — Free to use and extend for social good.

---

*"Fighting misinformation, one scan at a time." 🇮🇳*
