import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Eye,
  RotateCcw,
  ShieldAlert,
  Target,
  Brain,
  BarChart2,
} from 'lucide-react';
import { COURSE_PATHS } from '../data/curriculumData';
import { BEHAVIORAL_SCENARIOS, CHART_CHALLENGES } from '../data/challengesAndGlossary';
import { INDIAN_MARKET_ASSETS } from '../data/indianMarketData';
import { Language, Lesson, NavigationTab, SkillLevel, UserProfile } from '../types';
import { InteractiveCandlestickChart } from './InteractiveCandlestickChart';

interface LearnSectionProps {
  profile: UserProfile;
  onCompleteLesson: (lesson: Lesson, quizCorrect: boolean) => void;
  onCompleteChallenge: (challengeId: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const LearnSection: React.FC<LearnSectionProps> = ({
  profile,
  onCompleteLesson,
  onCompleteChallenge,
  onNavigate,
}) => {
  const lang: Language = profile.language;
  const [subTab, setSubTab] = useState<'courses' | 'challenge' | 'psychology'>('courses');
  const [levelFilter, setLevelFilter] = useState<'all' | SkillLevel>('all');

  const allLessons = COURSE_PATHS.flatMap((p) => p.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0].id);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Chart Challenge state
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const [trendAns, setTrendAns] = useState<number | null>(null);
  const [actionAns, setActionAns] = useState<number | null>(null);
  const [candlesRevealed, setCandlesRevealed] = useState<boolean>(false);

  // Behavioral Scenario state
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, number>>({});

  const activeLesson =
    allLessons.find((l) => l.id === activeLessonId) || allLessons[0];

  const lessonAsset =
    INDIAN_MARKET_ASSETS.find((a) => a.symbol === activeLesson.visualChartSymbol) ||
    INDIAN_MARKET_ASSETS[0];

  const filteredPaths =
    levelFilter === 'all'
      ? COURSE_PATHS
      : COURSE_PATHS.filter((p) => p.level === levelFilter);

  const handleSelectLesson = (id: string) => {
    setActiveLessonId(id);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    const q = activeLesson.quiz[0];
    const isCorrect = selectedQuizOption === q.correctIndex;
    onCompleteLesson(activeLesson, isCorrect);
  };

  const activeChallenge = CHART_CHALLENGES[activeChallengeIdx] || CHART_CHALLENGES[0];
  const challengeCombinedCandles = [
    ...activeChallenge.visibleCandles,
    ...activeChallenge.hiddenCandles,
  ];

  const handleRevealChallenge = () => {
    setCandlesRevealed(true);
    onCompleteChallenge(activeChallenge.id);
  };

  const handleResetChallenge = (newIdx: number) => {
    setActiveChallengeIdx(newIdx);
    setTrendAns(null);
    setActionAns(null);
    setCandlesRevealed(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Sub-Navigation & Adaptive Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            {lang === 'hinglish'
              ? 'Structured Trading & Investment Academy'
              : 'Structured Trading & Investment Academy'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'hinglish'
              ? 'Concept → Simple Explanation → ₹ Example → Interactive Chart → Common Mistakes → Quiz → Practice'
              : 'Progressive curriculum: Concept · Indian ₹ Example · Interactive Chart · Common Mistakes · Quiz · Practice'}
          </p>
        </div>

        {/* Interactive Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setSubTab('courses')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'courses'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Paths</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('challenge')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'challenge'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Chart Challenge Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('psychology')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'psychology'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Psychology Scenarios</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: STRUCTURED CURRICULUM & 8-STEP LESSON VIEWER */}
      {subTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Course Paths & Modules */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-400">Filter by Skill Level</span>
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevelFilter(lvl)}
                    className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors ${
                      levelFilter === lvl
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredPaths.map((path) => (
                <div
                  key={path.id}
                  className="border border-slate-800 bg-slate-900/60 rounded-xl p-4 space-y-3"
                >
                  <div>
                    <div className="text-xs text-slate-400 font-mono">
                      {path.code} · {path.level.toUpperCase()} · {path.modulesCount} Modules
                    </div>
                    <h3 className="text-sm font-semibold text-white mt-0.5">
                      {path.title[lang]}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {path.subtitle[lang]}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    {path.lessons.map((lesson) => {
                      const isDone = profile.completedLessonIds.includes(lesson.id);
                      const isActive = lesson.id === activeLesson.id;
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => handleSelectLesson(lesson.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${
                            isActive
                              ? 'border-blue-500 bg-blue-950/35 text-white'
                              : 'border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              M{lesson.moduleNumber}: {lesson.title[lang]}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {lesson.durationMinutes} min ·{' '}
                              {isDone ? 'Completed ✓' : 'Interactive Lesson'}
                            </div>
                          </div>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 8-Part Interactive Lesson Engine */}
          <div className="lg:col-span-8 border border-slate-800 bg-slate-900/60 rounded-xl p-5 md:p-6 space-y-6">
            {/* Lesson Header */}
            <div className="border-b border-slate-800 pb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-blue-400 font-mono">
                  Module {activeLesson.moduleNumber} · {activeLesson.level.toUpperCase()} ·{' '}
                  {activeLesson.durationMinutes} min read · Language:{' '}
                  {lang === 'hinglish' ? 'Hinglish' : 'English'}
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-white mt-1">
                  {activeLesson.title[lang]}
                </h2>
              </div>
              {profile.completedLessonIds.includes(activeLesson.id) && (
                <span className="text-xs font-mono text-emerald-400">
                  ● Completed
                </span>
              )}
            </div>

            {/* 1. Concept & 2. Simple Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="text-xs font-semibold text-blue-400">
                  01. Core Concept
                </div>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                  {activeLesson.concept[lang]}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="text-xs font-semibold text-emerald-400">
                  02. Simple Explanation ({lang === 'hinglish' ? 'Hinglish' : 'Plain English'})
                </div>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                  {activeLesson.simpleExplanation[lang]}
                </p>
              </div>
            </div>

            {/* 3. Realistic Indian Market Example */}
            <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-500/30 space-y-1.5">
              <div className="text-xs font-semibold text-blue-300">
                03. Realistic Indian Market (₹ INR) Example
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-mono">
                {activeLesson.realisticExample[lang]}
              </p>
            </div>

            {/* 4. Interactive Visual Chart Example */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-slate-200">
                  04. Interactive Visual Chart · {lessonAsset.symbol} ({lessonAsset.exchange})
                </div>
                <div className="text-xs text-slate-400">
                  {activeLesson.visualChartAnnotation[lang]}
                </div>
              </div>
              <InteractiveCandlestickChart
                symbol={lessonAsset.symbol}
                candles={lessonAsset.candles}
                supportLevel={lessonAsset.supportLevel}
                resistanceLevel={lessonAsset.resistanceLevel}
                showEma20={true}
                height={270}
              />
            </div>

            {/* 5. Common Mistakes */}
            <div className="p-4 rounded-lg bg-rose-950/15 border border-rose-500/30 space-y-2">
              <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>05. Common Mistakes Beginners & Traders Make</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {activeLesson.commonMistakes.map((m, i) => (
                  <li key={i} className="leading-relaxed">
                    {m[lang]}
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. Interactive Mini Quiz */}
            {activeLesson.quiz.length > 0 && (
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-amber-400">
                  06. Knowledge Check Mini-Quiz
                </div>
                <p className="text-sm font-medium text-white">
                  {activeLesson.quiz[0].question[lang]}
                </p>
                <div className="space-y-2">
                  {activeLesson.quiz[0].options.map((opt, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isRight = idx === activeLesson.quiz[0].correctIndex;
                    let borderStyle = 'border-slate-800 bg-slate-900/70 text-slate-200';
                    if (quizSubmitted) {
                      if (isRight) {
                        borderStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-200';
                      } else if (isSelected && !isRight) {
                        borderStyle = 'border-rose-500 bg-rose-950/30 text-rose-200';
                      }
                    } else if (isSelected) {
                      borderStyle = 'border-blue-500 bg-blue-950/30 text-blue-200';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!quizSubmitted) setSelectedQuizOption(idx);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs transition-colors ${borderStyle}`}
                      >
                        {opt[lang]}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedQuizOption === null}
                    onClick={handleQuizSubmit}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-medium transition-colors"
                  >
                    {lang === 'hinglish'
                      ? 'Answer Check Karein & Lesson Complete Karein'
                      : 'Submit Answer & Complete Lesson'}
                  </button>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 space-y-1">
                    <div className="font-semibold text-emerald-400">
                      {selectedQuizOption === activeLesson.quiz[0].correctIndex
                        ? '✓ Correct — Skill Score Updated!'
                        : 'Explanation & Learning Note:'}
                    </div>
                    <p>{activeLesson.quiz[0].explanation[lang]}</p>
                  </div>
                )}
              </div>
            )}

            {/* 7. Practical Exercise & 8. Key Takeaway */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-200">
                  07. Practical Hands-On Exercise
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeLesson.practicalExercise[lang]}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('practice')}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 pt-1"
                >
                  <span>Open Practice Lab</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-lg bg-emerald-950/15 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-semibold text-emerald-400">
                  08. Key Process Takeaway
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  "{activeLesson.keyTakeaway[lang]}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: INTERACTIVE CHART CHALLENGE MODE (BAR-BY-BAR REVEAL) */}
      {subTab === 'challenge' && (
        <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 md:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs text-blue-400 font-mono">
                Interactive Historical Simulation · Purpose: Process Education, Not Prediction
              </div>
              <h2 className="text-lg font-semibold text-white mt-0.5">
                {activeChallenge.title[lang]}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {CHART_CHALLENGES.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleResetChallenge(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    activeChallengeIdx === idx
                      ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Challenge #{idx + 1} ({ch.symbol})
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {activeChallenge.setupContext[lang]}
          </p>

          {/* Chart with Hidden or Revealed Future Candles */}
          <InteractiveCandlestickChart
            symbol={`${activeChallenge.symbol} (${
              candlesRevealed ? 'All 46 Candles Revealed' : 'First 34 Candles Shown · Next 12 Hidden'
            })`}
            candles={challengeCombinedCandles}
            revealedCount={
              candlesRevealed
                ? challengeCombinedCandles.length
                : activeChallenge.visibleCandles.length
            }
            supportLevel={activeChallenge.supportZone}
            resistanceLevel={activeChallenge.resistanceZone}
            entryLevel={activeChallenge.suggestedEntry}
            stopLevel={activeChallenge.suggestedStop}
            targetLevel={activeChallenge.suggestedTarget}
            height={310}
          />

          {/* Setup Reference Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs tabular-nums">
            <div>
              <span className="text-slate-400 block">Support Zone</span>
              <strong className="text-emerald-400">₹{activeChallenge.supportZone}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Resistance Zone</span>
              <strong className="text-rose-400">₹{activeChallenge.resistanceZone}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Hypothetical Entry</span>
              <strong className="text-sky-400">₹{activeChallenge.suggestedEntry}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Invalidation Stop</span>
              <strong className="text-rose-400">₹{activeChallenge.suggestedStop}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Target Level</span>
              <strong className="text-emerald-400">₹{activeChallenge.suggestedTarget}</strong>
            </div>
          </div>

          {/* 2 Diagnostic Questions before Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="text-xs font-semibold text-white">
                {activeChallenge.questions.trendQuestion.prompt[lang]}
              </div>
              {activeChallenge.questions.trendQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTrendAns(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                    trendAns === idx
                      ? 'border-blue-500 bg-blue-950/30 text-blue-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {opt[lang]}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="text-xs font-semibold text-white">
                {activeChallenge.questions.actionQuestion.prompt[lang]}
              </div>
              {activeChallenge.questions.actionQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActionAns(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                    actionAns === idx
                      ? 'border-blue-500 bg-blue-950/30 text-blue-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {opt[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Reveal Action & Outcome Explanation */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
            {!candlesRevealed ? (
              <button
                type="button"
                onClick={handleRevealChallenge}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>
                  {lang === 'hinglish'
                    ? 'Agle 12 Historical Candles Reveal Karein & Explanation Dekhein'
                    : 'Reveal Subsequent 12 Historical Candles & Process Debrief'}
                </span>
              </button>
            ) : (
              <div className="w-full p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">
                    Historical Outcome & Risk Process Debrief
                  </span>
                  <button
                    type="button"
                    onClick={() => setCandlesRevealed(false)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Hide Future Candles Again</span>
                  </button>
                </div>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                  {activeChallenge.outcomeExplanation[lang]}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: TRADING PSYCHOLOGY BEHAVIORAL SCENARIOS */}
      {subTab === 'psychology' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <h2 className="text-base font-semibold text-white">
              {lang === 'hinglish'
                ? 'Trading Psychology & Behavioral Decision Checklists'
                : 'Trading Psychology & Behavioral Decision Lab'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'hinglish'
                ? 'Real trading mein 80% galtiyan FOMO, Revenge Trading aur Loss Aversion se hoti hain. Niche diye gaye scenarios mein apna decision test karein.'
                : 'Evaluate how you respond to losing streaks, stop-loss pressure, and FOMO using rules-based thinking.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BEHAVIORAL_SCENARIOS.map((sc) => {
              const chosenIdx = scenarioAnswers[sc.id];
              return (
                <div
                  key={sc.id}
                  className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-amber-400">
                      Bias Tested: {sc.biasTested}
                    </div>
                    <h3 className="text-base font-semibold text-white">{sc.title[lang]}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                      {sc.situation[lang]}
                    </p>

                    <div className="space-y-2 pt-1">
                      {sc.options.map((opt, idx) => {
                        const isChosen = chosenIdx === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setScenarioAnswers((prev) => ({ ...prev, [sc.id]: idx }))
                            }
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                              isChosen
                                ? opt.isProcessDisciplined
                                  ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                                  : 'border-rose-500 bg-rose-950/30 text-rose-200'
                                : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {opt.label[lang]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {chosenIdx !== undefined && (
                    <div
                      className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                        sc.options[chosenIdx].isProcessDisciplined
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                          : 'border-rose-500/40 bg-rose-950/20 text-rose-200'
                      }`}
                    >
                      {sc.options[chosenIdx].feedback[lang]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
