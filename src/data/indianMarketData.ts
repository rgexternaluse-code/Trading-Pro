import { MarketAsset, MarketNewsItem, OHLCVCandle } from '../types';

function generateCandles(
  basePrice: number,
  volatilityPct: number,
  trendDrift: number,
  seed: number,
  count = 48
): OHLCVCandle[] {
  const candles: OHLCVCandle[] = [];
  let currentClose = basePrice * 0.94;
  let s = seed;
  const pseudoRandom = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const startDate = new Date('2026-07-15T09:15:00');
  const closes: number[] = [];

  for (let i = 0; i < count; i++) {
    const dt = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = dt.toISOString().split('T')[0];

    const rand = pseudoRandom() - 0.48 + trendDrift;
    const deltaPct = rand * volatilityPct;
    const open = Number(currentClose.toFixed(2));
    const close = Number(Math.max(10, open * (1 + deltaPct)).toFixed(2));
    const wickUp = Math.abs(pseudoRandom() * volatilityPct * 0.65 * open);
    const wickDown = Math.abs(pseudoRandom() * volatilityPct * 0.65 * open);
    const high = Number((Math.max(open, close) + wickUp).toFixed(2));
    const low = Number(Math.max(5, Math.min(open, close) - wickDown).toFixed(2));
    const volume = Math.round(450000 + pseudoRandom() * 1850000);

    closes.push(close);

    // Compute EMA20, EMA50, VWAP, RSI14, ATR14 approximations
    const slice20 = closes.slice(Math.max(0, closes.length - 20));
    const ema20 = Number((slice20.reduce((a, b) => a + b, 0) / slice20.length).toFixed(2));

    const slice50 = closes.slice(Math.max(0, closes.length - 50));
    const ema50 = Number((slice50.reduce((a, b) => a + b, 0) / slice50.length).toFixed(2));

    const vwap = Number(((high + low + close) / 3).toFixed(2));

    // Simple 14-period RSI calculation
    let gains = 0;
    let losses = 0;
    const rsiStart = Math.max(1, closes.length - 14);
    for (let j = rsiStart; j < closes.length; j++) {
      const diff = closes[j] - closes[j - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }
    const rs = losses === 0 ? 70 : gains / losses;
    const rsi = Number(Math.min(88, Math.max(18, 100 - 100 / (1 + rs))).toFixed(1));
    const atr = Number((close * volatilityPct * 0.85).toFixed(2));

    candles.push({
      date: dateStr,
      open,
      high,
      low,
      close,
      volume,
      ema20,
      ema50,
      vwap,
      rsi,
      atr,
    });

    currentClose = close;
  }

  return candles;
}

export const INDIAN_MARKET_ASSETS: MarketAsset[] = [
  {
    symbol: 'NIFTY 50',
    name: 'Nifty 50 Benchmark Index',
    exchange: 'INDEX',
    category: 'Index',
    price: 24845.6,
    change: 142.35,
    changePct: 0.58,
    dayHigh: 24910.0,
    dayLow: 24720.4,
    volume: 284500000,
    lotSize: 25,
    atr14: 185.0,
    supportLevel: 24650,
    resistanceLevel: 25000,
    fundamentals: {
      peRatio: 22.4,
      pbRatio: 3.6,
      roePct: 15.8,
      rocePct: 17.2,
      debtToEquity: 0.42,
      dividendYieldPct: 1.25,
      marketCapCr: 19450000,
      revenueGrowthYoYPct: 11.4,
      sector: 'Broad Indian Benchmark (50 Large-Cap Constituents)',
    },
    candles: generateCandles(24845, 0.011, 0.03, 101),
    educationalSummary: {
      en: 'Nifty 50 represents the weighted average of 50 of the largest Indian companies listed on the NSE across 13+ sectors. Ideal for studying broad market structure, index investing, and option hedging.',
      hinglish: 'Nifty 50 NSE ki top 50 large-cap companies ka benchmark index hai. Market ka overall trend, index investing aur option hedging samajhne ke liye yeh sabse important index hai.',
    },
  },
  {
    symbol: 'BANKNIFTY',
    name: 'Nifty Bank Index',
    exchange: 'INDEX',
    category: 'Index',
    price: 52680.25,
    change: -215.4,
    changePct: -0.41,
    dayHigh: 53040.0,
    dayLow: 52510.0,
    volume: 142000000,
    lotSize: 15,
    atr14: 490.0,
    supportLevel: 52200,
    resistanceLevel: 53150,
    fundamentals: {
      peRatio: 15.9,
      pbRatio: 2.3,
      roePct: 14.9,
      rocePct: 15.4,
      debtToEquity: 0.0,
      dividendYieldPct: 1.1,
      marketCapCr: 4120000,
      revenueGrowthYoYPct: 13.8,
      sector: 'Banking & Financial Services',
    },
    candles: generateCandles(52680, 0.015, 0.01, 202),
    educationalSummary: {
      en: 'BankNifty has higher beta and wider intraday ATR than Nifty 50. Because of its faster swings, traders must reduce position size to keep risk per trade within 1%.',
      hinglish: 'BankNifty mein Nifty 50 ke muqable zyada volatility (ATR) hoti hai. Isliye intraday ya options mein trade karte waqt position size chhota rakhna aur strict stop-loss lagana zaroori hai.',
    },
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    exchange: 'NSE',
    category: 'Equity',
    price: 2984.5,
    change: 34.8,
    changePct: 1.18,
    dayHigh: 3005.0,
    dayLow: 2948.0,
    volume: 6840200,
    lotSize: 1,
    atr14: 42.5,
    supportLevel: 2920,
    resistanceLevel: 3040,
    fundamentals: {
      peRatio: 27.8,
      pbRatio: 2.5,
      roePct: 9.8,
      rocePct: 11.2,
      debtToEquity: 0.44,
      dividendYieldPct: 0.34,
      marketCapCr: 2018500,
      revenueGrowthYoYPct: 9.6,
      sector: 'Energy, Telecom & Retail Conglomerate',
    },
    candles: generateCandles(2984, 0.016, 0.04, 303),
    educationalSummary: {
      en: 'High liquidity heavyweight in Nifty 50 (~9-10% index weight). Tight bid-ask spreads make it a textbook instrument for learning VWAP pullbacks and swing support/resistance.',
      hinglish: 'Reliance Nifty 50 ka heavyweight stock hai jisme high liquidity aur tight bid-ask spread rehta hai. VWAP pullbacks aur swing trading seekhne ke liye yeh ek classic stock hai.',
    },
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    exchange: 'NSE',
    category: 'Equity',
    price: 4290.0,
    change: 28.5,
    changePct: 0.67,
    dayHigh: 4322.0,
    dayLow: 4255.0,
    volume: 2310400,
    lotSize: 1,
    atr14: 58.0,
    supportLevel: 4210,
    resistanceLevel: 4360,
    fundamentals: {
      peRatio: 31.2,
      pbRatio: 16.4,
      roePct: 51.5,
      rocePct: 62.1,
      debtToEquity: 0.08,
      dividendYieldPct: 1.65,
      marketCapCr: 1552000,
      revenueGrowthYoYPct: 6.8,
      sector: 'Information Technology',
    },
    candles: generateCandles(4290, 0.014, 0.025, 404),
    educationalSummary: {
      en: 'Demonstrates high ROE/ROCE and virtually zero debt-to-equity—an ideal case study in fundamental quality vs. valuation multiples (P/E).',
      hinglish: 'TCS fundamental analysis seekhne ke liye best example hai—iska ROE 50%+ hai aur debt lagbhag zero hai, jisse aap quality vs P/E valuation samajh sakte hain.',
    },
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    exchange: 'NSE',
    category: 'Equity',
    price: 1712.4,
    change: -11.2,
    changePct: -0.65,
    dayHigh: 1731.0,
    dayLow: 1704.5,
    volume: 12940000,
    lotSize: 1,
    atr14: 24.0,
    supportLevel: 1680,
    resistanceLevel: 1755,
    fundamentals: {
      peRatio: 18.6,
      pbRatio: 2.6,
      roePct: 16.1,
      rocePct: 16.8,
      debtToEquity: 0.0,
      dividendYieldPct: 1.14,
      marketCapCr: 1304000,
      revenueGrowthYoYPct: 14.2,
      sector: 'Private Sector Banking',
    },
    candles: generateCandles(1712, 0.014, 0.015, 505),
    educationalSummary: {
      en: 'Largest private bank component in both Nifty 50 and BankNifty. Useful for studying range consolidation, institutional accumulation zones, and Price-to-Book (P/B) valuation.',
      hinglish: 'Banking stocks ko P/E ke bajaye Price-to-Book (P/B) aur Net Interest Margin se evaluate kiya jata hai. HDFC Bank dono indices ka major driver hai.',
    },
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    exchange: 'NSE',
    category: 'Equity',
    price: 1876.8,
    change: 19.4,
    changePct: 1.04,
    dayHigh: 1892.0,
    dayLow: 1854.0,
    volume: 5910000,
    lotSize: 1,
    atr14: 29.5,
    supportLevel: 1835,
    resistanceLevel: 1915,
    fundamentals: {
      peRatio: 28.4,
      pbRatio: 8.9,
      roePct: 31.8,
      rocePct: 39.4,
      debtToEquity: 0.09,
      dividendYieldPct: 2.1,
      marketCapCr: 778000,
      revenueGrowthYoYPct: 5.9,
      sector: 'Information Technology',
    },
    candles: generateCandles(1876, 0.017, 0.03, 606),
    educationalSummary: {
      en: 'IT exporters often experience overnight gap risk around global tech earnings and currency (USD/INR) shifts—an essential lesson for swing traders.',
      hinglish: 'IT stocks mein global markets aur USD/INR ke kaaran overnight gap-up ya gap-down risk hota hai. Swing traders ko iske hisaab se position sizing karni chahiye.',
    },
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    exchange: 'NSE',
    category: 'Equity',
    price: 982.3,
    change: -14.6,
    changePct: -1.46,
    dayHigh: 1004.0,
    dayLow: 976.0,
    volume: 11420000,
    lotSize: 1,
    atr14: 21.0,
    supportLevel: 955,
    resistanceLevel: 1025,
    fundamentals: {
      peRatio: 11.8,
      pbRatio: 3.8,
      roePct: 28.4,
      rocePct: 21.6,
      debtToEquity: 1.12,
      dividendYieldPct: 0.6,
      marketCapCr: 361500,
      revenueGrowthYoYPct: 16.4,
      sector: 'Automobiles & EV',
    },
    candles: generateCandles(982, 0.022, -0.01, 707),
    educationalSummary: {
      en: 'Cyclical auto stock with higher daily percentage swings. Demonstrates why cyclical low-P/E stocks behave differently from defensive consumer companies.',
      hinglish: 'Auto sector cyclical hota hai. Isme daily swings bade hote hain, isliye wide stop-loss ke saath quantity kam rakhna risk management ka golden rule hai.',
    },
  },
  {
    symbol: 'NIFTYBEES',
    name: 'Nippon India ETF Nifty 50 BeES',
    exchange: 'NSE',
    category: 'ETF',
    price: 274.85,
    change: 1.55,
    changePct: 0.57,
    dayHigh: 275.9,
    dayLow: 273.4,
    volume: 4120000,
    lotSize: 1,
    atr14: 2.3,
    supportLevel: 271,
    resistanceLevel: 278,
    fundamentals: {
      peRatio: 22.4,
      pbRatio: 3.6,
      roePct: 15.8,
      rocePct: 17.2,
      debtToEquity: 0.0,
      dividendYieldPct: 0.95,
      marketCapCr: 32400,
      revenueGrowthYoYPct: 11.4,
      sector: 'Passive Index ETF',
    },
    candles: generateCandles(274.85, 0.009, 0.03, 808),
    educationalSummary: {
      en: 'Exchange-Traded Fund tracking the Nifty 50 index at a low expense ratio. Ideal for beginners learning passive SIP investing, diversification, and core-satellite portfolio construction.',
      hinglish: 'NiftyBeES ek Exchange-Traded Fund (ETF) hai jo Nifty 50 ko track karta hai. Beginners ke liye SIP aur low-cost diversification samajhne ka sabse asaan zariya hai.',
    },
  },
];

export const INDIAN_MARKET_NEWS: MarketNewsItem[] = [
  {
    id: 'news-1',
    headline: {
      en: 'RBI Monetary Policy Committee Keeps Repo Rate Unchanged at 6.50%',
      hinglish: 'RBI Monetary Policy Committee ne Repo Rate 6.50% par unchanged rakha',
    },
    source: 'NSE Macro Desk (Demo Educational Feed)',
    publishedAgo: '2h ago',
    relatedSymbol: 'BANKNIFTY',
    verifiedEvent: {
      en: 'The Reserve Bank of India maintained the benchmark repo rate at 6.50% with a focus on inflation alignment toward the 4% medium-term target.',
      hinglish: 'RBI ne repo rate 6.50% par barkarar rakha hai aur inflation ko 4% target ke paas laane par focus bataya hai.',
    },
    analystInterpretation: {
      en: 'Stable rates keep borrowing costs predictable for banks and NBFCs, though net interest margin (NIM) expansion may moderate in coming quarters.',
      hinglish: 'Stable rates se banks aur NBFCs ke liye borrowing cost predictable rehti hai, halanki Net Interest Margin (NIM) growth moderate reh sakti hai.',
    },
    educationalRelevance: {
      en: 'Macro policy events create sharp 5-minute volatility spikes (whipsaws). Disciplined intraday traders wait for the post-announcement range to settle rather than guessing the first candle.',
      hinglish: 'RBI policy announcement ke waqt 5-minute chart par dono taraf spikes (whipsaws) aate hain. Disciplined traders pehli candle par guess karne ke bajaye structure settle hone ka wait karte hain.',
    },
  },
  {
    id: 'news-2',
    headline: {
      en: 'SEBI Tightens F&O Contract Lot Size & Intraday Position Monitoring Norms',
      hinglish: 'SEBI ne F&O Contract Lot Size aur Risk Monitoring rules ko strengthen kiya',
    },
    source: 'Regulatory Education Digest (Demo Feed)',
    publishedAgo: '5h ago',
    relatedSymbol: 'NIFTY 50',
    verifiedEvent: {
      en: 'Regulatory updates emphasize higher minimum contract values and upfront margin discipline to curb excessive retail speculation in expiry-day options.',
      hinglish: 'SEBI ke naye framework ka uddeshya retail traders ko expiry-day zero-hero options speculation aur excessive leverage se bachana hai.',
    },
    analystInterpretation: {
      en: 'Higher margin requirements may slightly reduce speculative weekly option volume while encouraging cash-market swing trading and hedged spreads.',
      hinglish: 'Isse speculative weekly option buying kam ho sakti hai aur traders cash-equity swing trading ya hedged strategies ki taraf shift honge.',
    },
    educationalRelevance: {
      en: 'Regulatory studies show over 90% of individual F&O traders incur net losses, largely due to over-leveraging and transaction costs (STT + brokerage). Master unleveraged equity trading first.',
      hinglish: 'SEBI data ke mutabiq 90% se zyada individual F&O traders over-leverage aur charges (STT + brokerage) ki wajah se loss karte hain. Pehle bina leverage ke cash equity mein discipline banayein.',
    },
  },
  {
    id: 'news-3',
    headline: {
      en: 'Large-Cap IT Companies Report Steady Deal Wins Amid Global Cloud Spend Stabilization',
      hinglish: 'Large-Cap IT Companies ne steady deal wins report kiye, margin discipline par focus',
    },
    source: 'Sector Research Feed (Demo Feed)',
    publishedAgo: '1d ago',
    relatedSymbol: 'TCS',
    verifiedEvent: {
      en: 'Quarterly order book disclosures show consistent Total Contract Value (TCV) inflows across banking and retail verticals.',
      hinglish: 'Quarterly results mein IT companies ki Total Contract Value (TCV) order book steady rahi hai aur operating margins stable hain.',
    },
    analystInterpretation: {
      en: 'Analysts view order backlog stability as supportive of medium-term cash flows, while watching discretionary spending recovery in North America.',
      hinglish: 'Analysts ke mutabiq order book strong rehna long-term cash flow ke liye achha संकेत hai, par global tech spending recovery par nazar rakhni hogi.',
    },
    educationalRelevance: {
      en: 'Notice the difference between a Verified Fact (reported order book numbers) and an Opinion (whether the stock price will rise next week). Good news can already be priced in.',
      hinglish: 'Verified Fact (actual order numbers) aur Opinion (kya stock kal badhega) mein farq samjhein. Kai baar achhi news pehle se price-in hoti hai.',
    },
  },
];

/**
 * Calculates realistic Indian Equity Intraday / Delivery statutory & brokerage charges
 * (Brokerage + STT + NSE Exchange Txn Charge + SEBI Turnover Fee + Stamp Duty + 18% GST)
 */
export function calculateIndianTradeCharges(params: {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  mode: 'intraday' | 'delivery';
}) {
  const { buyPrice, sellPrice, quantity, mode } = params;
  const buyTurnover = buyPrice * quantity;
  const sellTurnover = sellPrice * quantity;
  const totalTurnover = buyTurnover + sellTurnover;

  // Flat discount broker model: min(₹20, 0.03% of leg) for intraday; ₹0 or ₹20 for delivery
  const brokerageBuy = mode === 'intraday' ? Math.min(20, buyTurnover * 0.0003) : 0;
  const brokerageSell = mode === 'intraday' ? Math.min(20, sellTurnover * 0.0003) : 0;
  const totalBrokerage = Number((brokerageBuy + brokerageSell).toFixed(2));

  // STT: 0.025% on sell side for intraday; 0.1% on both buy & sell for delivery
  const stt = Number(
    (mode === 'intraday' ? sellTurnover * 0.00025 : totalTurnover * 0.001).toFixed(2)
  );

  // NSE Exchange Transaction Charge (~0.00297%)
  const exchangeCharges = Number((totalTurnover * 0.0000297).toFixed(2));

  // SEBI Turnover Fees (₹10 per crore = 0.0001%)
  const sebiCharges = Number((totalTurnover * 0.000001).toFixed(2));

  // Stamp Duty on Buy side (0.003% intraday, 0.015% delivery)
  const stampDuty = Number(
    (buyTurnover * (mode === 'intraday' ? 0.00003 : 0.00015)).toFixed(2)
  );

  // GST 18% on (Brokerage + Exchange Charges + SEBI Charges)
  const gst = Number(((totalBrokerage + exchangeCharges + sebiCharges) * 0.18).toFixed(2));

  const totalCharges = Number(
    (totalBrokerage + stt + exchangeCharges + sebiCharges + stampDuty + gst).toFixed(2)
  );

  const grossPnl = Number(((sellPrice - buyPrice) * quantity).toFixed(2));
  const netPnl = Number((grossPnl - totalCharges).toFixed(2));
  const breakevenMovePerShare = quantity > 0 ? Number((totalCharges / quantity).toFixed(2)) : 0;

  return {
    buyTurnover: Number(buyTurnover.toFixed(2)),
    sellTurnover: Number(sellTurnover.toFixed(2)),
    totalTurnover: Number(totalTurnover.toFixed(2)),
    totalBrokerage,
    stt,
    exchangeCharges,
    sebiCharges,
    stampDuty,
    gst,
    totalCharges,
    grossPnl,
    netPnl,
    breakevenMovePerShare,
  };
}
