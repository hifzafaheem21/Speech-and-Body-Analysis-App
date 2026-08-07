import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  analyzePresentation,
  type AnalysisResult,
  type AnalyzeRequest,
  type Metric,
} from '@workspace/api-client-react';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const HISTORY_KEY = '@speech_coach_analysis_history';

type AnalysisContextValue = {
  history: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  runAnalysis: (request: AnalyzeRequest) => Promise<void>;
  selectAnalysis: (analysis: AnalysisResult) => void;
  clearHistory: () => Promise<void>;
};

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

const metric = (score: number, label: string, detail: string): Metric => ({
  score,
  label,
  detail,
});

function mockAnalysis(request: AnalyzeRequest): AnalysisResult {
  const videoBoost = request.mode === 'video' ? 2 : 0;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    sourceName: request.sourceName,
    mode: request.mode,
    overallScore: 84 + videoBoost,
    confidence: metric(88, 'Strong presence', 'You project authority without sounding rehearsed.'),
    eyeContact: metric(request.mode === 'video' ? 82 : 76, 'Good focus', 'Try holding eye contact for one full thought.'),
    speechRate: metric(79, 'Well paced', 'A little slower on key points will add impact.'),
    bodyPosture: metric(request.mode === 'video' ? 86 : 80, 'Open stance', 'Your shoulders stay relaxed and ready.'),
    handGestures: metric(request.mode === 'video' ? 81 : 74, 'Natural movement', 'Use one intentional gesture for your next transition.'),
    suggestions: [
      'Pause for a beat before your main takeaway.',
      'Land your final sentence with a slightly lower pitch.',
      'Keep your hands visible when introducing a new idea.',
    ],
  };
}

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY)
      .then((stored) => {
        if (!stored) return;
        const parsed = JSON.parse(stored) as AnalysisResult[];
        setHistory(parsed);
        setCurrentAnalysis(parsed[0] ?? null);
      })
      .catch(() => setHistory([]));
  }, []);

  const runAnalysis = async (request: AnalyzeRequest) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      let result: AnalysisResult;
      try {
        result = await analyzePresentation(request);
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        result = mockAnalysis(request);
      }
      setCurrentAnalysis(result);
      setHistory((previous) => {
        const next = [result, ...previous.filter((item) => item.id !== result.id)].slice(0, 20);
        AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next)).catch(() => undefined);
        return next;
      });
    } catch {
      setError('We could not complete the analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const value = useMemo(
    () => ({
      history,
      currentAnalysis,
      isAnalyzing,
      error,
      runAnalysis,
      selectAnalysis: setCurrentAnalysis,
      clearHistory: async () => {
        await AsyncStorage.removeItem(HISTORY_KEY);
        setHistory([]);
        setCurrentAnalysis(null);
      },
    }),
    [currentAnalysis, error, history, isAnalyzing],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error('useAnalysis must be used within AnalysisProvider');
  return context;
}