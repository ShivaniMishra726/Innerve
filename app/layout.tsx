import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruthGuard — Stop Fake News in India",
  description:
    "AI-powered misinformation detection for WhatsApp forwards, viral messages, and suspicious news. Built for India.",
  keywords: "fact check, fake news, misinformation, India, WhatsApp, TruthGuard",
  authors: [{ name: "TruthGuard Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "TruthGuard — Stop Fake News in India",
    description:
      "Scan Before You Share. AI-powered misinformation detection for India.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "TruthGuard — Stop Fake News in India",
    description: "Scan Before You Share. AI misinformation detector for India.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF7722",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
