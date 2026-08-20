import { Router, type IRouter } from "express";
import type { AnalysisResult } from "@workspace/api-zod";
import healthRouter from "./health";
import { auditAnalysisEvent } from "../lib/analysis-audit";
import { deleteAnalysis, deleteTemporaryFiles, hasAnalysis, retainAnalysis } from "../lib/analysis-store";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.use(healthRouter);
router.post("/analyze", (req, res) => {
  const body = req.body as Record<string, unknown> | null;
  const sessionId = body?.sessionId;
  const consentAccepted = body?.consentAccepted;
  const mode = body?.mode;
  const sourceName = body?.sourceName;
  if (
    typeof sessionId !== "string" ||
    sessionId.trim().length === 0 ||
    consentAccepted !== true ||
    (mode !== "speech" && mode !== "video") ||
    typeof sourceName !== "string" ||
    sourceName.trim().length === 0
  ) {
    res.status(400).json({ message: "A valid sessionId, sourceName, and accepted consent are required" });
    return;
  }
  const thirdPartyEndpoint = process.env["THIRD_PARTY_ANALYSIS_URL"] ?? "mock://local-analysis";
  if (thirdPartyEndpoint !== "mock://local-analysis" && !thirdPartyEndpoint.startsWith("https://")) {
    auditAnalysisEvent({ sessionId, endpoint: thirdPartyEndpoint, status: "failure" });
    res.status(500).json({ message: "Third-party analysis endpoints must use HTTPS" });
    return;
  }
  const videoBoost = mode === "video" ? 2 : 0;
  const result: AnalysisResult = {
    sessionId,
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    sourceName,
    mode,
    overallScore: 84 + videoBoost,
    confidence: { score: 88, label: "Strong presence", detail: "You project authority without sounding rehearsed." },
    eyeContact: { score: mode === "video" ? 82 : 76, label: "Good focus", detail: "Try holding eye contact for one full thought." },
    speechRate: { score: 79, label: "Well paced", detail: "A little slower on key points will add impact." },
    bodyPosture: { score: mode === "video" ? 86 : 80, label: "Open stance", detail: "Your shoulders stay relaxed and ready." },
    handGestures: { score: mode === "video" ? 81 : 74, label: "Natural movement", detail: "Use one intentional gesture for your next transition." },
    suggestions: [
      "Pause for a beat before your main takeaway.",
      "Land your final sentence with a slightly lower pitch.",
      "Keep your hands visible when introducing a new idea.",
    ],
  };
  const rawVideoPath = typeof body?.rawVideoPath === "string" ? body.rawVideoPath : undefined;
  const extractedAudioPath = typeof body?.extractedAudioPath === "string" ? body.extractedAudioPath : undefined;
  retainAnalysis({ sessionId, result, rawVideoPath, extractedAudioPath });
  auditAnalysisEvent({ sessionId, endpoint: thirdPartyEndpoint, status: "success" });

  const retentionSeconds = Number(process.env["ANALYSIS_RETENTION_SECONDS"] ?? "0");
  if (retentionSeconds <= 0) {
    void deleteTemporaryFiles([rawVideoPath, extractedAudioPath]).catch((error: unknown) => {
      logger.error({ err: error, sessionId }, "analysis_media_cleanup_failed");
    });
  } else {
    const cleanupTimer = setTimeout(() => {
      void deleteTemporaryFiles([rawVideoPath, extractedAudioPath]).catch((error: unknown) => {
        logger.error({ err: error, sessionId }, "analysis_media_cleanup_failed");
      });
    }, retentionSeconds * 1000);
    cleanupTimer.unref();
  }
  res.json(result);
});

router.delete("/analyze/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId;
  const deleted = await deleteAnalysis(sessionId);
  if (!deleted && !hasAnalysis(sessionId)) {
    res.status(404).json({ message: "No analysis data was found for this session" });
    return;
  }
  auditAnalysisEvent({ sessionId, endpoint: "local-storage", status: "success" });
  res.status(204).send();
});

export default router;
