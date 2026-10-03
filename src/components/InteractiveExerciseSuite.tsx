import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Flag,
  Play,
  RotateCcw,
  Calculator,
  Code2,
  AlertTriangle,
} from 'lucide-react';
import {
  INTERACTIVE_EXERCISES_V2,
  gradeChartDrawingExercise,
  gradeNumericExercise,
} from '../data/interactiveExercisesV2';
import { INDIAN_MARKET_ASSETS } from '../data/indianMarketData';
import {
  AIErrorReport,
  InteractiveExerciseItem,
  Language,
  UserChartDrawing,
} from '../types';
import { ChartAnnotationCanvas } from './ChartAnnotationCanvas';
import { InteractiveCandlestickChart } from './InteractiveCandlestickChart';

interface InteractiveExerciseSuiteProps {
  language: Language;
  completedIds?: string[];
  onCompleteExercise?: (exId: string, passed: boolean) => void;
  onScoreUpdate?: (correct: boolean) => void;
  onReportIssue?: (report: Omit<AIErrorReport, 'id' | 'timestamp' | 'status'>) => void;
}

export const InteractiveExerciseSuite: React.FC<InteractiveExerciseSuiteProps> = ({
  language,
  completedIds = [],
  onCompleteExercise,
  onScoreUpdate,
  onReportIssue,
}) => {
  const [selectedExId, setSelectedExId] = useState<string>(
    INTERACTIVE_EXERCISES_V2[0].id
  );
  const activeEx: InteractiveExerciseItem =
    INTERACTIVE_EXERCISES_V2.find((e) => e.id === selectedExId) ||
    INTERACTIVE_EXERCISES_V2[0];

  // State per exercise interaction
  const [numericInput, setNumericInput] = useState<string>('50');
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [clickedCandleIdx, setClickedCandleIdx] = useState<number | null>(null);
  const [userDrawings, setUserDrawings] = useState<UserChartDrawing[]>([]);
  const [orderEntry, setOrderEntry] = useState<number>(1685);
  const [orderStop, setOrderStop] = useState<number>(1650);
  const [orderTarget, setOrderTarget] = useState<number>(1760);
  const [replayBars, setReplayBars] = useState<number>(26);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<{
    passed: boolean;
    feedback: string;
  } | null>(null);
  const [flagComment, setFlagComment] = useState<string>('');
  const [flagOpen, setFlagOpen] = useState<boolean>(false);

  const asset =
    INDIAN_MARKET_ASSETS.find((a) => a.symbol === activeEx.symbol) ||
    INDIAN_MARKET_ASSETS[2];

  const handleSelectExercise = (id: string) => {
    setSelectedExId(id);
    setSelectedOptIdx(null);
    setClickedCandleIdx(null);
    setUserDrawings([]);
    setShowHint(false);
    setSubmittedResult(null);
    setReplayBars(26);
  };

  const evaluateExercise = () => {
    let passed = false;
    let feedback = activeEx.explanation[language];

    if (activeEx.format === 'numeric_calc') {
      const res = gradeNumericExercise(
        Number(numericInput),
        activeEx.numericExpected || 50,
        activeEx.numericTolerance || 0
      );
      passed = res.passed;
      feedback = `${
        passed ? '✓ Exact Deterministic Match!' : `× Off by ${res.diff} ${activeEx.numericUnit}.`
      } ${activeEx.explanation[language]}`;
    } else if (activeEx.format === 'draw_sr') {
      const grade = gradeChartDrawingExercise(
        userDrawings,
        activeEx.expectedSupportPrice || 2915,
        activeEx.expectedResistancePrice || 3035,
        activeEx.priceToleranceInr || 22
      );
      passed = grade.passed;
      feedback = `Support Check: ${
        grade.supportMatched ? 'PASS ✓' : 'Outside ±₹22 band'
      } · Resistance Check: ${
        grade.resistanceMatched ? 'PASS ✓' : 'Outside ±₹22 band'
      }. ${activeEx.explanation[language]}`;
    } else if (activeEx.format === 'candle_click') {
      const range = activeEx.targetCandleRange || [10, 18];
      passed =
        clickedCandleIdx !== null &&
        clickedCandleIdx >= range[0] &&
        clickedCandleIdx <= range[1];
      feedback = `${
        passed
          ? `✓ Candle #${(clickedCandleIdx ?? 0) + 1} is inside the Swing Low Demand Zone (#${range[0] + 1}–#${range[1] + 1})!`
          : `× Please click a candle inside the Swing Low bounce window (#${range[0] + 1}–#${range[1] + 1}).`
      } ${activeEx.explanation[language]}`;
    } else if (activeEx.format === 'place_order' && activeEx.expectedOrderSetup) {
      const cfg = activeEx.expectedOrderSetup;
      const risk = Math.max(0.5, orderEntry - orderStop);
      const reward = Math.max(0.5, orderTarget - orderEntry);
      const rr = Number((reward / risk).toFixed(2));
      const stopValid = orderStop <= cfg.maxStopLoss && orderStop < orderEntry;
      const rrValid = rr >= cfg.minRR;
      passed = stopValid && rrValid;
      feedback = `Computed R:R = 1 : ${rr} (${
        rrValid ? '≥ 1:2.0 ✓' : '< 1:2.0 ×'
      }) · Stop Placement (₹${orderStop}): ${
        stopValid ? 'Below ₹1,658 Support ✓' : 'Too tight / above support ×'
      }. ${activeEx.explanation[language]}`;
    } else if (activeEx.format === 'spot_mistake' && activeEx.flawedTicketData) {
      passed = selectedOptIdx === activeEx.flawedTicketData.correctFlawIndex;
    } else if (activeEx.format === 'strategy_fix' && activeEx.brokenStrategySnippet) {
      passed = selectedOptIdx === activeEx.brokenStrategySnippet.correctBugIndex;
    } else {
      passed = selectedOptIdx === activeEx.correctOptionIndex;
    }

    setSubmittedResult({ passed, feedback });
    if (onCompleteExercise) onCompleteExercise(activeEx.id, passed);
    if (onScoreUpdate) onScoreUpdate(passed);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Selector: All 10 Exercise Formats */}
      <div className="lg:col-span-4 space-y-2.5">
        <div className="text-xs font-semibold text-slate-300 pb-1">
          10-Format Interactive Exercise Lab (Master Spec v2)
        </div>
        {INTERACTIVE_EXERCISES_V2.map((ex) => {
          const isDone = completedIds.includes(ex.id);
          const isActive = ex.id === activeEx.id;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => handleSelectExercise(ex.id)}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between gap-2 ${
                isActive
                  ? 'border-blue-500 bg-blue-950/35 text-white'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="min-w-0">
                <div className="font-semibold truncate">{ex.title[language]}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Format: {ex.format.toUpperCase()} · {ex.symbol} · {ex.level}
                </div>
              </div>
              {isDone && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Workspace: Interactive Exercise Renderer */}
      <div className="lg:col-span-8 border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-mono text-blue-400">
              {activeEx.format.toUpperCase()} · {activeEx.symbol} · Validation Stage:{' '}
              <span className="text-emerald-400">{activeEx.stage.toUpperCase()}</span>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-white mt-0.5">
              {activeEx.title[language]}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className="px-2.5 py-1 rounded border border-slate-800 bg-slate-950 text-xs text-amber-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Hint / Formula'}</span>
            </button>
            <button
              type="button"
              onClick={() => setFlagOpen((v) => !v)}
              className="px-2.5 py-1 rounded border border-slate-800 bg-slate-950 text-xs text-rose-300 flex items-center gap-1"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Flag Exercise</span>
            </button>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
          {activeEx.prompt[language]}
        </p>

        {showHint && (
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 font-mono">
            Hint: {activeEx.hint[language]}
          </div>
        )}

        {/* Format-Specific Interactive UI */}
        {activeEx.format === 'numeric_calc' && (
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <label className="block text-xs text-slate-400 font-mono">
              Enter Exact Calculated Value ({activeEx.numericUnit}):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={numericInput}
                onChange={(e) => setNumericInput(e.target.value)}
                className="w-40 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm font-mono text-white"
              />
              <span className="text-xs font-mono text-slate-400">
                {activeEx.numericUnit} (Deterministic Solver Verified)
              </span>
            </div>
          </div>
        )}

        {activeEx.format === 'draw_sr' && (
          <ChartAnnotationCanvas
            symbol={activeEx.symbol}
            candles={asset.candles}
            language={language}
            expectedSupport={activeEx.expectedSupportPrice}
            expectedResistance={activeEx.expectedResistancePrice}
            toleranceInr={activeEx.priceToleranceInr}
            mode="drawing"
            onDrawingsChange={setUserDrawings}
          />
        )}

        {activeEx.format === 'candle_click' && (
          <div className="space-y-2">
            <ChartAnnotationCanvas
              symbol={activeEx.symbol}
              candles={asset.candles}
              language={language}
              targetCandleRange={activeEx.targetCandleRange}
              mode="candle_click"
              selectedCandleIndex={clickedCandleIdx}
              onCandleClick={(idx) => setClickedCandleIdx(idx)}
            />
            <div className="text-xs font-mono text-slate-300">
              Selected Candle:{' '}
              {clickedCandleIdx !== null
                ? `Candle #${clickedCandleIdx + 1} (${asset.candles[clickedCandleIdx]?.date})`
                : 'None clicked yet — click a candle on the chart above'}
            </div>
          </div>
        )}

        {activeEx.format === 'place_order' && (
          <div className="space-y-4">
            <InteractiveCandlestickChart
              symbol={activeEx.symbol}
              candles={asset.candles}
              supportLevel={1655}
              resistanceLevel={1745}
              entryLevel={orderEntry}
              stopLevel={orderStop}
              targetLevel={orderTarget}
              height={260}
            />
            <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
              <div>
                <label className="block text-sky-400 mb-1">Entry Price (₹)</label>
                <input
                  type="number"
                  value={orderEntry}
                  onChange={(e) => setOrderEntry(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-rose-400 mb-1">Stop-Loss (₹)</label>
                <input
                  type="number"
                  value={orderStop}
                  onChange={(e) => setOrderStop(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-400 mb-1">Target Price (₹)</label>
                <input
                  type="number"
                  value={orderTarget}
                  onChange={(e) => setOrderTarget(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeEx.format === 'spot_mistake' && activeEx.flawedTicketData && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 font-mono text-xs">
              <div>
                <span className="text-slate-400 block">Capital</span>
                <strong className="text-white">
                  ₹{activeEx.flawedTicketData.capitalInr.toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Quantity</span>
                <strong className="text-rose-400">
                  {activeEx.flawedTicketData.shares} sh
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Entry</span>
                <strong className="text-white">₹{activeEx.flawedTicketData.entryPrice}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Stop-Loss</span>
                <strong className="text-rose-400">₹{activeEx.flawedTicketData.stopLoss}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Target</span>
                <strong className="text-amber-300">
                  ₹{activeEx.flawedTicketData.targetPrice}
                </strong>
              </div>
            </div>

            <div className="space-y-2">
              {activeEx.flawedTicketData.flawOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOptIdx(idx)}
                  className={`w-full text-left p-3 rounded-lg border text-xs ${
                    selectedOptIdx === idx
                      ? 'border-blue-500 bg-blue-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                >
                  {opt[language]}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeEx.format === 'strategy_fix' && activeEx.brokenStrategySnippet && (
          <div className="space-y-3">
            <pre className="p-3.5 rounded-lg bg-slate-950 border border-rose-500/40 font-mono text-xs text-rose-200 overflow-x-auto">
              {activeEx.brokenStrategySnippet.code}
            </pre>
            <div className="space-y-2">
              {activeEx.brokenStrategySnippet.bugOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOptIdx(idx)}
                  className={`w-full text-left p-3 rounded-lg border text-xs ${
                    selectedOptIdx === idx
                      ? 'border-blue-500 bg-blue-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                >
                  {opt[language]}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeEx.format === 'chart_replay' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Showing {replayBars} of {asset.candles.length} Historical Bars
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setReplayBars((b) => Math.min(asset.candles.length, b + 1))
                  }
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono"
                >
                  +1 Bar Step →
                </button>
                <button
                  type="button"
                  onClick={() => setReplayBars(26)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  Reset Replay
                </button>
              </div>
            </div>
            <InteractiveCandlestickChart
              symbol={activeEx.symbol}
              candles={asset.candles}
              revealedCount={replayBars}
              supportLevel={2920}
              resistanceLevel={3020}
              height={250}
            />
          </div>
        )}

        {(activeEx.format === 'mcq' ||
          activeEx.format === 'true_false' ||
          activeEx.format === 'chart_replay' ||
          activeEx.format === 'psychology_scenario') &&
          activeEx.mcqOptions && (
            <div className="space-y-2">
              {activeEx.mcqOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOptIdx(idx)}
                  className={`w-full text-left p-3 rounded-lg border text-xs ${
                    selectedOptIdx === idx
                      ? 'border-blue-500 bg-blue-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                >
                  {opt[language]}
                </button>
              ))}
            </div>
          )}

        {/* Submit & Feedback Row */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={evaluateExercise}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Verify Solution (Deterministic Grader)
          </button>
        </div>

        {submittedResult && (
          <div
            className={`p-4 rounded-lg border text-xs leading-relaxed space-y-2 ${
              submittedResult.passed
                ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-100'
                : 'border-amber-500/40 bg-amber-950/20 text-amber-100'
            }`}
          >
            <div className="font-semibold">
              {submittedResult.passed
                ? '✓ Passed Deterministic Verification!'
                : 'Review Calculation / Setup Rules:'}
            </div>
            <p>{submittedResult.feedback}</p>
            {activeEx.brokenStrategySnippet && submittedResult.passed && (
              <pre className="p-3 rounded bg-slate-950 border border-emerald-500/30 font-mono text-[11px] text-emerald-300 mt-2">
                {activeEx.brokenStrategySnippet.fixedCode}
              </pre>
            )}
          </div>
        )}

        {/* Flag / Report Issue Box */}
        {flagOpen && (
          <div className="p-4 rounded-lg bg-slate-950 border border-rose-500/40 space-y-2.5 text-xs">
            <div className="font-semibold text-rose-300">
              Report Content / Calculation Issue to Governance Pipeline
            </div>
            <input
              type="text"
              value={flagComment}
              onChange={(e) => setFlagComment(e.target.value)}
              placeholder="Describe the math, chart level, or explanation issue..."
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!flagComment.trim()) return;
                if (onReportIssue) {
                  onReportIssue({
                    sourceModule: 'Exercise Engine',
                    issueType: 'Calculation / Math Mismatch',
                    contextSnippet: `${activeEx.id} (${activeEx.title.en})`,
                    userComment: flagComment,
                  });
                }
                setFlagComment('');
                setFlagOpen(false);
              }}
              className="px-3.5 py-1.5 rounded bg-rose-600 text-white font-medium"
            >
              Submit Report to QA Audit Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
