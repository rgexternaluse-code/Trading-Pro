import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  BarChart3,
  Sliders,
  Bot,
  BookMarked,
  User,
  Globe,
  Search,
  Sun,
  Moon,
  Award,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import {
  JournalEntry,
  Language,
  Lesson,
  NavigationTab,
  PaperPosition,
  PaperTradeRecord,
  SkillLevel,
  UserProfile,
} from './types';
import { COURSE_PATHS } from './data/curriculumData';
import {
  GLOSSARY_ITEMS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_PAPER_POSITIONS,
  INITIAL_PAPER_TRADES,
} from './data/challengesAndGlossary';
import { calculateIndianTradeCharges } from './data/indianMarketData';
import { LanguageOnboardingModal } from './components/LanguageOnboardingModal';
import { LearnSection } from './components/LearnSection';
import { MarketsSection } from './components/MarketsSection';
import { PracticeSection } from './components/PracticeSection';
import { AITutorSection } from './components/AITutorSection';
import { JournalSection } from './components/JournalSection';

const STORAGE_KEY_PROFILE = 'aitia_user_profile_v1';
const STORAGE_KEY_POSITIONS = 'aitia_paper_positions_v1';
const STORAGE_KEY_TRADES = 'aitia_paper_trades_v1';
const STORAGE_KEY_JOURNAL = 'aitia_journal_entries_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  language: 'en',
  hasSelectedLanguage: false, // Triggers initial language selection popup with example
  hasCompletedOnboarding: false,
  skillLevel: 'intermediate',
  goal: 'intraday',
  dailyMinutes: 20,
  streakDays: 6,
  completedLessonIds: ['les-fund-1', 'les-risk-1'],
  completedChallengeIds: ['chal-1'],
  quizAccuracy: 82,
  quizAttemptsCount: 4,
  skillScores: {
    marketBasics: 74,
    riskManagement: 62,
    technicalAnalysis: 58,
    fundamentalAnalysis: 52,
    tradingPsychology: 64,
    derivatives: 35,
    algoTrading: 22,
  },
  paperBalance: 101386.5,
  initialPaperBalance: 100000,
  maxRiskPerTradePct: 1.0,
  maxDailyLossPct: 2.5,
  watchlist: ['NIFTY 50', 'RELIANCE', 'TCS', 'HDFCBANK'],
  theme: 'dark',
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROFILE;
  });

  const [positions, setPositions] = useState<PaperPosition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSITIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PAPER_POSITIONS;
  });

  const [trades, setTrades] = useState<PaperTradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRADES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PAPER_TRADES;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOURNAL);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_JOURNAL_ENTRIES;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [modalMode, setModalMode] = useState<'language_only' | 'full_onboarding' | null>(
    !profile.hasSelectedLanguage ? 'full_onboarding' : null
  );
  const [practiceTargetSymbol, setPracticeTargetSymbol] = useState<string>('RELIANCE');
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);
  const [globalQuery, setGlobalQuery] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(positions));
    } catch {}
  }, [positions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRADES, JSON.stringify(trades));
    } catch {}
  }, [trades]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(journalEntries));
    } catch {}
  }, [journalEntries]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const applyPresetPersona = (level: SkillLevel, lang: Language) => {
    if (level === 'beginner') {
      setProfile({
        ...DEFAULT_PROFILE,
        name: 'Riya Verma (Beginner)',
        language: lang,
        hasSelectedLanguage: true,
        hasCompletedOnboarding: true,
        skillLevel: 'beginner',
        goal: 'investing',
        completedLessonIds: ['les-fund-1'],
        skillScores: {
          marketBasics: 42,
          riskManagement: 30,
          technicalAnalysis: 25,
          fundamentalAnalysis: 38,
          tradingPsychology: 45,
          derivatives: 10,
          algoTrading: 5,
        },
      });
    } else if (level === 'intermediate') {
      setProfile({
        ...DEFAULT_PROFILE,
        name: 'Aarav Sharma (Intermediate)',
        language: lang,
        hasSelectedLanguage: true,
        hasCompletedOnboarding: true,
        skillLevel: 'intermediate',
        goal: 'intraday',
      });
    } else {
      setProfile({
        ...DEFAULT_PROFILE,
        name: 'Vikram Iyer (Quant / Pro)',
        language: lang,
        hasSelectedLanguage: true,
        hasCompletedOnboarding: true,
        skillLevel: 'advanced',
        goal: 'algo',
        completedLessonIds: [
          'les-fund-1',
          'les-fund-2',
          'les-risk-1',
          'les-risk-2',
          'les-ta-1',
          'les-quant-1',
        ],
        skillScores: {
          marketBasics: 92,
          riskManagement: 88,
          technicalAnalysis: 85,
          fundamentalAnalysis: 80,
          tradingPsychology: 84,
          derivatives: 78,
          algoTrading: 76,
        },
      });
    }
    setModalMode(null);
  };

  const handleCompleteLesson = (lesson: Lesson, quizCorrect: boolean) => {
    setProfile((prev) => {
      const completed = prev.completedLessonIds.includes(lesson.id)
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lesson.id];
      const currentCatScore = prev.skillScores[lesson.category] || 50;
      const delta = quizCorrect ? 8 : 3;
      return {
        ...prev,
        completedLessonIds: completed,
        quizAttemptsCount: prev.quizAttemptsCount + 1,
        quizAccuracy: quizCorrect
          ? Math.min(100, Math.round((prev.quizAccuracy + 100) / 2))
          : Math.max(40, Math.round((prev.quizAccuracy + 50) / 2)),
        skillScores: {
          ...prev.skillScores,
          [lesson.category]: Math.min(100, currentCatScore + delta),
        },
      };
    });
  };

  const handleCompleteChallenge = (challengeId: string) => {
    setProfile((prev) => ({
      ...prev,
      completedChallengeIds: prev.completedChallengeIds.includes(challengeId)
        ? prev.completedChallengeIds
        : [...prev.completedChallengeIds, challengeId],
    }));
  };

  const handleToggleWatchlist = (symbol: string) => {
    setProfile((prev) => ({
      ...prev,
      watchlist: prev.watchlist.includes(symbol)
        ? prev.watchlist.filter((s) => s !== symbol)
        : [...prev.watchlist, symbol],
    }));
  };

  const handlePlacePaperOrder = (newPos: PaperPosition) => {
    setPositions((prev) => [newPos, ...prev]);
  };

  const handleClosePaperPosition = (
    posId: string,
    exitPrice: number,
    reason: 'TARGET_HIT' | 'STOP_HIT' | 'MANUAL_EXIT'
  ) => {
    const pos = positions.find((p) => p.id === posId);
    if (!pos) return;

    const feeCalc = calculateIndianTradeCharges({
      buyPrice: pos.direction === 'LONG' ? pos.entryPrice : exitPrice,
      sellPrice: pos.direction === 'LONG' ? exitPrice : pos.entryPrice,
      quantity: pos.quantity,
      mode: 'intraday',
    });

    const stopDist = Math.max(1, Math.abs(pos.entryPrice - pos.stopLoss));
    const rMultiple = Number((feeCalc.netPnl / (stopDist * pos.quantity)).toFixed(2));

    const record: PaperTradeRecord = {
      id: 'trd-' + Date.now(),
      symbol: pos.symbol,
      direction: pos.direction,
      quantity: pos.quantity,
      entryPrice: pos.entryPrice,
      exitPrice,
      stopLoss: pos.stopLoss,
      targetPrice: pos.targetPrice,
      grossPnl: feeCalc.grossPnl,
      charges: feeCalc.totalCharges,
      netPnl: feeCalc.netPnl,
      rMultiple,
      exitReason: reason,
      closedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      strategyTag: pos.strategyTag,
      followedStopRule: true,
    };

    setPositions((prev) => prev.filter((p) => p.id !== posId));
    setTrades((prev) => [record, ...prev]);
    setProfile((prev) => ({
      ...prev,
      paperBalance: Number((prev.paperBalance + feeCalc.netPnl).toFixed(2)),
    }));
  };

  const handleResetPaperAccount = () => {
    setPositions(INITIAL_PAPER_POSITIONS);
    setTrades(INITIAL_PAPER_TRADES);
    setProfile((prev) => ({
      ...prev,
      paperBalance: 100000,
    }));
  };

  const lang = profile.language;
  const allLessons = COURSE_PATHS.flatMap((p) => p.lessons);
  const progressPct = Math.round(
    (profile.completedLessonIds.length / Math.max(1, allLessons.length)) * 100
  );

  // Adaptive Next Lesson Recommendation based on lowest skill score
  const sortedSkills = Object.entries(profile.skillScores).sort((a, b) => a[1] - b[1]);
  const weakestSkillKey = sortedSkills[0]?.[0] || 'riskManagement';
  const recommendedLesson =
    allLessons.find(
      (l) =>
        l.category === weakestSkillKey && !profile.completedLessonIds.includes(l.id)
    ) ||
    allLessons.find((l) => !profile.completedLessonIds.includes(l.id)) ||
    allLessons[0];

  const matchingGlossary = GLOSSARY_ITEMS.filter(
    (g) =>
      g.term.toLowerCase().includes(globalQuery.toLowerCase()) ||
      g.definition[lang].toLowerCase().includes(globalQuery.toLowerCase())
  );

  const isLight = profile.theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#090D16] text-slate-100'
      }`}
    >
      {/* Initial Language & Onboarding Popup Modal */}
      {modalMode && (
        <LanguageOnboardingModal
          profile={profile}
          mode={modalMode}
          onUpdateProfile={updateProfile}
          onApplyPresetPersona={applyPresetPersona}
          onClose={() => setModalMode(null)}
        />
      )}

      {/* Global Knowledge Search Modal (Section 32) */}
      {globalSearchOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-slate-950/80 backdrop-blur-sm p-4 pt-16">
          <div className="w-full max-w-2xl border border-slate-800 bg-slate-900 rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-blue-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={globalQuery}
                  onChange={(e) => setGlobalQuery(e.target.value)}
                  placeholder="Search Knowledge Base: e.g., What is VWAP, Stop Loss, Drawdown, CAGR, Greeks, STT..."
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setGlobalSearchOpen(false)}
                className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white border border-slate-800"
              >
                ESC
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {matchingGlossary.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{item.term}</span>
                    <span className="text-xs font-mono text-blue-400">{item.category}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.definition[lang]}
                  </p>
                  <div className="text-xs text-emerald-400 font-mono">
                    ₹ Example: {item.indianMarketExample[lang]}
                  </div>
                  {item.formula && (
                    <div className="text-[11px] font-mono text-amber-300 bg-slate-900 px-2.5 py-1 rounded">
                      Formula: {item.formula}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(item.relatedTab);
                      setGlobalSearchOpen(false);
                    }}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1 pt-1"
                  >
                    <span>Open Related Module / Calculator</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR CONTRACT (Strict 3-Zone Header: Brand Wordmark — Primary Nav Links — Actions) */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3.5 border-b border-slate-800/90 bg-[#090D16]/95 backdrop-blur">
        {/* Zone 1: Single Text Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home');
          }}
          className="text-base md:text-lg font-bold tracking-tight text-white whitespace-nowrap"
        >
          AI Trading Academy
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
          {(
            [
              { id: 'home', label: 'Home' },
              { id: 'learn', label: 'Learn' },
              { id: 'markets', label: 'Markets' },
              { id: 'practice', label: 'Practice Lab' },
              { id: 'tutor', label: 'AI Tutor' },
              { id: 'journal', label: 'Journal' },
              { id: 'profile', label: 'Profile & Settings' },
            ] as const
          ).map((nav) => (
            <button
              key={nav.id}
              type="button"
              onClick={() => setActiveTab(nav.id)}
              className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === nav.id
                  ? 'border-blue-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 2 Primary Actions (Search Knowledge Base + Language Switcher) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setGlobalSearchOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search Glossary</span>
          </button>

          <button
            type="button"
            onClick={() => setModalMode('language_only')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'hinglish' ? 'Hinglish · Change' : 'English · Change'}</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT WORKSPACE */}
      <main className="flex-1 w-full max-w-[1380px] mx-auto px-4 md:px-8 py-6 pb-24 lg:pb-10">
        {/* TAB 1: HOME DASHBOARD (Section 5) */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Hero Welcome & Adaptive Process Banner */}
            <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs text-slate-400 font-mono">
                  Skill Tier: {profile.skillLevel.toUpperCase()} · Streak: {profile.streakDays} Days · Language:{' '}
                  {lang === 'hinglish' ? 'Hinglish (Hindi + English)' : 'English'} · Market: NSE/BSE (₹ INR)
                </div>
                <h1 className="text-xl md:text-2xl font-semibold text-white">
                  {lang === 'hinglish'
                    ? `Namaste ${profile.name}. Aap apni ${profile.skillLevel} learning path mein ${progressPct}% aage badh chuke hain.`
                    : `Good day, ${profile.name}. You are ${progressPct}% through your personalized curriculum.`}
                </h1>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {lang === 'hinglish'
                    ? 'Hamara Core Process: LEARN → PRACTICE → DEFINE RULES → BACKTEST → PAPER TRADE → REVIEW. Bina stop-loss aur 1% position sizing ke kabhi trade na lein.'
                    : 'Core Academy Philosophy: "Don’t try to predict everything. Build a rules-based process." Learn → Practice → Define Rules → Backtest → Paper Trade → Review.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('learn')}
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <span>Continue Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('full_onboarding')}
                  className="px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 hover:bg-slate-800 text-xs text-slate-200 font-medium"
                >
                  Switch Level / Re-Assess
                </button>
              </div>
            </div>

            {/* Key Process & Risk Telemetry Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono tabular-nums">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-xs text-slate-400 block">Overall Curriculum Progress</span>
                <strong className="text-lg text-white mt-0.5 block">{progressPct}%</strong>
                <span className="text-[11px] text-emerald-400">
                  {profile.completedLessonIds.length} of {allLessons.length} modules completed
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-xs text-slate-400 block">Paper Portfolio (SIMULATION)</span>
                <strong className="text-lg text-white mt-0.5 block">
                  ₹{profile.paperBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </strong>
                <span className="text-[11px] text-blue-400">
                  Max Risk Rule: {profile.maxRiskPerTradePct}% per trade
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-xs text-slate-400 block">Risk Management Score</span>
                <strong className="text-lg text-emerald-400 mt-0.5 block">
                  {profile.skillScores.riskManagement}%
                </strong>
                <span className="text-[11px] text-slate-400">
                  100% Stop-Loss Adherence
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-xs text-slate-400 block">Quiz & Assessment Accuracy</span>
                <strong className="text-lg text-amber-300 mt-0.5 block">
                  {profile.quizAccuracy}%
                </strong>
                <span className="text-[11px] text-slate-400">
                  Across {profile.quizAttemptsCount} knowledge checks
                </span>
              </div>
            </div>

            {/* 5 Action Cards from Section 5 Specification */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1: Recommended Next Lesson */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-blue-400">
                    Adaptive Recommendation · Weakest Area Focus
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {recommendedLesson.title[lang]}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {recommendedLesson.concept[lang]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('learn')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white flex items-center justify-between"
                >
                  <span>Start {recommendedLesson.durationMinutes}-Min Interactive Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: Daily Chart Challenge */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-emerald-400">
                    Daily Practice · Bar-by-Bar Replay
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {lang === 'hinglish'
                      ? 'Historical Chart Challenge: Support, Resistance aur R:R Pehchanein'
                      : 'Interactive Chart Challenge: Identify Structure Before Reveal'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'hinglish'
                      ? 'RELIANCE aur NIFTY 50 ke chhupe hue candles ko reveal karne se pehle apna Entry, Stop-Loss aur Risk/Reward decision check karein.'
                      : 'Test your eye on historical NSE candles with future bars hidden. Evaluate trend, support/resistance, and Risk/Reward before revealing the outcome.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('learn')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white flex items-center justify-between"
                >
                  <span>Launch Chart Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 3: AI Personal Trading Tutor */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-amber-400">
                    5 Pedagogical Modes · English & Hinglish
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {lang === 'hinglish'
                      ? 'AI Trading Tutor & Chart Screenshot Assistant'
                      : 'AI Personal Trading Tutor & Chart Analyzer'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'hinglish'
                      ? '"Explain Like I’m New", "Quant Mode", ya "Debug My Strategy" mein koi bhi sawaal poochein ya chart screenshot upload karein.'
                      : 'Switch between Explain Like I’m New, Socratic Teacher Mode, Quant Mode, or upload a chart screenshot for a 6-part risk breakdown.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('tutor')}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center justify-between"
                >
                  <span>Ask AI Tutor Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Skill Profile Radar / Bar Breakdown (Section 30 & 52) + Recent Journal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Knowledge & Skill Competency Profile
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Adaptive Engine Active
                  </span>
                </div>

                <div className="space-y-3">
                  {(
                    [
                      { key: 'marketBasics', label: 'Market Basics & NSE/BSE Plumbing' },
                      { key: 'riskManagement', label: 'Risk Management & Position Sizing' },
                      { key: 'technicalAnalysis', label: 'Technical Analysis & Price Action' },
                      { key: 'fundamentalAnalysis', label: 'Fundamental Valuation (ROE/PE/PB)' },
                      { key: 'tradingPsychology', label: 'Trading Psychology & Discipline' },
                      { key: 'derivatives', label: 'Options Greeks & Payoff Math' },
                      { key: 'algoTrading', label: 'Systematic Backtesting & Quant' },
                    ] as const
                  ).map((sk) => {
                    const val = profile.skillScores[sk.key];
                    return (
                      <div key={sk.key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{sk.label}</span>
                          <span className="font-mono text-white">{val}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              val >= 70
                                ? 'bg-emerald-500'
                                : val >= 45
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Paper Trades & Process Milestones */}
              <div className="lg:col-span-6 p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Recent Paper Trading & Journal Activity
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('journal')}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      View Full Journal →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800/80 font-mono text-xs tabular-nums">
                    {trades.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="py-2.5 flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-semibold text-white">{t.symbol}</span>{' '}
                          <span className="text-slate-400">· {t.strategyTag}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={
                              t.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }
                          >
                            {t.netPnl >= 0 ? '+' : ''}₹{t.netPnl} ({t.rMultiple}R)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Responsible Gamification Milestones (Section 29 & 53) */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Award className="w-4 h-4" />
                    <span>Process-First Milestones (Never Rewards Reckless Leverage)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>✓ 1% Risk Sizing Mastered</div>
                    <div>✓ {profile.completedLessonIds.length} Lessons Completed</div>
                    <div>✓ 100% Stop-Loss Honored</div>
                    <div>✓ {journalEntries.length} Trades Journaled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEARN SECTION */}
        {activeTab === 'learn' && (
          <LearnSection
            profile={profile}
            onCompleteLesson={handleCompleteLesson}
            onCompleteChallenge={handleCompleteChallenge}
            onNavigate={setActiveTab}
          />
        )}

        {/* TAB 3: MARKETS SECTION */}
        {activeTab === 'markets' && (
          <MarketsSection
            profile={profile}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenPaperTradeForAsset={(sym) => {
              setPracticeTargetSymbol(sym);
              setActiveTab('practice');
            }}
            onNavigate={setActiveTab}
          />
        )}

        {/* TAB 4: PRACTICE LAB SECTION */}
        {activeTab === 'practice' && (
          <PracticeSection
            profile={profile}
            initialSymbol={practiceTargetSymbol}
            positions={positions}
            trades={trades}
            onPlacePaperOrder={handlePlacePaperOrder}
            onClosePaperPosition={handleClosePaperPosition}
            onResetPaperAccount={handleResetPaperAccount}
          />
        )}

        {/* TAB 5: AI TUTOR & CHART ASSISTANT */}
        {activeTab === 'tutor' && (
          <AITutorSection
            profile={profile}
            onToggleLanguage={(newLang) => updateProfile({ language: newLang })}
          />
        )}

        {/* TAB 6: TRADING JOURNAL & ANALYTICS */}
        {activeTab === 'journal' && (
          <JournalSection
            profile={profile}
            entries={journalEntries}
            onAddEntry={(newEntry) => setJournalEntries((prev) => [newEntry, ...prev])}
          />
        )}

        {/* TAB 7: PROFILE & SETTINGS (Language Switcher, Skill Presets, Risk Guardrails) */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-xl md:text-2xl font-semibold text-white">
                Profile, Language & Academy Settings
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Customize your explanation language (English / Hinglish), skill tier, and default risk guardrails anytime.
              </p>
            </div>

            {/* Language Preference Card with Example */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    1. Academy & AI Explanation Language
                  </h2>
                  <p className="text-xs text-slate-400">
                    Switches lesson explanations, quizzes, calculators, and AI Tutor responses immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalMode('language_only')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-blue-400 font-medium"
                >
                  Open Side-by-Side Language Preview Popup
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateProfile({ language: 'en' })}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    profile.language === 'en'
                      ? 'border-blue-500 bg-blue-950/30'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div className="text-sm font-semibold text-white">
                    English {profile.language === 'en' && '✓ (Active)'}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    "Risk 1% of your ₹1,00,000 capital (₹1,000) and size your shares based on the stop-loss distance."
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => updateProfile({ language: 'hinglish' })}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    profile.language === 'hinglish'
                      ? 'border-blue-500 bg-blue-950/30'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div className="text-sm font-semibold text-white">
                    Hinglish (Hindi + English){' '}
                    {profile.language === 'hinglish' && '✓ (Active)'}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    "Apne ₹1,00,000 capital par sirf 1% (₹1,000) risk lein aur stop-loss distance ke hisaab se quantity nikaalein."
                  </p>
                </button>
              </div>
            </div>

            {/* Skill Level & Persona Switcher */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  2. Switch Skill Level or Test Persona
                </h2>
                <p className="text-xs text-slate-400">
                  Test how the platform adapts across Beginner, Intermediate, and Advanced Quant tiers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => applyPresetPersona(lvl, profile.language)}
                    className={`p-4 rounded-xl border text-left capitalize transition-colors ${
                      profile.skillLevel === lvl
                        ? 'border-blue-500 bg-blue-950/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-semibold text-white">
                      {lvl} Profile {profile.skillLevel === lvl && '✓'}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Load {lvl} curriculum & skill scores
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Guardrails & Theme */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white">
                  Default Max Risk Per Trade (% of Capital)
                </label>
                <div className="flex items-center gap-2 font-mono text-xs">
                  {[0.5, 1.0, 1.5, 2.0].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateProfile({ maxRiskPerTradePct: r })}
                      className={`px-3 py-1.5 rounded border ${
                        profile.maxRiskPerTradePct === r
                          ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white">
                  Display Theme & Full Onboarding Reset
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateProfile({
                        theme: profile.theme === 'dark' ? 'light' : 'dark',
                      })
                    }
                    className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-200 flex items-center gap-1.5"
                  >
                    {profile.theme === 'dark' ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Switch to Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-blue-400" />
                        <span>Switch to Dark Mode</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalMode('full_onboarding')}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Run Onboarding Wizard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-slate-800 bg-[#090D16]/95 backdrop-blur px-2 py-1.5 grid grid-cols-7 gap-1">
        {(
          [
            { id: 'home', label: 'Home', Icon: Home },
            { id: 'learn', label: 'Learn', Icon: BookOpen },
            { id: 'markets', label: 'Markets', Icon: BarChart3 },
            { id: 'practice', label: 'Practice', Icon: Sliders },
            { id: 'tutor', label: 'AI Tutor', Icon: Bot },
            { id: 'journal', label: 'Journal', Icon: BookMarked },
            { id: 'profile', label: 'Profile', Icon: User },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center justify-center py-1 rounded text-[10px] font-medium ${
              activeTab === id ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
