import React, { useState, useRef } from 'react';
import {
  Trash2,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Crosshair,
  Minus,
  TrendingUp,
  Square,
  Target,
} from 'lucide-react';
import {
  ChartAnnotationTool,
  Language,
  OHLCVCandle,
  UserChartDrawing,
} from '../types';
import { gradeChartDrawingExercise } from '../data/interactiveExercisesV2';
import { colors } from '../theme/colors';

interface ChartAnnotationCanvasProps {
  symbol: string;
  candles: OHLCVCandle[];
  language: Language;
  expectedSupport?: number;
  expectedResistance?: number;
  toleranceInr?: number;
  targetCandleRange?: [number, number];
  mode?: 'drawing' | 'candle_click';
  onDrawingsChange?: (drawings: UserChartDrawing[]) => void;
  onCandleClick?: (candleIndex: number, candle: OHLCVCandle) => void;
  selectedCandleIndex?: number | null;
}

export const ChartAnnotationCanvas: React.FC<ChartAnnotationCanvasProps> = ({
  symbol,
  candles,
  language,
  expectedSupport = 2915,
  expectedResistance = 3035,
  toleranceInr = 22,
  targetCandleRange,
  mode = 'drawing',
  onDrawingsChange,
  onCandleClick,
  selectedCandleIndex = null,
}) => {
  const [activeTool, setActiveTool] = useState<ChartAnnotationTool>('support_line');
  const [drawings, setDrawings] = useState<UserChartDrawing[]>([]);
  const [pendingFirstPoint, setPendingFirstPoint] = useState<{
    price: number;
    candleIndex: number;
  } | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{
    price: number;
    candleIndex: number;
  } | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);
  const [aiCoaching, setAiCoaching] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const visibleCandles = candles.slice(0, 40);
  const prices: number[] = [];
  visibleCandles.forEach((c) => {
    prices.push(c.high, c.low);
  });
  if (expectedSupport) prices.push(expectedSupport - toleranceInr);
  if (expectedResistance) prices.push(expectedResistance + toleranceInr);

  const minPrice = Math.min(...prices) * 0.996;
  const maxPrice = Math.max(...prices) * 1.004;
  const priceRange = Math.max(1, maxPrice - minPrice);

  const svgWidth = 860;
  const svgHeight = 320;
  const padLeft = 16;
  const padRight = 68;
  const padTop = 18;
  const padBottom = 26;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const priceToY = (p: number) => {
    const ratio = (p - minPrice) / priceRange;
    return padTop + plotHeight - ratio * plotHeight;
  };

  const yToPrice = (y: number) => {
    const clampedY = Math.max(padTop, Math.min(padTop + plotHeight, y));
    const ratio = (padTop + plotHeight - clampedY) / plotHeight;
    return Number((minPrice + ratio * priceRange).toFixed(1));
  };

  const candleToX = (idx: number) => {
    const step = plotWidth / Math.max(1, visibleCandles.length);
    return padLeft + idx * step + step / 2;
  };

  const xToCandleIndex = (x: number) => {
    const step = plotWidth / Math.max(1, visibleCandles.length);
    const rawIdx = Math.floor((x - padLeft) / step);
    return Math.max(0, Math.min(visibleCandles.length - 1, rawIdx));
  };

  const getSvgPointFromEvent = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;
    return {
      price: yToPrice(svgY),
      candleIndex: xToCandleIndex(svgX),
    };
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getSvgPointFromEvent(e);
    if (pt) setHoverCoords(pt);
  };

  const updateDrawingsList = (next: UserChartDrawing[]) => {
    setDrawings(next);
    if (onDrawingsChange) onDrawingsChange(next);
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getSvgPointFromEvent(e);
    if (!pt) return;

    if (mode === 'candle_click') {
      if (onCandleClick) {
        onCandleClick(pt.candleIndex, visibleCandles[pt.candleIndex]);
      }
      return;
    }

    if (activeTool === 'trendline' || activeTool === 'zone_box') {
      if (!pendingFirstPoint) {
        setPendingFirstPoint(pt);
        return;
      } else {
        const newDrawing: UserChartDrawing = {
          id: 'drw-' + Date.now(),
          tool: activeTool,
          price1: pendingFirstPoint.price,
          candleIndex1: pendingFirstPoint.candleIndex,
          price2: pt.price,
          candleIndex2: pt.candleIndex,
          label:
            activeTool === 'trendline'
              ? `Trendline ₹${pendingFirstPoint.price} → ₹${pt.price}`
              : `Zone ₹${Math.min(pendingFirstPoint.price, pt.price)}–₹${Math.max(
                  pendingFirstPoint.price,
                  pt.price
                )}`,
        };
        setPendingFirstPoint(null);
        updateDrawingsList([...drawings, newDrawing]);
        return;
      }
    }

    const labelMap: Record<ChartAnnotationTool, string> = {
      support_line: `Support Line @ ₹${pt.price}`,
      resistance_line: `Resistance Line @ ₹${pt.price}`,
      entry_marker: `Entry Trigger @ ₹${pt.price}`,
      stop_marker: `Stop-Loss @ ₹${pt.price}`,
      target_marker: `Target @ ₹${pt.price}`,
      trendline: `Trendline @ ₹${pt.price}`,
      zone_box: `Zone @ ₹${pt.price}`,
    };

    const singleDrawing: UserChartDrawing = {
      id: 'drw-' + Date.now(),
      tool: activeTool,
      price1: pt.price,
      candleIndex1: pt.candleIndex,
      label: labelMap[activeTool],
    };

    updateDrawingsList([...drawings, singleDrawing]);
  };

  const handleRequestAICoaching = async () => {
    setAiLoading(true);
    try {
      const grade = gradeChartDrawingExercise(
        drawings,
        expectedSupport,
        expectedResistance,
        toleranceInr
      );
      const res = await fetch('/api/ai/grade-annotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          drawings,
          expectedSupport,
          expectedResistance,
          toleranceInr,
          deterministicGrade: grade,
          language,
        }),
      });
      const data = await res.json();
      if (res.ok && data.coachingFeedback) {
        setAiCoaching(data.coachingFeedback);
      } else {
        setAiCoaching(
          language === 'hinglish'
            ? `Deterministic Geometry Check: Support Match = ${
                grade.supportMatched ? 'PASS ✓' : 'Needs Adjustment'
              }, Resistance Match = ${
                grade.resistanceMatched ? 'PASS ✓' : 'Needs Adjustment'
              }. Support zone ₹${expectedSupport} (±₹${toleranceInr}) ke aas-paas multiple candle wicks hain aur Resistance ₹${expectedResistance} par supply rejection hai.`
            : `Deterministic Geometry Check: Support Match = ${
                grade.supportMatched ? 'PASS ✓' : 'Needs Adjustment'
              }, Resistance Match = ${
                grade.resistanceMatched ? 'PASS ✓' : 'Needs Adjustment'
              }. Ideal horizontal support sits near ₹${expectedSupport} (±₹${toleranceInr}) where prior swing lows bounced, and resistance sits near ₹${expectedResistance}.`
        );
      }
    } catch {
      // fallback
    } finally {
      setAiLoading(false);
    }
  };

  const stepWidth = plotWidth / Math.max(1, visibleCandles.length);
  const bodyWidth = Math.max(4, Math.min(13, stepWidth * 0.62));

  const gradeSummary = gradeChartDrawingExercise(
    drawings,
    expectedSupport,
    expectedResistance,
    toleranceInr
  );

  return (
    <div className="border border-slate-800 bg-slate-950 rounded-xl p-4 space-y-3">
      {/* Annotation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        {mode === 'drawing' ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'support_line', label: '+ Support Line', color: 'text-[#22C55E]' },
                { id: 'resistance_line', label: '+ Resistance Line', color: 'text-[#EF4444]' },
                { id: 'trendline', label: '+ 2-Pt Trendline', color: 'text-[#F59E0B]' },
                { id: 'zone_box', label: '+ Supply/Demand Box', color: 'text-[#6366F1]' },
                { id: 'entry_marker', label: '+ Entry', color: 'text-[#6366F1]' },
                { id: 'stop_marker', label: '+ Stop-Loss', color: 'text-[#EF4444]' },
                { id: 'target_marker', label: '+ Target', color: 'text-[#22C55E]' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTool(t.id);
                  setPendingFirstPoint(null);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  activeTool === t.id
                    ? 'border-[#6366F1] bg-[#6366F1] text-white'
                    : `border-slate-800 bg-slate-900/80 ${t.color} hover:border-slate-700`
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
            <Crosshair className="w-4 h-4" />
            <span>
              Click directly on the target candlestick on the chart below
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAnswerKey((v) => !v)}
            className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-1"
          >
            {showAnswerKey ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Hide Answer Key</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Show Answer Key Bands</span>
              </>
            )}
          </button>

          {mode === 'drawing' && drawings.length > 0 && (
            <button
              type="button"
              onClick={() => {
                updateDrawingsList([]);
                setPendingFirstPoint(null);
              }}
              className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 hover:bg-rose-950/40 text-xs text-rose-400 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear ({drawings.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div>
          {pendingFirstPoint ? (
            <span className="text-amber-400">
              Step 2: Click second point on chart to complete {activeTool} (Started at ₹
              {pendingFirstPoint.price})
            </span>
          ) : (
            <span>
              Instrument: <strong className="text-white">{symbol}</strong> · Click anywhere on chart to place annotation
            </span>
          )}
        </div>
        {hoverCoords && (
          <div className="text-slate-300">
            Cursor: Candle #{hoverCoords.candleIndex + 1} · Price:{' '}
            <strong className="text-sky-400">₹{hoverCoords.price}</strong>
          </div>
        )}
      </div>

      {/* Interactive SVG Chart Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        onMouseMove={handleSvgMouseMove}
        onClick={handleSvgClick}
        className="w-full select-none cursor-crosshair bg-[#090D16] rounded-lg border border-slate-900"
        style={{ height: 320 }}
      >
        {/* Horizontal Price Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((g, i) => {
          const priceVal = minPrice + g * priceRange;
          const y = priceToY(priceVal);
          return (
            <g key={i}>
              <line
                x1={padLeft}
                y1={y}
                x2={svgWidth - padRight}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              <text
                x={svgWidth - padRight + 5}
                y={y + 4}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                ₹{priceVal.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Ground Truth Answer Key Tolerance Bands (When Toggled) */}
        {showAnswerKey && expectedSupport && (
          <g>
            <rect
              x={padLeft}
              y={priceToY(expectedSupport + toleranceInr)}
              width={plotWidth}
              height={Math.abs(
                priceToY(expectedSupport - toleranceInr) -
                  priceToY(expectedSupport + toleranceInr)
              )}
              fill="#10b981"
              fillOpacity={0.14}
            />
            <line
              x1={padLeft}
              y1={priceToY(expectedSupport)}
              x2={svgWidth - padRight}
              y2={priceToY(expectedSupport)}
              stroke="#10b981"
              strokeDasharray="6 3"
              strokeWidth={1.5}
            />
            <text
              x={padLeft + 8}
              y={priceToY(expectedSupport) - 5}
              fill="#34d399"
              fontSize="10"
              fontFamily="monospace"
            >
              Key Support ₹{expectedSupport} (±₹{toleranceInr})
            </text>
          </g>
        )}

        {showAnswerKey && expectedResistance && (
          <g>
            <rect
              x={padLeft}
              y={priceToY(expectedResistance + toleranceInr)}
              width={plotWidth}
              height={Math.abs(
                priceToY(expectedResistance - toleranceInr) -
                  priceToY(expectedResistance + toleranceInr)
              )}
              fill="#f43f5e"
              fillOpacity={0.14}
            />
            <line
              x1={padLeft}
              y1={priceToY(expectedResistance)}
              x2={svgWidth - padRight}
              y2={priceToY(expectedResistance)}
              stroke="#f43f5e"
              strokeDasharray="6 3"
              strokeWidth={1.5}
            />
            <text
              x={padLeft + 8}
              y={priceToY(expectedResistance) - 5}
              fill="#fb7185"
              fontSize="10"
              fontFamily="monospace"
            >
              Key Resistance ₹{expectedResistance} (±₹{toleranceInr})
            </text>
          </g>
        )}

        {/* Target Candle Range Highlight when Answer Key is shown in candle_click mode */}
        {showAnswerKey && targetCandleRange && (
          <rect
            x={candleToX(targetCandleRange[0]) - stepWidth / 2}
            y={padTop}
            width={
              candleToX(targetCandleRange[1]) -
              candleToX(targetCandleRange[0]) +
              stepWidth
            }
            height={plotHeight}
            fill="#3b82f6"
            fillOpacity={0.15}
            stroke="#3b82f6"
            strokeDasharray="4 2"
          />
        )}

        {/* Candlesticks (STRICT: #22C55E Bullish, #EF4444 Bearish) */}
        {visibleCandles.map((c, idx) => {
          const x = candleToX(idx);
          const isBull = c.close >= c.open;
          const color = isBull ? colors.chart.bullishCandle : colors.chart.bearishCandle;
          const highY = priceToY(c.high);
          const lowY = priceToY(c.low);
          const openY = priceToY(c.open);
          const closeY = priceToY(c.close);
          const topY = Math.min(openY, closeY);
          const bodyH = Math.max(2, Math.abs(closeY - openY));
          const isSelectedCandle = selectedCandleIndex === idx;

          return (
            <g key={c.date + idx}>
              {isSelectedCandle && (
                <rect
                  x={x - stepWidth / 2}
                  y={padTop}
                  width={stepWidth}
                  height={plotHeight}
                  fill={colors.semantic.primary}
                  fillOpacity={0.22}
                  stroke={colors.semantic.primary}
                  strokeWidth={1}
                />
              )}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={color}
                strokeWidth={1.3}
              />
              <rect
                x={x - bodyWidth / 2}
                y={topY}
                width={bodyWidth}
                height={bodyH}
                fill={color}
                rx={1}
              />
            </g>
          );
        })}

        {/* User Drawn Annotations */}
        {drawings.map((d) => {
          const y1 = priceToY(d.price1);
          const x1 = candleToX(d.candleIndex1);

          if (d.tool === 'trendline' && d.price2 !== undefined && d.candleIndex2 !== undefined) {
            const y2 = priceToY(d.price2);
            const x2 = candleToX(d.candleIndex2);
            return (
              <g key={d.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={colors.semantic.warning}
                  strokeWidth={2.2}
                />
                <circle cx={x1} cy={y1} r={3.5} fill={colors.semantic.warning} />
                <circle cx={x2} cy={y2} r={3.5} fill={colors.semantic.warning} />
              </g>
            );
          }

          if (d.tool === 'zone_box' && d.price2 !== undefined && d.candleIndex2 !== undefined) {
            const y2 = priceToY(d.price2);
            const x2 = candleToX(d.candleIndex2);
            return (
              <rect
                key={d.id}
                x={Math.min(x1, x2)}
                y={Math.min(y1, y2)}
                width={Math.max(12, Math.abs(x2 - x1))}
                height={Math.max(6, Math.abs(y2 - y1))}
                fill={colors.semantic.primary}
                fillOpacity={0.22}
                stroke={colors.semantic.primary}
                strokeWidth={1.5}
              />
            );
          }

          const strokeMap: Record<ChartAnnotationTool, string> = {
            support_line: colors.semantic.positive,
            resistance_line: colors.semantic.negative,
            entry_marker: colors.semantic.primary,
            stop_marker: colors.semantic.negative,
            target_marker: colors.semantic.positive,
            trendline: colors.semantic.warning,
            zone_box: colors.semantic.primary,
          };
          const stroke = strokeMap[d.tool] || colors.semantic.primary;

          return (
            <g key={d.id}>
              <line
                x1={padLeft}
                y1={y1}
                x2={svgWidth - padRight}
                y2={y1}
                stroke={stroke}
                strokeWidth={2}
                strokeDasharray={
                  d.tool === 'support_line' || d.tool === 'resistance_line'
                    ? undefined
                    : '4 3'
                }
              />
              <text
                x={svgWidth - padRight - 130}
                y={y1 - 5}
                fill={stroke}
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Drawn Layers & AI Drawing Grader Bar */}
      {mode === 'drawing' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">
              Support Check:{' '}
              <strong
                className={
                  gradeSummary.supportMatched ? 'text-emerald-400' : 'text-amber-400'
                }
              >
                {gradeSummary.supportMatched
                  ? `Matched (Δ₹${gradeSummary.closestSupportDiff})`
                  : 'Draw Support Line'}
              </strong>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">
              Resistance Check:{' '}
              <strong
                className={
                  gradeSummary.resistanceMatched ? 'text-emerald-400' : 'text-amber-400'
                }
              >
                {gradeSummary.resistanceMatched
                  ? `Matched (Δ₹${gradeSummary.closestResistanceDiff})`
                  : 'Draw Resistance Line'}
              </strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleRequestAICoaching}
            disabled={aiLoading || drawings.length === 0}
            className="px-3.5 py-1.5 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-40 text-white text-xs font-medium flex items-center gap-1.5 self-start cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {aiLoading
                ? '✦ AI Coach Grading Drawings...'
                : '✦ Ask AI Coach to Grade Drawings'}
            </span>
          </button>
        </div>
      )}

      {aiCoaching && (
        <div className="p-3.5 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/40 text-xs text-slate-200 leading-relaxed">
          <div className="font-semibold text-[#14B8A6] mb-1">
            ✦ AI Chart Drawing & Geometry Coach Feedback:
          </div>
          <p>{aiCoaching}</p>
        </div>
      )}
    </div>
  );
};
