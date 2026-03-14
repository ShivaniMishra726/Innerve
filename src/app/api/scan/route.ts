import { NextRequest, NextResponse } from "next/server";
import { scanContent } from "@/lib/misinfoEngine";
import { scrubPII } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: "Text is too short to analyze (minimum 10 characters)" },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "Text is too long (maximum 10000 characters)" },
        { status: 400 }
      );
    }

    // Scrub PII before sending to AI engine (DPDP Act compliance)
    const sanitizedText = scrubPII(text);

    // Audit log: record whether scrubbing occurred, without logging actual PII
    if (sanitizedText !== text) {
      const redactedCount = (sanitizedText.match(/\[REDACTED\]/g) ?? []).length;
      console.info(`[PII scrubber] Redacted ${redactedCount} item(s) before inference.`);
    }

    const result = await scanContent(sanitizedText);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Internal server error during scan" },
      { status: 500 }
    );
  }
}
