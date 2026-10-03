import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  AlertTriangle,
  Eye,
  RotateCcw,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  AIErrorReport,
  ChapterDefinition,
  ChapterStageCategory,
  Language,
  NavigationTab,
  UserChapterProgress,
  UserProfile,
  UserWeakSkill,
} from '../types';
import {
  computeChapterStatus,
  evaluateChapterAssessment,
  getStatusBadgeMeta,
} from '../services/masteryEngine';
import {
  BEHAVIORAL_SCENARIOS,
  CHART_CHALLENGES,
} from '../data/challengesAndGlossary';
import { INDIAN_MARKET_ASSETS } from '../data/indianMarketData';
import { InteractiveCandlestickChart } from './InteractiveCandlestickChart';
import { InteractiveExerciseSuite } from './InteractiveExerciseSuite';

interface LearnSectionProps {
  profile: UserProfile;
  chapters: ChapterDefinition[];
  chapterProgressMap: Record<string, UserChapterProgress>;
  weakSkills: UserWeakSkill[];
  isAdminBypass: boolean;
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  onUpdateChapterProgress: (
    chapterId: string,
    updated: UserChapterProgress,
    updatedWeakSkills?: UserWeakSkill[],
    eventType?:
      | 'lesson_completed'
      | 'practice_completed'
      | 'assessment_completed'
      | 'chapter_mastered'
      | 'chapter_failed'
      | 'targeted_practice_completed',
    details?: string
  ) => void;
  onCompleteLessonLegacy: (lessonId: string, quizCorrect: boolean) => void;
  onCompleteChallenge: (challengeId: string, correctCount: number) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onReportIssue?: (
    report: Omit<AIErrorReport, 'id' | 'timestamp' | 'status'>
  ) => void;
}

const STAGE_CATEGORIES: ChapterStageCategory[] = [
  'Foundation',
  'Core Trading',
  'Risk',
  'Strategy',
  'Advanced',
];

