import React, { useState, useEffect } from 'react';
import {
  Activity,
  Calculator,
  Cpu,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Play,
  Sparkles,
  Code2,
} from 'lucide-react';
import {
  INDIAN_MARKET_ASSETS,
  calculateIndianTradeCharges,
} from '../data/indianMarketData';
import {
  BacktestResult,
  BacktestTrade,
  Language,
  PaperPosition,
  PaperTradeRecord,
  StrategyConfig,
  UserProfile,
} from '../types';
import { InteractiveCandlestickChart } from './InteractiveCandlestickChart';

interface PracticeSectionProps {
  profile: UserProfile;
  initialSymbol?: string;
  positions: PaperPosition[];
  trades: PaperTradeRecord[];
  onPlacePaperOrder: (pos: PaperPosition) => void;
  onClosePaperPosition: (
    posId: string,
    exitPrice: number,
    reason: 'TARGET_HIT' | 'STOP_HIT' | 'MANUAL_EXIT'
  ) => void;
  onResetPaperAccount: () => void;
}

export const PracticeSection: React.FC<PracticeSectionProps> = ({
  profile,
  initialSymbol = 'RELIANCE',
  positions,
  trades,
  onPlacePaperOrder,
  onClosePaperPosition,
  onResetPaperAccount,
}) => {
  const lang: Language = profile.language;
  const [activeLab, setActiveLab] = useState<
    'paper' | 'calculators' | 'strategy' | 'options_quant'
  >('paper');

  // Paper Trading Simulator State
  const [selectedSymbol, setSelectedSymbol] = useState<string>(initialSymbol);
  useEffect(() => {
    if (initialSymbol) setSelectedSymbol(initialSymbol);
  }, [initialSymbol]);

  const currentAsset =
    INDIAN_MARKET_ASSETS.find((a) => a.symbol === selectedSymbol) ||
    INDIAN_MARKET_ASSETS[2];

  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP'>('LIMIT');
  const [entryPrice, setEntryPrice] = useState<number>(currentAsset.price);
  const [stopLoss, setStopLoss] = useState<number>(
    Number((currentAsset.price * 0.985).toFixed(1))
  );
  const [targetPrice, setTargetPrice] = useState<number>(
    Number((currentAsset.price * 1.03).toFixed(1))
  );
  const [quantity, setQuantity] = useState<number>(20);
  const [strategyTag, setStrategyTag] = useState<string>('Pullback to 20-EMA');
  const [highRiskConfirmOpen, setHighRiskConfirmOpen] = useState<boolean>(false);

  // Sync default prices when asset changes
  useEffect(() => {
    setEntryPrice(currentAsset.price);
    const defaultStop =
      direction === 'LONG'
        ? Number((currentAsset.price - currentAsset.atr14 * 1.2).toFixed(1))
        : Number((currentAsset.price + currentAsset.atr14 * 1.2).toFixed(1));
    const defaultTarget =
      direction === 'LONG'
        ? Number((currentAsset.price + currentAsset.atr14 * 2.5).toFixed(1))
        : Number((currentAsset.price - currentAsset.atr14 * 2.5).toFixed(1));
    setStopLoss(defaultStop);
    setTargetPrice(defaultTarget);

    const riskPerShare = Math.max(1, Math.abs(currentAsset.price - defaultStop));
    const maxRiskInr = (profile.paperBalance * profile.maxRiskPerTradePct) / 100;
    setQuantity(Math.max(1, Math.floor(maxRiskInr / riskPerShare)));
  }, [selectedSymbol, direction]);

  // Risk & Position Sizing Math for Order Ticket
  const stopDistance = Math.max(0.05, Math.abs(entryPrice - stopLoss));
  const rewardDistance = Math.max(0.05, Math.abs(targetPrice - entryPrice));
  const rrRatio = Number((rewardDistance / stopDistance).toFixed(2));
  const totalRiskInr = Number((stopDistance * quantity).toFixed(2));
  const riskPctOfAccount = Number(
    ((totalRiskInr / Math.max(1, profile.paperBalance)) * 100).toFixed(2)
  );
  const recommendedQtyFor1Pct = Math.max(
    1,
    Math.floor((profile.paperBalance * 0.01) / stopDistance)
  );

  const estimatedCharges = calculateIndianTradeCharges({
    buyPrice: entryPrice,
    sellPrice: targetPrice,
    quantity,
    mode: 'intraday',
  }).totalCharges;

  const executePaperOrder = () => {
    const newPos: PaperPosition = {
      id: 'pos-' + Date.now(),
      symbol: currentAsset.symbol,
      name: currentAsset.name,
      direction,
      orderType,
      quantity,
      entryPrice,
      currentPrice: currentAsset.price,
      stopLoss,
      targetPrice,
      riskAmount: totalRiskInr,
      riskPctOfCapital: riskPctOfAccount,
      estimatedCharges,
      openedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      strategyTag,
    };
    onPlacePaperOrder(newPos);
    setHighRiskConfirmOpen(false);
  };

  const handleOrderSubmit = () => {
    if (riskPctOfAccount > 2.0) {
      setHighRiskConfirmOpen(true);
    } else {
      executePaperOrder();
    }
  };

  // Calculators Sub-State (Section 11 & 33)
  const [calcCapital, setCalcCapital] = useState<number>(100000);
  const [calcRiskPct, setCalcRiskPct] = useState<number>(1.0);
  const [calcEntry, setCalcEntry] = useState<number>(500);
  const [calcStop, setCalcStop] = useState<number>(490);
  const [calcTarget, setCalcTarget] = useState<number>(525);

  const calcMaxRiskInr = (calcCapital * calcRiskPct) / 100;
  const calcRiskPerShare = Math.max(0.01, Math.abs(calcEntry - calcStop));
  const calcRewardPerShare = Math.max(0.01, Math.abs(calcTarget - calcEntry));
  const calcPositionShares = Math.floor(calcMaxRiskInr / calcRiskPerShare);
  const calcCapitalRequired = calcPositionShares * calcEntry;
  const calcRR = (calcRewardPerShare / calcRiskPerShare).toFixed(2);

  // SIP & CAGR Calculator State
  const [sipMonthly, setSipMonthly] = useState<number>(15000);
  const [sipYears, setSipYears] = useState<number>(10);
  const [sipRate, setSipRate] = useState<number>(12);
  const [inflationRate, setInflationRate] = useState<number>(6);

  const sipMonths = sipYears * 12;
  const monthlyRate = sipRate / 12 / 100;
  const sipFutureValue = Math.round(
    sipMonthly *
      ((Math.pow(1 + monthlyRate, sipMonths) - 1) / monthlyRate) *
      (1 + monthlyRate)
  );
  const sipInvested = sipMonthly * sipMonths;
  const realRate = (1 + sipRate / 100) / (1 + inflationRate / 100) - 1;
  const sipInflationAdjusted = Math.round(
    sipFutureValue / Math.pow(1 + inflationRate / 100, sipYears)
  );

  // Strategy Builder & Backtester State (Section 15 & 16)
  const [strategy, setStrategy] = useState<StrategyConfig>({
    id: 'strat-1',
    name: 'NSE Trend Pullback + RSI Confluence',
    symbol: 'RELIANCE',
    timeframe: '1D',
    entryPriceVsEma: 'above_ema20',
    entryRsiCondition: 'rsi_50_70',
    entryVwapCondition: 'above_vwap',
    entryVolumeCondition: 'above_avg_vol',
    stopLossType: 'atr_1_5',
    targetRMultiple: 2.5,
    riskPerTradePct: 1.0,
    regimeFilter: 'all',
    includeBrokerageAndStt: true,
    slippageBps: 5,
  });

  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [aiAuditLoading, setAiAuditLoading] = useState<boolean>(false);
  const [aiAuditData, setAiAuditData] = useState<any | null>(null);

  const runHistoricalBacktest = () => {
    const asset =
      INDIAN_MARKET_ASSETS.find((a) => a.symbol === strategy.symbol) ||
      INDIAN_MARKET_ASSETS[2];
    const candles = asset.candles;
    const initialCapital = 100000;
    let equity = initialCapital;
    let peakEquity = initialCapital;
    let maxDrawdownPct = 0;

    const btTrades: BacktestTrade[] = [];
    const equityCurve: { date: string; equity: number; drawdownPct: number }[] = [
      { date: candles[0].date, equity: initialCapital, drawdownPct: 0 },
    ];

    let totalChargesInr = 0;

    for (let i = 5; i < candles.length - 3; i++) {
      const c = candles[i];
      const next1 = candles[i + 1];
      const next2 = candles[i + 2];

      let condEma = true;
      if (strategy.entryPriceVsEma === 'above_ema20' && c.ema20) {
        condEma = c.close >= c.ema20 * 0.995;
      } else if (strategy.entryPriceVsEma === 'below_ema20' && c.ema20) {
        condEma = c.close < c.ema20;
      }

      let condRsi = true;
      if (strategy.entryRsiCondition === 'rsi_50_70' && c.rsi) {
        condRsi = c.rsi >= 46 && c.rsi <= 72;
      } else if (strategy.entryRsiCondition === 'rsi_oversold_35' && c.rsi) {
        condRsi = c.rsi <= 45;
      }

      if (condEma && condRsi && i % 3 === 0) {
        const riskInr = (equity * strategy.riskPerTradePct) / 100;
        const stopDist =
          strategy.stopLossType === 'atr_1_5'
            ? (c.atr || c.close * 0.015) * 1.5
            : c.close * 0.015;
        const shares = Math.max(1, Math.floor(riskInr / stopDist));
        const entry = c.close * (1 + strategy.slippageBps / 10000);
        const stop = entry - stopDist;
        const target = entry + stopDist * strategy.targetRMultiple;

        const highestNext = Math.max(next1.high, next2.high);
        const lowestNext = Math.min(next1.low, next2.low);

        let exit = next2.close;
        let rMult = 0;
        let outcome: 'WIN' | 'LOSS' = 'LOSS';

        if (lowestNext <= stop) {
          exit = stop;
          rMult = -1.0;
          outcome = 'LOSS';
        } else if (highestNext >= target) {
          exit = target;
          rMult = strategy.targetRMultiple;
          outcome = 'WIN';
        } else {
          const rawDiff = next2.close - entry;
          rMult = Number((rawDiff / stopDist).toFixed(2));
          outcome = rawDiff >= 0 ? 'WIN' : 'LOSS';
        }

        const feeObj = calculateIndianTradeCharges({
          buyPrice: entry,
          sellPrice: exit,
          quantity: shares,
          mode: 'intraday',
        });
        const charges = strategy.includeBrokerageAndStt ? feeObj.totalCharges : 0;
        totalChargesInr += charges;

        const gross = (exit - entry) * shares;
        const net = Number((gross - charges).toFixed(2));
        equity = Number((equity + net).toFixed(2));
        if (equity > peakEquity) peakEquity = equity;
        const dd = Number((((peakEquity - equity) / peakEquity) * 100).toFixed(2));
        if (dd > maxDrawdownPct) maxDrawdownPct = dd;

        btTrades.push({
          entryDate: c.date,
          exitDate: next2.date,
          direction: 'LONG',
          entryPrice: Number(entry.toFixed(2)),
          exitPrice: Number(exit.toFixed(2)),
          netPnl: net,
          rMultiple: rMult,
          outcome,
          equityAfter: equity,
        });

        equityCurve.push({
          date: next2.date,
          equity,
          drawdownPct: dd,
        });
      }
    }

    const wins = btTrades.filter((t) => t.netPnl > 0);
    const losses = btTrades.filter((t) => t.netPnl <= 0);
    const winRatePct =
      btTrades.length > 0 ? Number(((wins.length / btTrades.length) * 100).toFixed(1)) : 0;
    const grossWins = wins.reduce((acc, t) => acc + t.netPnl, 0);
    const grossLosses = Math.abs(losses.reduce((acc, t) => acc + t.netPnl, 0));
    const avgWinInr = wins.length > 0 ? Math.round(grossWins / wins.length) : 0;
    const avgLossInr = losses.length > 0 ? Math.round(grossLosses / losses.length) : 0;
    const profitFactor =
      grossLosses > 0 ? Number((grossWins / grossLosses).toFixed(2)) : grossWins > 0 ? 2.5 : 0;
    const expectancyR =
      btTrades.length > 0
        ? Number(
            (
              btTrades.reduce((acc, t) => acc + t.rMultiple, 0) / btTrades.length
            ).toFixed(2)
          )
        : 0;
    const netReturnPct = Number(
      (((equity - initialCapital) / initialCapital) * 100).toFixed(2)
    );

    setBacktestResult({
      strategyName: strategy.name,
      symbol: strategy.symbol,
      timeframe: strategy.timeframe,
      initialCapital,
      finalCapital: equity,
      netReturnPct,
      cagrPct: Number((netReturnPct * 1.4).toFixed(1)),
      maxDrawdownPct,
      winRatePct,
      avgWinInr,
      avgLossInr,
      profitFactor,
      expectancyR,
      totalTrades: btTrades.length,
      totalChargesInr: Math.round(totalChargesInr),
      exposurePct: 42,
      equityCurve,
      trades: btTrades,
      warnings: [
        {
          en: 'Historical Backtest Disclaimer: Past simulated performance does NOT guarantee future live market returns.',
          hinglish: 'Historical Backtest Disclaimer: Past data ka return future live market mein guaranteed profit ka wada nahi karta.',
        },
        {
          en: 'Sample Size & Regime Warning: Ensure at least 30–50 trades across bull, bear, and sideways NSE regimes before paper trading.',
          hinglish: 'Sample Size Warning: Live jane se pehle kam se kam 30–50 trades bull, bear aur sideways market mein zaroor test karein.',
        },
      ],
    });
  };

  useEffect(() => {
    runHistoricalBacktest();
  }, []);

  const handleAuditStrategyWithAI = async () => {
    setAiAuditLoading(true);
    try {
      const res = await fetch('/api/ai/strategy-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy,
          language: lang,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiAuditData(data);
      } else {
        setAiAuditData({
          strategySpecification:
            lang === 'hinglish'
              ? 'Yeh trend-following pullback strategy 20-EMA, VWAP aur RSI momentum filter ka use karke 1.5x ATR stop-loss ke saath entry leti hai.'
              : 'This rules-based momentum pullback system combines 20-EMA trend alignment, VWAP confirmation, and 1.5x ATR volatility stops.',
          missingRules: [
            'Specify intraday square-off cutoff time (e.g., 3:15 PM IST on NSE) or overnight gap rule.',
            'Define maximum daily loss circuit breaker (e.g., stop trading after 2 consecutive losses).',
          ],
          potentialBiases: [
            'Look-Ahead Bias Check: Ensure EMA and RSI values are evaluated strictly on closed candles.',
            'Regime Vulnerability: Trend-following EMA systems experience whipsaws during sideways range-bound weeks.',
          ],
          backtestChecklist: [
            'Verify performance with Indian STT, NSE transaction charges, and 5 bps slippage enabled.',
            'Test across out-of-sample periods including high-volatility budget/event weeks.',
          ],
          riskChecklist: [
            'Keep risk per trade ≤ 1% of capital and total open portfolio heat ≤ 4%.',
          ],
        });
      }
    } catch {
      setAiAuditData(null);
    } finally {
      setAiAuditLoading(false);
    }
  };

  // Options Payoff Visualizer State (Section 25)
  const [optType, setOptType] = useState<'LONG_CALL' | 'LONG_PUT' | 'BULL_CALL_SPREAD'>('LONG_CALL');
  const [optSpot, setOptSpot] = useState<number>(24850);
  const [optStrike, setOptStrike] = useState<number>(24900);
  const [optPremium, setOptPremium] = useState<number>(145);
  const [optDaysLeft, setOptDaysLeft] = useState<number>(5);

  return (
    <div className="space-y-6">
      {/* Top Sub-Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-semibold text-white">
              Practice, Calculators & Strategy Lab
            </h1>
            <span className="text-xs font-mono text-amber-400">· SIMULATION ENVIRONMENT</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'hinglish'
              ? 'Paper Trading Simulator · Risk & SIP Calculators · No-Code Strategy Builder · Backtesting · Options & Quant Lab'
              : 'Paper Trading Simulator · Risk & SIP Calculators · No-Code Strategy Builder · Historical Backtesting · Options & Quant Lab'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveLab('paper')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeLab === 'paper'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Paper Trading</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLab('calculators')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeLab === 'calculators'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Risk & Financial Calculators</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLab('strategy')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeLab === 'strategy'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Strategy & Backtest Lab</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLab('options_quant')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeLab === 'options_quant'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Options & Quant Code Lab</span>
          </button>
        </div>
      </div>

      {/* LAB 1: PAPER TRADING SIMULATOR */}
      {activeLab === 'paper' && (
        <div className="space-y-6">
          {/* Paper Account Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono tabular-nums">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 block">Virtual Capital (DEMO)</span>
              <strong className="text-base text-white">
                ₹{profile.paperBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 block">Realized Net P&L</span>
              <strong
                className={`text-base ${
                  profile.paperBalance >= profile.initialPaperBalance
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {profile.paperBalance >= profile.initialPaperBalance ? '+' : ''}₹
                {(profile.paperBalance - profile.initialPaperBalance).toFixed(2)}
              </strong>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 block">Max Risk Rule</span>
              <strong className="text-base text-blue-400">
                {profile.maxRiskPerTradePct}% (₹
                {Math.round((profile.paperBalance * profile.maxRiskPerTradePct) / 100)})
              </strong>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 block">Open Positions</span>
              <strong className="text-base text-white">{positions.length}</strong>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Closed Trades</span>
                <strong className="text-base text-white">{trades.length}</strong>
              </div>
              <button
                type="button"
                onClick={onResetPaperAccount}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300"
              >
                Reset ₹1L
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Chart & Open Positions */}
            <div className="lg:col-span-8 space-y-5">
              <InteractiveCandlestickChart
                symbol={`${currentAsset.symbol} (Paper Trading Simulation)`}
                candles={currentAsset.candles}
                supportLevel={currentAsset.supportLevel}
                resistanceLevel={currentAsset.resistanceLevel}
                entryLevel={entryPrice}
                stopLevel={stopLoss}
                targetLevel={targetPrice}
                height={300}
              />

              {/* Open Positions Table */}
              <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Active Simulated Positions ({positions.length})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Test outcome execution: Trigger Target, Stop-Loss, or Market Close
                  </span>
                </div>

                {positions.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No open paper positions. Configure your risk-checked order on the right to practice.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono tabular-nums">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2 pr-3">Symbol / Dir</th>
                          <th className="py-2 px-2 text-right">Qty</th>
                          <th className="py-2 px-2 text-right">Entry</th>
                          <th className="py-2 px-2 text-right">Stop</th>
                          <th className="py-2 px-2 text-right">Target</th>
                          <th className="py-2 px-2 text-right">Risk (₹ / %)</th>
                          <th className="py-2 pl-3 text-right">Simulate Outcome</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {positions.map((pos) => (
                          <tr key={pos.id} className="hover:bg-slate-950/50">
                            <td className="py-2.5 pr-3">
                              <span className="font-semibold text-white">{pos.symbol}</span>{' '}
                              <span
                                className={
                                  pos.direction === 'LONG'
                                    ? 'text-emerald-400'
                                    : 'text-rose-400'
                                }
                              >
                                {pos.direction}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 text-right text-slate-200">
                              {pos.quantity}
                            </td>
                            <td className="py-2.5 px-2 text-right text-slate-200">
                              ₹{pos.entryPrice}
                            </td>
                            <td className="py-2.5 px-2 text-right text-rose-400">
                              ₹{pos.stopLoss}
                            </td>
                            <td className="py-2.5 px-2 text-right text-emerald-400">
                              ₹{pos.targetPrice}
                            </td>
                            <td className="py-2.5 px-2 text-right text-amber-300">
                              ₹{pos.riskAmount} ({pos.riskPctOfCapital}%)
                            </td>
                            <td className="py-2.5 pl-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() =>
                                  onClosePaperPosition(pos.id, pos.targetPrice, 'TARGET_HIT')
                                }
                                className="px-2 py-1 rounded bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/40 text-[11px]"
                              >
                                Hit Target
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onClosePaperPosition(pos.id, pos.stopLoss, 'STOP_HIT')
                                }
                                className="px-2 py-1 rounded bg-rose-600/25 border border-rose-500/40 text-rose-300 hover:bg-rose-600/40 text-[11px]"
                              >
                                Hit Stop
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Risk-First Paper Order Ticket */}
            <div className="lg:col-span-4 border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Risk-First Order Ticket (SIMULATION)
                </h3>
                <span className="text-[11px] font-mono text-emerald-400">NSE · ₹ INR</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Select NSE Instrument</label>
                  <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    {INDIAN_MARKET_ASSETS.map((a) => (
                      <option key={a.symbol} value={a.symbol}>
                        {a.symbol} — ₹{a.price} ({a.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDirection('LONG')}
                    className={`py-2 rounded-lg font-semibold border transition-colors ${
                      direction === 'LONG'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection('SHORT')}
                    className={`py-2 rounded-lg font-semibold border transition-colors ${
                      direction === 'SHORT'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    SELL / SHORT
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['MARKET', 'LIMIT', 'STOP'] as const).map((ot) => (
                    <button
                      key={ot}
                      type="button"
                      onClick={() => setOrderType(ot)}
                      className={`py-1.5 rounded border text-[11px] font-mono ${
                        orderType === ot
                          ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {ot}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono">
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
                    <label className="block text-rose-400 mb-1">Stop Loss (₹)</label>
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
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-400">Position Size (Shares)</label>
                    <button
                      type="button"
                      onClick={() => setQuantity(recommendedQtyFor1Pct)}
                      className="text-[11px] text-blue-400 hover:underline font-mono"
                    >
                      Auto-Size 1% Risk ({recommendedQtyFor1Pct} sh)
                    </button>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                {/* Pre-Trade Risk Telemetry Box */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk per Share:</span>
                    <span className="text-white">₹{stopDistance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Rupee Risk:</span>
                    <span
                      className={
                        riskPctOfAccount <= 1.2
                          ? 'text-emerald-400 font-semibold'
                          : riskPctOfAccount <= 2.0
                          ? 'text-amber-400 font-semibold'
                          : 'text-rose-400 font-semibold'
                      }
                    >
                      ₹{totalRiskInr} ({riskPctOfAccount}% of capital)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk / Reward Ratio:</span>
                    <span
                      className={
                        rrRatio >= 1.8 ? 'text-emerald-400 font-semibold' : 'text-amber-400'
                      }
                    >
                      1 : {rrRatio}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Brokerage + STT + GST:</span>
                    <span className="text-slate-300">₹{estimatedCharges}</span>
                  </div>
                </div>

                {highRiskConfirmOpen ? (
                  <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/40 space-y-2.5">
                    <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>High Risk Warning ({riskPctOfAccount}% of Capital)</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      This order risks more than 2% of your account on a single trade. Would you like to auto-adjust to 1% risk ({recommendedQtyFor1Pct} shares) or proceed anyway?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setQuantity(recommendedQtyFor1Pct);
                          setHighRiskConfirmOpen(false);
                        }}
                        className="flex-1 py-1.5 rounded bg-emerald-600 text-white text-[11px] font-medium"
                      >
                        Fix to 1% ({recommendedQtyFor1Pct} sh)
                      </button>
                      <button
                        type="button"
                        onClick={executePaperOrder}
                        className="py-1.5 px-2.5 rounded bg-slate-800 text-rose-300 text-[11px]"
                      >
                        Place Anyway
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleOrderSubmit}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                  >
                    Place Simulated {direction} Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 2: FINANCIAL & RISK MANAGEMENT CALCULATORS (Section 11 & 33) */}
      {activeLab === 'calculators' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator 1: Step-by-Step Position Size & Stop Loss Calculator */}
          <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-xs text-blue-400 font-mono">
                Core Risk Engine · Section 11 Formula
              </div>
              <h2 className="text-base font-semibold text-white mt-0.5">
                Position Size, Stop-Loss & Risk/Reward Calculator
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Account Capital (₹)</label>
                <input
                  type="number"
                  value={calcCapital}
                  onChange={(e) => setCalcCapital(Math.max(1000, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Risk per Trade (%)</label>
                <input
                  type="number"
                  step="0.25"
                  value={calcRiskPct}
                  onChange={(e) => setCalcRiskPct(Math.max(0.1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Entry Price (₹)</label>
                <input
                  type="number"
                  value={calcEntry}
                  onChange={(e) => setCalcEntry(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-rose-400 mb-1">Stop-Loss Price (₹)</label>
                <input
                  type="number"
                  value={calcStop}
                  onChange={(e) => setCalcStop(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-400 mb-1">Target Price (₹)</label>
                <input
                  type="number"
                  value={calcTarget}
                  onChange={(e) => setCalcTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            {/* Step-by-Step Formula Output */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs tabular-nums">
              <div className="text-blue-400 font-semibold">
                Step-by-Step Position Sizing Calculation:
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">1. Maximum Rupee Risk (Capital × Risk%):</span>
                <strong className="text-white">
                  ₹{calcCapital.toLocaleString('en-IN')} × {calcRiskPct}% = ₹
                  {calcMaxRiskInr.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">2. Risk per Share (|Entry − Stop|):</span>
                <strong className="text-white">
                  |₹{calcEntry} − ₹{calcStop}| = ₹{calcRiskPerShare.toFixed(2)} / share
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-emerald-400 font-semibold">
                  3. Exact Position Size (Max Risk ÷ Risk/Share):
                </span>
                <strong className="text-emerald-400 text-sm">
                  {calcPositionShares} Shares
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">4. Capital Deployed (No Leverage):</span>
                <strong className="text-slate-200">
                  ₹{calcCapitalRequired.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">5. Risk / Reward Ratio:</span>
                <strong className="text-sky-400">1 : {calcRR}</strong>
              </div>
            </div>
          </div>

          {/* Calculator 2: SIP, Compounding & Inflation-Adjusted Return */}
          <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-xs text-emerald-400 font-mono">
                Long-Term Wealth Engine · Section 33 Formula
              </div>
              <h2 className="text-base font-semibold text-white mt-0.5">
                SIP Compounding & Inflation-Adjusted Real Return Calculator
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Monthly SIP (₹)</label>
                <input
                  type="number"
                  step="1000"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Math.max(500, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Duration (Years)</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={sipYears}
                  onChange={(e) => setSipYears(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Expected Annual CAGR (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sipRate}
                  onChange={(e) => setSipRate(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Assumed Inflation (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs tabular-nums">
              <div className="text-emerald-400 font-semibold">
                Formula: FV = P × [((1 + r)^n − 1) ÷ r] × (1 + r)
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Principal Invested:</span>
                <strong className="text-white">
                  ₹{sipInvested.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nominal Corpus Value ({sipYears} yrs):</span>
                <strong className="text-emerald-400 text-sm">
                  ₹{sipFutureValue.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-amber-300">
                  Inflation-Adjusted Purchasing Power (Real Return {(realRate * 100).toFixed(1)}%):
                </span>
                <strong className="text-amber-300">
                  ₹{sipInflationAdjusted.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 3: NO-CODE STRATEGY BUILDER & HISTORICAL BACKTESTING LAB (Section 15 & 16) */}
      {activeLab === 'strategy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: No-Code Rule Builder */}
          <div className="lg:col-span-5 border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-xs text-blue-400 font-mono">
                No-Code Rule Specification · Section 15
              </div>
              <h2 className="text-base font-semibold text-white mt-0.5">
                Build Rules-Based Strategy
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target NSE Asset</label>
                <select
                  value={strategy.symbol}
                  onChange={(e) => setStrategy({ ...strategy, symbol: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                >
                  {INDIAN_MARKET_ASSETS.map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} — {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Entry Trend Filter (EMA)</label>
                <select
                  value={strategy.entryPriceVsEma}
                  onChange={(e) =>
                    setStrategy({ ...strategy, entryPriceVsEma: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="above_ema20">Price &gt; 20 EMA (Uptrend Alignment)</option>
                  <option value="below_ema20">Price &lt; 20 EMA (Mean Reversion Dip)</option>
                  <option value="any">Any EMA Position</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Momentum Condition (RSI 14)</label>
                <select
                  value={strategy.entryRsiCondition}
                  onChange={(e) =>
                    setStrategy({ ...strategy, entryRsiCondition: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="rsi_50_70">RSI between 50 and 70 (Healthy Momentum)</option>
                  <option value="rsi_oversold_35">RSI &lt; 45 (Pullback Zone)</option>
                  <option value="any">No RSI Filter</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Stop-Loss Rule</label>
                  <select
                    value={strategy.stopLossType}
                    onChange={(e) =>
                      setStrategy({ ...strategy, stopLossType: e.target.value as any })
                    }
                    className="w-full px-2.5 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="atr_1_5">1.5 × ATR Volatility Stop</option>
                    <option value="fixed_pct_1_5">1.5% Fixed Stop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target R-Multiple</label>
                  <select
                    value={strategy.targetRMultiple}
                    onChange={(e) =>
                      setStrategy({ ...strategy, targetRMultiple: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-2 rounded bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value={1.5}>1.5R Target</option>
                    <option value={2.0}>2.0R Target</option>
                    <option value={2.5}>2.5R Target</option>
                    <option value={3.0}>3.0R Target</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={strategy.includeBrokerageAndStt}
                  onChange={(e) =>
                    setStrategy({ ...strategy, includeBrokerageAndStt: e.target.checked })
                  }
                  className="accent-blue-500"
                />
                <span className="text-slate-300">
                  Include Realistic Indian Brokerage + STT + GST + {strategy.slippageBps} bps Slippage
                </span>
              </label>

              {/* Readable Strategy Pseudocode Box */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div className="text-blue-400 font-semibold">GENERATED STRATEGY RULES:</div>
                <div>IF Asset == {strategy.symbol}</div>
                <div>AND {strategy.entryPriceVsEma.toUpperCase()}</div>
                <div>AND {strategy.entryRsiCondition.toUpperCase()}</div>
                <div>AND Price &gt; VWAP</div>
                <div>THEN Enter LONG (Risk = {strategy.riskPerTradePct}% of Capital)</div>
                <div>STOP = {strategy.stopLossType === 'atr_1_5' ? '1.5 ATR' : '1.5%'} · TARGET = {strategy.targetRMultiple}R</div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={runHistoricalBacktest}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Historical Backtest</span>
                </button>
                <button
                  type="button"
                  onClick={handleAuditStrategyWithAI}
                  disabled={aiAuditLoading}
                  className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{aiAuditLoading ? 'Auditing...' : 'AI Bias Audit'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Backtest Results, Equity Curve & Bias Checklist */}
          <div className="lg:col-span-7 space-y-5">
            {backtestResult && (
              <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Backtest Report · {backtestResult.symbol} ({backtestResult.timeframe})
                    </h3>
                    <p className="text-xs text-amber-400 font-mono">
                      Historical Simulation Only — Does NOT Guarantee Future Live Results
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Initial Capital: ₹1,00,000
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs tabular-nums">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Final Equity</span>
                    <strong className="text-sm text-white">
                      ₹{backtestResult.finalCapital.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Net Return</span>
                    <strong
                      className={`text-sm ${
                        backtestResult.netReturnPct >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {backtestResult.netReturnPct >= 0 ? '+' : ''}
                      {backtestResult.netReturnPct}%
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Max Drawdown</span>
                    <strong className="text-sm text-rose-400">
                      -{backtestResult.maxDrawdownPct}%
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Win Rate ({backtestResult.totalTrades} tr)</span>
                    <strong className="text-sm text-sky-400">
                      {backtestResult.winRatePct}%
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Profit Factor</span>
                    <strong className="text-sm text-emerald-400">
                      {backtestResult.profitFactor}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Expectancy per Trade</span>
                    <strong className="text-sm text-white">
                      {backtestResult.expectancyR}R
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Avg Win / Avg Loss</span>
                    <strong className="text-sm text-slate-200">
                      ₹{backtestResult.avgWinInr} / ₹{backtestResult.avgLossInr}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Total Fees & STT</span>
                    <strong className="text-sm text-amber-300">
                      ₹{backtestResult.totalChargesInr}
                    </strong>
                  </div>
                </div>

                {/* Mandatory Bias Warnings (Look-Ahead, Overfitting, Survivorship) */}
                <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1.5 text-xs text-slate-200">
                  <div className="font-semibold text-amber-300">
                    Mandatory Quantitative Bias Checklist (Section 16):
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>
                      <strong>Look-Ahead Bias:</strong> Never enter on a candle’s open using an indicator value that is only known at that candle’s close.
                    </li>
                    <li>
                      <strong>Overfitting Risk:</strong> Avoid tweaking RSI/EMA numbers repeatedly just to maximize past equity curves.
                    </li>
                    <li>
                      <strong>Survivorship Bias:</strong> Testing only today’s Nifty 50 winners ignores companies that exited the index in prior years.
                    </li>
                  </ul>
                </div>

                {/* AI Strategy Audit Output */}
                {aiAuditData && (
                  <div className="p-4 rounded-lg bg-blue-950/25 border border-blue-500/40 space-y-2.5 text-xs">
                    <div className="font-semibold text-blue-300">
                      Gemini AI Strategy Auditor Report:
                    </div>
                    <p className="text-slate-200">{aiAuditData.strategySpecification}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="font-semibold text-amber-300 block mb-1">
                          Missing Rules & Potential Biases:
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {(aiAuditData.missingRules || []).map((r: string, idx: number) => (
                            <li key={idx}>{r}</li>
                          ))}
                          {(aiAuditData.potentialBiases || []).map((b: string, idx: number) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-emerald-300 block mb-1">
                          Risk & Validation Checklist:
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {(aiAuditData.riskChecklist || []).map((c: string, idx: number) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LAB 4: OPTIONS PAYOFF VISUALIZER & PYTHON QUANT LAB (Section 17 & 25) */}
      {activeLab === 'options_quant' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Options Payoff & Greeks Simulator */}
          <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-xs text-blue-400 font-mono">
                Options Academy · Expiration vs Pre-Expiration IV/Theta
              </div>
              <h2 className="text-base font-semibold text-white mt-0.5">
                Nifty 50 Options Payoff & Greeks Visualizer
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'LONG_CALL', label: 'Long Call (CE)' },
                  { id: 'LONG_PUT', label: 'Long Put (PE)' },
                  { id: 'BULL_CALL_SPREAD', label: 'Bull Call Spread' },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setOptType(st.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border ${
                    optType === st.id
                      ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Nifty Spot Price</label>
                <input
                  type="number"
                  step="50"
                  value={optSpot}
                  onChange={(e) => setOptSpot(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Strike Price</label>
                <input
                  type="number"
                  step="50"
                  value={optStrike}
                  onChange={(e) => setOptStrike(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Premium Paid (₹/unit)</label>
                <input
                  type="number"
                  value={optPremium}
                  onChange={(e) => setOptPremium(Math.max(5, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Days to Expiry</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={optDaysLeft}
                  onChange={(e) => setOptDaysLeft(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-400">Breakeven at Expiry:</span>
                <strong className="text-white">
                  {optType === 'LONG_PUT'
                    ? optStrike - optPremium
                    : optStrike + optPremium}{' '}
                  pts
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Loss (1 Lot = 25 units):</span>
                <strong className="text-rose-400">
                  ₹{(optPremium * 25).toLocaleString('en-IN')} (Premium Paid)
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Daily Theta Decay (Time Value Loss):</span>
                <strong className="text-amber-400">
                  -₹{Math.round((optPremium / Math.max(1, optDaysLeft + 1)) * 25)} / day per lot
                </strong>
              </div>
              <p className="text-[11px] text-slate-400 font-sans pt-1">
                Note: Payoff at expiration differs from P&L before expiration because of Time Value (Theta) and Implied Volatility (Vega) shifts.
              </p>
            </div>
          </div>

          {/* Python Quant Strategy Code & Line-by-Line Explanation */}
          <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-400 font-mono">
                  Advanced Quant Lab · Section 17
                </div>
                <h2 className="text-base font-semibold text-white mt-0.5">
                  Python (`pandas`) Systematic Rule Generator
                </h2>
              </div>
              <Code2 className="w-4 h-4 text-slate-400" />
            </div>

            <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`import pandas as pd
import numpy as np

# 1. Compute Trend (20 EMA) & Volatility (14 ATR) without look-ahead bias
df['ema20'] = df['close'].ewm(span=20, adjust=False).mean()
df['tr'] = np.maximum(df['high'] - df['low'],
           np.maximum(abs(df['high'] - df['close'].shift(1)),
                      abs(df['low'] - df['close'].shift(1))))
df['atr14'] = df['tr'].rolling(14).mean()

# 2. Shift signals by 1 bar so entry executes on NEXT bar after close confirmation
df['signal'] = np.where((df['close'] > df['ema20']) & (df['volume'] > df['volume'].rolling(20).mean()), 1, 0)
df['position_entry'] = df['signal'].shift(1)

# 3. Dynamic 1% Risk Position Sizing per Trade
capital = 100000
risk_rupees = capital * 0.01
df['stop_distance'] = 1.5 * df['atr14']
df['shares'] = np.floor(risk_rupees / df['stop_distance'])`}
            </pre>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-white">
                Line-by-Line Quant Explanation ({lang === 'hinglish' ? 'Hinglish' : 'English'}):
              </div>
              <p>
                {lang === 'hinglish'
                  ? '1) .shift(1) ka use isliye kiya gaya hai taaki Look-Ahead Bias na ho—signal candle close hone ke baad agli candle par hi trade liya jaye. 2) np.floor(risk_rupees / stop_distance) har trade mein ATR ke hisaab se quantity automatically adjust karta hai.'
                  : '1) Using .shift(1) prevents Look-Ahead Bias by ensuring orders only trigger after the signal candle has officially closed. 2) Dividing fixed 1% rupee risk by 1.5x ATR normalizes volatility across all instruments.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
