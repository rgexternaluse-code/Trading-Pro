import React, { useState } from 'react';
import { CheckCircle2, Globe, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Language, SkillLevel, TradingGoal, UserProfile } from '../types';
import { SKILL_ASSESSMENT_QUESTIONS } from '../data/challengesAndGlossary';

interface LanguageOnboardingModalProps {
  profile: UserProfile;
  mode: 'language_only' | 'full_onboarding';
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onApplyPresetPersona: (level: SkillLevel, lang: Language) => void;
  onClose: () => void;
}

export const LanguageOnboardingModal: React.FC<LanguageOnboardingModalProps> = ({
  profile,
  mode,
  onUpdateProfile,
  onApplyPresetPersona,
  onClose,
}) => {
  const [step, setStep] = useState<'language' | 'goals' | 'assessment'>(
    mode === 'language_only' ? 'language' : !profile.hasSelectedLanguage ? 'language' : 'goals'
  );

  const [selectedLang, setSelectedLang] = useState<Language>(profile.language || 'en');
  const [userName, setUserName] = useState<string>(profile.name || 'Aarav Sharma');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>(profile.skillLevel || 'beginner');
  const [selectedGoal, setSelectedGoal] = useState<TradingGoal>(profile.goal || 'intraday');
  const [dailyMinutes, setDailyMinutes] = useState<number>(profile.dailyMinutes || 20);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleConfirmLanguage = () => {
    onUpdateProfile({
      language: selectedLang,
      hasSelectedLanguage: true,
    });
    if (mode === 'language_only') {
      onClose();
    } else {
      setStep('goals');
    }
  };

  const handleFinishOnboarding = () => {
    // Score the 5 skill assessment questions if answered
    let correctCount = 0;
    const categoryBonus: Record<string, number> = {};
    SKILL_ASSESSMENT_QUESTIONS.forEach((q) => {
      const userAns = answers[q.id];
      if (userAns !== undefined) {
        if (userAns === q.correctIndex) {
          correctCount++;
          categoryBonus[q.category] = 78;
        } else {
          categoryBonus[q.category] = 38;
        }
      }
    });

    const baseScore =
      selectedLevel === 'beginner' ? 32 : selectedLevel === 'intermediate' ? 58 : 78;

    onUpdateProfile({
      name: userName.trim() || 'Trader',
      language: selectedLang,
      hasSelectedLanguage: true,
      hasCompletedOnboarding: true,
      skillLevel: selectedLevel,
      goal: selectedGoal,
      dailyMinutes,
      quizAccuracy:
        Object.keys(answers).length > 0
          ? Math.round((correctCount / SKILL_ASSESSMENT_QUESTIONS.length) * 100)
          : profile.quizAccuracy,
      skillScores: {
        marketBasics: categoryBonus.marketBasics ?? baseScore + 10,
        riskManagement: categoryBonus.riskManagement ?? baseScore - 4,
        technicalAnalysis: categoryBonus.technicalAnalysis ?? baseScore + 4,
        fundamentalAnalysis: categoryBonus.fundamentalAnalysis ?? baseScore,
        tradingPsychology: baseScore + 6,
        derivatives: categoryBonus.derivatives ?? Math.max(15, baseScore - 15),
        algoTrading: selectedLevel === 'advanced' ? 72 : 18,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl border border-slate-800 bg-slate-900 text-slate-100 rounded-xl p-6 md:p-8 shadow-2xl my-auto">
        {/* Step 1: Language Selection with Side-by-Side Example */}
        {step === 'language' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Step 1 · Choose Your Learning Language / Bhasha Chunein</span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Select Your Preferred Explanation Style
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Compare the live example below. You can switch between English and Hinglish anytime from the header or Settings.
                </p>
              </div>
              {mode === 'language_only' && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 rounded-lg"
                >
                  Close
                </button>
              )}
            </div>

            {/* Side-by-side Language Cards with Concrete Trading Example */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* English Option */}
              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`text-left p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  selectedLang === 'en'
                    ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-base font-semibold text-white">English</span>
                      <p className="text-xs text-slate-400">
                        Clear professional financial English (INR ₹ context)
                      </p>
                    </div>
                    {selectedLang === 'en' && (
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    )}
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800/90 space-y-2">
                    <div className="text-[11px] font-mono text-blue-400">
                      Sample Lesson Preview · 1% Position Sizing Rule
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      "If your trading capital is <strong>₹1,00,000</strong> and your maximum risk per trade is <strong>1% (₹1,000)</strong>, buying Reliance at ₹2,950 with a stop-loss at ₹2,925 (₹25 risk/share) means your position size must be <strong>40 shares</strong> (₹1,000 ÷ ₹25)."
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Lessons, Quizzes & AI Tutor in English</span>
                  <span className="font-medium text-blue-400">Select English</span>
                </div>
              </button>

              {/* Hinglish Option */}
              <button
                type="button"
                onClick={() => setSelectedLang('hinglish')}
                className={`text-left p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  selectedLang === 'hinglish'
                    ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-base font-semibold text-white">
                        Hinglish (Hindi + English)
                      </span>
                      <p className="text-xs text-slate-400">
                        Conversational Hindi in English script + standard market terms
                      </p>
                    </div>
                    {selectedLang === 'hinglish' && (
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    )}
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800/90 space-y-2">
                    <div className="text-[11px] font-mono text-emerald-400">
                      Sample Lesson Preview · 1% Position Sizing Rule
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      "Agar aapka capital <strong>₹1,00,000</strong> hai aur risk per trade <strong>1% (₹1,000)</strong> hai, toh Reliance ₹2,950 par buy karte waqt ₹2,925 ka stop-loss (₹25 risk/share) lagane par aapki sahi quantity <strong>40 shares</strong> (₹1,000 ÷ ₹25) hogi."
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Asaan Hinglish + Standard Trading Terms</span>
                  <span className="font-medium text-blue-400">Select Hinglish</span>
                </div>
              </button>
            </div>

            {/* Quick Persona Switcher for Instant Testing */}
            {mode === 'full_onboarding' && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Instant Profile Presets: </span>
                  Want to jump right in without the questionnaire? Load a pre-configured profile in{' '}
                  <strong className="text-blue-400">
                    {selectedLang === 'hinglish' ? 'Hinglish' : 'English'}
                  </strong>
                  :
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onApplyPresetPersona('beginner', selectedLang)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 whitespace-nowrap"
                  >
                    Beginner Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => onApplyPresetPersona('intermediate', selectedLang)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 whitespace-nowrap"
                  >
                    Intermediate Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => onApplyPresetPersona('advanced', selectedLang)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 whitespace-nowrap"
                  >
                    Advanced Quant Preset
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmLanguage}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <span>
                  {mode === 'language_only'
                    ? selectedLang === 'hinglish'
                      ? 'Hinglish Save Karein'
                      : 'Save Language Preference'
                    : selectedLang === 'hinglish'
                    ? 'Aage Badhein (Continue in Hinglish)'
                    : 'Continue in English'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Experience, Goal, Market Scope & Daily Time */}
        {step === 'goals' && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <div className="text-xs text-blue-400 font-medium mb-1">
                Step 2 of 3 · Personalize Your Curriculum
              </div>
              <h2 className="text-xl font-semibold text-white">
                {selectedLang === 'hinglish'
                  ? 'Apna Trading Experience aur Learning Goal Chunein'
                  : 'Tailor Your Learning Path & Risk Guardrails'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {selectedLang === 'hinglish' ? 'Aapka Naam (Your Name)' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {selectedLang === 'hinglish'
                    ? 'Rozana Seekhne ka Samay (Daily Study Time)'
                    : 'Daily Learning Time Commitment'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyMinutes(mins)}
                      className={`py-2 px-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
                        dailyMinutes === mins
                          ? 'bg-blue-600/25 border-blue-500 text-blue-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mins === 60 ? '60m+' : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                {selectedLang === 'hinglish'
                  ? '1. Current Market Experience Level'
                  : '1. Select Your Current Experience Level'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(
                  [
                    {
                      id: 'beginner',
                      title: 'Beginner',
                      desc:
                        selectedLang === 'hinglish'
                          ? 'Stocks, Demat, Candlesticks aur 1% Risk Rule bilkul shuru se seekhein'
                          : 'New to markets. Learn stocks, candlesticks, orders, and 1% risk sizing from scratch.',
                    },
                    {
                      id: 'intermediate',
                      title: 'Intermediate',
                      desc:
                        selectedLang === 'hinglish'
                          ? 'Price Action structure (HH/HL), VWAP, Intraday/Swing rules aur consistency banayein'
                          : 'Know chart basics. Focus on price action structure, VWAP, backtesting, and discipline.',
                    },
                    {
                      id: 'advanced',
                      title: 'Professional / Quant',
                      desc:
                        selectedLang === 'hinglish'
                          ? 'Options Greeks, Systematic Backtesting, Overfitting checks aur Python Algo Lab'
                          : 'Focus on systematic rules, Options Greeks, backtest biases, and Python strategy architecture.',
                    },
                  ] as const
                ).map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`p-3.5 rounded-lg border text-left transition-colors ${
                      selectedLevel === lvl.id
                        ? 'border-blue-500 bg-blue-950/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-semibold text-white">{lvl.title}</div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Goal */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                {selectedLang === 'hinglish'
                  ? '2. Primary Learning Goal'
                  : '2. Primary Learning Focus'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {(
                  [
                    { id: 'investing', label: 'Long-Term Investing' },
                    { id: 'swing', label: 'Swing Trading' },
                    { id: 'intraday', label: 'Intraday Trading' },
                    { id: 'scalping', label: 'Scalping & Execution' },
                    { id: 'options', label: 'Options & Hedging' },
                    { id: 'algo', label: 'Algorithmic / Quant' },
                    { id: 'all', label: 'Complete Curriculum' },
                  ] as const
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                      selectedGoal === g.id
                        ? 'border-blue-500 bg-blue-950/30 text-blue-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Market Availability Notice */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-semibold text-emerald-400">
                  ● Indian Market (NSE / BSE · INR ₹) — Active
                </span>
                <span className="text-slate-400 ml-2">
                  Includes Nifty 50, BankNifty, Equities, ETFs & SEBI/STT cost engine.
                </span>
              </div>
              <span className="text-slate-500 font-mono">
                US Equities ($) & Crypto · Coming Soon
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('language')}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                ← Back to Language
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white border border-slate-700 rounded-lg"
                >
                  Skip Quiz & Start
                </button>
                <button
                  type="button"
                  onClick={() => setStep('assessment')}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2"
                >
                  <span>Take 60-Second Skill Check</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Quick Skill Assessment */}
        {step === 'assessment' && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-xs text-blue-400 font-medium mb-1">
                Step 3 of 3 · Adaptive Diagnostic Assessment
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                {selectedLang === 'hinglish'
                  ? '5 Quick Questions — Aapka Personalized Study Plan Banane ke Liye'
                  : '5 Quick Diagnostic Questions to Calibrate Your Study Plan'}
              </h2>
            </div>

            <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1">
              {SKILL_ASSESSMENT_QUESTIONS.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2.5"
                >
                  <div className="text-xs font-medium text-white">
                    {idx + 1}. {q.question[selectedLang]}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const chosen = answers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                          className={`px-3 py-2 rounded-lg text-xs text-left border transition-colors ${
                            chosen
                              ? 'border-blue-500 bg-blue-950/30 text-blue-200'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt[selectedLang]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep('goals')}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {selectedLang === 'hinglish'
                    ? 'Personalized Academy Shuru Karein'
                    : 'Generate My Personalized Curriculum'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
