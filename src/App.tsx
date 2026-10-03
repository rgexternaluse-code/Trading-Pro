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
  LogOut,
  Eye,
  TrendingUp,
  Sparkles,
  Play,
  CheckCircle2,
} from 'lucide-react';
import {
  AIErrorReport,
  AuthSessionUser,
  ChapterDefinition,
  JournalEntry,
  Language,
  LearningAnalyticsEvent,
  Lesson,
  NavigationTab,
  PaperPosition,
  PaperTradeRecord,
  SkillLevel,
  UserChapterProgress,
  UserProfile,
  UserWeakSkill,
} from './types';
import { COURSE_PATHS } from './data/curriculumData';
import { CHAPTER_CURRICULUM } from './data/chapterCurriculum';
import { computeChapterStatus } from './services/masteryEngine';
import {
  GLOSSARY_ITEMS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_PAPER_POSITIONS,
  INITIAL_PAPER_TRADES,
} from './data/challengesAndGlossary';
import { INITIAL_AI_ERROR_REPORTS } from './data/interactiveExercisesV2';
import { calculateIndianTradeCharges } from './data/indianMarketData';
import { LanguageOnboardingModal } from './components/LanguageOnboardingModal';
import { LoginScreen } from './components/LoginScreen';
import { AdminDashboardSection } from './components/AdminDashboardSection';
import { LearnSection } from './components/LearnSection';
import { MarketsSection } from './components/MarketsSection';
import { PracticeSection } from './components/PracticeSection';
import { AITutorSection } from './components/AITutorSection';
import { JournalSection } from './components/JournalSection';
import { GovernanceStudioSection } from './components/GovernanceStudioSection';

