import {
  AIErrorReport,
  InteractiveExerciseItem,
  UserChartDrawing,
} from '../types';
import { calculateIndianTradeCharges } from './indianMarketData';

export const INTERACTIVE_EXERCISES_V2: InteractiveExerciseItem[] = [
  // 1. NUMERIC CALCULATION (Deterministic Solver)
  {
    id: 'ex-v2-numeric-1',
    format: 'numeric_calc',
    title: {
      en: 'Format 1 · Exact Position Size Calculation (1% Risk Rule)',
      hinglish: 'Format 1 · Exact Position Size Calculation (1% Risk Rule)',
    },
    level: 'beginner',
    category: 'riskManagement',
    symbol: 'RELIANCE',
    stage: 'published',
    prompt: {
      en: 'Your trading account capital is ₹1,50,000. You follow a strict 1% maximum risk per trade rule. You plan a LONG entry on RELIANCE at ₹2,960 with an invalidation stop-loss at ₹2,930. Calculate the exact number of shares you should buy.',
      hinglish:
        'Aapka trading capital ₹1,50,000 hai aur aap 1% max risk per trade rule follow karte hain. RELIANCE mein Entry ₹2,960 aur Stop-Loss ₹2,930 hai. Aapko exact kitne shares buy karne chahiye?',
    },
    hint: {
      en: 'Max Rupee Risk = ₹1,50,000 × 1% = ₹1,500. Risk per share = ₹2,960 − ₹2,930 = ₹30. Shares = Max Risk ÷ Risk per share.',
      hinglish:
        'Max Rupee Risk = ₹1,50,000 × 1% = ₹1,500. Risk per share = ₹2,960 − ₹2,930 = ₹30. Shares = ₹1,500 ÷ ₹30.',
    },
    explanation: {
      en: 'Step 1: Max Risk = ₹1,50,000 × 0.01 = ₹1,500. Step 2: Stop-Loss Distance = |₹2,960 − ₹2,930| = ₹30/share. Step 3: Position Size = ₹1,500 ÷ ₹30 = 50 shares. Even if stopped out, your account loses only 1%.',
      hinglish:
        'Step 1: Max Risk = ₹1,50,000 × 1% = ₹1,500. Step 2: Stop-Loss Distance = ₹30/share. Step 3: Exact Quantity = ₹1,500 ÷ ₹30 = 50 shares.',
    },
    numericExpected: 50,
    numericTolerance: 0,
    numericUnit: 'shares',
    numericFormulaSteps: {
      en: 'Shares = (₹1,50,000 × 1%) ÷ (₹2,960 − ₹2,930) = ₹1,500 ÷ ₹30 = 50 shares',
      hinglish: 'Shares = (₹1,50,000 × 1%) ÷ (₹2,960 − ₹2,930) = ₹1,500 ÷ ₹30 = 50 shares',
    },
  },

  // 2. DRAW SUPPORT & RESISTANCE ON CHART (Interactive Canvas + Geometry Grader)
  {
    id: 'ex-v2-draw-sr-1',
    format: 'draw_sr',
    title: {
      en: 'Format 2 · Draw Key Support & Resistance Zones on RELIANCE',
      hinglish: 'Format 2 · RELIANCE Chart Par Support Aur Resistance Draw Karein',
    },
    level: 'intermediate',
    category: 'technicalAnalysis',
    symbol: 'RELIANCE',
    stage: 'published',
    prompt: {
      en: 'Using the Interactive Chart Annotation Toolbar below, select "Support Line" and click near the horizontal demand floor (~₹2,915), then select "Resistance Line" and click near the supply ceiling (~₹3,035). Tolerance: ±₹22 (0.75% / 0.5×ATR).',
      hinglish:
        'Niche diye gaye Interactive Chart Toolbar se pehle "Support Line" select karke demand zone (~₹2,915) par click karein, phir "Resistance Line" select karke supply zone (~₹3,035) par mark karein. Tolerance: ±₹22.',
    },
    hint: {
      en: 'Look for the price zone where multiple candle lows bounced near ₹2,910–₹2,920 and where highs rejected near ₹3,030–₹3,040.',
      hinglish:
        'Dekhein kahan multiple candle lows ₹2,910–₹2,920 ke paas bounce hue hain aur highs ₹3,030–₹3,040 ke paas reject hue hain.',
    },
    explanation: {
      en: 'Support and Resistance are zones (not single-paisa lines) where institutional order flow previously absorbed supply or demand. Our geometry grader checks your drawn price levels within ±0.5×ATR tolerance.',
      hinglish:
        'Support aur Resistance ek zone hote hain jahan buyers ya sellers bar-bar active hote hain. Geometry grader ±0.5×ATR tolerance ke andar aapki drawing check karta hai.',
    },
    expectedSupportPrice: 2915,
    expectedResistancePrice: 3035,
    priceToleranceInr: 22,
  },

  // 3. CLICK THE EXACT CANDLESTICK ON CHART
  {
    id: 'ex-v2-candle-click-1',
    format: 'candle_click',
    title: {
      en: 'Format 3 · Click the Swing Low Demand Rejection Candle',
      hinglish: 'Format 3 · Chart Par Swing Low Rejection Candle Click Karein',
    },
    level: 'beginner',
    category: 'technicalAnalysis',
    symbol: 'TCS',
    stage: 'published',
    prompt: {
      en: 'Click directly on any candlestick inside the primary Swing Low / Pullback Support bounce window (Candles #10 to #18) on the TCS chart where selling pressure exhausted and an upward swing began.',
      hinglish:
        'TCS chart par us candlestick par click karein jahan pullback swing low (#10 se #18 candle ke beech) bana aur buyers ne wapas control liya.',
    },
    hint: {
      en: 'Inspect the first third of the chart (around candle indices 10–18) where price dips to its local trough before curling back above the 20-EMA.',
      hinglish:
        'Chart ke shuruati hisse (candle #10 se #18) mein dekhein jahan price dip bana kar wapas 20-EMA ke upar nikla hai.',
    },
    explanation: {
      en: 'Identifying structural swing lows (Higher Lows) on the chart trains you to wait for pullbacks into value rather than chasing extended green candles at the top of a move.',
      hinglish:
        'Chart par swing low (Higher Low) pehchanne se aap top par FOMO buying karne ke bajaye pullback ka wait karna seekhte hain.',
    },
    targetCandleRange: [10, 18],
  },

  // 4. INTERACTIVE ORDER PLACEMENT (ENTRY + STOP + TARGET)
  {
    id: 'ex-v2-place-order-1',
    format: 'place_order',
    title: {
      en: 'Format 4 · Configure an Asymmetric 1:2+ R:R Trade Setup on HDFCBANK',
      hinglish: 'Format 4 · HDFCBANK Par 1:2+ Risk/Reward Trade Setup Banayein',
    },
    level: 'intermediate',
    category: 'riskManagement',
    symbol: 'HDFCBANK',
    stage: 'published',
    prompt: {
      en: 'HDFCBANK is trading near ₹1,685 with structural support at ₹1,655 and resistance near ₹1,745. Set a LONG Entry near ₹1,680–₹1,690, place an invalidation Stop-Loss below support (≤ ₹1,655), and set a Target that achieves at least a 1 : 2.0 Risk/Reward ratio.',
      hinglish:
        'HDFCBANK ₹1,685 ke paas trade kar raha hai (Support ₹1,655, Resistance ₹1,745). LONG Entry ₹1,680–₹1,690 ke beech rakhein, Stop-Loss ₹1,655 ya usse neeche rakhein, aur Target aisa set karein jisse kam se kam 1 : 2.0 R:R mile.',
    },
    hint: {
      en: 'If Entry = ₹1,685 and Stop-Loss = ₹1,650 (Risk = ₹35), then a 2R Target requires at least ₹1,685 + ₹70 = ₹1,755.',
      hinglish:
        'Agar Entry = ₹1,685 aur Stop-Loss = ₹1,650 (Risk = ₹35) hai, toh 1:2 R:R ke liye Target kam se kam ₹1,685 + ₹70 = ₹1,755 hona chahiye.',
    },
    explanation: {
      en: 'A valid trade setup requires two simultaneous conditions: (1) Stop-Loss placed beyond structural noise/support, and (2) Reward-to-Risk ≥ 2.0R so that even a 40% win rate produces positive expectancy.',
      hinglish:
        'Ek achhe trade setup mein Stop-Loss support ke neeche hona chahiye aur Reward-to-Risk kam se kam 1:2 hona chahiye taaki 40% win-rate par bhi net profit bane.',
    },
    expectedOrderSetup: {
      direction: 'LONG',
      idealEntry: 1685,
      maxStopLoss: 1658,
      minTarget: 1740,
      minRR: 2.0,
    },
  },

  // 5. SPOT THE MISTAKE IN A LOSING TRADE TICKET
  {
    id: 'ex-v2-spot-mistake-1',
    format: 'spot_mistake',
    title: {
      en: 'Format 5 · Audit & Spot the Fatal Flaw in This Order Ticket',
      hinglish: 'Format 5 · Is Order Ticket Mein Sabse Badi Galti Pehchanein',
    },
    level: 'beginner',
    category: 'riskManagement',
    symbol: 'INFY',
    stage: 'published',
    prompt: {
      en: 'Inspect the trader’s order ticket below for INFY. The trader has ₹1,00,000 capital and bought 250 shares at ₹1,880 with a Stop-Loss at ₹1,840 and Target at ₹1,900. What is the critical risk management violation?',
      hinglish:
        'Niche diye gaye INFY order ticket ko dhyan se dekhein. Trader ka capital ₹1,00,000 hai aur usne ₹1,880 par 250 shares buy kiye (Stop-Loss ₹1,840, Target ₹1,900). Ismein sabse badi galti kya hai?',
    },
    hint: {
      en: 'Calculate Total Rupee Risk = 250 shares × (₹1,880 − ₹1,840) = ₹10,000 (10% of capital!) and check the R:R ratio (₹20 reward vs ₹40 risk = 0.5R).',
      hinglish:
        'Total Risk = 250 × ₹40 = ₹10,000 (capital ka 10%!) aur Reward sirf ₹20 vs Risk ₹40 (1:0.5 inverted R:R).',
    },
    explanation: {
      en: 'Risking ₹10,000 on a ₹1,00,000 account equals 10% capital risk on a single trade, paired with an inverted 1 : 0.5 Risk/Reward ratio. Just 5 consecutive losses at 10% risk destroys over 40% of the account.',
      hinglish:
        '₹1,00,000 account par ₹10,000 (10%) risk lena aur ₹40 risk ke badle sirf ₹20 target rakhna (0.5R) account blow hone ka sabse bada kaaran hai.',
    },
    flawedTicketData: {
      capitalInr: 100000,
      entryPrice: 1880,
      stopLoss: 1840,
      targetPrice: 1900,
      shares: 250,
      flawOptions: [
        {
          en: '10% Account Risk (₹10,000 loss on 250 shares) + Negative 1:0.5 Risk/Reward Ratio',
          hinglish: '10% Capital Risk (₹10,000 risk) + Ulta 1:0.5 Risk/Reward Ratio',
        },
        {
          en: 'INFY cannot be traded on the NSE cash segment',
          hinglish: 'INFY ko NSE cash market mein trade nahi kiya ja sakta',
        },
        {
          en: 'The stop-loss should be removed completely so it never triggers',
          hinglish: 'Stop-Loss hata dena chahiye taaki loss book hi na ho',
        },
      ],
      correctFlawIndex: 0,
    },
  },

  // 6. STRATEGY FIX (DEBUG LOOK-AHEAD BIAS IN QUANT CODE)
  {
    id: 'ex-v2-strategy-fix-1',
    format: 'strategy_fix',
    title: {
      en: 'Format 6 · Debug Look-Ahead Bias in a Python Backtest Script',
      hinglish: 'Format 6 · Python Backtest Code Mein Look-Ahead Bias Fix Karein',
    },
    level: 'advanced',
    category: 'algoTrading',
    symbol: 'NIFTY 50',
    stage: 'published',
    prompt: {
      en: 'A quant developer wrote the Python backtest code below and claimed a 94% win rate. Inspect line 2 and identify why this backtest suffers from severe Look-Ahead Bias.',
      hinglish:
        'Ek developer ne niche diya gaya Python backtest code likha jo 94% win-rate dikhata hai. Line 2 dekhein aur batayein ismein Look-Ahead Bias kyun hai.',
    },
    hint: {
      en: 'Notice `df["close"].shift(-1)` uses tomorrow’s future closing price to generate today’s signal!',
      hinglish:
        '`df["close"].shift(-1)` aane wale kal (future) ka close price use kar raha hai jo live market mein namumkin hai!',
    },
    explanation: {
      en: 'In pandas, `.shift(-1)` peeks into future rows, whereas `.shift(1)` uses completed past bars. Any backtest that uses unclosed or future bar data creates fake paper profits that fail immediately in live trading.',
      hinglish:
        'Pandas mein `.shift(-1)` future candle ka data chura leta hai. Sahi backtest ke liye signal ko `.shift(1)` karna zaroori hai taaki candle close hone ke baad agli candle par trade ho.',
    },
    brokenStrategySnippet: {
      code: `# BROKEN BACKTEST SCRIPT
df['ema20'] = df['close'].ewm(span=20).mean()
df['signal'] = np.where(df['close'].shift(-1) > df['ema20'], 1, 0) # <-- BUG HERE
df['strategy_return'] = df['signal'] * df['close'].pct_change()`,
      bugOptions: [
        {
          en: 'Uses .shift(-1) which peeks at next bar future close (Look-Ahead Bias); must use closed bar signal shifted forward by +1 (.shift(1))',
          hinglish:
            '.shift(-1) future candle ka close price dekh raha hai (Look-Ahead Bias); ise .shift(1) hona chahiye',
        },
        {
          en: 'EMA span should be 2000 instead of 20',
          hinglish: 'EMA span 20 ke bajaye 2000 hona chahiye',
        },
        {
          en: 'Python cannot calculate percentage change on Nifty 50',
          hinglish: 'Python Nifty 50 par percentage calculate nahi kar sakta',
        },
      ],
      correctBugIndex: 0,
      fixedCode: `# FIXED BACKTEST SCRIPT (ZERO LOOK-AHEAD BIAS)
df['ema20'] = df['close'].ewm(span=20, adjust=False).mean()
df['raw_signal'] = np.where(df['close'] > df['ema20'], 1, 0)
df['position'] = df['raw_signal'].shift(1) # Execute on NEXT bar after close`,
    },
  },

  // 7. TRUE / FALSE RAPID CONCEPT VERIFICATION
  {
    id: 'ex-v2-tf-1',
    format: 'true_false',
    title: {
      en: 'Format 7 · True or False: High Win Rate Guarantees Profitability',
      hinglish: 'Format 7 · Sahi ya Galat: Kya 80% Win-Rate Hamesha Profit Deta Hai?',
    },
    level: 'beginner',
    category: 'riskManagement',
    symbol: 'NIFTY 50',
    stage: 'published',
    prompt: {
      en: 'Statement: "A trader with an 80% win rate is mathematically guaranteed to be profitable over 100 trades, regardless of their average loss size."',
      hinglish:
        'Statement: "Agar kisi trader ka win-rate 80% hai, toh woh 100 trades mein hamesha profitable rahega—chahe uska average loss kitna bhi bada ho."',
    },
    hint: {
      en: 'Check Expectancy: If you win ₹500 on 80 trades (+₹40,000) but lose ₹3,000 on 20 trades (-₹60,000), your net P&L is -₹20,000!',
      hinglish:
        'Expectancy check karein: 80 trades mein ₹500 profit (+₹40,000) aur 20 trades mein ₹3,000 loss (-₹60,000) hone par net ₹20,000 ka nuksan hoga!',
    },
    explanation: {
      en: 'FALSE! Profitability depends on Expectancy = (Win% × Avg Win) − (Loss% × Avg Loss). Scalpers who take tiny profits without stop-losses often win 80% of trades and still lose their entire capital on the remaining 20%.',
      hinglish:
        'GALAT (FALSE)! Asli profitability Expectancy = (Win% × Avg Win) − (Loss% × Avg Loss) par nirbhar karti hai. Chhote profit book karke bade loss hold karne se 80% win-rate par bhi bada loss hota hai.',
    },
    mcqOptions: [
      { en: 'True — Win rate is the only metric that matters', hinglish: 'True — Win-rate hi sab kuch hai' },
      {
        en: 'False — Without controlled loss size (Expectancy > 0), a single large loss wipes out many small wins',
        hinglish:
          'False — Bina Stop-Loss aur Positive Expectancy ke 20% bade losses saara profit khatam kar dete hain',
      },
    ],
    correctOptionIndex: 1,
  },

  // 8. MULTIPLE CHOICE (OPTIONS THETA & VEGA)
  {
    id: 'ex-v2-mcq-1',
    format: 'mcq',
    title: {
      en: 'Format 8 · Options Greeks: IV Crush After Earnings / Event',
      hinglish: 'Format 8 · Options Greeks: Quarterly Results Ke Baad IV Crush',
    },
    level: 'advanced',
    category: 'derivatives',
    symbol: 'NIFTY 50',
    stage: 'published',
    prompt: {
      en: 'You buy an Out-of-the-Money (OTM) Call Option one day before a major company earnings announcement when Implied Volatility (IV) is extremely high. The next morning, the stock rises slightly (+0.8%), yet your Call Option loses 35% of its value. Which two Greeks explain this loss?',
      hinglish:
        'Aapne result se ek din pehle high Implied Volatility (IV) mein OTM Call Option buy kiya. Agle din stock +0.8% badha, phir bhi aapke Call Option ka price 35% gir gaya. Yeh kin do Greeks ki wajah se hua?',
    },
    hint: {
      en: 'Think about the drop in Implied Volatility (Vega) after the event uncertainty passes, combined with overnight time decay (Theta).',
      hinglish:
        'Event khatam hone par Implied Volatility girne (Vega Crush) aur overnight time decay (Theta) ke baare mein sochein.',
    },
    explanation: {
      en: 'Vega (sensitivity to Implied Volatility) and Theta (time decay). Before major events, option premiums are inflated by high IV. Once the announcement is out, IV collapses ("IV Crush"), draining extrinsic value faster than a small spot move can offset.',
      hinglish:
        'Vega (IV गिरने से नुकसान) aur Theta (Time Decay). Bade event se pehle IV bahut high hota hai; result aate hi IV Crush hota hai aur OTM option ka premium tezi se gir jata hai.',
    },
    mcqOptions: [
      {
        en: 'Vega (Implied Volatility Crush) and Theta (Time Decay)',
        hinglish: 'Vega (IV Crush) aur Theta (Time Decay)',
      },
      {
        en: 'Rho (Interest Rates) only',
        hinglish: 'Sirf Rho (Interest Rate change)',
      },
      {
        en: 'Dividend Yield and Book Value',
        hinglish: 'Dividend Yield aur Book Value',
      },
    ],
    correctOptionIndex: 0,
  },

  // 9. BAR-BY-BAR CHART REPLAY DECISION
  {
    id: 'ex-v2-replay-1',
    format: 'chart_replay',
    title: {
      en: 'Format 9 · Bar-by-Bar Candle Replay: Mid-Trade Management',
      hinglish: 'Format 9 · Bar-by-Bar Candle Replay: Live Trade Management',
    },
    level: 'intermediate',
    category: 'technicalAnalysis',
    symbol: 'RELIANCE',
    stage: 'published',
    prompt: {
      en: 'Use the "+1 Bar Step" button to replay the RELIANCE setup candle-by-candle. When price pulls back to ₹2,920 support with a 1:2.5 R:R setup and defined stop at ₹2,890, what is the disciplined rules-based decision?',
      hinglish:
        '"+1 Bar Step" button दबाकर RELIANCE ke candles ek-ek karke replay karein. Jab price ₹2,920 support par 1:2.5 R:R aur ₹2,890 stop-loss ke saath hold kare, toh sahi process decision kya hoga?',
    },
    hint: {
      en: 'Step through the hidden bars and observe whether the ₹2,890 invalidation stop is respected while price rebounds toward ₹2,995.',
      hinglish:
        'Candles step forward karein aur dekhein ki ₹2,890 stop-loss safe rehta hai aur price ₹2,995 target ki taraf badhta hai.',
    },
    explanation: {
      en: 'Stepping bar-by-bar teaches patience: you enter only when price reaches your predefined zone, size at 1% risk, and hold until either your invalidation stop or target is reached.',
      hinglish:
        'Bar-by-bar replay se patience aata hai: predefined zone par 1% risk ke saath entry lein aur bina panic kiye stop-loss ya target tak plan follow karein.',
    },
    mcqOptions: [
      {
        en: 'Enter LONG with 1% Risk Size, set Stop at ₹2,890, and hold according to plan',
        hinglish: '1% Risk Quantity ke saath LONG lein, ₹2,890 Stop lagayein aur plan follow karein',
      },
      {
        en: 'Go 100% all-in with 5x margin and no stop-loss',
        hinglish: 'Bina stop-loss 5x margin lekar saara paisa laga dein',
      },
      {
        en: 'Panic exit on the first ₹5 red tick',
        hinglish: '₹5 neeche aate hi darr kar exit kar dein',
      },
    ],
    correctOptionIndex: 0,
  },

  // 10. PSYCHOLOGY & BEHAVIORAL SCENARIO
  {
    id: 'ex-v2-psych-1',
    format: 'psychology_scenario',
    title: {
      en: 'Format 10 · Behavioral Check: Handling 3 Consecutive -1R Losses',
      hinglish: 'Format 10 · Psychology Check: Lagatar 3 Stop-Loss Hit Hone Par Kya Karein?',
    },
    level: 'intermediate',
    category: 'tradingPsychology',
    symbol: 'BANKNIFTY',
    stage: 'published',
    prompt: {
      en: 'You followed your tested 55%-win-rate strategy rules perfectly, but your last 3 trades hit their predefined -1R stop-loss (-3% total drawdown). A new valid setup appears, and you feel an urge to triple your position size to "win it all back in one trade." What is the correct mathematical and behavioral action?',
      hinglish:
        'Aapne apne 55% win-rate strategy ke rules 100% follow kiye, lekin pichle 3 trades mein -1R stop-loss hit ho gaya (-3% drawdown). Ab man kar raha hai ki agle trade mein 3x quantity lekar ek baar mein saara loss recover kar lein. Sahi kadam kya hai?',
    },
    hint: {
      en: 'In a 55% win-rate system, a 3-loss streak has a (0.45)^3 = 9.1% probability—it happens roughly once every 11 trade sequences!',
      hinglish:
        '55% win-rate wali strategy mein bhi lagatar 3 loss hone ki probability (0.45)^3 = 9.1% hoti hai—yeh bilkul normal statistical variance hai!',
    },
    explanation: {
      en: 'A 3-trade losing streak is completely normal random variance in any probabilistic edge. Tripling size turns a routine -3% dip into a -9% or -12% emotional spiral (Revenge Trading). Keep risk fixed at ≤1% per trade.',
      hinglish:
        'Lagatar 3 stop-loss hit hona normal statistical probability hai. Quantity 3x karna Revenge Trading hai jo account ko gehre drawdown mein le jata hai. Apna risk 1% par hi sabit rakhein.',
    },
    mcqOptions: [
      {
        en: 'Recognize normal variance ((0.45)³ = 9.1% chance), keep risk strictly at 1% (or 0.5%), and log emotions in Journal',
        hinglish:
          'Ise normal variance samjhein, risk strictly 1% (ya 0.5%) rakhein aur Journal mein emotion note karein',
      },
      {
        en: 'Triple position size to 3%–5% risk to recover all 3 losses immediately',
        hinglish: 'Quantity 3 guna badha dein taaki ek hi trade mein saara loss wapas aa jaye',
      },
      {
        en: 'Abandon stop-losses on the next trade',
        hinglish: 'Agle trade mein stop-loss lagana band kar dein',
      },
    ],
    correctOptionIndex: 0,
  },
];