export const LearnSection: React.FC<LearnSectionProps> = ({
  profile,
  chapters,
  chapterProgressMap,
  weakSkills,
  isAdminBypass,
  activeChapterId,
  onSelectChapter,
  onUpdateChapterProgress,
  onCompleteLessonLegacy,
  onCompleteChallenge,
  onNavigateTab,
  onReportIssue,
}) => {
  const lang: Language = profile.language;

  const [subTab, setSubTab] = useState<
    'journey' | 'exercises_v2' | 'chart_challenge' | 'psychology_lab'
  >('journey');

  // Inside Chapter Workspace: 'lessons' | 'practice' | 'assessment' | 'remediation'
  const [chapterStep, setChapterStep] = useState<
    'lessons' | 'practice' | 'assessment' | 'remediation'
  >('lessons');
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [quickCheckChoice, setQuickCheckChoice] = useState<number | null>(null);
  const [quickCheckChecked, setQuickCheckChecked] = useState(false);

  // Practice Activity state
  const [practiceNumericInputs, setPracticeNumericInputs] = useState<
    Record<string, string>
  >({});
  const [practiceOptionChoices, setPracticeOptionChoices] = useState<
    Record<string, number>
  >({});
  const [practiceFeedback, setPracticeFeedback] = useState<
    Record<string, { passed: boolean; message: string }>
  >({});

  // Assessment state
  const [assessmentAnswers, setAssessmentAnswers] = useState<
    Record<string, number>
  >({});
  const [assessmentResult, setAssessmentResult] = useState<{
    scorePct: number;
    mastered: boolean;
    criticalConceptsPassed: boolean;
    weakConceptIds: string[];
  } | null>(null);

  // Preview state for locked chapters (Section 13: Flexible Exploration)
  const [previewLockedChapterId, setPreviewLockedChapterId] = useState<
    string | null
  >(null);

  // Chart Challenge state
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [revealedBars, setRevealedBars] = useState(false);

  // Behavioral Lab state
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [scenarioPick, setScenarioPick] = useState<number | null>(null);

  const currentChapter =
    chapters.find((c) => c.id === activeChapterId) || chapters[0];
  const currentStatus = computeChapterStatus(
    currentChapter,
    chapterProgressMap,
    isAdminBypass
  );
  const isLocked = currentStatus === 'locked' && !isAdminBypass;
  const isPreviewMode = isLocked && previewLockedChapterId === currentChapter.id;

  const existingProgress: UserChapterProgress = chapterProgressMap[
    currentChapter.id
  ] || {
    userId: profile.name,
    chapterId: currentChapter.id,
    status: isLocked ? 'locked' : 'available',
    completedLessonIds: [],
    completedPracticeIds: [],
    lessonProgress: 0,
    practiceProgress: 0,
    criticalConceptsPassed: false,
    weakConceptIds: [],
    attemptsCount: 0,
  };

  const allLessonsCompleted = currentChapter.lessons.every((l) =>
    existingProgress.completedLessonIds.includes(l.id)
  );
  const allPracticeCompleted = currentChapter.practiceActivities.every((p) =>
    existingProgress.completedPracticeIds.includes(p.id)
  );
  const canTakeAssessment =
    isAdminBypass || (allLessonsCompleted && allPracticeCompleted);

  const activeLesson =
    currentChapter.lessons[
      Math.min(activeLessonIndex, currentChapter.lessons.length - 1)
    ] || currentChapter.lessons[0];

  const handleSelectChapterCard = (ch: ChapterDefinition) => {
    const st = computeChapterStatus(ch, chapterProgressMap, isAdminBypass);
    onSelectChapter(ch.id);
    setActiveLessonIndex(0);
    setQuickCheckChoice(null);
    setQuickCheckChecked(false);
    setAssessmentResult(null);
    setAssessmentAnswers({});
    if (st === 'locked' && !isAdminBypass) {
      setPreviewLockedChapterId(ch.id);
      setChapterStep('lessons');
    } else {
      setPreviewLockedChapterId(null);
      setChapterStep('lessons');
    }
  };

  const handleCompleteCurrentLesson = () => {
    if (isLocked) return;
    if (quickCheckChoice === null) return;
    setQuickCheckChecked(true);
    const isRight = quickCheckChoice === activeLesson.quickCheck.correctIndex;
    onCompleteLessonLegacy(activeLesson.id, isRight);

    const updatedLessonIds = Array.from(
      new Set([...existingProgress.completedLessonIds, activeLesson.id])
    );
    const lessonProgress = Math.round(
      (updatedLessonIds.length / Math.max(1, currentChapter.lessons.length)) *
        100
    );

    const updated: UserChapterProgress = {
      ...existingProgress,
      status:
        existingProgress.status === 'mastered'
          ? 'mastered'
          : lessonProgress === 100
          ? 'practice'
          : 'learning',
      completedLessonIds: updatedLessonIds,
      lessonProgress,
      lastActivityAt: new Date().toISOString(),
    };

    onUpdateChapterProgress(
      currentChapter.id,
      updated,
      undefined,
      'lesson_completed',
      `Completed lesson ${activeLesson.title.en}`
    );
  };

  const handleVerifyPracticeActivity = (activityId: string) => {
    if (isLocked) return;
    const act = currentChapter.practiceActivities.find(
      (a) => a.id === activityId
    );
    if (!act) return;

    let passed = false;
    if (act.type === 'numeric_calc' && act.expectedNumeric !== undefined) {
      const val = Number(practiceNumericInputs[activityId]);
      const tol = act.numericTolerance ?? 0.05;
      passed =
        !Number.isNaN(val) && Math.abs(val - act.expectedNumeric) <= tol;
    } else if (act.options && act.correctOptionIndex !== undefined) {
      passed = practiceOptionChoices[activityId] === act.correctOptionIndex;
    }

    setPracticeFeedback((prev) => ({
      ...prev,
      [activityId]: {
        passed,
        message: passed
          ? `✓ Correct! ${act.explanation[lang]}`
          : `✕ Check your calculation/logic. Hint: ${act.hint[lang]}`,
      },
    }));

    if (passed) {
      const updatedPracticeIds = Array.from(
        new Set([...existingProgress.completedPracticeIds, activityId])
      );
      const practiceProgress = Math.round(
        (updatedPracticeIds.length /
          Math.max(1, currentChapter.practiceActivities.length)) *
          100
      );
      const updated: UserChapterProgress = {
        ...existingProgress,
        status:
          existingProgress.status === 'mastered'
            ? 'mastered'
            : practiceProgress === 100 && allLessonsCompleted
            ? 'assessment'
            : 'practice',
        completedPracticeIds: updatedPracticeIds,
        practiceProgress,
        lastActivityAt: new Date().toISOString(),
      };
      onUpdateChapterProgress(
        currentChapter.id,
        updated,
        undefined,
        'practice_completed',
        `Completed practice ${act.title.en}`
      );
    }
  };

  const handleSubmitChapterAssessment = () => {
    if (isLocked) return;
    const evaluation = evaluateChapterAssessment(
      currentChapter,
      assessmentAnswers,
      existingProgress,
      weakSkills
    );

    setAssessmentResult({
      scorePct: evaluation.scorePct,
      mastered: evaluation.mastered,
      criticalConceptsPassed: evaluation.criticalConceptsPassed,
      weakConceptIds: evaluation.weakConceptIds,
    });

    onUpdateChapterProgress(
      currentChapter.id,
      evaluation.updatedProgress,
      evaluation.updatedWeakSkills,
      evaluation.mastered ? 'chapter_mastered' : 'chapter_failed',
      `Assessment Score: ${evaluation.scorePct}% (${
        evaluation.mastered ? 'MASTERED' : 'NEEDS REVIEW'
      })`
    );
  };

  const handleCompleteTargetedRemediation = () => {
    // Clears needs_review weak concepts after targeted practice and returns to assessment retry
    const updatedWeak = weakSkills.filter(
      (w) => w.chapterId !== currentChapter.id
    );
    const updated: UserChapterProgress = {
      ...existingProgress,
      status: 'assessment',
      weakConceptIds: [],
      lastActivityAt: new Date().toISOString(),
    };
    onUpdateChapterProgress(
      currentChapter.id,
      updated,
      updatedWeak,
      'targeted_practice_completed',
      `Completed 3-minute targeted remediation for ${currentChapter.title.en}`
    );
    setAssessmentResult(null);
    setAssessmentAnswers({});
    setChapterStep('assessment');
  };

  // Overall chapter mastery stats
  const masteredCount = chapters.filter(
    (c) =>
      computeChapterStatus(c, chapterProgressMap, false) === 'mastered'
  ).length;

  const nextChapterObj = chapters.find(
    (c) => c.chapterNumber === currentChapter.chapterNumber + 1
  );

  const activeChallenge = CHART_CHALLENGES[activeChallengeIdx] || CHART_CHALLENGES[0];
  const activeScenario = BEHAVIORAL_SCENARIOS[scenarioIdx] || BEHAVIORAL_SCENARIOS[0];

  return (
    <div className="space-y-6">
      {/* TOP BAR: GUIDED CHAPTER MASTERY JOURNEY HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#6366F1] font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>
              CHAPTER-BASED MASTERY SYSTEM · LEARN → PRACTICE → ASSESS → MASTER → UNLOCK
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1">
            {lang === 'hinglish'
              ? `Your Trading Journey (${masteredCount}/${chapters.length} Chapters Mastered)`
              : `Your Trading Journey (${masteredCount}/${chapters.length} Chapters Mastered)`}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAdminBypass
              ? 'Admin Mode Active: All 18 chapters, practice labs, and assessments are unlocked for direct inspection.'
              : 'Complete lessons and required deterministic practice, then score 80%+ on the Chapter Assessment to master and unlock the next chapter.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#0B1325] border border-[#1E2D4A] rounded-2xl self-start shadow-md">
          {(
            [
              { id: 'journey', label: '18-Chapter Mastery Path' },
              { id: 'exercises_v2', label: '10-Format Exercise & Drawing Lab' },
              { id: 'chart_challenge', label: 'Bar-by-Bar Chart Challenge' },
              { id: 'psychology_lab', label: 'Psychology Scenarios' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                subTab === t.id
                  ? 'bg-gradient-to-r from-[#5B5FEF] to-[#6366F1] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* WEAK SKILL QUEUE BANNER (Section 12) */}
      {weakSkills.length > 0 && subTab === 'journey' && (
        <div className="p-4 rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-mono font-semibold text-[#F59E0B] uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>NEEDS PRACTICE · WEAK SKILL REINFORCEMENT QUEUE</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-200 pt-1">
              {weakSkills.map((ws) => (
                <span
                  key={ws.conceptId}
                  className="px-2.5 py-1 rounded bg-slate-950 border border-[#F59E0B]/40 font-mono"
                >
                  ⚠ CH {String(ws.chapterNumber).padStart(2, '0')} ·{' '}
                  {ws.title[lang]} ({ws.accuracyScore}%)
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const firstWeak = weakSkills[0];
              if (firstWeak) {
                onSelectChapter(firstWeak.chapterId);
                setChapterStep('remediation');
              }
            }}
            className="px-4 py-2 rounded-lg bg-[#F59E0B] text-slate-950 text-xs font-bold shrink-0 cursor-pointer"
          >
            Start 3-Min Targeted Practice →
          </button>
        </div>
      )}

      {/* SUB-TAB 1: 18-CHAPTER MASTERY JOURNEY */}
      {subTab === 'journey' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN (4 COLS): GUIDED CHAPTER PATH MAP (Section 14 & 15) */}
          <div className="lg:col-span-4 space-y-5 max-h-[840px] overflow-y-auto pr-1">
            {STAGE_CATEGORIES.map((stageName) => {
              const stageChapters = chapters.filter(
                (c) => c.stageCategory === stageName
              );
              return (
                <div
                  key={stageName}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#6366F1] font-semibold">
                      {stageName} Stage
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {stageChapters.length} Chapters
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {stageChapters.map((ch) => {
                      const status = computeChapterStatus(
                        ch,
                        chapterProgressMap,
                        isAdminBypass
                      );
                      const badge = getStatusBadgeMeta(status);
                      const prog = chapterProgressMap[ch.id];
                      const isSelected = ch.id === currentChapter.id;

                      const lessonPct = prog?.lessonProgress ?? 0;
                      const pracPct = prog?.practiceProgress ?? 0;
                      const combinedPct =
                        status === 'mastered'
                          ? 100
                          : Math.round((lessonPct + pracPct) / 2);

                      const prereqLabels = ch.prerequisiteChapterIds
                        .map((pid) => {
                          const found = chapters.find((x) => x.id === pid);
                          return found
                            ? `CH ${String(found.chapterNumber).padStart(2, '0')}`
                            : pid;
                        })
                        .join(', ');

                      return (
                        <div
                          key={ch.id}
                          onClick={() => handleSelectChapterCard(ch)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                            isSelected
                              ? 'border-[#6366F1] bg-slate-950 shadow-md'
                              : status === 'locked'
                              ? 'border-slate-800/70 bg-slate-950/50 opacity-80 hover:opacity-100'
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                            <span className="text-[#6366F1] font-bold">
                              {String(ch.chapterNumber).padStart(2, '0')} ·{' '}
                              {ch.estimatedMinutes}m
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded border text-[10px] ${badge.badgeClass}`}
                            >
                              {lang === 'hinglish'
                                ? badge.labelHi
                                : badge.labelEn}
                            </span>
                          </div>

                          <div className="text-sm font-semibold text-white">
                            {ch.title[lang]}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {ch.description[lang]}
                          </p>

                          {/* Progress bar */}
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-400">
                                {status === 'locked'
                                  ? `Prereq: ${prereqLabels}`
                                  : `${combinedPct}% complete`}
                              </span>
                              <span className="text-[#6366F1] font-semibold">
                                {status === 'locked'
                                  ? '[ Preview ]'
                                  : isSelected
                                  ? 'Active →'
                                  : 'Open →'}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${combinedPct}%`,
                                  backgroundColor:
                                    status === 'mastered'
                                      ? '#22C55E'
                                      : '#6366F1',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN (8 COLS): ACTIVE CHAPTER DETAIL & MASTERY LOOP (Sections 16–19) */}
          <div className="lg:col-span-8 space-y-5">
            {/* CHAPTER HEADER CARD */}
            <div className="p-6 rounded-3xl border border-[#1E2D4A] bg-[#0B1325] shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#6366F1] font-bold">
                    CHAPTER {String(currentChapter.chapterNumber).padStart(2, '0')}
                  </span>
                  <span className="text-slate-400">
                    {currentChapter.stageCategory} · {currentChapter.estimatedMinutes} min
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded border text-xs font-mono ${
                    getStatusBadgeMeta(currentStatus).badgeClass
                  }`}
                >
                  {getStatusBadgeMeta(currentStatus).labelEn}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  {currentChapter.title[lang]}
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  {currentChapter.description[lang]}
                </p>
              </div>

              {/* LOCKED CHAPTER PREVIEW NOTICE (Section 13) */}
              {isLocked && (
                <div className="p-3.5 rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#F59E0B] flex items-center gap-1.5">
                      <Lock className="w-4 h-4" />
                      <span>
                        🔒 Locked Chapter — Read-Only Preview Mode Active
                      </span>
                    </div>
                    <p className="text-slate-300">
                      To unlock Practice &amp; Mastery Assessment for this chapter, first master prerequisite(s):{' '}
                      <strong className="font-mono text-white">
                        {currentChapter.prerequisiteChapterIds.join(', ')}
                      </strong>
                      .
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const firstPrereq =
                        currentChapter.prerequisiteChapterIds[0] || 'ch-01';
                      onSelectChapter(firstPrereq);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#6366F1] text-white font-semibold shrink-0 cursor-pointer"
                  >
                    Go to Prerequisite →
                  </button>
                </div>
              )}

              {/* 3-STEP CHAPTER LOOP STEPPER: 1. LEARN -> 2. PRACTICE -> 3. ASSESS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setChapterStep('lessons')}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    chapterStep === 'lessons'
                      ? 'border-[#6366F1] bg-[#6366F1]/15 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span>STEP 1 · LEARN</span>
                    <span
                      className={
                        allLessonsCompleted
                          ? 'text-[#22C55E]'
                          : 'text-slate-400'
                      }
                    >
                      {allLessonsCompleted
                        ? '✓ 100%'
                        : `${existingProgress.completedLessonIds.length}/${currentChapter.lessons.length}`}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    Interactive Lessons
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setChapterStep('practice')}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    chapterStep === 'practice'
                      ? 'border-[#6366F1] bg-[#6366F1]/15 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span>STEP 2 · PRACTICE</span>
                    <span
                      className={
                        allPracticeCompleted
                          ? 'text-[#22C55E]'
                          : 'text-slate-400'
                      }
                    >
                      {allPracticeCompleted
                        ? '✓ 100%'
                        : `${existingProgress.completedPracticeIds.length}/${currentChapter.practiceActivities.length}`}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    Deterministic Practice
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!canTakeAssessment}
                  onClick={() => setChapterStep('assessment')}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    !canTakeAssessment
                      ? 'border-slate-800 bg-slate-950/50 text-slate-500 cursor-not-allowed'
                      : chapterStep === 'assessment'
                      ? 'border-[#6366F1] bg-[#6366F1]/15 text-white cursor-pointer'
                      : 'border-slate-800 bg-slate-950 text-slate-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span>STEP 3 · ASSESS</span>
                    <span>
                      {!canTakeAssessment
                        ? '🔒 Complete 1 & 2'
                        : existingProgress.assessmentBestScore !== undefined
                        ? `Best: ${existingProgress.assessmentBestScore}%`
                        : `Min ${currentChapter.masteryThreshold}%`}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    Chapter Mastery Check
                  </div>
                </button>
              </div>
            </div>

            {/* STEP 1 WORKSPACE: SHORT INTERACTIVE LESSONS (CONCEPT -> VISUAL -> QUICK CHECK) */}
            {chapterStep === 'lessons' && activeLesson && (
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900 space-y-5">
                {currentChapter.lessons.length > 1 && (
                  <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                    {currentChapter.lessons.map((les, idx) => {
                      const isDone =
                        existingProgress.completedLessonIds.includes(les.id);
                      return (
                        <button
                          key={les.id}
                          type="button"
                          onClick={() => {
                            setActiveLessonIndex(idx);
                            setQuickCheckChoice(null);
                            setQuickCheckChecked(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                            activeLessonIndex === idx
                              ? 'border-[#6366F1] bg-[#6366F1] text-white'
                              : 'border-slate-800 bg-slate-950 text-slate-300'
                          }`}
                        >
                          {isDone ? '✓ ' : ''}Lesson {idx + 1}: {les.title[lang]}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#6366F1] uppercase">
                    1. CORE CONCEPT · {activeLesson.durationMinutes} MIN READ
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {activeLesson.title[lang]}
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {activeLesson.conceptSummary[lang]}
                  </p>
                </div>

                {/* Visual Example + Formula + Interactive Candlestick Anatomy Diagram */}
                <div className="p-5 rounded-2xl border border-[#223254] bg-[#101C34] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-mono text-[#14B8A6] font-semibold uppercase">
                      2. VISUAL CONCEPT &amp; INDIAN MARKET (NSE/BSE ₹) EXAMPLE
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('tutor')}
                      className="px-3 py-1 rounded-full bg-[#14B8A6]/15 border border-[#14B8A6]/40 text-[#14B8A6] text-[11px] font-bold flex items-center gap-1 hover:bg-[#14B8A6]/25 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>✦ Ask AI Tutor</span>
                    </button>
                  </div>

                  {/* Visual Candlestick & Risk/Reward Anatomy SVG Banner */}
                  <div className="rounded-2xl bg-[#070D19] border border-[#1E2D4A] p-4">
                    <svg
                      viewBox="0 0 540 130"
                      className="w-full h-28 md:h-32 overflow-visible"
                      aria-label="Visual Candlestick & Risk Reward Diagram"
                    >
                      {/* Left: Bullish Candle Anatomy (#22C55E) */}
                      <g transform="translate(20, 8)">
                        <line x1="45" y1="8" x2="45" y2="104" stroke="#22C55E" strokeWidth="2.5" />
                        <rect x="29" y="28" width="32" height="54" rx="5" fill="#22C55E" />
                        <text x="88" y="14" fill="#94A3B8" fontSize="10" fontFamily="monospace">High (Upper Wick)</text>
                        <text x="88" y="34" fill="#22C55E" fontSize="10" fontWeight="bold" fontFamily="monospace">▲ Close (Buyers Win)</text>
                        <text x="88" y="80" fill="#CBD5E1" fontSize="10" fontFamily="monospace">Open Price</text>
                        <text x="88" y="104" fill="#94A3B8" fontSize="10" fontFamily="monospace">Low (Support Test)</text>
                        <text x="16" y="118" fill="#22C55E" fontSize="11" fontWeight="bold">Bullish Candle</text>
                      </g>

                      {/* Divider */}
                      <line x1="255" y1="12" x2="255" y2="115" stroke="#1E2D4A" strokeDasharray="3 3" />

                      {/* Right: Bearish Candle Anatomy (#EF4444) */}
                      <g transform="translate(280, 8)">
                        <line x1="45" y1="8" x2="45" y2="104" stroke="#EF4444" strokeWidth="2.5" />
                        <rect x="29" y="28" width="32" height="54" rx="5" fill="#EF4444" />
                        <text x="88" y="14" fill="#94A3B8" fontSize="10" fontFamily="monospace">High (Resistance)</text>
                        <text x="88" y="34" fill="#CBD5E1" fontSize="10" fontFamily="monospace">Open Price</text>
                        <text x="88" y="80" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="monospace">▼ Close (Sellers Win)</text>
                        <text x="88" y="104" fill="#94A3B8" fontSize="10" fontFamily="monospace">Low (Lower Wick)</text>
                        <text x="16" y="118" fill="#EF4444" fontSize="11" fontWeight="bold">Bearish Candle</text>
                      </g>
                    </svg>
                  </div>

                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                    {activeLesson.visualExample[lang]}
                  </p>
                  {activeLesson.formulaOrRule && (
                    <div className="p-3 rounded-xl bg-[#070D19] border border-[#6366F1]/40 font-mono text-xs text-[#818CF8] font-semibold">
                      Formula / Rule: {activeLesson.formulaOrRule}
                    </div>
                  )}
                </div>

                {/* Optional Embedded Candlestick Chart if Lesson has chartSymbol */}
                {activeLesson.chartSymbol && (
                  <div className="border border-slate-800 rounded-xl p-3 bg-slate-950">
                    <InteractiveCandlestickChart
                      symbol={activeLesson.chartSymbol}
                      candles={
                        (
                          INDIAN_MARKET_ASSETS.find(
                            (a) =>
                              a.symbol === activeLesson.chartSymbol ||
                              (activeLesson.chartSymbol === 'NIFTY50' &&
                                a.symbol === 'NIFTY 50')
                          ) || INDIAN_MARKET_ASSETS[0]
                        ).candles
                      }
                      height={240}
                    />
                  </div>
                )}

                {/* Quick Check (Required to mark lesson complete) */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
                  <div className="text-xs font-mono uppercase text-[#6366F1] font-semibold">
                    3. LESSON QUICK CHECK
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {activeLesson.quickCheck.question[lang]}
                  </p>

                  <div className="space-y-2">
                    {activeLesson.quickCheck.options.map((opt, idx) => {
                      const isSelected = quickCheckChoice === idx;
                      const isRight =
                        idx === activeLesson.quickCheck.correctIndex;
                      let cls =
                        'border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700';
                      if (quickCheckChecked) {
                        if (isRight) {
                          cls =
                            'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]';
                        } else if (isSelected) {
                          cls =
                            'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]';
                        }
                      } else if (isSelected) {
                        cls =
                          'border-[#6366F1] bg-[#6366F1]/15 text-white';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isLocked}
                          onClick={() => {
                            setQuickCheckChoice(idx);
                            setQuickCheckChecked(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer ${cls}`}
                        >
                          <span>{opt[lang]}</span>
                          {quickCheckChecked && isRight && (
                            <span className="font-mono font-bold">
                              ✓ Correct
                            </span>
                          )}
                          {quickCheckChecked && isSelected && !isRight && (
                            <span className="font-mono font-bold">
                              ✕ Incorrect
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!isLocked && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        disabled={quickCheckChoice === null}
                        onClick={handleCompleteCurrentLesson}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5B5FEF] to-[#6366F1] hover:from-[#4F46E5] hover:to-[#5B5FEF] disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-[#6366F1]/20 cursor-pointer"
                      >
                        Verify Quick Check &amp; Mark Lesson Complete
                      </button>

                      {allLessonsCompleted && (
                        <button
                          type="button"
                          onClick={() => setChapterStep('practice')}
                          className="px-5 py-2.5 rounded-full bg-[#22C55E] text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Proceed to Step 2: Practice</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {quickCheckChecked && (
                    <div className="p-3 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/40 text-xs text-slate-200">
                      <strong className="text-[#14B8A6] block mb-0.5">
                        ✦ Concept Explanation:
                      </strong>
                      {activeLesson.quickCheck.explanation[lang]}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 WORKSPACE: REQUIRED DETERMINISTIC PRACTICE ACTIVITIES */}
            {chapterStep === 'practice' && (
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900 space-y-5">
                <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-mono text-[#6366F1] uppercase font-semibold">
                      STEP 2 · DETERMINISTIC CHAPTER PRACTICE
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      Apply {currentChapter.title[lang]} Before Assessment Unlocks
                    </h3>
                  </div>
                  {canTakeAssessment && (
                    <button
                      type="button"
                      onClick={() => setChapterStep('assessment')}
                      className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceed to Step 3: Chapter Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {currentChapter.practiceActivities.map((act) => {
                  const isDone =
                    existingProgress.completedPracticeIds.includes(act.id);
                  const fb = practiceFeedback[act.id];

                  return (
                    <div
                      key={act.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-semibold">
                          {act.title[lang]}
                        </span>
                        <span
                          className={
                            isDone ? 'text-[#22C55E]' : 'text-[#F59E0B]'
                          }
                        >
                          {isDone ? '✓ Completed' : 'Required Practice'}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                        {act.prompt[lang]}
                      </p>

                      {act.type === 'numeric_calc' ? (
                        <div className="flex flex-wrap items-center gap-2.5">
                          <input
                            type="number"
                            step="any"
                            disabled={isLocked}
                            placeholder={`Enter value (${act.numericUnit || ''})`}
                            value={practiceNumericInputs[act.id] || ''}
                            onChange={(e) =>
                              setPracticeNumericInputs((prev) => ({
                                ...prev,
                                [act.id]: e.target.value,
                              }))
                            }
                            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono w-48"
                          />
                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => handleVerifyPracticeActivity(act.id)}
                            className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold cursor-pointer"
                          >
                            Verify Calculation
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(act.options || []).map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isLocked}
                              onClick={() =>
                                setPracticeOptionChoices((prev) => ({
                                  ...prev,
                                  [act.id]: oIdx,
                                }))
                              }
                              className={`w-full text-left px-3.5 py-2 rounded-lg border text-xs cursor-pointer ${
                                practiceOptionChoices[act.id] === oIdx
                                  ? 'border-[#6366F1] bg-[#6366F1]/15 text-white'
                                  : 'border-slate-800 bg-slate-900 text-slate-300'
                              }`}
                            >
                              {opt[lang]}
                            </button>
                          ))}
                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => handleVerifyPracticeActivity(act.id)}
                            className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold cursor-pointer"
                          >
                            Verify Decision
                          </button>
                        </div>
                      )}

                      {fb && (
                        <div
                          className={`p-3 rounded-lg border text-xs ${
                            fb.passed
                              ? 'border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]'
                              : 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]'
                          }`}
                        >
                          {fb.message}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 3 WORKSPACE: CHAPTER MASTERY ASSESSMENT & CELEBRATION / REMEDIATION (Sections 9, 10 & 11) */}
            {chapterStep === 'assessment' && (
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900 space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-xs font-mono text-[#6366F1] uppercase font-semibold">
                    STEP 3 · CHAPTER MASTERY ASSESSMENT (MIN{' '}
                    {currentChapter.masteryThreshold}% + ALL CRITICAL CONCEPTS)
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {currentChapter.title[lang]} — Mastery Verification
                  </h3>
                </div>

                {/* MASTERY CELEBRATION CARD (Section 10) */}
                {assessmentResult && assessmentResult.mastered && (
                  <div className="p-6 rounded-xl border border-[#22C55E] bg-slate-950 text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-xs font-mono font-bold">
                      <Award className="w-4 h-4" />
                      <span>🎉 MASTERED</span>
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      {currentChapter.title[lang]}
                    </h4>
                    <div className="flex justify-center gap-6 text-xs font-mono text-slate-300">
                      <span>Score: {assessmentResult.scorePct}%</span>
                      <span>
                        Critical Concepts: {currentChapter.concepts.length}/
                        {currentChapter.concepts.length} Passed
                      </span>
                    </div>
                    {nextChapterObj && (
                      <div className="text-xs font-mono text-[#22C55E]">
                        ✓ Chapter {String(nextChapterObj.chapterNumber).padStart(2, '0')} ({nextChapterObj.title[lang]}) Unlocked!
                      </div>
                    )}
                    {nextChapterObj && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleSelectChapterCard(nextChapterObj)}
                          className="px-5 py-2.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold cursor-pointer"
                        >
                          Continue to Chapter{' '}
                          {String(nextChapterObj.chapterNumber).padStart(2, '0')} →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TARGETED REMEDIATION CARD IF FAILED (Section 11) */}
                {assessmentResult && !assessmentResult.mastered && (
                  <div className="p-5 rounded-xl border border-[#F59E0B] bg-slate-950 space-y-3">
                    <div className="text-xs font-mono font-bold text-[#F59E0B] uppercase">
                      ⚠ ASSESSMENT COMPLETE · SCORE: {assessmentResult.scorePct}% (REQUIRED: {currentChapter.masteryThreshold}%)
                    </div>
                    <p className="text-xs text-slate-300">
                      Needs targeted practice before unlocking the next chapter:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentChapter.concepts
                        .filter((c) =>
                          assessmentResult.weakConceptIds.includes(c.id)
                        )
                        .map((c) => (
                          <span
                            key={c.id}
                            className="px-2.5 py-1 rounded bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-xs font-mono text-[#F59E0B]"
                          >
                            ⚠ {c.title[lang]}
                          </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setChapterStep('remediation')}
                        className="px-4 py-2 rounded-lg bg-[#F59E0B] text-slate-950 text-xs font-bold cursor-pointer"
                      >
                        Launch 3-Minute Targeted Practice →
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAssessmentResult(null);
                          setAssessmentAnswers({});
                        }}
                        className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-200 cursor-pointer"
                      >
                        Retry Assessment
                      </button>
                    </div>
                  </div>
                )}

                {/* ASSESSMENT QUESTIONS LIST */}
                <div className="space-y-4">
                  {currentChapter.assessmentQuestions.map((q, qIdx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>
                          Question {qIdx + 1} · {q.questionType.toUpperCase()}
                        </span>
                        {q.isCriticalConcept && (
                          <span className="text-[#F59E0B]">
                            ★ Critical Mastery Concept
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {q.prompt[lang]}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isPicked = assessmentAnswers[q.id] === oIdx;
                          const isCorrect = oIdx === q.correctIndex;
                          let cls =
                            'border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700';
                          if (assessmentResult) {
                            if (isCorrect) {
                              cls =
                                'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]';
                            } else if (isPicked) {
                              cls =
                                'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]';
                            }
                          } else if (isPicked) {
                            cls =
                              'border-[#6366F1] bg-[#6366F1]/15 text-white';
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={Boolean(assessmentResult)}
                              onClick={() =>
                                setAssessmentAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: oIdx,
                                }))
                              }
                              className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer ${cls}`}
                            >
                              <span>{opt[lang]}</span>
                              {assessmentResult && isCorrect && (
                                <span className="font-mono font-bold">
                                  ✓ Correct
                                </span>
                              )}
                              {assessmentResult && isPicked && !isCorrect && (
                                <span className="font-mono font-bold">
                                  ✕ Incorrect
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {assessmentResult && (
                        <div className="p-3 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/40 text-xs text-slate-200 space-y-1">
                          {q.deterministicFormulaNote && (
                            <div className="font-mono text-[#14B8A6]">
                              Deterministic Proof: {q.deterministicFormulaNote}
                            </div>
                          )}
                          <p>{q.explanation[lang]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!assessmentResult && (
                  <button
                    type="button"
                    disabled={
                      Object.keys(assessmentAnswers).length <
                      currentChapter.assessmentQuestions.length
                    }
                    onClick={handleSubmitChapterAssessment}
                    className="w-full py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                  >
                    Submit Chapter Assessment &amp; Check Mastery
                  </button>
                )}
              </div>
            )}

            {/* TARGETED REMEDIATION DRILL WORKSPACE (Section 11) */}
            {chapterStep === 'remediation' && (
              <div className="p-5 rounded-xl border border-[#F59E0B]/50 bg-slate-900 space-y-4">
                <div className="text-xs font-mono text-[#F59E0B] uppercase font-semibold">
                  ⚠ 3-MINUTE TARGETED REMEDIATION DRILL
                </div>
                <h3 className="text-lg font-bold text-white">
                  Reinforce Weak Concepts in {currentChapter.title[lang]}
                </h3>
                <div className="space-y-3">
                  {currentChapter.lessons.map((l) => (
                    <div
                      key={l.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="font-semibold text-white">
                        {l.title[lang]}
                      </div>
                      <p className="text-slate-300">{l.conceptSummary[lang]}</p>
                      {l.formulaOrRule && (
                        <div className="font-mono text-[#14B8A6] pt-1">
                          Key Rule: {l.formulaOrRule}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCompleteTargetedRemediation}
                  className="px-5 py-2.5 rounded-lg bg-[#22C55E] text-slate-950 text-xs font-bold cursor-pointer"
                >
                  ✓ Complete Targeted Review &amp; Retry Chapter Assessment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 10-FORMAT INTERACTIVE EXERCISE SUITE & CHART DRAWING STUDIO */}
      {subTab === 'exercises_v2' && (
        <InteractiveExerciseSuite
          language={lang}
          onScoreUpdate={(correct: boolean) =>
            onCompleteLessonLegacy('ex-v2-suite', correct)
          }
          onReportIssue={onReportIssue || (() => {})}
        />
      )}

      {/* SUB-TAB 3: BAR-BY-BAR HISTORICAL CHART CHALLENGE */}
      {subTab === 'chart_challenge' && activeChallenge && (
        <div className="border border-slate-800 bg-slate-900 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white">
                {activeChallenge.title[lang]} ({activeChallenge.symbol} ·{' '}
                {activeChallenge.timeframe})
              </h2>
              <p className="text-xs text-slate-400">
                {activeChallenge.setupContext[lang]}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRevealedBars((p) => !p)}
                className="px-3.5 py-1.5 rounded-lg bg-[#6366F1] text-white text-xs font-semibold cursor-pointer"
              >
                {revealedBars ? 'Hide Future Bars' : 'Reveal Next Outcome Bars'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRevealedBars(false);
                  setActiveChallengeIdx(
                    (prev) => (prev + 1) % CHART_CHALLENGES.length
                  );
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-xs text-slate-200 cursor-pointer"
              >
                Next Chart →
              </button>
            </div>
          </div>

          <InteractiveCandlestickChart
            symbol={activeChallenge.symbol}
            candles={
              revealedBars
                ? [
                    ...activeChallenge.visibleCandles,
                    ...activeChallenge.hiddenCandles,
                  ]
                : activeChallenge.visibleCandles
            }
            supportLevel={activeChallenge.supportZone}
            resistanceLevel={activeChallenge.resistanceZone}
            entryLevel={activeChallenge.suggestedEntry}
            stopLevel={activeChallenge.suggestedStop}
            targetLevel={activeChallenge.suggestedTarget}
            height={300}
          />

          {revealedBars && (
            <div className="p-3.5 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/40 text-xs text-slate-200">
              <strong className="text-[#14B8A6] block mb-0.5">
                ✦ Outcome Breakdown:
              </strong>
              {activeChallenge.outcomeExplanation[lang]}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: TRADING PSYCHOLOGY SCENARIO LAB */}
      {subTab === 'psychology_lab' && activeScenario && (
        <div className="border border-slate-800 bg-slate-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#F59E0B]">
                Bias Tested: {activeScenario.biasTested}
              </span>
              <h2 className="text-base font-bold text-white">
                {activeScenario.title[lang]}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setScenarioPick(null);
                setScenarioIdx(
                  (prev) => (prev + 1) % BEHAVIORAL_SCENARIOS.length
                );
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-xs text-slate-200 cursor-pointer"
            >
              Next Scenario →
            </button>
          </div>

          <p className="text-xs md:text-sm text-slate-200">
            {activeScenario.situation[lang]}
          </p>

          <div className="space-y-2">
            {activeScenario.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setScenarioPick(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs cursor-pointer ${
                  scenarioPick === idx
                    ? opt.isProcessDisciplined
                      ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]'
                      : 'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]'
                    : 'border-slate-800 bg-slate-950 text-slate-200'
                }`}
              >
                <div className="font-semibold">{opt.label[lang]}</div>
                {scenarioPick === idx && (
                  <div className="mt-1.5 text-slate-300">
                    {opt.isProcessDisciplined ? '✓ ' : '✕ '}
                    {opt.feedback[lang]}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
