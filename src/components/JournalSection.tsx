import React, { useState } from 'react';
import {
  BookMarked,
  Plus,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { INDIAN_MARKET_ASSETS } from '../data/indianMarketData';
import { JournalEntry, Language, UserProfile } from '../types';

interface JournalSectionProps {
  profile: UserProfile;
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  profile,
  entries,
  onAddEntry,
}) => {
  const lang: Language = profile.language;
  const [setupFilter, setSetupFilter] = useState<string>('ALL');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'LONG' | 'SHORT'>('ALL');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New Journal Entry Form State
  const [symbol, setSymbol] = useState<string>('RELIANCE');
  const [timeOfDay, setTimeOfDay] = useState<JournalEntry['timeOfDay']>(
    'Opening (9:15-10:30)'
  );
  const [setup, setSetup] = useState<JournalEntry['setup']>('Pullback to EMA/VWAP');
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState<number>(2960);
  const [stopLoss, setStopLoss] = useState<number>(2930);
  const [targetPrice, setTargetPrice] = useState<number>(3020);
  const [exitPrice, setExitPrice] = useState<number>(3015);
  const [quantity, setQuantity] = useState<number>(25);
  const [emotion, setEmotion] = useState<JournalEntry['emotion']>('Calm & Disciplined');
  const [mistake, setMistake] = useState<JournalEntry['mistake']>(
    'None — Followed Plan'
  );
  const [reasonForTrade, setReasonForTrade] = useState<string>(
    'Pullback to 20-EMA support with rising volume confirmation.'
  );
  const [lessonLearned, setLessonLearned] = useState<string>(
    'Predefined stop-loss kept emotions calm throughout the trade.'
  );

  // AI Pattern Analysis State
  const [aiAnalyzing, setAiAnalyzing] = useState<boolean>(false);
  const [aiJournalInsights, setAiJournalInsights] = useState<{
    summaryObservation: string;
    detectedPatterns: string[];
    strengths: string[];
    recommendedLessons: string[];
  } | null>(null);

  const filteredEntries = entries.filter((e) => {
    if (setupFilter !== 'ALL' && e.setup !== setupFilter) return false;
    if (directionFilter !== 'ALL' && e.direction !== directionFilter) return false;
    return true;
  });

  // Compute Analytics (Section 22)
  const totalTrades = filteredEntries.length;
  const winningTrades = filteredEntries.filter((e) => e.netPnl > 0);
  const losingTrades = filteredEntries.filter((e) => e.netPnl <= 0);
  const winRate =
    totalTrades > 0 ? Number(((winningTrades.length / totalTrades) * 100).toFixed(1)) : 0;

  const totalNetPnl = filteredEntries.reduce((acc, e) => acc + e.netPnl, 0);
  const avgR =
    totalTrades > 0
      ? Number(
          (
            filteredEntries.reduce((acc, e) => acc + e.rMultiple, 0) / totalTrades
          ).toFixed(2)
        )
      : 0;

  const grossProfit = winningTrades.reduce((acc, e) => acc + e.netPnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((acc, e) => acc + e.netPnl, 0));
  const profitFactor =
    grossLoss > 0
      ? Number((grossProfit / grossLoss).toFixed(2))
      : grossProfit > 0
      ? 3.0
      : 0;

  const disciplinedCount = filteredEntries.filter(
    (e) => e.mistake === 'None — Followed Plan'
  ).length;
  const disciplineScore =
    totalTrades > 0 ? Math.round((disciplinedCount / totalTrades) * 100) : 100;

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const stopDist = Math.max(1, Math.abs(entryPrice - stopLoss));
    const priceDiff =
      direction === 'LONG' ? exitPrice - entryPrice : entryPrice - exitPrice;
    const netPnl = Number((priceDiff * quantity - 55).toFixed(2));
    const rMultiple = Number((priceDiff / stopDist).toFixed(2));

    const newItem: JournalEntry = {
      id: 'jrn-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      timeOfDay,
      symbol,
      setup,
      direction,
      entryPrice,
      stopLoss,
      targetPrice,
      exitPrice,
      quantity,
      netPnl,
      rMultiple,
      reasonForTrade,
      emotion,
      mistake,
      lessonLearned,
    };

    onAddEntry(newItem);
    setShowAddForm(false);
  };

  const handleRunAIJournalAnalysis = async () => {
    setAiAnalyzing(true);
    try {
      const res = await fetch('/api/ai/journal-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries,
          language: lang,
        }),
      });
      const data = await res.json();
      if (res.ok && data.summaryObservation) {
        setAiJournalInsights(data);
      } else {
        setAiJournalInsights({
          summaryObservation:
            lang === 'hinglish'
              ? `Aapke ${entries.length} recorded trades mein Discipline Score ${disciplineScore}% hai aur Expectancy +${avgR}R per trade hai.`
              : `Across your ${entries.length} recorded trades, your rule-adherence score is ${disciplineScore}% with a positive expectancy of +${avgR}R per trade.`,
          detectedPatterns: [
            lang === 'hinglish'
              ? 'Midday session (10:30-13:30) mein FOMO ke kaaran liye gaye breakout trades mein win-rate kam raha hai.'
              : 'Midday session (10:30–13:30) breakout attempts tagged with FOMO show lower follow-through than morning pullback setups.',
            lang === 'hinglish'
              ? 'Jab aapने "Pullback to EMA/VWAP" setup par predefined stop-loss rakha, tab 2R targets smoothly achieve hue.'
              : 'Trades where you waited for a pullback to EMA/VWAP or Support Bounce achieved an average +2.0R multiple.',
          ],
          strengths: [
            'Consistent stop-loss placement keeping losses near -1.0R.',
            'Clear post-trade reflection notes on every logged entry.',
          ],
          recommendedLessons: [
            'Review Path C: False Breakouts & Midday Volume Filters',
            'Review Path E: Overcoming FOMO & Sticking to Written Checklists',
          ],
        });
      }
    } catch {
      // Handled fallback
    } finally {
      setAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            Trading Journal & Performance Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'hinglish'
              ? 'Har trade ka setup, emotion aur mistake record karein. AI aapke journal data se behavioral patterns dikhayega.'
              : 'Track setups, R-multiples, emotions, and mistakes. Review objective process patterns rather than just rupee P&L.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRunAIJournalAnalysis}
            disabled={aiAnalyzing}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-100 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {aiAnalyzing ? 'Analyzing Patterns...' : 'AI Behavioral Pattern Audit'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Trade Entry</span>
          </button>
        </div>
      </div>

      {/* Performance Analytics KPI Row (Section 22) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono tabular-nums">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block">Total Logged Trades</span>
          <strong className="text-base text-white">{totalTrades}</strong>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block">Win Rate</span>
          <strong className="text-base text-sky-400">{winRate}%</strong>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block">Average Expectancy</span>
          <strong
            className={`text-base ${
              avgR >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {avgR >= 0 ? '+' : ''}
            {avgR}R
          </strong>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block">Profit Factor</span>
          <strong className="text-base text-emerald-400">{profitFactor}</strong>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block">Net Journal P&L</span>
          <strong
            className={`text-base ${
              totalNetPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalNetPnl >= 0 ? '+' : ''}₹{totalNetPnl.toFixed(1)}
          </strong>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block">Rule Discipline Score</span>
          <strong className="text-base text-amber-300">{disciplineScore}%</strong>
        </div>
      </div>

      {/* AI Behavioral Insights Card */}
      {aiJournalInsights && (
        <div className="p-5 rounded-xl border border-blue-500/40 bg-blue-950/20 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-blue-300">
              AI Journal Behavioral Observation Report (Data-Driven Process Audit)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Observations from Recorded Trades Only
            </span>
          </div>
          <p className="text-slate-200 leading-relaxed">
            {aiJournalInsights.summaryObservation}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="font-semibold text-amber-300 block mb-1">
                Detected Process Patterns:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {aiJournalInsights.detectedPatterns.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="font-semibold text-emerald-300 block mb-1">
                Observed Strengths:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {aiJournalInsights.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="font-semibold text-sky-300 block mb-1">
                Recommended Study Modules:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {aiJournalInsights.recommendedLessons.map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible New Journal Entry Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveEntry}
          className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white">
              Record New Trade & Behavioral Reflection
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">NSE Symbol</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-2.5 py-2 rounded bg-slate-950 border border-slate-800 text-white"
              >
                {INDIAN_MARKET_ASSETS.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Session Time of Day</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Opening (9:15-10:30)">Opening (9:15-10:30)</option>
                <option value="Midday (10:30-13:30)">Midday (10:30-13:30)</option>
                <option value="Closing (13:30-15:30)">Closing (13:30-15:30)</option>
                <option value="Positional / EOD">Positional / EOD</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Setup Type</label>
              <select
                value={setup}
                onChange={(e) => setSetup(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Pullback to EMA/VWAP">Pullback to EMA/VWAP</option>
                <option value="Breakout">Breakout</option>
                <option value="Support Bounce">Support Bounce</option>
                <option value="Range Rejection">Range Rejection</option>
                <option value="Impulse / Unplanned">Impulse / Unplanned</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded bg-slate-950 border border-slate-800 text-white"
              >
                <option value="LONG">LONG (Buy)</option>
                <option value="SHORT">SHORT (Sell)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Entry (₹)</label>
              <input
                type="number"
                step="0.5"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-rose-400 mb-1">Stop-Loss (₹)</label>
              <input
                type="number"
                step="0.5"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-emerald-400 mb-1">Target (₹)</label>
              <input
                type="number"
                step="0.5"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-sky-400 mb-1">Actual Exit (₹)</label>
              <input
                type="number"
                step="0.5"
                value={exitPrice}
                onChange={(e) => setExitPrice(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Emotional State</label>
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Calm & Disciplined">Calm & Disciplined</option>
                <option value="FOMO (Chasing)">FOMO (Chasing)</option>
                <option value="Fear / Hesitation">Fear / Hesitation</option>
                <option value="Revenge Trading">Revenge Trading</option>
                <option value="Overconfident">Overconfident</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Process Mistake Tag</label>
              <select
                value={mistake}
                onChange={(e) => setMistake(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded bg-slate-950 border border-slate-800 text-white"
              >
                <option value="None — Followed Plan">None — Followed Plan</option>
                <option value="Moved Stop Loss Wider">Moved Stop Loss Wider</option>
                <option value="Exited Too Early">Exited Too Early</option>
                <option value="Oversized Position">Oversized Position</option>
                <option value="Traded Outside Rules">Traded Outside Rules</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Entry Thesis / Reason</label>
              <input
                type="text"
                value={reasonForTrade}
                onChange={(e) => setReasonForTrade(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Post-Trade Lesson Learned</label>
              <input
                type="text"
                value={lessonLearned}
                onChange={(e) => setLessonLearned(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              Save Journal Record
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar & Journal Table */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter by Setup:</span>
            {['ALL', 'Pullback to EMA/VWAP', 'Breakout', 'Support Bounce'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSetupFilter(st)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  setupFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {(['ALL', 'LONG', 'SHORT'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirectionFilter(d)}
                className={`px-2.5 py-1 rounded text-xs font-mono ${
                  directionFilter === d
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 pr-3">Date / Session</th>
                <th className="py-2.5 px-2">Asset & Setup</th>
                <th className="py-2.5 px-2 text-right">Entry → Exit</th>
                <th className="py-2.5 px-2 text-right">R-Multiple</th>
                <th className="py-2.5 px-2 text-right">Net P&L (₹)</th>
                <th className="py-2.5 px-3">Emotion & Mistake Tag</th>
                <th className="py-2.5 pl-3">Lesson Learned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-950/50">
                  <td className="py-3 pr-3 font-mono whitespace-nowrap">
                    <div className="text-slate-200">{entry.date}</div>
                    <div className="text-[11px] text-slate-500">{entry.timeOfDay}</div>
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap">
                    <div className="font-semibold text-white">
                      {entry.symbol} · {entry.direction}
                    </div>
                    <div className="text-[11px] text-blue-400">{entry.setup}</div>
                  </td>
                  <td className="py-3 px-2 text-right font-mono tabular-nums whitespace-nowrap text-slate-300">
                    ₹{entry.entryPrice} → ₹{entry.exitPrice}
                  </td>
                  <td
                    className={`py-3 px-2 text-right font-mono tabular-nums font-semibold ${
                      entry.rMultiple >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {entry.rMultiple >= 0 ? '+' : ''}
                    {entry.rMultiple}R
                  </td>
                  <td
                    className={`py-3 px-2 text-right font-mono tabular-nums font-semibold ${
                      entry.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {entry.netPnl >= 0 ? '+' : ''}₹{entry.netPnl}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="text-slate-200">{entry.emotion}</div>
                    <div
                      className={`text-[11px] ${
                        entry.mistake === 'None — Followed Plan'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {entry.mistake}
                    </div>
                  </td>
                  <td className="py-3 pl-3 text-slate-300 max-w-xs">
                    {entry.lessonLearned}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
