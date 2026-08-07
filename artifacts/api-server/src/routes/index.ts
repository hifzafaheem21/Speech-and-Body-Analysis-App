import { Router, type IRouter } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.post("/analyze", (req, res) => {
  const body = req.body as Record<string, unknown> | null;
  const mode = body?.mode;
  const sourceName = body?.sourceName;
  if ((mode !== "speech" && mode !== "video") || typeof sourceName !== "string" || sourceName.trim().length === 0) {
    res.status(400).json({ message: "mode and sourceName are required" });
    return;
  }
  const videoBoost = mode === "video" ? 2 : 0;
  res.json({
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
  });
});

export default router;
