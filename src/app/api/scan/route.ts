import { NextRequest, NextResponse } from "next/server";
import { scanContent } from "@/lib/misinfoEngine";
import { scrubPII } from "@/lib/utils";
import { runCloudAnalysis } from "@/lib/cloudAnalysis";

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

    // When local confidence is low, call cloud APIs for a second opinion.
    // Cloud analysis is optional — it requires HUGGINGFACE_API_KEY and/or
    // GOOGLE_FACT_CHECK_API_KEY to be set. If neither key is present the
    // call returns immediately with { used: false } and the local result
    // is returned unchanged.
    if (result.confidence < 70) {
      const cloudAnalysis = await runCloudAnalysis(sanitizedText);

      if (cloudAnalysis.used && cloudAnalysis.huggingfaceScore !== null) {
        // Blend HuggingFace score into the risk score with a 20 % weight so
        // the local model (80 %) still dominates.
        const blendedRisk = Math.round(
          result.riskScore * 0.8 + cloudAnalysis.huggingfaceScore * 0.2
        );
        const blendedScore = Math.max(0, 100 - blendedRisk);

        return NextResponse.json({
          ...result,
          score: blendedScore,
          riskScore: blendedRisk,
          cloudAnalysis,
        });
      }

      // Cloud was attempted but returned no usable score — attach the metadata
      // so the UI can indicate cloud was consulted.
      return NextResponse.json({ ...result, cloudAnalysis });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Internal server error during scan" },
      { status: 500 }
    );
  }
}
