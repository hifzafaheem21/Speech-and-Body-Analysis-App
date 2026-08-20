import fs from "node:fs/promises";
import path from "node:path";
import type { AnalysisResult } from "@workspace/api-zod";

export type RetainedAnalysis = {
  sessionId: string;
  result: AnalysisResult;
  rawVideoPath?: string;
  extractedAudioPath?: string;
};

const sessions = new Map<string, RetainedAnalysis>();
const storageRoot = path.resolve(process.env["ANALYSIS_STORAGE_DIR"] ?? "/tmp/speech-body-analysis");

export function retainAnalysis(entry: RetainedAnalysis) {
  sessions.set(entry.sessionId, entry);
}

export function hasAnalysis(sessionId: string) {
  return sessions.has(sessionId);
}

export async function deleteAnalysis(sessionId: string) {
  const entry = sessions.get(sessionId);
  if (!entry) return false;

  await Promise.all([
    removeTemporaryFile(entry.rawVideoPath),
    removeTemporaryFile(entry.extractedAudioPath),
  ]);
  sessions.delete(sessionId);
  return true;
}

export async function deleteTemporaryFiles(paths: Array<string | undefined>) {
  await Promise.all(paths.map(removeTemporaryFile));
}

async function removeTemporaryFile(filePath: string | undefined) {
  if (!filePath) return;
  const resolved = path.resolve(filePath);
  if (resolved !== storageRoot && !resolved.startsWith(`${storageRoot}${path.sep}`)) {
    throw new Error("Refusing to delete a file outside ANALYSIS_STORAGE_DIR");
  }
  await fs.rm(resolved, { force: true });
}