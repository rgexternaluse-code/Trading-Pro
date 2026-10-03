export type Language = 'en' | 'hinglish';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type TradingGoal =
  | 'investing'
  | 'swing'
  | 'intraday'
  | 'scalping'
  | 'options'
  | 'algo'
  | 'all';

export type NavigationTab =
  | 'home'
  | 'learn'
  | 'markets'
  | 'practice'
  | 'tutor'
  | 'journal'
  | 'governance'
  | 'admin'
  | 'profile';

export type UserRole = 'admin' | 'user';

export interface AuthSessionUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  token: string;
  createdAt: string;
}

export interface LocalizedText {
  en: string;
  hinglish: string;
}

export interface SkillScores {
  marketBasics: number;
  technicalAnalysis: number;
  fundamentalAnalysis: number;
  riskManagement: number;
  tradingPsychology: number;
  derivatives: number;
  algoTrading: number;
}

export interface UserProfile {
  name: string;
  language: Language;
  hasSelectedLanguage: boolean;
  hasCompletedOnboarding: boolean;
  skillLevel: SkillLevel;
  goal: TradingGoal;
  dailyMinutes: number;
  streakDays: number;
  completedLessonIds: string[];
  completedChallengeIds: string[];
  quizAccuracy: number;
  quizAttemptsCount: number;
  skillScores: SkillScores;
  paperBalance: number;
  initialPaperBalance: number;
  maxRiskPerTradePct: number;
  maxDailyLossPct: number;
  watchlist: string[];
  theme: 'dark' | 'light';
}

export interface LessonQuizQuestion {
  id: string;
  question: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
  category: keyof SkillScores;
}

export interface Lesson {
  id: string;
  pathId: string;
  moduleNumber: number;
  title: LocalizedText;
  level: SkillLevel;
  category: keyof SkillScores;
  durationMinutes: number;
  concept: LocalizedText;
  simpleExplanation: LocalizedText;
  realisticExample: LocalizedText;
  visualChartSymbol: string;
  visualChartAnnotation: LocalizedText;
  commonMistakes: LocalizedText[];
  quiz: LessonQuizQuestion[];
  practicalExercise: LocalizedText;
  keyTakeaway: LocalizedText;
}

export interface CoursePath {
  id: string;
  code: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  level: SkillLevel;
  modulesCount: number;
  lessons: Lesson[];
}

export interface OHLCVCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20?: number;
  ema50?: number;
  vwap?: number;
  rsi?: number;
  atr?: number;
}

export interface FundamentalMetrics {
  peRatio: number;
  pbRatio: number;
  roePct: number;
  rocePct: number;
  debtToEquity: number;
  dividendYieldPct: number;
  marketCapCr: number;
  revenueGrowthYoYPct: number;
  sector: string;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'INDEX';
  category: 'Index' | 'Equity' | 'ETF';
  price: number;
  change: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  lotSize: number;
  atr14: number;
  supportLevel: number;
  resistanceLevel: number;
  fundamentals: FundamentalMetrics;
  candles: OHLCVCandle[];
  educationalSummary: LocalizedText;
}

export interface MarketNewsItem {
  id: string;
  headline: LocalizedText;
  source: string;
  publishedAgo: string;
  relatedSymbol: string;
  verifiedEvent: LocalizedText;
  analystInterpretation: LocalizedText;
  educationalRelevance: LocalizedText;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  name: string;
  direction: 'LONG' | 'SHORT';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  targetPrice: number;
  riskAmount: number;
  riskPctOfCapital: number;
  estimatedCharges: number;
  openedAt: string;
  strategyTag: string;
}

export interface PaperTradeRecord {
  id: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  targetPrice: number;
  grossPnl: number;
  charges: number; // Brokerage + STT + SEBI + GST + Slippage
  netPnl: number;
  rMultiple: number;
  exitReason: 'TARGET_HIT' | 'STOP_HIT' | 'MANUAL_EXIT';
  closedAt: string;
  strategyTag: string;
  followedStopRule: boolean;
}

export interface StrategyConfig {
  id: string;
  name: string;
  symbol: string;
  timeframe: '5m' | '15m' | '1H' | '1D';
  entryPriceVsEma: 'above_ema20' | 'below_ema20' | 'ema20_cross_ema50' | 'any';
  entryRsiCondition: 'rsi_50_70' | 'rsi_oversold_35' | 'rsi_overbought_70' | 'any';
  entryVwapCondition: 'above_vwap' | 'below_vwap' | 'any';
  entryVolumeCondition: 'above_avg_vol' | 'any';
  stopLossType: 'atr_1_5' | 'fixed_pct_1_5' | 'support_swing';
  targetRMultiple: number;
  riskPerTradePct: number;
  regimeFilter: 'all' | 'bull_trend_only' | 'high_volatility_only';
  includeBrokerageAndStt: boolean;
  slippageBps: number;
}

