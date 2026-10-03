import {
  ChapterDefinition,
  ChapterMasteryStatus,
  UserChapterProgress,
  UserWeakSkill,
} from '../types';

/**
 * Dedicated Mastery & Unlock Engine (Section 21)
 * Do not duplicate this logic across individual screens.
 */

export function canUnlockChapter(
  chapter: ChapterDefinition,
  userProgressMap: Record<string, UserChapterProgress>,
  isAdminBypass = false
): boolean {
  if (isAdminBypass) return true;
  if (!chapter.prerequisiteChapterIds || chapter.prerequisiteChapterIds.length === 0) {
    return true;
  }
  return chapter.prerequisiteChapterIds.every(
    (prereqId) => userProgressMap[prereqId]?.status === 'mastered'
  );
}

export function isChapterMastered(
  chapter: ChapterDefinition,
  progress?: UserChapterProgress
): boolean {
  if (!progress) return false;
  const requiredLessonsComplete =
    chapter.lessons.length === 0 ||
    chapter.lessons.every((l) => progress.completedLessonIds.includes(l.id));
  const requiredPracticeComplete =
    chapter.practiceActivities.length === 0 ||
    chapter.practiceActivities.every((p) =>
      progress.completedPracticeIds.includes(p.id)
    );
  const assessmentScore = progress.assessmentBestScore ?? 0;
  return (
    requiredLessonsComplete &&
    requiredPracticeComplete &&
    assessmentScore >= chapter.masteryThreshold &&
    progress.criticalConceptsPassed
  );
}

export function computeChapterStatus(
  chapter: ChapterDefinition,
  userProgressMap: Record<string, UserChapterProgress>,
  isAdminBypass = false
): ChapterMasteryStatus {
  const existing = userProgressMap[chapter.id];
  if (existing?.status === 'mastered') return 'mastered';

  const unlocked = canUnlockChapter(chapter, userProgressMap, isAdminBypass);
  if (!unlocked) return 'locked';

  if (!existing) return 'available';
  if (existing.status === 'needs_review') return 'needs_review';

  if (isChapterMastered(chapter, existing)) {
    return 'mastered';
  }

  const allLessonsDone =
    chapter.lessons.length > 0 &&
    chapter.lessons.every((l) => existing.completedLessonIds.includes(l.id));
  const allPracticeDone =
    chapter.practiceActivities.length > 0 &&
    chapter.practiceActivities.every((p) =>
      existing.completedPracticeIds.includes(p.id)
    );

  if (allLessonsDone && allPracticeDone) return 'assessment';
  if (allLessonsDone) return 'practice';
  if (existing.completedLessonIds.length > 0 || existing.completedPracticeIds.length > 0) {
    return 'learning';
  }
  return 'available';
}

export function getStatusBadgeMeta(status: ChapterMasteryStatus): {
  icon: string;
  labelEn: string;
  labelHi: string;
  badgeClass: string;
} {
  switch (status) {
    case 'mastered':
      return {
        icon: '🟢',
        labelEn: '✓ Mastered',
        labelHi: '✓ Mastered',
        badgeClass: 'border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]',
      };
    case 'needs_review':
      return {
        icon: '⚠',
        labelEn: '⚠ Needs Review',
        labelHi: '⚠ Needs Review',
        badgeClass: 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]',
      };
    case 'assessment':
      return {
        icon: '🔵',
        labelEn: 'Ready for Assessment',
        labelHi: 'Assessment Ready',
        badgeClass: 'border-[#6366F1]/40 bg-[#6366F1]/15 text-[#6366F1]',
      };
    case 'practice':
      return {
        icon: '🟡',
        labelEn: 'Practicing',
        labelHi: 'Practicing',
        badgeClass: 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]',
      };
    case 'learning':
    case 'available':
      return {
        icon: '🔵',
        labelEn: status === 'learning' ? 'In Progress' : 'Available',
        labelHi: status === 'learning' ? 'Chalu Hai' : 'Available',
        badgeClass: 'border-[#6366F1]/40 bg-[#6366F1]/15 text-[#6366F1]',
      };
    case 'locked':
    default:
      return {
        icon: '🔒',
        labelEn: '🔒 Locked',
        labelHi: '🔒 Locked',
        badgeClass: 'border-slate-700 bg-slate-900 text-slate-400',
      };
  }
}

export function evaluateChapterAssessment(
  chapter: ChapterDefinition,
  selectedIndices: Record<string, number>,
  currentProgress: UserChapterProgress,
  existingWeakSkills: UserWeakSkill[]
): {
  scorePct: number;
  criticalConceptsPassed: boolean;
  mastered: boolean;
  weakConceptIds: string[];
  updatedProgress: UserChapterProgress;
  updatedWeakSkills: UserWeakSkill[];
} {
  const questions = chapter.assessmentQuestions;
  let correctCount = 0;
  let criticalFailed = false;
  const failedConceptSet = new Set<string>();
  const passedConceptSet = new Set<string>();

  questions.forEach((q) => {
    const userChoice = selectedIndices[q.id];
    const isCorrect = userChoice === q.correctIndex;
    if (isCorrect) {
      correctCount += 1;
      passedConceptSet.add(q.conceptId);
    } else {
      failedConceptSet.add(q.conceptId);
      if (q.isCriticalConcept) {
        criticalFailed = true;
      }
    }
  });

  const scorePct =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
  const criticalConceptsPassed = !criticalFailed;
  const weakConceptIds = Array.from(failedConceptSet);

  const lessonsDone = chapter.lessons.every((l) =>
    currentProgress.completedLessonIds.includes(l.id)
  );
  const practiceDone = chapter.practiceActivities.every((p) =>
    currentProgress.completedPracticeIds.includes(p.id)
  );

  const mastered =
    lessonsDone &&
    practiceDone &&
    scorePct >= chapter.masteryThreshold &&
    criticalConceptsPassed;

  const nowIso = new Date().toISOString();
  const bestScore = Math.max(currentProgress.assessmentBestScore ?? 0, scorePct);

  const updatedProgress: UserChapterProgress = {
    ...currentProgress,
    status: mastered ? 'mastered' : 'needs_review',
    assessmentBestScore: bestScore,
    masteryScore: bestScore,
    criticalConceptsPassed,
    weakConceptIds,
    attemptsCount: (currentProgress.attemptsCount || 0) + 1,
    masteredAt: mastered ? nowIso : currentProgress.masteredAt,
    lastActivityAt: nowIso,
  };

  // Update Weak Skill Queue (Section 12)
  const weakMap = new Map<string, UserWeakSkill>();
  existingWeakSkills.forEach((ws) => weakMap.set(ws.conceptId, ws));

  chapter.concepts.forEach((concept) => {
    if (failedConceptSet.has(concept.id)) {
      weakMap.set(concept.id, {
        conceptId: concept.id,
        chapterId: chapter.id,
        chapterNumber: chapter.chapterNumber,
        title: concept.title,
        accuracyScore: Math.min(60, scorePct),
        needsRemediation: true,
        lastTestedAt: nowIso,
      });
    } else if (passedConceptSet.has(concept.id) && weakMap.has(concept.id)) {
      const prev = weakMap.get(concept.id)!;
      weakMap.set(concept.id, {
        ...prev,
        accuracyScore: 100,
        needsRemediation: false,
        lastTestedAt: nowIso,
      });
    }
  });

  return {
    scorePct,
    criticalConceptsPassed,
    mastered,
    weakConceptIds,
    updatedProgress,
    updatedWeakSkills: Array.from(weakMap.values()).filter((w) => w.needsRemediation),
  };
}