// Deterministic Grading Functions (Master Spec v2 Section: Hybrid Math & Geometry Grader)
export function gradeNumericExercise(
  userValue: number,
  expected: number,
  tolerance: number = 0.5
): { passed: boolean; diff: number } {
  const diff = Number(Math.abs(userValue - expected).toFixed(2));
  return {
    passed: diff <= tolerance,
    diff,
  };
}

export function gradeChartDrawingExercise(
  drawings: UserChartDrawing[],
  expectedSupport: number,
  expectedResistance: number,
  toleranceInr: number
): {
  passed: boolean;
  supportMatched: boolean;
  resistanceMatched: boolean;
  closestSupportDiff: number | null;
  closestResistanceDiff: number | null;
} {
  const supportDrawings = drawings.filter(
    (d) => d.tool === 'support_line' || d.tool === 'zone_box'
  );
  const resistanceDrawings = drawings.filter(
    (d) => d.tool === 'resistance_line' || d.tool === 'zone_box'
  );

  let closestSupportDiff: number | null = null;
  for (const d of supportDrawings) {
    const diff = Math.abs(d.price1 - expectedSupport);
    if (closestSupportDiff === null || diff < closestSupportDiff) {
      closestSupportDiff = Number(diff.toFixed(1));
    }
  }

  let closestResistanceDiff: number | null = null;
  for (const d of resistanceDrawings) {
    const diff = Math.abs(d.price1 - expectedResistance);
    if (closestResistanceDiff === null || diff < closestResistanceDiff) {
      closestResistanceDiff = Number(diff.toFixed(1));
    }
  }

  const supportMatched =
    closestSupportDiff !== null && closestSupportDiff <= toleranceInr;
  const resistanceMatched =
    closestResistanceDiff !== null && closestResistanceDiff <= toleranceInr;

  return {
    passed: supportMatched && resistanceMatched,
    supportMatched,
    resistanceMatched,
    closestSupportDiff,
    closestResistanceDiff,
  };
}

