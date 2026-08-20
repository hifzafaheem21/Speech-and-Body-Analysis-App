import { logger } from "./logger";

export function auditAnalysisEvent({
  sessionId,
  endpoint,
  status,
}: {
  sessionId: string;
  endpoint: string;
  status: "success" | "failure";
}) {
  logger.info(
    {
      auditEvent: {
        timestamp: new Date().toISOString(),
        sessionId,
        thirdPartyEndpoint: endpoint,
        status,
      },
    },
    "analysis_event",
  );
}