export interface BacktestTrade {
  entryDate: string;
  exitDate: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  netPnl: number;
  rMultiple: number;
  outcome: 'WIN' | 'LOSS';
  equityAfter: number;
}

export interface BacktestResult {
  strategyName: string;
  symbol: string;
  timeframe: string;
  initialCapital: number;
  finalCapital: number;
  netReturnPct: number;
  cagrPct: number;
  maxDrawdownPct: number;
  winRatePct: number;
  avgWinInr: number;
  avgLossInr: number;
  profitFactor: number;
  expectancyR: number;
  totalTrades: number;
  totalChargesInr: number;
  exposurePct: number;
  equityCurve: { date: string; equity: number; drawdownPct: number }[];
  trades: BacktestTrade[];
  warnings: LocalizedText[];
}

export interface JournalEntry {
  id: string;
  date: string;
  timeOfDay: 'Opening (9:15-10:30)' | 'Midday (10:30-13:30)' | 'Closing (13:30-15:30)' | 'Positional / EOD';
  symbol: string;
  setup: 'Breakout' | 'Pullback to EMA/VWAP' | 'Support Bounce' | 'Range Rejection' | 'Impulse / Unplanned';
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  exitPrice: number;
  quantity: number;
  netPnl: number;
  rMultiple: number;
  reasonForTrade: string;
  emotion: 'Calm & Disciplined' | 'FOMO (Chasing)' | 'Fear / Hesitation' | 'Revenge Trading' | 'Overconfident';
  mistake: 'None — Followed Plan' | 'Moved Stop Loss Wider' | 'Exited Too Early' | 'Oversized Position' | 'Traded Outside Rules';
  lessonLearned: string;
}

export interface ChartChallenge {
  id: string;
  title: LocalizedText;
  symbol: string;
  timeframe: string;
  level: SkillLevel;
  setupContext: LocalizedText;
  visibleCandles: OHLCVCandle[];
  hiddenCandles: OHLCVCandle[];
  supportZone: number;
  resistanceZone: number;
  suggestedEntry: number;
  suggestedStop: number;
  suggestedTarget: number;
  questions: {
    trendQuestion: {
      prompt: LocalizedText;
      options: LocalizedText[];
      correctIndex: number;
    };
    actionQuestion: {
      prompt: LocalizedText;
      options: LocalizedText[];
      correctIndex: number;
    };
  };
  outcomeExplanation: LocalizedText;
}

export interface BehavioralScenario {
  id: string;
  title: LocalizedText;
  situation: LocalizedText;
  biasTested: string;
  options: {
    label: LocalizedText;
    isProcessDisciplined: boolean;
    feedback: LocalizedText;
  }[];
}

export interface GlossaryItem {
  id: string;
  term: string;
  category: string;
  definition: LocalizedText;
  indianMarketExample: LocalizedText;
  formula?: string;
  relatedTab: NavigationTab;
}

// --- MASTER PROMPT V2 EXTENSIONS ---

export type ChartAnnotationTool =
  | 'support_line'
  | 'resistance_line'
  | 'trendline'
  | 'entry_marker'
  | 'stop_marker'
  | 'target_marker'
  | 'zone_box';

export interface UserChartDrawing {
  id: string;
  tool: ChartAnnotationTool;
  price1: number;
  candleIndex1: number;
  price2?: number;
  candleIndex2?: number;
  label: string;
}

export type ExerciseFormat =
  | 'mcq'
  | 'true_false'
  | 'numeric_calc'
  | 'candle_click'
  | 'draw_sr'
  | 'place_order'
  | 'spot_mistake'
  | 'strategy_fix'
  | 'chart_replay'
  | 'psychology_scenario';

export type PipelineValidationStage =
  | 'draft'
  | 'ai_generated'
  | 'deterministic_test_passed'
  | 'human_review'
  | 'published'
  | 'flagged';

export interface InteractiveExerciseItem {
  id: string;
  format: ExerciseFormat;
  title: LocalizedText;
  level: SkillLevel;
  category: keyof SkillScores;
  symbol: string;
  prompt: LocalizedText;
  hint: LocalizedText;
  explanation: LocalizedText;
  stage: PipelineValidationStage;
  // Format-specific ground truth answer keys
  mcqOptions?: LocalizedText[];
  correctOptionIndex?: number;
  numericExpected?: number;
  numericTolerance?: number;
  numericUnit?: string;
  numericFormulaSteps?: LocalizedText;
  targetCandleIndex?: number;
  targetCandleRange?: [number, number];
  expectedSupportPrice?: number;
  expectedResistancePrice?: number;
  priceToleranceInr?: number;
  expectedOrderSetup?: {
    direction: 'LONG' | 'SHORT';
    idealEntry: number;
    maxStopLoss: number;
    minTarget: number;
    minRR: number;
  };
  flawedTicketData?: {
    capitalInr: number;
    entryPrice: number;
    stopLoss: number | null;
    targetPrice: number;
    shares: number;
    flawOptions: LocalizedText[];
    correctFlawIndex: number;
  };
  brokenStrategySnippet?: {
    code: string;
    bugOptions: LocalizedText[];
    correctBugIndex: number;
    fixedCode: string;
  };
}

