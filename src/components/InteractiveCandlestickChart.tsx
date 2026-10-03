import React, { useState } from 'react';
import { OHLCVCandle } from '../types';
import { colors } from '../theme/colors';

interface InteractiveCandlestickChartProps {
  symbol: string;
  candles: OHLCVCandle[];
  supportLevel?: number;
  resistanceLevel?: number;
  entryLevel?: number;
  stopLevel?: number;
  targetLevel?: number;
  showEma20?: boolean;
  showVwap?: boolean;
  height?: number;
  revealedCount?: number; // Useful for Chart Challenge mode
}

export const InteractiveCandlestickChart: React.FC<InteractiveCandlestickChartProps> = ({
  symbol,
  candles,
  supportLevel,
  resistanceLevel,
  entryLevel,
  stopLevel,
  targetLevel,
  showEma20 = true,
  showVwap = false,
  height = 320,
  revealedCount,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [emaVisible, setEmaVisible] = useState(showEma20);
  const [vwapVisible, setVwapVisible] = useState(showVwap);

  const activeCandles = revealedCount ? candles.slice(0, revealedCount) : candles;
  if (!activeCandles.length) return null;

  const allPrices: number[] = [];
  activeCandles.forEach((c) => {
    allPrices.push(c.high, c.low);
    if (emaVisible && c.ema20) allPrices.push(c.ema20);
    if (vwapVisible && c.vwap) allPrices.push(c.vwap);
  });
  if (supportLevel) allPrices.push(supportLevel);
  if (resistanceLevel) allPrices.push(resistanceLevel);
  if (entryLevel) allPrices.push(entryLevel);
  if (stopLevel) allPrices.push(stopLevel);
  if (targetLevel) allPrices.push(targetLevel);

  const minPrice = Math.min(...allPrices) * 0.996;
  const maxPrice = Math.max(...allPrices) * 1.004;
  const priceRange = Math.max(1, maxPrice - minPrice);

  const maxVol = Math.max(...activeCandles.map((c) => c.volume), 1);

  const svgWidth = 860;
  const svgHeight = height;
  const padLeft = 14;
  const padRight = 68;
  const padTop = 18;
  const padBottom = 54;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const yForPrice = (p: number) =>
    padTop + plotHeight - ((p - minPrice) / priceRange) * plotHeight;

  const stepX = plotWidth / Math.max(1, activeCandles.length);
  const candleWidth = Math.max(4, Math.min(14, stepX * 0.64));

  const inspectedCandle =
    hoverIndex !== null && activeCandles[hoverIndex]
      ? activeCandles[hoverIndex]
      : activeCandles[activeCandles.length - 1];

  const isUp = inspectedCandle.close >= inspectedCandle.open;

  const emaPoints = activeCandles
    .map((c, idx) => {
      if (!c.ema20) return null;
      const x = padLeft + idx * stepX + stepX / 2;
      const y = yForPrice(c.ema20);
      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(' ');

  const vwapPoints = activeCandles
    .map((c, idx) => {
      if (!c.vwap) return null;
      const x = padLeft + idx * stepX + stepX / 2;
      const y = yForPrice(c.vwap);
      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(' ');

  const priceTicks = [0, 0.25, 0.5, 0.75, 1].map(
    (ratio) => minPrice + priceRange * ratio
  );

  return (
    <div className="border border-slate-800 bg-slate-950/90 rounded-lg p-3.5 select-none">
      {/* Header Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2 font-mono tabular-nums">
          <span className="font-semibold text-slate-100">{symbol}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{inspectedCandle.date}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">
            O: <strong className="text-slate-200">₹{inspectedCandle.open.toFixed(2)}</strong>
          </span>
          <span className="text-slate-400">
            H: <strong className="text-slate-200">₹{inspectedCandle.high.toFixed(2)}</strong>
          </span>
          <span className="text-slate-400">
            L: <strong className="text-slate-200">₹{inspectedCandle.low.toFixed(2)}</strong>
          </span>
          <span className="text-slate-400">
            C:{' '}
            <strong className={isUp ? 'text-emerald-400' : 'text-rose-400'}>
              ₹{inspectedCandle.close.toFixed(2)} {isUp ? '▲' : '▼'}
            </strong>
          </span>
          {inspectedCandle.rsi !== undefined && (
            <>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">
                RSI(14): <strong className="text-slate-200">{inspectedCandle.rsi}</strong>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEmaVisible((v) => !v)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              emaVisible
                ? 'bg-blue-600/25 text-blue-300 border border-blue-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            20 EMA
          </button>
          <button
            type="button"
            onClick={() => setVwapVisible((v) => !v)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              vwapVisible
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            VWAP
          </button>
          <span className="text-[11px] font-mono text-amber-400/90 pl-1">
            DEMO HISTORICAL DATA
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Horizontal Price Gridlines */}
          {priceTicks.map((tick, idx) => {
            const y = yForPrice(tick);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke={colors.chart.gridDark}
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                <text
                  x={svgWidth - padRight + 6}
                  y={y + 4}
                  fill={colors.dark.textMuted}
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ₹{tick.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Support Level Line */}
          {supportLevel && (
            <g>
              <line
                x1={padLeft}
                y1={yForPrice(supportLevel)}
                x2={svgWidth - padRight}
                y2={yForPrice(supportLevel)}
                stroke={colors.semantic.positive}
                strokeWidth={1.2}
                strokeDasharray="5 4"
              />
              <text
                x={padLeft + 6}
                y={yForPrice(supportLevel) - 5}
                fill={colors.semantic.positive}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                Support Zone ₹{supportLevel}
              </text>
            </g>
          )}

          {/* Resistance Level Line */}
          {resistanceLevel && (
            <g>
              <line
                x1={padLeft}
                y1={yForPrice(resistanceLevel)}
                x2={svgWidth - padRight}
                y2={yForPrice(resistanceLevel)}
                stroke={colors.semantic.negative}
                strokeWidth={1.2}
                strokeDasharray="5 4"
              />
              <text
                x={padLeft + 6}
                y={yForPrice(resistanceLevel) - 5}
                fill={colors.semantic.negative}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                Resistance Zone ₹{resistanceLevel}
              </text>
            </g>
          )}

          {/* Optional Trade Setup Lines (Entry, Stop, Target) */}
          {entryLevel && (
            <g>
              <line
                x1={padLeft}
                y1={yForPrice(entryLevel)}
                x2={svgWidth - padRight}
                y2={yForPrice(entryLevel)}
                stroke={colors.semantic.primary}
                strokeWidth={1.5}
              />
              <text
                x={svgWidth - padRight - 110}
                y={yForPrice(entryLevel) - 4}
                fill={colors.semantic.primary}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                Entry ₹{entryLevel}
              </text>
            </g>
          )}
          {stopLevel && (
            <g>
              <line
                x1={padLeft}
                y1={yForPrice(stopLevel)}
                x2={svgWidth - padRight}
                y2={yForPrice(stopLevel)}
                stroke={colors.semantic.negative}
                strokeWidth={1.5}
              />
              <text
                x={svgWidth - padRight - 110}
                y={yForPrice(stopLevel) + 12}
                fill={colors.semantic.negative}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                Stop ₹{stopLevel}
              </text>
            </g>
          )}
          {targetLevel && (
            <g>
              <line
                x1={padLeft}
                y1={yForPrice(targetLevel)}
                x2={svgWidth - padRight}
                y2={yForPrice(targetLevel)}
                stroke={colors.semantic.positive}
                strokeWidth={1.5}
              />
              <text
                x={svgWidth - padRight - 110}
                y={yForPrice(targetLevel) - 4}
                fill={colors.semantic.positive}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                Target ₹{targetLevel}
              </text>
            </g>
          )}

          {/* EMA20 Line (Brand Indigo #6366F1) */}
          {emaVisible && emaPoints && (
            <polyline
              fill="none"
              stroke={colors.chart.indicatorPrimary}
              strokeWidth={1.8}
              points={emaPoints}
            />
          )}

          {/* VWAP Line (Warning Amber #F59E0B) */}
          {vwapVisible && vwapPoints && (
            <polyline
              fill="none"
              stroke={colors.chart.indicatorWarning}
              strokeWidth={1.5}
              strokeDasharray="3 2"
              points={vwapPoints}
            />
          )}

          {/* Candles + Volume (STRICT: #22C55E Bullish, #EF4444 Bearish) */}
          {activeCandles.map((c, idx) => {
            const centerX = padLeft + idx * stepX + stepX / 2;
            const highY = yForPrice(c.high);
            const lowY = yForPrice(c.low);
            const openY = yForPrice(c.open);
            const closeY = yForPrice(c.close);
            const bull = c.close >= c.open;
            const color = bull
              ? colors.chart.bullishCandle
              : colors.chart.bearishCandle;
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(closeY - openY));

            const volBarHeight = (c.volume / maxVol) * 32;
            const volY = svgHeight - 16 - volBarHeight;

            return (
              <g
                key={c.date + idx}
                onMouseEnter={() => setHoverIndex(idx)}
                className="cursor-crosshair"
              >
                {/* Invisible hit rect for smooth hover */}
                <rect
                  x={padLeft + idx * stepX}
                  y={padTop}
                  width={stepX}
                  height={plotHeight + 40}
                  fill="transparent"
                />
                {hoverIndex === idx && (
                  <line
                    x1={centerX}
                    y1={padTop}
                    x2={centerX}
                    y2={svgHeight - 16}
                    stroke={colors.chart.crosshair}
                    strokeDasharray="2 2"
                    strokeWidth={1}
                  />
                )}
                {/* Wick */}
                <line
                  x1={centerX}
                  y1={highY}
                  x2={centerX}
                  y2={lowY}
                  stroke={color}
                  strokeWidth={1.3}
                />
                {/* Body */}
                <rect
                  x={centerX - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={color}
                  rx={1}
                />
                {/* Volume Bar */}
                <rect
                  x={centerX - candleWidth / 2}
                  y={volY}
                  width={candleWidth}
                  height={volBarHeight}
                  fill={
                    bull
                      ? colors.chart.bullishVolume
                      : colors.chart.bearishVolume
                  }
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