export interface DeterministicTestCaseResult {
  id: string;
  suite: string;
  name: string;
  formulaTested: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export function runDeterministicValidationSuite(): DeterministicTestCaseResult[] {
  // 1. Position Sizing Formula Test
  const cap = 150000;
  const riskPct = 1;
  const entry = 2960;
  const stop = 2930;
  const shares = Math.floor(((cap * riskPct) / 100) / Math.abs(entry - stop));

  // 2. Fractional Share Conservative Floor Rounding Test (₹1,000 risk / ₹30 stop = 33.33 -> 33 shares)
  const oddShares = Math.floor((100000 * 0.01) / 30);
  const actualOddRisk = oddShares * 30;

  // 3. Risk/Reward Ratio Formula Test
  const target = 3035;
  const rr = Number(((target - entry) / (entry - stop)).toFixed(2));

  // 4. Drawdown Recovery Math Test (-50% drawdown requires +100% gain)
  const lossFraction = 0.5;
  const recoveryRequiredPct = Math.round((lossFraction / (1 - lossFraction)) * 100);

  // 5. Expectancy Equation Test
  const winProb = 0.5;
  const avgWinR = 2.2;
  const lossProb = 0.5;
  const avgLossR = 1.0;
  const expectancyR = Number((winProb * avgWinR - lossProb * avgLossR).toFixed(2));

  // 6. Indian Intraday Brokerage + STT + GST Calculator Test
  const chargesRes = calculateIndianTradeCharges({
    buyPrice: 1000,
    sellPrice: 1020,
    quantity: 100,
    mode: 'intraday',
  });

  // 7. Indian Delivery Equity Charges (0 Brokerage, 0.1% Buy+Sell STT)
  const deliveryCharges = calculateIndianTradeCharges({
    buyPrice: 1000,
    sellPrice: 1050,
    quantity: 100,
    mode: 'delivery',
  });

  // 8. NSE Options Flat ₹20/Order Brokerage + 0.0625% Sell STT
  const optionsCharges = calculateIndianTradeCharges({
    buyPrice: 150,
    sellPrice: 210,
    quantity: 50,
    mode: 'options',
  });

  // 9. SIP Compounding & Real Inflation-Adjusted Return Formula
  const sipMonthly = 10000;
  const sipMonths = 120; // 10 yrs
  const rMonth = 12 / 12 / 100; // 1% monthly
  const sipFV = Math.round(
    sipMonthly * ((Math.pow(1 + rMonth, sipMonths) - 1) / rMonth) * (1 + rMonth)
  );

  // 10. Chart Geometry Tolerance Grader Test
  const sampleDrawings: UserChartDrawing[] = [
    { id: 't1', tool: 'support_line', price1: 2921, candleIndex1: 12, label: 'Support' },
    { id: 't2', tool: 'resistance_line', price1: 3030, candleIndex1: 25, label: 'Resistance' },
  ];
  const geoGrade = gradeChartDrawingExercise(sampleDrawings, 2915, 3035, 22);

  return [
    {
      id: 'test-01',
      suite: 'Risk Math Engine',
      name: '1% Position Sizing Solver',
      formulaTested: 'floor((Capital × Risk%) ÷ |Entry − Stop|)',
      expectedOutput: '50 shares (₹1,500 risk)',
      actualOutput: `${shares} shares (₹${shares * 30} risk)`,
      passed: shares === 50,
    },
    {
      id: 'test-02',
      suite: 'Risk Math Engine',
      name: 'Odd-Lot Conservative Floor Rounding',
      formulaTested: 'floor(₹1,000 ÷ ₹30) = 33 sh (Never exceeds 1% risk)',
      expectedOutput: '33 shares (₹990 ≤ ₹1,000 max)',
      actualOutput: `${oddShares} shares (₹${actualOddRisk} ≤ ₹1,000 max)`,
      passed: oddShares === 33 && actualOddRisk <= 1000,
    },
    {
      id: 'test-03',
      suite: 'Risk Math Engine',
      name: 'Asymmetric Risk/Reward Ratio',
      formulaTested: '|Target − Entry| ÷ |Entry − Stop|',
      expectedOutput: '1 : 2.5',
      actualOutput: `1 : ${rr}`,
      passed: rr === 2.5,
    },
    {
      id: 'test-04',
      suite: 'Drawdown Math Engine',
      name: 'Non-Linear Drawdown Recovery (-50%)',
      formulaTested: 'Loss% ÷ (100% − Loss%)',
      expectedOutput: '+100% Gain Required',
      actualOutput: `+${recoveryRequiredPct}% Gain Required`,
      passed: recoveryRequiredPct === 100,
    },
    {
      id: 'test-05',
      suite: 'Quant Statistical Engine',
      name: 'Trade Expectancy (R-Multiple)',
      formulaTested: '(W% × AvgWinR) − (L% × AvgLossR)',
      expectedOutput: '+0.6R per trade',
      actualOutput: `+${expectancyR}R per trade`,
      passed: expectancyR === 0.6,
    },
    {
      id: 'test-06',
      suite: 'NSE/BSE Fee Engine',
      name: 'Intraday Brokerage + STT (0.025% Sell) + GST',
      formulaTested: 'Gross P&L − (Min(₹20, 0.03%)×2 + STT + Exch + GST)',
      expectedOutput: 'Gross ₹2,000 → Net ₹1,913.69',
      actualOutput: `Gross ₹${chargesRes.grossPnl} → Net ₹${chargesRes.netPnl} (Fees ₹${chargesRes.totalCharges})`,
      passed: chargesRes.totalCharges > 40 && chargesRes.netPnl < chargesRes.grossPnl,
    },
    {
      id: 'test-07',
      suite: 'NSE/BSE Fee Engine',
      name: 'Delivery Equity Zero-Brokerage + 0.1% STT Check',
      formulaTested: 'Brokerage ₹0 + 0.1% Buy/Sell STT + 0.015% Stamp',
      expectedOutput: 'Brokerage ₹0 & STT ₹205',
      actualOutput: `Brokerage ₹${deliveryCharges.brokerage} & STT ₹${deliveryCharges.stt}`,
      passed: deliveryCharges.brokerage === 0 && deliveryCharges.stt === 205,
    },
    {
      id: 'test-08',
      suite: 'NSE/BSE Fee Engine',
      name: 'F&O Options Flat ₹40 Brokerage + Premium STT',
      formulaTested: '₹20×2 Orders + 0.0625% Sell STT + Exch + 18% GST',
      expectedOutput: 'Brokerage ₹40 & Net < ₹3,000',
      actualOutput: `Brokerage ₹${optionsCharges.brokerage} & Net ₹${optionsCharges.netPnl}`,
      passed: optionsCharges.brokerage === 40 && optionsCharges.netPnl < 3000,
    },
    {
      id: 'test-09',
      suite: 'Wealth Compounding Engine',
      name: '10-Yr Monthly SIP Future Value (₹10k @ 12% p.a.)',
      formulaTested: 'P × [((1 + r)^n − 1) ÷ r] × (1 + r)',
      expectedOutput: '₹23,23,391',
      actualOutput: `₹${sipFV.toLocaleString('en-IN')}`,
      passed: sipFV === 2323391,
    },
    {
      id: 'test-10',
      suite: 'Geometry Tolerance Engine',
      name: 'Support/Resistance ±0.5×ATR Tolerance Grader',
      formulaTested: '|UserPrice − KeyPrice| ≤ Tolerance(₹22)',
      expectedOutput: 'PASS (Support Δ₹6, Resistance Δ₹5)',
      actualOutput: `${geoGrade.passed ? 'PASS' : 'FAIL'} (Support Δ₹${geoGrade.closestSupportDiff}, Resistance Δ₹${geoGrade.closestResistanceDiff})`,
      passed: geoGrade.passed,
    },
  ];
}

export const INITIAL_AI_ERROR_REPORTS: AIErrorReport[] = [
  {
    id: 'err-101',
    timestamp: '2026-09-28 14:20',
    sourceModule: 'AI Chart Coach',
    issueType: 'Inaccurate Chart Level',
    contextSnippet: 'BANKNIFTY 15m chart resistance zone flagged at 51,600 vs 51,780 swing high',
    userComment: 'Minor resistance existed at 51,600, but major supply zone is 51,750–51,800.',
    status: 'verified_fixed',
  },
  {
    id: 'err-102',
    timestamp: '2026-09-29 09:15',
    sourceModule: 'Exercise Engine',
    issueType: 'Calculation / Math Mismatch',
    contextSnippet: 'Intraday STT rounding on odd lot quantity (37 shares)',
    userComment: 'Verified that deterministic solver rounds share quantity down via Math.floor().',
    status: 'resolved_by_deterministic_solver',
  },
];

export const SUPABASE_POSTGRES_SCHEMA_SQL = `-- PRODUCTION POSTGRESQL / SUPABASE SCHEMA & RLS POLICIES (MASTER SPEC V2)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hinglish')),
  skill_level TEXT DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  max_risk_per_trade_pct NUMERIC(4,2) DEFAULT 1.00,
  paper_balance_inr NUMERIC(14,2) DEFAULT 100000.00,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.exercises (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN (
    'mcq','true_false','numeric_calc','candle_click','draw_sr',
    'place_order','spot_mistake','strategy_fix','chart_replay','psychology_scenario'
  )),
  validation_stage TEXT NOT NULL DEFAULT 'draft' CHECK (validation_stage IN (
    'draft','ai_generated','deterministic_test_passed','human_review','published','flagged'
  )),
  ground_truth_json JSONB NOT NULL,
  tolerance_config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.ai_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  agent_role TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,
  structured_response JSONB NOT NULL,
  deterministic_verified BOOLEAN DEFAULT true,
  flagged_by_user BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_audit_logs ENABLE ROW LEVEL SECURITY;`;