export type AIAgentRole =
  | 'concept_teacher'
  | 'math_risk_tutor'
  | 'chart_coach'
  | 'strategy_auditor'
  | 'quiz_examiner'
  | 'journal_psych_coach'
  | 'safety_guard';

export interface AIErrorReport {
  id: string;
  timestamp: string;
  sourceModule: 'AI Tutor' | 'AI Chart Coach' | 'Exercise Engine' | 'Strategy Auditor';
  issueType:
    | 'Calculation / Math Mismatch'
    | 'Inaccurate Chart Level'
    | 'Overly Complex Jargon'
    | 'Unsafe / Predictive Tone'
    | 'Other Educational Feedback';
  contextSnippet: string;
  userComment: string;
  status: 'open_review' | 'verified_fixed' | 'resolved_by_deterministic_solver';
}

// --- CHAPTER-BASED MASTERY LEARNING SYSTEM (V1.0) ---

export type ChapterStageCategory =
  | 'Foundation'
  | 'Core Trading'
  | 'Risk'
  | 'Strategy'
  | 'Advanced';

export type ChapterMasteryStatus =
  | 'locked'
  | 'available'
  | 'learning'
  | 'practice'
  | 'assessment'
  | 'mastered'
  | 'needs_review';

export interface ChapterConcept {
  id: string;
  title: LocalizedText;
  isCritical: boolean;
}

export interface ChapterInteractiveLesson {
  id: string;
  title: LocalizedText;
  durationMinutes: number;
  conceptId: string;
  conceptSummary: LocalizedText;
  visualExample: LocalizedText;
  formulaOrRule?: string;
  chartSymbol?: string;
  quickCheck: {
    question: LocalizedText;
    options: LocalizedText[];
    correctIndex: number;
    explanation: LocalizedText;
  };
}

export interface ChapterPracticeActivity {
  id: string;
  title: LocalizedText;
  conceptId: string;
  type: 'numeric_calc' | 'scenario_decision' | 'chart_reading';
  prompt: LocalizedText;
  hint: LocalizedText;
  // Deterministic numeric check or option check
  expectedNumeric?: number;
  numericTolerance?: number;
  numericUnit?: string;
  options?: LocalizedText[];
  correctOptionIndex?: number;
  explanation: LocalizedText;
}

export interface ChapterAssessmentQuestion {
  id: string;
  conceptId: string;
  isCriticalConcept: boolean;
  questionType: 'calculation' | 'scenario' | 'chart_interpretation' | 'true_false' | 'mcq';
  prompt: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  deterministicFormulaNote?: string;
  explanation: LocalizedText;
}

export interface ChapterDefinition {
  id: string;
  chapterNumber: number;
  stageCategory: ChapterStageCategory;
  title: LocalizedText;
  description: LocalizedText;
  iconName: string;
  estimatedMinutes: number;
  prerequisiteChapterIds: string[];
  masteryThreshold: number; // default 80
  concepts: ChapterConcept[];
  lessons: ChapterInteractiveLesson[];
  practiceActivities: ChapterPracticeActivity[];
  assessmentQuestions: ChapterAssessmentQuestion[];
}

export interface UserChapterProgress {
  userId: string;
  chapterId: string;
  status: ChapterMasteryStatus;
  completedLessonIds: string[];
  completedPracticeIds: string[];
  lessonProgress: number; // 0-100
  practiceProgress: number; // 0-100
  assessmentBestScore?: number;
  masteryScore?: number;
  criticalConceptsPassed: boolean;
  weakConceptIds: string[];
  attemptsCount: number;
  startedAt?: string;
  masteredAt?: string;
  lastActivityAt?: string;
}

export interface UserWeakSkill {
  conceptId: string;
  chapterId: string;
  chapterNumber: number;
  title: LocalizedText;
  accuracyScore: number; // 0-100
  needsRemediation: boolean;
  lastTestedAt: string;
}

export interface LearningAnalyticsEvent {
  id: string;
  userId: string;
  eventType:
    | 'chapter_viewed'
    | 'chapter_started'
    | 'lesson_completed'
    | 'practice_completed'
    | 'assessment_completed'
    | 'chapter_mastered'
    | 'chapter_failed'
    | 'skill_marked_weak'
    | 'targeted_practice_completed'
    | 'chapter_unlocked';
  chapterId: string;
  timestamp: string;
  details: string;
}


