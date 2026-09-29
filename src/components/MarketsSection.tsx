import React, { useState } from 'react';
import {
  Search,
  Star,
  TrendingUp,
  Newspaper,
  PieChart,
  ArrowUpRight,
  Lock,
  Info,
} from 'lucide-react';
import { INDIAN_MARKET_ASSETS, INDIAN_MARKET_NEWS } from '../data/indianMarketData';
import { Language, MarketAsset, NavigationTab, UserProfile } from '../types';
import { InteractiveCandlestickChart } from './InteractiveCandlestickChart';

interface MarketsSectionProps {
  profile: UserProfile;
  onToggleWatchlist: (symbol: string) => void;
  onOpenPaperTradeForAsset: (symbol: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const MarketsSection: React.FC<MarketsSectionProps> = ({
  profile,
  onToggleWatchlist,
  onOpenPaperTradeForAsset,
}) => {
  const lang: Language = profile.language;
  const [marketRegion, setMarketRegion] = useState<'india' | 'us' | 'crypto'>('india');
  const [subView, setSubView] = useState<'terminal' | 'news' | 'portfolio'>('terminal');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Index' | 'Equity' | 'ETF' | 'WATCHLIST'>('ALL');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NIFTY 50');

  // Portfolio Simulator state
  const [portfolioCapital, setPortfolioCapital] = useState<number>(500000);
  const [allocEquityIndex, setAllocEquityIndex] = useState<number>(45);
  const [allocActiveStocks, setAllocActiveStocks] = useState<number>(20);
  const [allocDebtLiquid, setAllocDebtLiquid] = useState<number>(25);
  const [allocGoldEtf, setAllocGoldEtf] = useState<number>(10);

  const applyPortfolioTemplate = (template: 'conservative' | 'balanced' | 'growth') => {
    if (template === 'conservative') {
      setAllocEquityIndex(25);
      setAllocActiveStocks(5);
      setAllocDebtLiquid(55);
      setAllocGoldEtf(15);
    } else if (template === 'balanced') {
      setAllocEquityIndex(45);
      setAllocActiveStocks(20);
      setAllocDebtLiquid(25);
      setAllocGoldEtf(10);
    } else {
      setAllocEquityIndex(55);
      setAllocActiveStocks(30);
      setAllocDebtLiquid(10);
      setAllocGoldEtf(5);
    }
  };

  const totalAllocation =
    allocEquityIndex + allocActiveStocks + allocDebtLiquid + allocGoldEtf;

  // Educational portfolio metrics estimation
  const equityWeight = (allocEquityIndex + allocActiveStocks) / 100;
  const debtWeight = allocDebtLiquid / 100;
  const goldWeight = allocGoldEtf / 100;

  const estHistoricalCagr = Number(
    (equityWeight * 12.8 + debtWeight * 6.8 + goldWeight * 9.2).toFixed(1)
  );
  const estMaxDrawdown = Number(
    (equityWeight * 28.0 + debtWeight * 2.5 + goldWeight * 11.0).toFixed(1)
  );
  const estVolatility = Number(
    (equityWeight * 16.5 + debtWeight * 3.0 + goldWeight * 10.5).toFixed(1)
  );
  const projected5YrValue = Math.round(
    portfolioCapital * Math.pow(1 + estHistoricalCagr / 100, 5)
  );

  const filteredAssets = INDIAN_MARKET_ASSETS.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.fundamentals.sector.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (categoryFilter === 'WATCHLIST') {
      return profile.watchlist.includes(asset.symbol);
    }
    if (categoryFilter !== 'ALL') {
      return asset.category === categoryFilter;
    }
    return true;
  });

  const activeAsset: MarketAsset =
    INDIAN_MARKET_ASSETS.find((a) => a.symbol === selectedSymbol) ||
    INDIAN_MARKET_ASSETS[0];

  return (
    <div className="space-y-6">
      {/* Top Bar: Market Region Switcher & Sub-Views */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-semibold text-white">
              Markets & Educational Analysis
            </h1>
            <span className="text-xs font-mono text-amber-400">
              · DEMO / HISTORICAL SIMULATION DATA
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {lang === 'hinglish'
              ? 'Indian Market (NSE/BSE · ₹ INR) abhi active hai. US Market aur Crypto future release mein judenge.'
              : 'Indian Market (NSE/BSE · ₹ INR) active now. US Equities and Crypto Markets are scheduled for future release.'}
          </p>
        </div>

        {/* Market Region Selector (India Active, US & Crypto Coming Soon) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setMarketRegion('india')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                marketRegion === 'india'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Indian Market (NSE/BSE · ₹)
            </button>
            <button
              type="button"
              onClick={() => setMarketRegion('us')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                marketRegion === 'us'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>US Market ($) · Future</span>
            </button>
            <button
              type="button"
              onClick={() => setMarketRegion('crypto')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                marketRegion === 'crypto'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Crypto · Future</span>
            </button>
          </div>

          {marketRegion === 'india' && (
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setSubView('terminal')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  subView === 'terminal'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Chart & Fundamentals
              </button>
              <button
                type="button"
                onClick={() => setSubView('portfolio')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  subView === 'portfolio'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Portfolio Simulator
              </button>
              <button
                type="button"
                onClick={() => setSubView('news')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  subView === 'news'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                News Context
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FUTURE MARKET PREVIEW STATE FOR US & CRYPTO */}
      {marketRegion !== 'india' && (
        <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/60 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            {marketRegion === 'us'
              ? 'US Equities & ETFs (NYSE / NASDAQ · $ USD) — Planned for Future Expansion'
              : 'Crypto Market Structure & Derivatives — Planned for Future Expansion'}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {lang === 'hinglish'
              ? 'Abhi ke liye sirf Indian Market (NSE/BSE — Nifty 50, BankNifty, Indian Equities, ETFs aur SEBI/STT rules) active rakha gaya hai taaki aap ek market par poora focus aur mastery bana sakein.'
              : 'Per our product roadmap, the current release focuses exclusively on the Indian Market (NSE/BSE — Nifty 50, BankNifty, Indian Equities, ETFs, and SEBI/STT rules). Multi-jurisdiction US and Crypto feeds will unlock in a future phase.'}
          </p>
          <button
            type="button"
            onClick={() => setMarketRegion('india')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
          >
            Return to Active Indian Market (NSE/BSE · ₹)
          </button>
        </div>
      )}

      {/* ACTIVE INDIAN MARKET TERMINAL */}
      {marketRegion === 'india' && subView === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Asset Watchlist & Filter */}
          <div className="lg:col-span-4 border border-slate-800 bg-slate-900/60 rounded-xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NSE symbol or sector (e.g. RELIANCE, IT)..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {(['ALL', 'Index', 'Equity', 'ETF', 'WATCHLIST'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat === 'WATCHLIST' ? `Watchlist (${profile.watchlist.length})` : cat}
                </button>
              ))}
            </div>

            <div className="divide-y divide-slate-800/80 max-h-[520px] overflow-y-auto">
              {filteredAssets.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No matching Indian market instruments found.
                </div>
              ) : (
                filteredAssets.map((asset) => {
                  const isSelected = asset.symbol === activeAsset.symbol;
                  const isUp = asset.change >= 0;
                  const inWatchlist = profile.watchlist.includes(asset.symbol);
                  return (
                    <div
                      key={asset.symbol}
                      onClick={() => setSelectedSymbol(asset.symbol)}
                      className={`p-3 cursor-pointer transition-colors flex items-center justify-between gap-2 rounded-lg ${
                        isSelected ? 'bg-blue-950/35' : 'hover:bg-slate-950/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white">
                            {asset.symbol}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            · {asset.exchange} · {asset.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {asset.name}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right font-mono tabular-nums">
                          <div className="text-xs font-semibold text-white">
                            ₹{asset.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div
                            className={`text-[11px] ${
                              isUp ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isUp ? '▲ +' : '▼ '}
                            {asset.change.toFixed(2)} ({asset.changePct.toFixed(2)}%)
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(asset.symbol);
                          }}
                          title="Toggle Watchlist"
                          className={`p-1.5 rounded hover:bg-slate-800 ${
                            inWatchlist ? 'text-amber-400' : 'text-slate-600'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Asset Chart, Key Levels & Fundamental Breakdown */}
          <div className="lg:col-span-8 space-y-5">
            <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
              {/* Asset Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-slate-400 font-mono">
                    {activeAsset.exchange} · {activeAsset.category} · Sector:{' '}
                    {activeAsset.fundamentals.sector}
                  </div>
                  <h2 className="text-xl font-semibold text-white mt-0.5">
                    {activeAsset.name} ({activeAsset.symbol})
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right font-mono tabular-nums">
                    <div className="text-lg font-semibold text-white">
                      ₹{activeAsset.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs ${
                        activeAsset.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {activeAsset.change >= 0 ? '▲ +' : '▼ '}
                      {activeAsset.change.toFixed(2)} ({activeAsset.changePct.toFixed(2)}%) · DEMO
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenPaperTradeForAsset(activeAsset.symbol)}
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors"
                  >
                    <span>Practice Paper Trade</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Educational Note */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-blue-400">Educational Profile: </strong>
                {activeAsset.educationalSummary[lang]}
              </div>

              {/* Interactive Candlestick Chart */}
              <InteractiveCandlestickChart
                symbol={activeAsset.symbol}
                candles={activeAsset.candles}
                supportLevel={activeAsset.supportLevel}
                resistanceLevel={activeAsset.resistanceLevel}
                showEma20={true}
                showVwap={true}
                height={310}
              />

              {/* Technical & Volatility Telemetry */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono text-xs tabular-nums">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block">Key Support Zone</span>
                  <strong className="text-emerald-400">₹{activeAsset.supportLevel}</strong>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block">Key Resistance Zone</span>
                  <strong className="text-rose-400">₹{activeAsset.resistanceLevel}</strong>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block">14-Day ATR (Volatility)</span>
                  <strong className="text-amber-300">₹{activeAsset.atr14.toFixed(2)}</strong>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block">Suggested 1.5x ATR Stop</span>
                  <strong className="text-sky-300">
                    ₹{(activeAsset.atr14 * 1.5).toFixed(1)} distance
                  </strong>
                </div>
              </div>

              {/* Fundamental Valuation Metrics */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="text-xs font-semibold text-slate-200">
                  Fundamental & Valuation Ratios (Educational Reference)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs tabular-nums">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 block">P/E Ratio</span>
                    <strong className="text-white">{activeAsset.fundamentals.peRatio}x</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 block">P/B Ratio</span>
                    <strong className="text-white">{activeAsset.fundamentals.pbRatio}x</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 block">ROE / ROCE</span>
                    <strong className="text-emerald-400">
                      {activeAsset.fundamentals.roePct}% / {activeAsset.fundamentals.rocePct}%
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 block">Debt-to-Equity</span>
                    <strong className="text-white">
                      {activeAsset.fundamentals.debtToEquity}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVESTING PORTFOLIO SIMULATOR (Section 23) */}
      {marketRegion === 'india' && subView === 'portfolio' && (
        <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 md:p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Indian Asset Allocation & Portfolio Construction Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'hinglish'
                  ? 'Dekhein kaise Equity, Debt aur Gold ka mishran aapke long-term return aur maximum drawdown ko balance karta hai. Koi bhi ek portfolio har insaan ke liye "best" nahi hota.'
                  : 'Simulate how blending Nifty 50 Index ETFs, active equities, liquid debt/G-Secs, and Sovereign Gold impacts volatility and drawdown. No single allocation is universally best.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Educational Templates:</span>
              <button
                type="button"
                onClick={() => applyPortfolioTemplate('conservative')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-200"
              >
                Conservative
              </button>
              <button
                type="button"
                onClick={() => applyPortfolioTemplate('balanced')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-200"
              >
                Balanced
              </button>
              <button
                type="button"
                onClick={() => applyPortfolioTemplate('growth')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-200"
              >
                Growth
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sliders */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Virtual Portfolio Capital (₹ INR):{' '}
                  <strong className="font-mono text-white">
                    ₹{portfolioCapital.toLocaleString('en-IN')}
                  </strong>
                </label>
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={50000}
                  value={portfolioCapital}
                  onChange={(e) => setPortfolioCapital(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {[
                {
                  label: 'Nifty 50 Passive Index ETF (NIFTYBEES)',
                  val: allocEquityIndex,
                  setter: setAllocEquityIndex,
                },
                {
                  label: 'Large/Mid-Cap Quality Indian Equities (TCS, RELIANCE, HDFCBANK)',
                  val: allocActiveStocks,
                  setter: setAllocActiveStocks,
                },
                {
                  label: 'Fixed Income / Liquid Debt / G-Sec Funds (Cushion)',
                  val: allocDebtLiquid,
                  setter: setAllocDebtLiquid,
                },
                {
                  label: 'Gold ETF / Sovereign Gold Hedge (Low Correlation)',
                  val: allocGoldEtf,
                  setter: setAllocGoldEtf,
                },
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-200 font-medium">{item.label}</span>
                    <span className="font-mono text-blue-400">
                      {item.val}% (₹
                      {Math.round((portfolioCapital * item.val) / 100).toLocaleString('en-IN')})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={item.val}
                    onChange={(e) => item.setter(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}

              {totalAllocation !== 100 && (
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs text-amber-300 flex items-center justify-between">
                  <span>
                    Total Allocation is currently <strong>{totalAllocation}%</strong> (should equal
                    100%).
                  </span>
                  <button
                    type="button"
                    onClick={() => applyPortfolioTemplate('balanced')}
                    className="underline font-medium"
                  >
                    Auto-Normalize to 100%
                  </button>
                </div>
              )}
            </div>

            {/* Simulated Risk & Return Output */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 font-mono tabular-nums">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">
                    Historical Simulated CAGR
                  </span>
                  <strong className="text-lg text-emerald-400">
                    ~{estHistoricalCagr}% / yr
                  </strong>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Not guaranteed future return
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">
                    Est. Crisis Max Drawdown
                  </span>
                  <strong className="text-lg text-rose-400">-{estMaxDrawdown}%</strong>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Peak-to-trough stress test
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">
                    Annualized Volatility (Std Dev)
                  </span>
                  <strong className="text-lg text-amber-300">{estVolatility}%</strong>
                </div>
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">
                    5-Year Hypothetical Value
                  </span>
                  <strong className="text-lg text-sky-400">
                    ₹{projected5YrValue.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                <div className="font-semibold text-white">
                  Why Rebalancing & Asset Correlation Matter
                </div>
                <p>
                  {lang === 'hinglish'
                    ? 'Jab stock market 20% girta hai, tab Debt aur Gold aapke portfolio ke drawdown ko kam rakhte hain aur aapko saste valuations par Equity rebalance karne ka mauka dete hain.'
                    : 'During equity bear markets (like 2008 or March 2020), a 100% equity portfolio can experience a 30%–38% temporary drawdown. Holding uncorrelated Debt and Gold dampens volatility and provides dry powder to rebalance into equities at lower valuations.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEWS & MARKET CONTEXT (SEPARATING FACT VS INTERPRETATION) */}
      {marketRegion === 'india' && subView === 'news' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center gap-3 text-xs text-slate-300">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              {lang === 'hinglish'
                ? 'Hum har news ko 3 hisson mein alag karte hain: (1) Verified Event, (2) Analyst Interpretation, aur (3) Educational Process Takeaway—taaki aap afwahon par trade na karein.'
                : 'Every market catalyst below explicitly separates Verified Factual Events from Analyst Interpretations and Educational Process Lessons.'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {INDIAN_MARKET_NEWS.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
                  <span>
                    {item.source} · {item.publishedAgo}
                  </span>
                  <span className="text-blue-400">Related: {item.relatedSymbol}</span>
                </div>
                <h3 className="text-base font-semibold text-white">{item.headline[lang]}</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-xs font-semibold text-emerald-400">
                      1. Verified Factual Event
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.verifiedEvent[lang]}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-xs font-semibold text-amber-400">
                      2. Analyst Interpretation (Opinion)
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.analystInterpretation[lang]}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/30 space-y-1">
                    <div className="text-xs font-semibold text-blue-300">
                      3. Educational Process Relevance
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {item.educationalRelevance[lang]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