const STORAGE_KEY_PROFILE = 'aitia_user_profile_v1';
const STORAGE_KEY_POSITIONS = 'aitia_paper_positions_v1';
const STORAGE_KEY_TRADES = 'aitia_paper_trades_v1';
const STORAGE_KEY_JOURNAL = 'aitia_journal_entries_v1';
const STORAGE_KEY_SESSION = 'aitia_auth_session_v1';

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

  const [errorReports, setErrorReports] = useState<AIErrorReport[]>(
    INITIAL_AI_ERROR_REPORTS
  );

  const handleReportIssue = (
    report: Omit<AIErrorReport, 'id' | 'timestamp' | 'status'>
  ) => {
    const newRep: AIErrorReport = {
      ...report,
      id: 'err-' + Date.now(),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'open_review',
    };
    setErrorReports((prev) => [newRep, ...prev]);
  };

  const handleResolveReport = (id: string) => {
    setErrorReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'verified_fixed' } : r))
    );
  };

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [authUser, setAuthUser] = useState<AuthSessionUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  });
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  // 18-Chapter Mastery System State
  const [chapters, setChapters] = useState<ChapterDefinition[]>(CHAPTER_CURRICULUM);
  const [activeChapterId, setActiveChapterId] = useState<string>('ch-01');
  const [chapterProgressMap, setChapterProgressMap] = useState<
    Record<string, UserChapterProgress>
  >({});
  const [weakSkills, setWeakSkills] = useState<UserWeakSkill[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<LearningAnalyticsEvent[]>([]);
  // Separate simulation progress map when Admin toggles "Preview as User" (Section 40.12)
  const [isPreviewAsUser, setIsPreviewAsUser] = useState<boolean>(false);
  const [previewProgressMap, setPreviewProgressMap] = useState<
    Record<string, UserChapterProgress>
  >({});

  // Verify backend session on mount if token exists
  useEffect(() => {
    if (!authUser?.token) return;
    fetch('/api/auth/session', {
      headers: { Authorization: `Bearer ${authUser.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session expired');
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setAuthUser(data.user);
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(data.user));
        }
      })
      .catch(() => {
        // Re-authenticate or clear stale token
      });
  }, []);

  // Load user-isolated chapter progress from backend/localStorage when authUser changes
  useEffect(() => {
    if (!authUser) return;
    const localKey = `aitia_chapter_prog_${authUser.id}`;
    try {
      const savedLocal = localStorage.getItem(localKey);
      if (savedLocal) {
        setChapterProgressMap(JSON.parse(savedLocal));
      } else {
        setChapterProgressMap({});
      }
    } catch {}

    fetch('/api/user/progress', {
      headers: { Authorization: `Bearer ${authUser.token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.progress && Object.keys(data.progress).length > 0) {
          setChapterProgressMap(data.progress);
        }
      })
      .catch(() => {});
  }, [authUser?.id]);

  const handleLoginSuccess = (loggedInUser: AuthSessionUser) => {
    setAuthUser(loggedInUser);
    setSessionMessage(null);
    setIsPreviewAsUser(false);
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(loggedInUser));
    } catch {}
    setProfile((prev) => ({
      ...prev,
      name: loggedInUser.displayName,
    }));
    // Land on TradeLearn Home screen so user immediately sees the redesigned UI
    setActiveTab('home');
  };

  const handleLogout = async () => {
    if (authUser?.token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authUser.token}` },
        });
      } catch {}
    }
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch {}
    setAuthUser(null);
    setIsPreviewAsUser(false);
    setActiveTab('home');
  };

  const handleUpdateChapterProgress = (
    chapterId: string,
    updated: UserChapterProgress,
    updatedWeakSkills?: UserWeakSkill[],
    eventType?: LearningAnalyticsEvent['eventType'],
    details?: string
  ) => {
    if (updatedWeakSkills) {
      setWeakSkills(updatedWeakSkills);
    }
    if (eventType && authUser) {
      setAnalyticsEvents((prev) => [
        {
          id: `ev-${Date.now()}`,
          userId: authUser.id,
          eventType,
          chapterId,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          details: details || '',
        },
        ...prev,
      ]);
    }

    // If Admin is in "Preview as User" mode, mutate only simulation state (Section 40.12)
    if (authUser?.role === 'admin' && isPreviewAsUser) {
      setPreviewProgressMap((prev) => ({ ...prev, [chapterId]: updated }));
      return;
    }

    setChapterProgressMap((prev) => {
      const next = { ...prev, [chapterId]: updated };
      if (authUser) {
        try {
          localStorage.setItem(
            `aitia_chapter_prog_${authUser.id}`,
            JSON.stringify(next)
          );
        } catch {}
        fetch('/api/user/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authUser.token}`,
          },
          body: JSON.stringify({ progress: next }),
        }).catch(() => {});
      }
      return next;
    });
  };

  const handleUpdateChapterConfig = (
    chapterId: string,
    updates: { masteryThreshold?: number; prerequisiteChapterIds?: string[] }
  ) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, ...updates } : ch))
    );
  };

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
    document.documentElement.setAttribute('data-theme', profile.theme || 'dark');
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

  const handleCompleteLesson = (
    lessonOrId: Lesson | string,
    quizCorrect: boolean
  ) => {
    const lessonId = typeof lessonOrId === 'string' ? lessonOrId : lessonOrId.id;
    const lesson =
      typeof lessonOrId === 'string'
        ? allLessons.find((l) => l.id === lessonId)
        : lessonOrId;
    const category = lesson?.category || 'marketBasics';

    setProfile((prev) => {
      const completed = prev.completedLessonIds.includes(lessonId)
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];
      const currentCatScore = prev.skillScores[category] || 50;
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
          [category]: Math.min(100, currentCatScore + delta),
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
  const isAdmin = authUser?.role === 'admin';
  const effectiveAdminBypass = Boolean(isAdmin && !isPreviewAsUser);
  const effectiveChapterProgressMap =
    isAdmin && isPreviewAsUser ? previewProgressMap : chapterProgressMap;

  const masteredChaptersCount = chapters.filter(
    (c) =>
      computeChapterStatus(
        c,
        effectiveChapterProgressMap,
        effectiveAdminBypass
      ) === 'mastered'
  ).length;

  const currentFocusChapter =
    chapters.find(
      (c) =>
        computeChapterStatus(
          c,
          effectiveChapterProgressMap,
          false
        ) !== 'mastered'
    ) || chapters[0];

  // Require login before accessing the application (Section 40.3)
  if (!authUser) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        sessionExpiredMessage={sessionMessage}
      />
    );
  }

  return (
    <div
      data-theme={profile.theme || 'dark'}
      className={`min-h-screen flex flex-col transition-colors ${
        isLight ? 'bg-[#F7F8FC] text-[#0F172A]' : 'bg-[#0B1020] text-[#F8FAFC]'
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
      <header
        className={`sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3.5 border-b backdrop-blur-md ${
          isLight
            ? 'border-[#E2E8F0] bg-[#FFFFFF]/95'
            : 'border-[#1E2D4A] bg-[#070D19]/95'
        }`}
      >
        {/* Zone 1: TradeLearn Brand Identity */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home');
          }}
          className="flex items-center gap-3 whitespace-nowrap group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14B8A6]/25 to-[#6366F1]/25 border border-[#14B8A6]/40 flex items-center justify-center text-[#14B8A6] shadow-inner">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-white leading-none">
              TradeLearn
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
              Learn • Practice • Grow
            </div>
          </div>
        </a>

        {/* Zone 2: Sleek Segmented Navigation Bar (Role-Aware) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#0B1325] border border-[#1E2D4A]">
          {(
            [
              { id: 'home' as NavigationTab, label: 'Home' },
              { id: 'learn' as NavigationTab, label: 'Easy Lessons' },
              { id: 'practice' as NavigationTab, label: 'Hands-on Practice' },
              { id: 'tutor' as NavigationTab, label: '✦ AI Tutor' },
              { id: 'markets' as NavigationTab, label: 'Markets' },
              { id: 'journal' as NavigationTab, label: 'Journal' },
              { id: 'governance' as NavigationTab, label: 'QA Lab' },
              ...(isAdmin
                ? [{ id: 'admin' as NavigationTab, label: '★ Admin Studio' }]
                : []),
              { id: 'profile' as NavigationTab, label: 'Profile' },
            ]
          ).map((nav) => {
            const isAiTab = nav.id === 'tutor';
            const isActive = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                type="button"
                onClick={() => setActiveTab(nav.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? isAiTab
                      ? 'bg-[#14B8A6] text-white font-bold shadow-sm'
                      : 'bg-gradient-to-r from-[#5B5FEF] to-[#6366F1] text-white font-bold shadow-sm'
                    : isAiTab
                    ? 'text-[#14B8A6] hover:bg-[#14B8A6]/10 font-semibold'
                    : 'text-slate-300 hover:text-white font-medium'
                }`}
              >
                {nav.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Role Badge + Search + Theme + Language + Logout) */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsPreviewAsUser((prev) => !prev)}
              title="Toggle Admin Preview as User Simulation Mode"
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono cursor-pointer ${
                isPreviewAsUser
                  ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#F59E0B]'
                  : 'border-[#6366F1]/40 bg-[#6366F1]/15 text-[#6366F1]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreviewAsUser ? 'User Preview' : 'Admin Mode'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setGlobalSearchOpen(true)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Glossary</span>
          </button>

          <button
            type="button"
            onClick={() =>
              updateProfile({
                theme: profile.theme === 'dark' ? 'light' : 'dark',
              })
            }
            title="Switch between Dark Theme (Charts/Trading) and Light Theme (Reading/Lessons)"
            className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            {profile.theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#6366F1]" />
                <span className="hidden md:inline">Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setModalMode('language_only')}
            className="px-2.5 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'hinglish' ? 'Hinglish' : 'English'}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title={`Logged in as ${authUser.username} (${authUser.role.toUpperCase()}) · Click to Logout`}
            className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-[#EF4444] text-xs text-slate-300 hover:text-[#EF4444] flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{authUser.username}</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT WORKSPACE */}
      <main className="flex-1 w-full max-w-[1380px] mx-auto px-4 md:px-8 py-6 pb-24 lg:pb-10 relative">
        {/* Ambient radial background glows matching TradeLearn UI */}
        {!isLight && (
          <>
            <div className="pointer-events-none fixed top-16 left-1/3 w-[520px] h-[320px] rounded-full bg-[#6366F1]/10 blur-[120px] -z-10" />
            <div className="pointer-events-none fixed bottom-16 right-1/4 w-[420px] h-[280px] rounded-full bg-[#14B8A6]/10 blur-[110px] -z-10" />
          </>
        )}

        {/* TAB 1: HOME DASHBOARD (TradeLearn Reference Design: Screen 1 Hero + Screen 2 Progress & Today's Lesson + Learning Path) */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* TOP SPLIT SHOWCASE: LEFT = TRADELEARN HERO CARD (Exact Reference Image) | RIGHT = PERSONAL PROGRESS & TODAY'S LESSON */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* LEFT CARD (6 COLS): EXACT TRADELEARN HERO & 3 PILLAR CARDS FROM SHARED IMAGE */}
              <div className="lg:col-span-6 bg-[#0B1325] border border-[#1E2D4A] rounded-3xl p-6 md:p-7 shadow-2xl flex flex-col justify-between space-y-5 relative overflow-hidden">
                <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-44 rounded-full bg-[#14B8A6]/15 blur-[80px]" />

                {/* Brand Header */}
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14B8A6]/25 to-[#6366F1]/25 border border-[#14B8A6]/40 flex items-center justify-center text-[#14B8A6] shadow-inner">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold tracking-tight text-white leading-none">
                        TradeLearn
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-medium tracking-wide mt-0.5">
                        Learn • Practice • Grow
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('admin')}
                      className="px-3.5 py-1.5 rounded-full bg-[#6366F1]/15 border border-[#6366F1]/40 text-xs font-bold text-[#818CF8] hover:bg-[#6366F1]/25 cursor-pointer"
                    >
                      ★ Open Admin Studio →
                    </button>
                  )}
                </div>

                {/* Custom Candlestick & Trader Hero Illustration */}
                <div className="relative rounded-2xl bg-gradient-to-b from-[#0E1A32] to-[#091122] border border-[#1C2C4C] p-4 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_40%,rgba(20,184,166,0.18),transparent_65%)]" />
                  <svg
                    viewBox="0 0 480 175"
                    className="w-full h-36 md:h-40 overflow-visible"
                    aria-label="Learn Trading Step by Step Illustration"
                  >
                    {[30, 70, 110, 150].map((y) => (
                      <line
                        key={y}
                        x1="16"
                        y1={y}
                        x2="464"
                        y2={y}
                        stroke="#1B2A47"
                        strokeDasharray="3 4"
                        strokeWidth="1"
                      />
                    ))}
                    <path
                      d="M 28 142 Q 115 124, 185 90 T 355 52 L 445 20"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <polygon points="452,14 436,16 444,29" fill="#22C55E" />
                    {[
                      { x: 40, h: 108, l: 152, o: 140, c: 118, bull: true },
                      { x: 72, h: 100, l: 144, o: 118, c: 132, bull: false },
                      { x: 104, h: 80, l: 132, o: 126, c: 92, bull: true },
                      { x: 136, h: 60, l: 114, o: 92, c: 70, bull: true },
                      { x: 168, h: 68, l: 118, o: 74, c: 102, bull: false },
                      { x: 200, h: 44, l: 100, o: 94, c: 54, bull: true },
                      { x: 232, h: 34, l: 84, o: 54, c: 42, bull: true },
                      { x: 376, h: 42, l: 94, o: 80, c: 52, bull: true },
                      { x: 410, h: 24, l: 74, o: 52, c: 30, bull: true },
                    ].map((cd, i) => {
                      const col = cd.bull ? '#22C55E' : '#EF4444';
                      const top = Math.min(cd.o, cd.c);
                      const height = Math.max(8, Math.abs(cd.c - cd.o));
                      return (
                        <g key={i}>
                          <line
                            x1={cd.x}
                            y1={cd.h}
                            x2={cd.x}
                            y2={cd.l}
                            stroke={col}
                            strokeWidth="2.2"
                          />
                          <rect
                            x={cd.x - 8}
                            y={top}
                            width="16"
                            height={height}
                            rx="3"
                            fill={col}
                          />
                        </g>
                      );
                    })}
                    <g transform="translate(245, 36)">
                      <path
                        d="M 28 84 C 28 58, 92 58, 92 84 L 102 128 L 18 128 Z"
                        fill="#4F46E5"
                      />
                      <circle cx="60" cy="36" r="21" fill="#FDBA74" />
                      <path
                        d="M 39 32 C 38 14, 82 12, 81 32 C 74 22, 48 22, 39 32 Z"
                        fill="#1E1B4B"
                      />
                      <circle cx="52" cy="35" r="2" fill="#0F172A" />
                      <circle cx="66" cy="35" r="2" fill="#0F172A" />
                      <path
                        d="M 54 44 Q 59 48, 65 44"
                        fill="none"
                        stroke="#0F172A"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <rect
                        x="62"
                        y="78"
                        width="64"
                        height="44"
                        rx="6"
                        fill="#CBD5E1"
                        stroke="#94A3B8"
                        strokeWidth="2"
                      />
                      <circle cx="94" cy="100" r="5" fill="#64748B" />
                      <rect
                        x="46"
                        y="122"
                        width="90"
                        height="6"
                        rx="3"
                        fill="#94A3B8"
                      />
                    </g>
                  </svg>
                </div>

                {/* Headline & Subtitle */}
                <div className="space-y-1.5">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                    <span className="block text-white">Learn Trading</span>
                    <span className="block bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#6366F1] bg-clip-text text-transparent">
                      Step by Step
                    </span>
                  </h1>
                  <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
                    Build your skills, gain confidence and master the markets — at
                    your own pace.
                  </p>
                </div>

                {/* 3 Feature Pillar Cards (Easy Lessons · Hands-on Practice · AI Tutor) */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('learn')}
                    className="p-3.5 rounded-2xl bg-[#101C34] border border-[#223254] hover:border-[#60A5FA] text-center space-y-1.5 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#60A5FA] flex items-center justify-center mx-auto">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-white leading-snug">
                      Easy Lessons
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-tight">
                      Simple, clear and visual.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('practice')}
                    className="p-3.5 rounded-2xl bg-[#101C34] border border-[#223254] hover:border-[#22C55E] text-center space-y-1.5 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center mx-auto">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-white leading-snug">
                      Hands-on Practice
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-tight">
                      Apply what you learn.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('tutor')}
                    className="p-3.5 rounded-2xl bg-[#101C34] border border-[#223254] hover:border-[#C084FC] text-center space-y-1.5 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#C084FC] flex items-center justify-center mx-auto">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-white leading-snug">
                      AI Tutor
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-tight">
                      Get personal guidance anytime.
                    </p>
                  </button>
                </div>

                {/* Primary Pill CTA Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveChapterId(currentFocusChapter.id);
                    setActiveTab('learn');
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#5B5FEF] to-[#6366F1] hover:from-[#4F46E5] hover:to-[#5B5FEF] text-white text-sm font-bold shadow-lg shadow-[#6366F1]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* RIGHT COLUMN (6 COLS): GREETING, PROGRESS RING, TODAY'S LESSON & AI TUTOR */}
              <div className="lg:col-span-6 flex flex-col justify-between gap-5">
                {/* Welcome & Overall Progress Card */}
                <div className="p-6 rounded-3xl border border-[#1E2D4A] bg-[#0B1325] shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-[#60A5FA]">
                        🔥 {profile.streakDays} Day Streak · Level: {profile.skillLevel.toUpperCase()}
                      </div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-white mt-0.5">
                        {lang === 'hinglish'
                          ? `Namaste, ${profile.name}! 👋`
                          : `Hello, ${profile.name}! 👋`}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalMode('full_onboarding')}
                      className="px-3.5 py-2 rounded-full border border-[#223254] bg-[#101C34] hover:border-[#6366F1] text-xs text-slate-200 font-semibold cursor-pointer"
                    >
                      Customize Goal
                    </button>
                  </div>

                  {/* Your Progress Bar Box */}
                  <div className="p-4 rounded-2xl bg-[#101C34] border border-[#223254] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Your Learning Progress</span>
                      <span className="font-mono font-bold text-[#60A5FA]">
                        {masteredChaptersCount}/{chapters.length} Chapters Mastered ({progressPct}% Lessons)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#070D19] overflow-hidden border border-[#1E2D4A]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#14B8A6] transition-all"
                        style={{ width: `${Math.max(12, progressPct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Today's Lesson Card */}
                <div className="p-6 rounded-3xl border border-[#6366F1]/40 bg-[#0B1325] shadow-xl space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#60A5FA] font-bold uppercase flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>
                        TODAY&apos;S LESSON · CHAPTER {String(currentFocusChapter.chapterNumber).padStart(2, '0')}
                      </span>
                    </span>
                    <span className="text-slate-400">
                      {currentFocusChapter.estimatedMinutes} min · {currentFocusChapter.stageCategory}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-extrabold text-white">
                      {currentFocusChapter.title[lang]}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                      {currentFocusChapter.description[lang]}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChapterId(currentFocusChapter.id);
                        setActiveTab('learn');
                      }}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5B5FEF] to-[#6366F1] hover:from-[#4F46E5] hover:to-[#5B5FEF] text-white text-xs font-bold shadow-lg shadow-[#6366F1]/25 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue Lesson</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('practice')}
                      className="px-4 py-2.5 rounded-full border border-[#223254] bg-[#101C34] hover:border-[#22C55E] text-xs text-slate-200 font-semibold cursor-pointer"
                    >
                      Hands-on Simulator →
                    </button>
                  </div>
                </div>

                {/* Personal AI Tutor Card */}
                <div className="p-6 rounded-3xl border border-[#14B8A6]/40 bg-[#0B1325] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-[#14B8A6] uppercase">
                      ✦ AI TUTOR · PERSONAL GUIDANCE ANYTIME
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {lang === 'hinglish'
                        ? 'Candlestick pattern ya 1% risk rule par sawaal hai?'
                        : 'Have a question about candlesticks, stop-loss, or chart structure?'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ask in English or Hinglish — get step-by-step explanations or upload a chart.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tutor')}
                    className="px-5 py-2.5 rounded-full bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold shadow-lg shadow-[#14B8A6]/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>✦ Ask AI Tutor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* YOUR LEARNING PATH — Sleek Rounded-3xl Module Cards with Brand Indigo (#6366F1) Progress */}
            <div className="p-6 rounded-3xl border border-[#1E2D4A] bg-[#0B1325] space-y-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2D4A] pb-3.5">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-white">
                    Learning Path &amp; Module Progress ({progressPct}% Overall)
                  </h2>
                  <p className="text-xs text-slate-400">
                    {profile.completedLessonIds.length} / {allLessons.length} lessons completed · Step-by-step skill progression
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('learn')}
                  className="text-xs text-[#6366F1] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View All 18 Chapters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {COURSE_PATHS.slice(0, 4).map((pathItem, idx) => {
                  const totalInPath = pathItem.lessons.length;
                  const doneInPath = pathItem.lessons.filter((l) =>
                    profile.completedLessonIds.includes(l.id)
                  ).length;
                  const pct = Math.round(
                    (doneInPath / Math.max(1, totalInPath)) * 100
                  );
                  const isDone = pct === 100;

                  return (
                    <div
                      key={pathItem.id}
                      className="p-4 rounded-2xl border border-[#223254] bg-[#101C34] flex flex-col justify-between space-y-3 hover:border-[#6366F1]/50 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-[#60A5FA] font-semibold">
                            0{idx + 1} · {pathItem.level.toUpperCase()}
                          </span>
                          <span
                            className={`font-mono ${
                              isDone ? 'text-[#22C55E]' : 'text-slate-400'
                            }`}
                          >
                            {isDone
                              ? '✓ Completed'
                              : `${doneInPath}/${totalInPath} lessons`}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white">
                          {pathItem.title[lang]}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {pathItem.subtitle[lang]}
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">Progress</span>
                          <span
                            className={
                              isDone ? 'text-[#22C55E] font-semibold' : 'text-white'
                            }
                          >
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#070D19] overflow-hidden border border-[#1E2D4A]">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: isDone ? '#22C55E' : '#6366F1',
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('learn')}
                          className="text-xs font-semibold text-[#60A5FA] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                        >
                          <span>Continue Lesson →</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Process & Chapter Mastery Summary Row (TradeLearn Rounded-2xl Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono tabular-nums">
              <div className="p-4 rounded-2xl border border-[#1E2D4A] bg-[#0B1325]">
                <span className="text-xs text-slate-400 block">Chapters Mastered</span>
                <strong className="text-lg text-white mt-0.5 block">
                  {masteredChaptersCount} / {chapters.length}
                </strong>
                <span className="text-[11px] text-[#60A5FA]">
                  Current: CH {String(currentFocusChapter.chapterNumber).padStart(2, '0')} · {currentFocusChapter.title.en}
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-[#1E2D4A] bg-[#0B1325]">
                <span className="text-xs text-slate-400 block">Paper Portfolio (SIMULATION)</span>
                <strong className="text-lg text-white mt-0.5 block">
                  ₹{profile.paperBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </strong>
                <span className="text-[11px] text-[#F59E0B]">
                  ⚠ Max Risk Rule: {profile.maxRiskPerTradePct}% per trade
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-[#1E2D4A] bg-[#0B1325]">
                <span className="text-xs text-slate-400 block">Skills Needing Practice</span>
                <strong
                  className={`text-lg mt-0.5 block ${
                    weakSkills.length > 0 ? 'text-[#F59E0B]' : 'text-[#22C55E]'
                  }`}
                >
                  {weakSkills.length === 0 ? '✓ 0 Weak Skills' : `⚠ ${weakSkills.length} Concepts`}
                </strong>
                <span className="text-[11px] text-slate-400">
                  100% Stop-Loss Adherence
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-[#1E2D4A] bg-[#0B1325]">
                <span className="text-xs text-slate-400 block">Current Streak &amp; Accuracy</span>
                <strong className="text-lg text-[#60A5FA] mt-0.5 block">
                  🔥 {profile.streakDays} Days · {profile.quizAccuracy}%
                </strong>
                <span className="text-[11px] text-slate-400">
                  Role: {authUser.role.toUpperCase()} ({authUser.username})
                </span>
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
                            className="h-full rounded-full"
                            style={{
                              width: `${val}%`,
                              backgroundColor: val >= 80 ? '#22C55E' : '#6366F1',
                            }}
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
                              t.netPnl >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                            }
                          >
                            {t.netPnl >= 0 ? '▲ +₹' : '▼ -₹'}
                            {Math.abs(t.netPnl)} ({t.rMultiple}R)
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

        {/* ADMIN DASHBOARD TAB (Restricted to Role === 'admin') */}
        {activeTab === 'admin' && isAdmin && (
          <AdminDashboardSection
            currentUser={authUser}
            language={profile.language}
            chapters={chapters}
            onUpdateChapterConfig={handleUpdateChapterConfig}
            isPreviewAsUser={isPreviewAsUser}
            onTogglePreviewAsUser={setIsPreviewAsUser}
            onOpenChapterInLearn={(chId) => {
              setActiveChapterId(chId);
              setActiveTab('learn');
            }}
            onNavigateTab={setActiveTab}
            errorReports={errorReports}
            onResolveReport={handleResolveReport}
            analyticsEvents={analyticsEvents}
          />
        )}

        {/* TAB 2: LEARN SECTION (18-CHAPTER MASTERY LEARNING SYSTEM) */}
        {activeTab === 'learn' && (
          <LearnSection
            profile={profile}
            chapters={chapters}
            chapterProgressMap={effectiveChapterProgressMap}
            weakSkills={weakSkills}
            isAdminBypass={effectiveAdminBypass}
            activeChapterId={activeChapterId}
            onSelectChapter={setActiveChapterId}
            onUpdateChapterProgress={handleUpdateChapterProgress}
            onCompleteLessonLegacy={handleCompleteLesson}
            onCompleteChallenge={handleCompleteChallenge}
            onNavigateTab={setActiveTab}
            onReportIssue={handleReportIssue}
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
            onReportIssue={handleReportIssue}
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

        {/* TAB 7: CONTENT GOVERNANCE, DETERMINISTIC TEST SUITE & SUPABASE SCHEMA (MASTER SPEC V2) */}
        {activeTab === 'governance' && (
          <GovernanceStudioSection
            language={profile.language}
            errorReports={errorReports}
            onResolveReport={handleResolveReport}
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
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-slate-800 bg-[#090D16]/95 backdrop-blur px-2 py-1.5 grid grid-cols-8 gap-1">
        {(
          [
            { id: 'home', label: 'Home', Icon: Home },
            { id: 'learn', label: 'Learn', Icon: BookOpen },
            { id: 'markets', label: 'Markets', Icon: BarChart3 },
            { id: 'practice', label: 'Practice', Icon: Sliders },
            { id: 'tutor', label: 'AI Tutor', Icon: Bot },
            { id: 'journal', label: 'Journal', Icon: BookMarked },
            { id: 'governance', label: 'QA Lab', Icon: ShieldCheck },
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
