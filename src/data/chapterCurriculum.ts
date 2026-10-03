import { ChapterDefinition } from '../types';

export const CHAPTER_CURRICULUM: ChapterDefinition[] = [
  {
    id: 'ch-01',
    chapterNumber: 1,
    stageCategory: 'Foundation',
    title: {
      en: 'Market Foundations',
      hinglish: 'Market Foundations (Share Bazaar Ki Buniyad)',
    },
    description: {
      en: 'Understand NSE/BSE exchanges, equities, indices (Nifty 50), buyers/sellers, and price discovery.',
      hinglish: 'NSE/BSE exchanges, equities, Nifty 50 index, buyers/sellers aur price discovery samjhein.',
    },
    iconName: 'Landmark',
    estimatedMinutes: 15,
    prerequisiteChapterIds: [],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-01-exchanges', title: { en: 'Exchanges & Indices (NSE/BSE)', hinglish: 'Exchanges Aur Indices (NSE/BSE)' }, isCritical: true },
      { id: 'c-01-bidask', title: { en: 'Buyers, Sellers & Price Formation', hinglish: 'Buyers, Sellers Aur Price Formation' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-01-1',
        title: { en: 'How NSE, BSE & Nifty 50 Work', hinglish: 'NSE, BSE Aur Nifty 50 Kaise Kaam Karte Hain' },
        durationMinutes: 5,
        conceptId: 'c-01-exchanges',
        conceptSummary: {
          en: 'NSE and BSE are SEBI-regulated electronic exchanges matching buy/sell orders. Nifty 50 tracks the top 50 Indian large-cap companies across 14 sectors.',
          hinglish: 'NSE aur BSE SEBI-regulated exchanges hain. Nifty 50 India ki top 50 large-cap companies ko track karta hai.',
        },
        visualExample: {
          en: 'Example: When RELIANCE or HDFCBANK moves +2%, Nifty 50 moves proportionally to their free-float market weight.',
          hinglish: 'Example: Jab RELIANCE ya HDFCBANK +2% badhta hai, toh Nifty 50 unke free-float weight ke hisaab se move karta hai.',
        },
        formulaOrRule: 'Market Cap = Current Share Price × Total Outstanding Shares',
        chartSymbol: 'NIFTY50',
        quickCheck: {
          question: {
            en: 'Which regulator oversees NSE, BSE, and broker margin protection rules in India?',
            hinglish: 'India mein NSE, BSE aur broker rules ko kaun regulate karta hai?',
          },
          options: [
            { en: 'SEBI (Securities and Exchange Board of India)', hinglish: 'SEBI (Securities and Exchange Board of India)' },
            { en: 'IRDAI', hinglish: 'IRDAI' },
            { en: 'TRAI', hinglish: 'TRAI' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'SEBI regulates Indian securities markets, exchanges, and investor protection.',
            hinglish: 'SEBI Indian stock market aur investor protection ko regulate karta hai.',
          },
        },
      },
      {
        id: 'l-01-2',
        title: { en: 'Buyers, Sellers & Order Book Price Discovery', hinglish: 'Buyers, Sellers Aur Price Discovery' },
        durationMinutes: 5,
        conceptId: 'c-01-bidask',
        conceptSummary: {
          en: 'Prices move when aggressive buyers lift the Ask (seller price) or aggressive sellers hit the Bid (buyer price).',
          hinglish: 'Price tab badhta hai jab buyers Ask price par buy karte hain, aur girta hai jab sellers Bid price par sell karte hain.',
        },
        visualExample: {
          en: 'TCS Best Bid: ₹3,850.00 (500 qty) | Best Ask: ₹3,850.50 (400 qty). Spread = ₹0.50.',
          hinglish: 'TCS Best Bid: ₹3,850.00 | Best Ask: ₹3,850.50. Bid-Ask Spread = ₹0.50.',
        },
        formulaOrRule: 'Bid-Ask Spread = Best Ask Price - Best Bid Price',
        chartSymbol: 'TCS',
        quickCheck: {
          question: {
            en: 'If Best Bid is ₹1,500 and Best Ask is ₹1,501, what is the Bid-Ask Spread?',
            hinglish: 'Agar Best Bid ₹1,500 aur Best Ask ₹1,501 hai, toh Spread kitna hai?',
          },
          options: [
            { en: '₹1.00', hinglish: '₹1.00' },
            { en: '₹1,500.50', hinglish: '₹1,500.50' },
            { en: '₹3,001.00', hinglish: '₹3,001.00' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Spread = Ask (₹1,501) - Bid (₹1,500) = ₹1.00.',
            hinglish: 'Spread = Ask (₹1,501) - Bid (₹1,500) = ₹1.00.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-01-1',
        title: { en: 'Calculate Bid-Ask Spread Cost on 200 Shares', hinglish: '200 Shares Par Bid-Ask Spread Cost Nikalein' },
        conceptId: 'c-01-bidask',
        type: 'numeric_calc',
        prompt: {
          en: 'INFY Best Bid is ₹1,620 and Best Ask is ₹1,621.50. If you buy 200 shares at Ask and immediately sell at Bid, what is your instant spread cost in ₹?',
          hinglish: 'INFY Bid ₹1,620 aur Ask ₹1,621.50 hai. 200 shares par spread cost (₹1.50 × 200) kitni hogi?',
        },
        hint: { en: 'Spread = 1621.50 - 1620 = ₹1.50 per share. Multiply by 200 shares.', hinglish: 'Spread ₹1.50 × 200 shares.' },
        expectedNumeric: 300,
        numericTolerance: 0,
        numericUnit: '₹',
        explanation: {
          en: 'Spread per share = ₹1.50. For 200 shares, instant spread friction = 200 × ₹1.50 = ₹300.',
          hinglish: '200 shares × ₹1.50 spread = ₹300 friction cost.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-01-1',
        conceptId: 'c-01-exchanges',
        isCriticalConcept: true,
        questionType: 'mcq',
        prompt: {
          en: 'What is the standard equity delivery settlement cycle on NSE/BSE in India?',
          hinglish: 'NSE/BSE par equity delivery settlement cycle kya hai?',
        },
        options: [
          { en: 'T+1 (Trade Day + 1 Business Day)', hinglish: 'T+1 (Trade Day + 1 Business Day)' },
          { en: 'T+7 Days', hinglish: 'T+7 Days' },
          { en: 'T+30 Days', hinglish: 'T+30 Days' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Indian exchanges operate on SEBI T+1 rolling settlement (with optional T+0 beta).',
          hinglish: 'India mein T+1 settlement cycle लागू hai.',
        },
      },
      {
        id: 'q-01-2',
        conceptId: 'c-01-bidask',
        isCriticalConcept: true,
        questionType: 'calculation',
        prompt: {
          en: 'A stock has Best Bid ₹840 and Best Ask ₹842. If you place a Market BUY order for 100 shares, what price will you pay and what is the total spread vs Bid?',
          hinglish: 'Bid ₹840 aur Ask ₹842 hai. 100 shares Market BUY karne par kis price par fill hoga aur total spread kitna hai?',
        },
        options: [
          { en: 'Fills at ₹842 (Ask); ₹200 spread cost across 100 shares', hinglish: '₹842 (Ask) par fill; 100 shares par ₹200 spread' },
          { en: 'Fills at ₹840 (Bid); ₹0 spread cost', hinglish: '₹840 (Bid) par fill; ₹0 spread' },
          { en: 'Fills at ₹800', hinglish: '₹800 par fill' },
        ],
        correctIndex: 0,
        deterministicFormulaNote: 'Spread Cost = (Ask - Bid) × Qty = (842 - 840) × 100 = ₹200',
        explanation: {
          en: 'Market Buy orders match against the lowest available Ask (₹842), costing ₹2 × 100 = ₹200 over the Bid.',
          hinglish: 'Market Buy order Ask (₹842) par match hota hai.',
        },
      },
    ],
  },
  {
    id: 'ch-02',
    chapterNumber: 2,
    stageCategory: 'Foundation',
    title: {
      en: 'Orders & Execution',
      hinglish: 'Orders & Execution (Market, Limit, SL & Charges)',
    },
    description: {
      en: 'Master Market, Limit, and Stop-Loss orders, slippage control, and NSE/BSE statutory transaction costs.',
      hinglish: 'Market, Limit, Stop-Loss orders, slippage aur NSE/BSE brokerage/STT charges samjhein.',
    },
    iconName: 'Sliders',
    estimatedMinutes: 18,
    prerequisiteChapterIds: ['ch-01'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-02-orders', title: { en: 'Market, Limit & Stop Orders', hinglish: 'Market, Limit Aur Stop Orders' }, isCritical: true },
      { id: 'c-02-costs', title: { en: 'Slippage & Indian Statutory Costs (STT/GST)', hinglish: 'Slippage Aur Indian Charges (STT/GST)' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-02-1',
        title: { en: 'Market vs Limit vs Stop-Loss (SL/SL-M) Orders', hinglish: 'Market vs Limit vs Stop-Loss Orders' },
        durationMinutes: 6,
        conceptId: 'c-02-orders',
        conceptSummary: {
          en: 'Market orders guarantee execution speed but not price. Limit orders guarantee your maximum buy (or minimum sell) price. Stop-Loss orders trigger when price breaches your invalidation level.',
          hinglish: 'Market order turant execute hota hai par price fix nahi hota. Limit order price control deta hai. Stop-Loss risk protect karta hai.',
        },
        visualExample: {
          en: 'Buying RELIANCE breakout at ₹2,960 with a Limit range ₹2,960–₹2,962 prevents runaway slippage during volatility.',
          hinglish: 'RELIANCE ₹2,960 par Limit order lagane se sudden spike mein galat price par buy nahi hota.',
        },
        formulaOrRule: 'Slippage = Actual Fill Price - Intended Order Price',
        chartSymbol: 'RELIANCE',
        quickCheck: {
          question: {
            en: 'Which order type protects you from paying more than ₹2,962 when entering a stock?',
            hinglish: 'Kaunsa order ensure karta hai ki aap ₹2,962 se upar buy na karein?',
          },
          options: [
            { en: 'Limit Buy Order at ₹2,962', hinglish: 'Limit Buy Order at ₹2,962' },
            { en: 'Market Buy Order', hinglish: 'Market Buy Order' },
            { en: 'Stop-Loss Sell Order', hinglish: 'Stop-Loss Sell Order' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'A Limit Buy Order caps the maximum execution price at your specified limit.',
            hinglish: 'Limit Buy Order aapka maximum buy price fix kar deta hai.',
          },
        },
      },
      {
        id: 'l-02-2',
        title: { en: 'NSE/BSE Transaction Costs: Brokerage, STT, GST & Stamp Duty', hinglish: 'NSE/BSE Charges: Brokerage, STT, GST Aur Stamp Duty' },
        durationMinutes: 6,
        conceptId: 'c-02-costs',
        conceptSummary: {
          en: 'Every Indian trade incurs Brokerage (capped at ₹20/order), STT (0.025% intraday sell / 0.1% delivery both sides), NSE Txn Charge, 18% GST, SEBI fee, and Stamp Duty.',
          hinglish: 'Har Indian trade par Brokerage (max ₹20/order), STT, Exchange charge, 18% GST, SEBI fee aur Stamp Duty lagti hai.',
        },
        visualExample: {
          en: 'Overtrading 15 scalps/day can consume 25%–40% of gross profits in statutory taxes and brokerage.',
          hinglish: 'Din mein 15-20 bina soche trades lene se bada hissa STT aur brokerage mein chala jata hai.',
        },
        formulaOrRule: 'Net P&L = Gross P&L - (Brokerage + STT + Exchange Levy + GST + SEBI + Stamp Duty)',
        quickCheck: {
          question: {
            en: 'On an NSE Equity Intraday trade, on which leg is the 0.025% STT charged?',
            hinglish: 'NSE Intraday equity trade mein 0.025% STT kis side par lagta hai?',
          },
          options: [
            { en: 'Only on the Sell side turnover', hinglish: 'Sirf Sell side turnover par' },
            { en: 'On both Buy and Sell sides at 1%', hinglish: 'Buy aur Sell dono par 1%' },
            { en: 'STT does not exist in India', hinglish: 'India mein STT nahi lagta' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Intraday equity STT (0.025%) is levied on the sell-side turnover.',
            hinglish: 'Intraday equity mein 0.025% STT sirf sell side par lagta hai.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-02-1',
        title: { en: 'Net P&L After Slippage & ₹65 Statutory Charges', hinglish: 'Slippage Aur ₹65 Charges Ke Baad Net P&L' },
        conceptId: 'c-02-costs',
        type: 'numeric_calc',
        prompt: {
          en: 'You buy 100 shares at ₹500 and sell at ₹512 (Gross Profit = ₹1,200). Total NSE brokerage + STT + GST is ₹65. What is your exact Net Profit in ₹?',
          hinglish: '100 shares ₹500 par buy aur ₹512 par sell kiye (Gross Profit = ₹1,200). Total charges ₹65 hain. Net Profit (₹) batayein.',
        },
        hint: { en: 'Subtract ₹65 total charges from ₹1,200 gross profit.', hinglish: '1200 - 65 karein.' },
        expectedNumeric: 1135,
        numericTolerance: 0,
        numericUnit: '₹',
        explanation: {
          en: 'Net Profit = ₹1,200 Gross - ₹65 Statutory Charges = ₹1,135.',
          hinglish: 'Net Profit = ₹1,200 - ₹65 = ₹1,135.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-02-1',
        conceptId: 'c-02-orders',
        isCriticalConcept: true,
        questionType: 'scenario',
        prompt: {
          en: 'You are long HDFCBANK at ₹1,640 and want automatic protection if price drops to ₹1,620. Which order must you place?',
          hinglish: 'Aapne HDFCBANK ₹1,640 par buy kiya hai aur ₹1,620 ke neeche protection chahte hain. Kaunsa order lagayenge?',
        },
        options: [
          { en: 'Stop-Loss (SL / SL-M) Sell Order triggered at ₹1,620', hinglish: '₹1,620 trigger par Stop-Loss (SL) Sell Order' },
          { en: 'Limit Buy Order at ₹1,620', hinglish: '₹1,620 par Limit Buy Order' },
          { en: 'Market Buy Order', hinglish: 'Market Buy Order' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'A Stop-Loss Sell order at ₹1,620 automatically exits your long position if support breaks.',
          hinglish: 'Stop-Loss Sell order ₹1,620 tootne par aapko bade loss se bachata hai.',
        },
      },
      {
        id: 'q-02-2',
        conceptId: 'c-02-costs',
        isCriticalConcept: true,
        questionType: 'calculation',
        prompt: {
          en: 'If a trader makes ₹400 gross profit on a scalp, but pays ₹110 in brokerage, STT, GST, and slippage, what percentage of gross profit was lost to friction?',
          hinglish: 'Agar ₹400 gross profit mein se ₹110 charges aur slippage mein gaye, toh kitna % profit charges mein gaya?',
        },
        options: [
          { en: '27.5% lost to transaction friction', hinglish: '27.5% transaction charges mein gaya' },
          { en: '2.5% lost', hinglish: '2.5% gaya' },
          { en: '0% lost', hinglish: '0% gaya' },
        ],
        correctIndex: 0,
        deterministicFormulaNote: '(110 / 400) × 100 = 27.5%',
        explanation: {
          en: '₹110 / ₹400 = 27.5% fee drag, demonstrating why small R:R scalps fail without cost awareness.',
          hinglish: '110 / 400 = 27.5% charges drag.',
        },
      },
    ],
  },
  {
    id: 'ch-03',
    chapterNumber: 3,
    stageCategory: 'Foundation',
    title: {
      en: 'Reading Charts',
      hinglish: 'Reading Charts (OHLC, Candlesticks & Volume)',
    },
    description: {
      en: 'Read OHLC price action, bullish/bearish candlestick anatomy, wicks, timeframes, and volume confirmation.',
      hinglish: 'OHLC, Green/Red candlestick body aur wick, timeframes aur volume read karna seekhein.',
    },
    iconName: 'BarChart2',
    estimatedMinutes: 18,
    prerequisiteChapterIds: ['ch-02'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-03-ohlc', title: { en: 'OHLC & Candlestick Anatomy', hinglish: 'OHLC Aur Candlestick Anatomy' }, isCritical: true },
      { id: 'c-03-volume', title: { en: 'Volume & Timeframe Alignment', hinglish: 'Volume Aur Timeframe Alignment' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-03-1',
        title: { en: 'OHLC & Candlestick Anatomy (Green vs Red)', hinglish: 'OHLC Aur Candlestick Anatomy (Green vs Red)' },
        durationMinutes: 6,
        conceptId: 'c-03-ohlc',
        conceptSummary: {
          en: 'Every candle shows Open, High, Low, and Close. Close > Open creates a Bullish Green (#22C55E) candle; Close < Open creates a Bearish Red (#EF4444) candle.',
          hinglish: 'Har candle Open, High, Low, Close dikhati hai. Close > Open = Green Bullish (#22C55E); Close < Open = Red Bearish (#EF4444).',
        },
        visualExample: {
          en: 'A long lower wick near support shows sellers pushed price down intra-bar, but buyers stepped in aggressively before the close.',
          hinglish: 'Support par lamba lower wick dikhata hai ki buyers ne neeche se strong buying ki hai.',
        },
        formulaOrRule: 'Candle Range = High - Low | Body Size = |Close - Open|',
        chartSymbol: 'RELIANCE',
        quickCheck: {
          question: {
            en: 'A candle opens at ₹2,920, drops to ₹2,900, rallies to ₹2,955, and closes at ₹2,950. What color is it and what is its total range?',
            hinglish: 'Open ₹2,920, Low ₹2,900, High ₹2,955, Close ₹2,950. Candle ka color aur range kya hai?',
          },
          options: [
            { en: 'Bullish Green (#22C55E); Range = ₹55', hinglish: 'Bullish Green (#22C55E); Range = ₹55' },
            { en: 'Bearish Red (#EF4444); Range = ₹30', hinglish: 'Bearish Red (#EF4444); Range = ₹30' },
            { en: 'Neutral; Range = ₹10', hinglish: 'Neutral; Range = ₹10' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Close (₹2,950) > Open (₹2,920) = Bullish Green. Range = High (₹2,955) - Low (₹2,900) = ₹55.',
            hinglish: 'Close > Open isliye Green candle, aur Range = 2955 - 2900 = ₹55.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-03-1',
        title: { en: 'Calculate Candlestick Body-to-Range Ratio', hinglish: 'Candlestick Body Range Calculate Karein' },
        conceptId: 'c-03-ohlc',
        type: 'numeric_calc',
        prompt: {
          en: 'NIFTY 50 daily candle has Open = 22,400, Low = 22,380, High = 22,530, Close = 22,520. What is the real body size (|Close - Open|) in points?',
          hinglish: 'NIFTY candle Open = 22,400 aur Close = 22,520 hai. Candle ki real body kitne points ki hai?',
        },
        hint: { en: 'Body Size = |22,520 - 22,400|.', hinglish: '22520 - 22400 karein.' },
        expectedNumeric: 120,
        numericTolerance: 0,
        numericUnit: 'pts',
        explanation: {
          en: 'Real Body = 22,520 - 22,400 = 120 points bullish expansion.',
          hinglish: '22,520 - 22,400 = 120 points.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-03-1',
        conceptId: 'c-03-ohlc',
        isCriticalConcept: true,
        questionType: 'chart_interpretation',
        prompt: {
          en: 'What does a candle with a tiny body at the top of its range and a very long lower shadow at a key support zone indicate?',
          hinglish: 'Support zone par lambi lower wick aur upar choti body wali candle kya dikhati hai?',
        },
        options: [
          { en: 'Strong buyer rejection of lower prices (demand absorption)', hinglish: 'Neeche ke levels par strong buyer demand aur rejection' },
          { en: 'Guaranteed 100% profit without stop-loss', hinglish: 'Bina stop-loss ke 100% profit' },
          { en: 'Zero market participation', hinglish: 'Zero participation' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Long lower wicks at support indicate sellers were absorbed by institutional demand.',
          hinglish: 'Lambi lower wick dikhati hai ki buyers ne selling ko absorb kar liya.',
        },
      },
      {
        id: 'q-03-2',
        conceptId: 'c-03-volume',
        isCriticalConcept: true,
        questionType: 'mcq',
        prompt: {
          en: 'Why is a resistance breakout on 2.5x average volume more reliable than a breakout on 0.4x volume?',
          hinglish: '2.5x volume wala breakout 0.4x low volume breakout se zyada reliable kyun hota hai?',
        },
        options: [
          { en: 'High volume confirms institutional participation and conviction behind the price move', hinglish: 'High volume bade institutions ki भागीदारी confirm karta hai' },
          { en: 'Volume has no relation to liquidity', hinglish: 'Volume ka koi matlab nahi hota' },
          { en: 'Low volume means zero risk', hinglish: 'Low volume ka matlab zero risk hai' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Volume measures participation; breakouts without volume frequently fail as bull traps.',
          hinglish: 'High volume breakout institutional commitment dikhata hai.',
        },
      },
    ],
  },
  {
    id: 'ch-04',
    chapterNumber: 4,
    stageCategory: 'Foundation',
    title: {
      en: 'Market Structure',
      hinglish: 'Market Structure (HH/HL, LH/LL & Ranges)',
    },
    description: {
      en: 'Identify Higher Highs/Higher Lows (uptrend), Lower Highs/Lower Lows (downtrend), and consolidation ranges.',
      hinglish: 'Higher High/Higher Low (uptrend), Lower High/Lower Low (downtrend) aur sideways range pehchanein.',
    },
    iconName: 'TrendingUp',
    estimatedMinutes: 20,
    prerequisiteChapterIds: ['ch-03'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-04-swings', title: { en: 'HH/HL Uptrend vs LH/LL Downtrend', hinglish: 'HH/HL Uptrend vs LH/LL Downtrend' }, isCritical: true },
      { id: 'c-04-bos', title: { en: 'Structure Break & Invalidation', hinglish: 'Structure Break Aur Invalidation' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-04-1',
        title: { en: 'Swing Highs, Swing Lows & Trend Identification', hinglish: 'Swing Highs, Swing Lows Aur Trend Pehchanna' },
        durationMinutes: 7,
        conceptId: 'c-04-swings',
        conceptSummary: {
          en: 'An uptrend is a sequence of Higher Highs (HH) and Higher Lows (HL). It remains intact until price closes decisively below the most recent Higher Low.',
          hinglish: 'Uptrend mein price Higher High (HH) aur Higher Low (HL) banata hai. Jab tak recent Higher Low hold karta hai, trend bullish rehta hai.',
        },
        visualExample: {
          en: 'NIFTY swings: 22,100 (Low) → 22,400 (High) → 22,220 (Higher Low) → 22,560 (Higher High).',
          hinglish: 'NIFTY swings: 22,100 → 22,400 → 22,220 (HL) → 22,560 (HH).',
        },
        chartSymbol: 'NIFTY50',
        quickCheck: {
          question: {
            en: 'In an established HH + HL uptrend, where is the structural invalidation level for a pullback long trade?',
            hinglish: 'HH + HL uptrend mein pullback buy trade ka structural stop-loss kahan hona chahiye?',
          },
          options: [
            { en: 'Just below the most recent defended Higher Low (HL)', hinglish: 'Recent Higher Low (HL) ke thoda neeche' },
            { en: 'At a random ₹10 distance regardless of chart structure', hinglish: 'Bina chart dekhe random ₹10 neeche' },
            { en: 'No stop-loss needed in an uptrend', hinglish: 'Uptrend mein stop-loss ki zaroorat nahi' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'If price breaks the prior Higher Low, the HH/HL sequence is invalidated.',
            hinglish: 'Higher Low tootne par uptrend structure invalidate ho jata hai.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-04-1',
        title: { en: 'Identify Structural Stop Distance Below Higher Low', hinglish: 'Higher Low Ke Neeche Stop Distance Nikalein' },
        conceptId: 'c-04-bos',
        type: 'numeric_calc',
        prompt: {
          en: 'Stock forms a Higher Low at ₹1,420 and triggers an entry at ₹1,445. You place your stop ₹5 below the Higher Low (at ₹1,415). What is your per-share risk in ₹?',
          hinglish: 'Entry ₹1,445 hai aur Stop-Loss Higher Low (₹1,420) se ₹5 neeche (₹1,415) hai. Per-share risk kitna hai?',
        },
        hint: { en: 'Entry (1445) - Stop (1415).', hinglish: '1445 - 1415 karein.' },
        expectedNumeric: 30,
        numericTolerance: 0,
        numericUnit: '₹',
        explanation: {
          en: 'Per-share structural risk = ₹1,445 - ₹1,415 = ₹30.',
          hinglish: 'Per-share risk = 1445 - 1415 = ₹30.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-04-1',
        conceptId: 'c-04-swings',
        isCriticalConcept: true,
        questionType: 'chart_interpretation',
        prompt: {
          en: 'A stock prints swings: ₹500 → ₹460 → ₹485 → ₹440 → ₹465 → ₹420. What is the market structure?',
          hinglish: 'Swings: ₹500 → ₹460 → ₹485 → ₹440 → ₹465 → ₹420. Yeh kaunsa structure hai?',
        },
        options: [
          { en: 'Downtrend (Lower Highs and Lower Lows)', hinglish: 'Downtrend (Lower Highs aur Lower Lows)' },
          { en: 'Uptrend (Higher Highs and Higher Lows)', hinglish: 'Uptrend (Higher Highs aur Higher Lows)' },
          { en: 'Flat zero-volatility line', hinglish: 'Flat line' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Highs (500 → 485 → 465) and Lows (460 → 440 → 420) are both stepping lower = Downtrend.',
          hinglish: 'Highs aur Lows dono neeche ja rahe hain = Downtrend.',
        },
      },
    ],
  },
  {
    id: 'ch-05',
    chapterNumber: 5,
    stageCategory: 'Core Trading',
    title: { en: 'Trend & Price Action', hinglish: 'Trend & Price Action (Pullbacks & Breakouts)' },
    description: {
      en: 'Distinguish impulse momentum waves from corrective pullbacks and high-conviction breakouts.',
      hinglish: 'Impulse moves, healthy pullbacks aur breakout price action mein farq samjhein.',
    },
    iconName: 'Activity',
    estimatedMinutes: 20,
    prerequisiteChapterIds: ['ch-04'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-05-pullback', title: { en: 'Impulse vs Pullback Quality', hinglish: 'Impulse vs Pullback Quality' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-05-1',
        title: { en: 'Trading Pullbacks vs Chasing Extended Breakouts', hinglish: 'Pullback Entry vs Chasing Breakouts' },
        durationMinutes: 7,
        conceptId: 'c-05-pullback',
        conceptSummary: {
          en: 'Entering on a controlled low-volume pullback near value offers a tighter stop-loss and superior Risk:Reward compared to chasing an extended candle far from support.',
          hinglish: 'Extended green candle ko chase karne ke bajaye low-volume pullback par entry lene se stop-loss chota aur R:R behtar milta hai.',
        },
        visualExample: {
          en: 'RELIANCE rallies ₹2,900 → ₹2,980, then pulls back calmly to ₹2,940 support.',
          hinglish: 'RELIANCE ₹2,900 se ₹2,980 gaya aur ₹2,940 support par retest kiya.',
        },
        chartSymbol: 'RELIANCE',
        quickCheck: {
          question: {
            en: 'Why does chasing a candle after 5 consecutive huge green bars hurt your expectancy?',
            hinglish: 'Lagatar 5 badi green candles ke baad top par buy karne se kya nuksan hota hai?',
          },
          options: [
            { en: 'Your distance to structural stop-loss becomes huge, destroying Risk:Reward', hinglish: 'Structural stop-loss bahut door ho jata hai aur R:R kharab ho jata hai' },
            { en: 'It guarantees a 10R win', hinglish: 'Yeh 10R win guarantee karta hai' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Extended entries widen your stop distance and reduce reward-to-risk.',
            hinglish: 'Top par chase karne se stop bada aur reward chota ho jata hai.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-05-1',
        title: { en: 'Compare R:R on Pullback Entry vs Extended Chase Entry', hinglish: 'Pullback Entry vs Chase Entry R:R Compare Karein' },
        conceptId: 'c-05-pullback',
        type: 'numeric_calc',
        prompt: {
          en: 'Support is ₹1,000 and Target is ₹1,090. If you enter on a pullback at ₹1,020 with Stop at ₹995 (Risk = ₹25, Reward = ₹70), what is your Reward:Risk ratio?',
          hinglish: 'Entry ₹1,020, Stop ₹995 (Risk ₹25) aur Target ₹1,090 (Reward ₹70) hai. R:R ratio (70 / 25) kitna hai?',
        },
        hint: { en: 'Divide 70 by 25.', hinglish: '70 / 25 karein.' },
        expectedNumeric: 2.8,
        numericTolerance: 0.05,
        numericUnit: 'R',
        explanation: {
          en: 'Reward (₹70) / Risk (₹25) = 2.8R.',
          hinglish: '70 / 25 = 2.8R.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-05-1',
        conceptId: 'c-05-pullback',
        isCriticalConcept: true,
        questionType: 'scenario',
        prompt: {
          en: 'During a healthy bullish pullback in an uptrend, how should volume typically behave?',
          hinglish: 'Uptrend ke healthy pullback mein volume kaisa hona chahiye?',
        },
        options: [
          { en: 'Volume contracts during the pullback and expands when the uptrend resumes', hinglish: 'Pullback mein volume kam hota hai aur bounce par badhta hai' },
          { en: 'Panic selling volume hits 5x average on every red bar', hinglish: 'Har red candle par 5x panic selling hoti hai' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Low pullback volume shows profit-taking rather than institutional distribution.',
          hinglish: 'Low volume pullback dikhata hai ki bade sellers active nahi hain.',
        },
      },
    ],
  },
  {
    id: 'ch-06',
    chapterNumber: 6,
    stageCategory: 'Core Trading',
    title: { en: 'Support & Resistance', hinglish: 'Support & Resistance (Zones, Retests & Traps)' },
    description: {
      en: 'Treat Support & Resistance as ATR-based zones, trade role-reversal retests, and spot false breakouts.',
      hinglish: 'Support/Resistance ko zone ki tarah draw karein, break-and-retest aur false breakout pehchanein.',
    },
    iconName: 'Layers',
    estimatedMinutes: 20,
    prerequisiteChapterIds: ['ch-05'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-06-zones', title: { en: 'Support/Resistance Zones & Role Reversal', hinglish: 'S/R Zones Aur Role Reversal' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-06-1',
        title: { en: 'Why Support & Resistance Are Zones (±0.5×ATR), Not Exact Lines', hinglish: 'Support & Resistance Zones Kyun Hote Hain' },
        durationMinutes: 7,
        conceptId: 'c-06-zones',
        conceptSummary: {
          en: 'Institutional orders cluster across a price band (±0.5×ATR). When resistance breaks on volume, it often flips into new support on a retest.',
          hinglish: 'Institutional orders ek zone (±0.5×ATR) mein hote hain. Resistance tootne ke baad retest par naya Support ban jata hai.',
        },
        visualExample: {
          en: 'RELIANCE breaks ₹2,955 ceiling, rallies to ₹2,985, and holds ₹2,952–₹2,958 as new support.',
          hinglish: 'RELIANCE ₹2,955 todne ke baad wapas ₹2,955 par support leta hai.',
        },
        chartSymbol: 'RELIANCE',
        quickCheck: {
          question: {
            en: 'When a major resistance zone at ₹1,800 is broken decisively with high volume, what does the ₹1,800 zone typically become on a pullback?',
            hinglish: 'Jab ₹1,800 ka resistance high volume ke saath break hota hai, toh pullback par ₹1,800 kya kaam karta hai?',
          },
          options: [
            { en: 'Potential new Support zone (Polarity / Role Reversal)', hinglish: 'Naya Support zone (Role Reversal)' },
            { en: 'Guaranteed zero-risk zone', hinglish: 'Zero-risk zone' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Broken resistance frequently acts as support when retested from above.',
            hinglish: 'Toota hua resistance retest par support ban sakta hai.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-06-1',
        title: { en: 'Calculate ATR-Padded Stop Below Support Zone', hinglish: 'Support Zone Ke Neeche ATR Buffer Stop Nikalein' },
        conceptId: 'c-06-zones',
        type: 'numeric_calc',
        prompt: {
          en: 'Support zone low is ₹2,910 and 14-period ATR is ₹20. Using a 0.5 × ATR buffer below support, at what price should your stop-loss be placed?',
          hinglish: 'Support low ₹2,910 hai aur ATR ₹20 hai. Support se 0.5 × ATR (₹10) neeche stop-loss price kya hoga?',
        },
        hint: { en: '2910 - (0.5 × 20) = 2910 - 10.', hinglish: '2910 - 10 karein.' },
        expectedNumeric: 2900,
        numericTolerance: 0,
        numericUnit: '₹',
        explanation: {
          en: 'Stop Price = ₹2,910 - (0.5 × ₹20) = ₹2,900, protecting you from normal wick noise.',
          hinglish: 'Stop Price = 2910 - 10 = ₹2,900.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-06-1',
        conceptId: 'c-06-zones',
        isCriticalConcept: true,
        questionType: 'scenario',
        prompt: {
          en: 'Price pokes ₹8 above ₹2,500 resistance on low volume and immediately closes back inside the range at ₹2,482. What is this pattern called?',
          hinglish: 'Price low volume par ₹2,500 ke upar ja kar turant ₹2,482 par wapas range ke andar close ho gaya. Ise kya kehte hain?',
        },
        options: [
          { en: 'False Breakout / Bull Trap (Liquidity Sweep)', hinglish: 'False Breakout / Bull Trap' },
          { en: 'Confirmed Institutional Breakout', hinglish: 'Confirmed Breakout' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Failure to close above resistance with low volume is a classic false breakout.',
          hinglish: 'Resistance ke upar टिक na pana False Breakout (Bull Trap) kehlata hai.',
        },
      },
    ],
  },
  {
    id: 'ch-07',
    chapterNumber: 7,
    stageCategory: 'Core Trading',
    title: { en: 'Technical Indicators', hinglish: 'Technical Indicators (EMA, VWAP, RSI & Limits)' },
    description: {
      en: 'Use 20 EMA, VWAP, RSI, and ATR as secondary filters—understanding indicator lag and regime limits.',
      hinglish: '20 EMA, VWAP, RSI aur ATR ko price structure ke saath secondary filter ki tarah use karein.',
    },
    iconName: 'Cpu',
    estimatedMinutes: 20,
    prerequisiteChapterIds: ['ch-06'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-07-indicators', title: { en: 'EMA, VWAP, RSI & Indicator Limitations', hinglish: 'EMA, VWAP, RSI Aur Indicator Limitations' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-07-1',
        title: { en: 'Why Indicators Lag Price & How to Avoid Multicollinearity', hinglish: 'Indicators Price Ke Peeche Kyun Chalte Hain' },
        durationMinutes: 7,
        conceptId: 'c-07-indicators',
        conceptSummary: {
          en: 'Moving averages and oscillators are mathematical derivatives of past prices. Combine at most 1 trend filter (e.g., 20 EMA), 1 institutional benchmark (VWAP), and 1 volatility measure (ATR).',
          hinglish: 'Indicators past price se bante hain. Chart par 5-6 momentum indicators lagane se confusion badhta hai.',
        },
        visualExample: {
          en: 'In a strong trend, RSI can stay above 70 for weeks—shorting solely because RSI > 70 fights the dominant trend.',
          hinglish: 'Strong uptrend mein RSI hafton tak 70 ke upar reh sakta hai; sirf RSI dekh kar short karna galti hai.',
        },
        quickCheck: {
          question: {
            en: 'Why is shorting a strong uptrend solely because RSI reached 72 a common beginner mistake?',
            hinglish: 'Strong uptrend mein sirf RSI 72 dekh kar short karna galti kyun hai?',
          },
          options: [
            { en: 'Oscillators can remain overbought for extended periods during strong momentum trends', hinglish: 'Strong trend mein RSI kafi samay tak 70+ reh sakta hai' },
            { en: 'RSI 72 guarantees an instant 20% crash', hinglish: 'RSI 72 ka matlab pakka crash hai' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Momentum indicators stay elevated in strong trends; structure breaks must confirm reversals.',
            hinglish: 'Trend ke khilaf bina structure break ke trade nahi lena chahiye.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-07-1',
        title: { en: 'Intraday VWAP Institutional Filter Check', hinglish: 'Intraday VWAP Institutional Filter Check' },
        conceptId: 'c-07-indicators',
        type: 'scenario_decision',
        prompt: {
          en: 'Stock is trading at ₹1,540, well above rising intraday VWAP (₹1,518) and 20 EMA (₹1,525). Which directional bias aligns with institutional flow?',
          hinglish: 'Stock ₹1,540 par hai, rising VWAP (₹1,518) aur 20 EMA (₹1,525) ke upar. Institutional bias kis taraf hai?',
        },
        hint: { en: 'Price > rising VWAP and 20 EMA favors long pullback setups.', hinglish: 'Price VWAP aur 20 EMA ke upar hai toh Bullish/Long bias hai.' },
        options: [
          { en: 'Bullish / Long pullback bias while above VWAP & last Higher Low', hinglish: 'Bullish / Long pullback bias jab tak VWAP hold kare' },
          { en: 'Blindly Short with no stop-loss', hinglish: 'Bina stop-loss ke blind short' },
        ],
        correctOptionIndex: 0,
        explanation: {
          en: 'Trading above rising VWAP indicates average institutional volume is in profit on the long side.',
          hinglish: 'Rising VWAP ke upar price bullish institutional support dikhata hai.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-07-1',
        conceptId: 'c-07-indicators',
        isCriticalConcept: true,
        questionType: 'mcq',
        prompt: {
          en: 'What is the primary purpose of Average True Range (ATR) in a rules-based trading plan?',
          hinglish: 'Trading plan mein ATR (Average True Range) ka sabse bada use kya hai?',
        },
        options: [
          { en: 'Measuring volatility to set noise-adjusted stop-loss distances and position sizes', hinglish: 'Volatility naap kar sahi stop-loss distance aur position size tay karna' },
          { en: 'Predicting company dividend announcements', hinglish: 'Company dividend predict karna' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'ATR quantifies average bar range in ₹ so stops are placed outside normal noise.',
          hinglish: 'ATR batata hai ki stock average kitne ₹ move karta hai.',
        },
      },
    ],
  },
  {
    id: 'ch-08',
    chapterNumber: 8,
    stageCategory: 'Core Trading',
    title: { en: 'Trading Setups', hinglish: 'Trading Setups (Entry, Invalidation & Quality)' },
    description: {
      en: 'Combine structure, trigger, invalidation stop-loss, and target into a complete A+ setup checklist.',
      hinglish: 'Structure, entry trigger, invalidation stop-loss aur target mila kar complete setup banayein.',
    },
    iconName: 'Crosshair',
    estimatedMinutes: 22,
    prerequisiteChapterIds: ['ch-07'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-08-setup', title: { en: 'Setup Confluence & Invalidation Level', hinglish: 'Setup Confluence Aur Invalidation Level' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-08-1',
        title: { en: 'The 4 Pillars of Every Valid Trade Setup', hinglish: 'Har Valid Trade Setup Ke 4 Pillars' },
        durationMinutes: 8,
        conceptId: 'c-08-setup',
        conceptSummary: {
          en: 'A valid setup requires: (1) Context/Regime, (2) Location/Zone, (3) Objective Trigger, and (4) Clear Invalidation (Stop-Loss) yielding >= 1:2 R:R.',
          hinglish: 'Valid setup ke 4 hisse hain: (1) Trend Context, (2) Support/Resistance Zone, (3) Entry Trigger, (4) Clear Stop-Loss aur >= 1:2 R:R.',
        },
        visualExample: {
          en: 'If Entry is ₹1,200, Stop is ₹1,180 (Risk ₹20), and nearest Resistance is ₹1,215 (Reward ₹15 = 0.75R), you PASS on the trade.',
          hinglish: 'Agar Risk ₹20 hai aur samne Resistance ₹15 door hai (0.75R), toh trade skip karna hi sahi decision hai.',
        },
        quickCheck: {
          question: {
            en: 'If a bullish candlestick appears right underneath a major multi-month resistance zone with only 0.6R room to target, what should you do?',
            hinglish: 'Agar major resistance ke bilkul neeche buy signal aaye jahan sirf 0.6R space bacha ho, toh kya karna chahiye?',
          },
          options: [
            { en: 'Skip the trade — insufficient reward-to-risk before overhead supply', hinglish: 'Trade skip karein — samne resistance hai aur R:R kharab hai' },
            { en: 'Double your position size and remove the stop-loss', hinglish: 'Position double karein aur stop-loss hata dein' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Buying directly into overhead resistance with < 1R space violates positive expectancy.',
            hinglish: 'Resistance ke bilkul neeche 0.6R ke liye buy karna expectancy ke khilaf hai.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-08-1',
        title: { en: 'Evaluate Setup Reward-to-Risk Qualification', hinglish: 'Setup R:R Qualification Check Karein' },
        conceptId: 'c-08-setup',
        type: 'numeric_calc',
        prompt: {
          en: 'Setup Entry = ₹2,400, Structural Stop = ₹2,360 (Risk = ₹40), First Target Zone = ₹2,500 (Reward = ₹100). Calculate the R:R ratio.',
          hinglish: 'Entry ₹2,400, Stop ₹2,360 (Risk ₹40), Target ₹2,500 (Reward ₹100). R:R ratio (100 / 40) kitna hai?',
        },
        hint: { en: '100 / 40.', hinglish: '100 / 40 karein.' },
        expectedNumeric: 2.5,
        numericTolerance: 0.05,
        numericUnit: 'R',
        explanation: {
          en: 'Reward (₹100) / Risk (₹40) = 2.5R (Qualifies as >= 2.0R setup).',
          hinglish: '100 / 40 = 2.5R.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-08-1',
        conceptId: 'c-08-setup',
        isCriticalConcept: true,
        questionType: 'scenario',
        prompt: {
          en: 'What defines the exact price where your trade thesis is proven wrong?',
          hinglish: 'Woh exact price level kaunsa hota hai jahan aapka trade idea galat sabit ho jata hai?',
        },
        options: [
          { en: 'Structural Invalidation Level (where your Stop-Loss is placed)', hinglish: 'Structural Invalidation Level (jahan Stop-Loss lagta hai)' },
          { en: 'Your profit target level', hinglish: 'Profit target level' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Invalidation is the structural level where the setup logic no longer holds.',
          hinglish: 'Invalidation level par rukna hi capital bachaata hai.',
        },
      },
    ],
  },
  {
    id: 'ch-09',
    chapterNumber: 9,
    stageCategory: 'Risk',
    title: { en: 'Risk Management', hinglish: 'Risk Management (1% Rule, Position Sizing & Drawdown)' },
    description: {
      en: 'Master the 1% risk rule, deterministic position sizing, risk/reward math, and drawdown survival.',
      hinglish: '1% risk rule, exact position sizing formula, R:R math aur drawdown recovery master karein.',
    },
    iconName: 'Shield',
    estimatedMinutes: 25,
    prerequisiteChapterIds: ['ch-08'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-09-sizing', title: { en: 'Position Sizing Formula', hinglish: 'Position Sizing Formula' }, isCritical: true },
      { id: 'c-09-rr', title: { en: 'Risk/Reward & Breakeven Win Rate', hinglish: 'Risk/Reward Aur Breakeven Win Rate' }, isCritical: true },
      { id: 'c-09-drawdown', title: { en: 'Drawdown Recovery Asymmetry', hinglish: 'Drawdown Recovery Math' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-09-1',
        title: { en: 'Deterministic Position Sizing & The 1% Capital Rule', hinglish: 'Position Sizing Formula Aur 1% Capital Rule' },
        durationMinutes: 8,
        conceptId: 'c-09-sizing',
        conceptSummary: {
          en: 'Never risk more than 1% of total capital on a single trade. Shares = floor((Capital × Risk%) / |Entry - Stop|). Always round DOWN so rupee risk never exceeds your cap.',
          hinglish: 'Ek trade par capital ka max 1% risk lein. Shares = floor((Capital × Risk%) / |Entry - Stop|).',
        },
        visualExample: {
          en: 'Capital ₹2,00,000, 1% Risk = ₹2,000. Entry ₹2,950, Stop ₹2,910 (Stop = ₹40). Shares = 2000 / 40 = 50 shares.',
          hinglish: 'Capital ₹2,00,000, 1% Risk = ₹2,000. Stop ₹40 hai toh 2000 / 40 = 50 shares.',
        },
        formulaOrRule: 'Shares = floor((Account Capital × Risk%) / |Entry Price - Stop Loss|)',
        quickCheck: {
          question: {
            en: 'With ₹1,00,000 capital and 1% max risk (₹1,000), if your stop-loss is ₹25 away from entry, how many shares can you buy?',
            hinglish: '₹1,00,000 capital par 1% risk (₹1,000) aur ₹25 stop distance ke saath kitne shares buy karenge?',
          },
          options: [
            { en: '40 shares', hinglish: '40 shares' },
            { en: '400 shares', hinglish: '400 shares' },
            { en: '100 shares', hinglish: '100 shares' },
          ],
          correctIndex: 0,
          explanation: {
            en: '₹1,000 max risk / ₹25 stop distance = 40 shares.',
            hinglish: '1000 / 25 = 40 shares.',
          },
        },
      },
      {
        id: 'l-09-2',
        title: { en: 'Drawdown Recovery Math & Max Daily Loss Circuit Breaker', hinglish: 'Drawdown Recovery Math Aur Daily Loss Limit' },
        durationMinutes: 8,
        conceptId: 'c-09-drawdown',
        conceptSummary: {
          en: 'Losses compound asymmetrically: a 50% loss requires a +100% gain just to break even. A 2%–3% daily loss limit stops emotional tilt before deep drawdowns happen.',
          hinglish: '50% capital loss recover karne ke liye +100% return chahiye hota hai. Isliye daily loss limit zaroori hai.',
        },
        visualExample: {
          en: '10% loss needs +11.1% gain; 25% loss needs +33.3% gain; 50% loss needs +100% gain.',
          hinglish: '10% loss = +11.1% recovery; 50% loss = +100% recovery.',
        },
        formulaOrRule: 'Required Recovery % = ((1 / (1 - DrawdownFraction)) - 1) × 100',
        quickCheck: {
          question: {
            en: 'If a trader loses 50% of their ₹2,00,000 account (down to ₹1,00,000), what percentage gain is required on the remaining ₹1,00,000 to get back to ₹2,00,000?',
            hinglish: 'Agar ₹2,00,000 mein se 50% loss ho jaye (₹1,00,000 bache), toh wapas ₹2,00,000 par aane ke liye kitna % return chahiye?',
          },
          options: [
            { en: '+100% gain', hinglish: '+100% gain' },
            { en: '+50% gain', hinglish: '+50% gain' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'From ₹1,00,000 to ₹2,00,000 requires doubling the remaining capital (+100%).',
            hinglish: '₹1L se ₹2L wapas banane ke liye +100% gain chahiye.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-09-1',
        title: { en: 'Calculate Safe Floored Position Size', hinglish: 'Safe Position Size Calculate Karein' },
        conceptId: 'c-09-sizing',
        type: 'numeric_calc',
        prompt: {
          en: 'Account Capital = ₹1,50,000. Risk per trade = 1% (₹1,500). Entry = ₹2,960, Stop-Loss = ₹2,930 (₹30 risk/share). Calculate the exact number of shares.',
          hinglish: 'Capital ₹1,50,000, Risk 1% (₹1,500), Entry ₹2,960, Stop ₹2,930 (₹30/share risk). Exact shares batayein.',
        },
        hint: { en: '1500 / 30.', hinglish: '1500 / 30 karein.' },
        expectedNumeric: 50,
        numericTolerance: 0,
        numericUnit: 'shares',
        explanation: {
          en: 'Max Risk = ₹1,500. Stop Distance = ₹30. Shares = 1500 / 30 = 50 shares.',
          hinglish: '1500 / 30 = 50 shares.',
        },
      },
      {
        id: 'p-09-2',
        title: { en: 'Calculate Minimum Breakeven Win Rate at 1:3 R:R', hinglish: '1:3 R:R Par Breakeven Win Rate Nikalein' },
        conceptId: 'c-09-rr',
        type: 'numeric_calc',
        prompt: {
          en: 'If your average winner is 3R and average loser is 1R (1:3 Risk:Reward), what is your minimum breakeven win rate %? Formula: (1 / (1 + 3)) × 100.',
          hinglish: 'Agar Risk:Reward 1:3 hai, toh breakeven win rate % kitna hoga? Formula: (1 / (1 + 3)) × 100.',
        },
        hint: { en: '100 / 4 = 25%.', hinglish: '100 / 4 = 25%.' },
        expectedNumeric: 25,
        numericTolerance: 0.1,
        numericUnit: '%',
        explanation: {
          en: 'Breakeven Win Rate = 1 / (1 + 3) = 25%.',
          hinglish: '1 / (1 + 3) = 25%.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-09-1',
        conceptId: 'c-09-sizing',
        isCriticalConcept: true,
        questionType: 'calculation',
        prompt: {
          en: 'Capital = ₹3,00,000. Max Risk = 1% (₹3,000). Entry = ₹1,250, Stop-Loss = ₹1,220 (₹30 stop). What is the maximum safe quantity?',
          hinglish: 'Capital ₹3,00,000, 1% Risk (₹3,000), Entry ₹1,250, Stop ₹1,220. Safe quantity kya hai?',
        },
        options: [
          { en: '100 shares (Risk = ₹3,000)', hinglish: '100 shares (Risk = ₹3,000)' },
          { en: '240 shares (Full margin)', hinglish: '240 shares' },
          { en: '500 shares', hinglish: '500 shares' },
        ],
        correctIndex: 0,
        deterministicFormulaNote: 'Shares = 3000 / (1250 - 1220) = 100 shares',
        explanation: {
          en: '3000 / 30 = 100 shares.',
          hinglish: '3000 / 30 = 100 shares.',
        },
      },
      {
        id: 'q-09-2',
        conceptId: 'c-09-rr',
        isCriticalConcept: true,
        questionType: 'calculation',
        prompt: {
          en: 'Entry is ₹800, Stop-Loss is ₹780, and Target is ₹850. What is the Reward:Risk ratio?',
          hinglish: 'Entry ₹800, Stop ₹780 (Risk ₹20), Target ₹850 (Reward ₹50). R:R ratio kya hai?',
        },
        options: [
          { en: '1 : 2.5 (2.5R)', hinglish: '1 : 2.5 (2.5R)' },
          { en: '1 : 0.4 (0.4R)', hinglish: '1 : 0.4 (0.4R)' },
          { en: '1 : 5.0 (5.0R)', hinglish: '1 : 5.0 (5.0R)' },
        ],
        correctIndex: 0,
        deterministicFormulaNote: '(850 - 800) / (800 - 780) = 50 / 20 = 2.5R',
        explanation: {
          en: 'Reward (₹50) / Risk (₹20) = 2.5R.',
          hinglish: '50 / 20 = 2.5R.',
        },
      },
      {
        id: 'q-09-3',
        conceptId: 'c-09-drawdown',
        isCriticalConcept: true,
        questionType: 'scenario',
        prompt: {
          en: 'A trader buys 400 shares of TATASTEEL with a ₹15 stop-loss (₹6,000 risk) on a ₹1,50,000 account (4% risk). Why is this position over-sized?',
          hinglish: '₹1,50,000 account par ₹6,000 risk (4% risk) lena kyun galat hai?',
        },
        options: [
          { en: 'It risks 4% on a single trade (4x the 1% rule), exposing the account to rapid drawdown during a normal losing streak', hinglish: 'Yeh 1% rule se 4 guna zyada risk hai, jo losing streak mein account khali kar sakta hai' },
          { en: 'It is too small', hinglish: 'Yeh bahut chota risk hai' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'At 1% risk on ₹1,50,000 (₹1,500 max risk), the trader should hold at most 100 shares (₹1,500 / ₹15).',
          hinglish: '₹1,500 max risk ke hisaab se sirf 100 shares hone chahiye the.',
        },
      },
    ],
  },
  {
    id: 'ch-10',
    chapterNumber: 10,
    stageCategory: 'Risk',
    title: { en: 'Trading Psychology', hinglish: 'Trading Psychology (Discipline, FOMO & Revenge Control)' },
    description: {
      en: 'Eliminate FOMO, revenge trading, overtrading, and stop-widening by thinking in 100-trade probabilities.',
      hinglish: 'FOMO, revenge trading aur stop-loss hatane ki galti ko 100-trade mindset se rokein.',
    },
    iconName: 'Brain',
    estimatedMinutes: 18,
    prerequisiteChapterIds: ['ch-09'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-10-revenge', title: { en: 'Preventing Revenge Trading & FOMO', hinglish: 'Revenge Trading Aur FOMO Rokna' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-10-1',
        title: { en: 'Thinking in Probabilities & Stopping Revenge Trades', hinglish: 'Probabilities Mein Sochna Aur Revenge Trade Rokna' },
        durationMinutes: 7,
        conceptId: 'c-10-revenge',
        conceptSummary: {
          en: 'Even a 55% win-rate system has a 95% probability of experiencing a 4–5 trade losing streak across 100 trades. A loss that followed your rules is a Good Trade.',
          hinglish: '55% win-rate wale system mein bhi 4-5 losses lagatar aana normal math hai. Rules follow karke hua 1R loss ek Good Trade hai.',
        },
        visualExample: {
          en: 'Doubling lot size after 2 losses ("Martingale/Revenge") turns a normal -2R day into a -10R account-wrecking disaster.',
          hinglish: '2 loss ke baad lot size double karna sabse khatarnak revenge trading trap hai.',
        },
        quickCheck: {
          question: {
            en: 'After two consecutive -1R stop-outs that followed your plan, what is the disciplined action?',
            hinglish: 'Plan ke mutabiq 2 consecutive -1R stop-loss hit hone ke baad sahi kadam kya hai?',
          },
          options: [
            { en: 'Keep risk at 1% (or pause if daily loss limit reached) and wait for the next A+ setup', hinglish: 'Risk 1% hi rakhein (ya daily limit par rukein) aur agle A+ setup ka wait karein' },
            { en: 'Triple your position size to win back the money in 5 minutes', hinglish: 'Paisa wapas paane ke liye position 3x kar dein' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Consistent 1R sizing allows your positive expectancy edge to play out over a large sample.',
            hinglish: 'Consistent 1R risk rakhne se hi edge kaam karta hai.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-10-1',
        title: { en: 'Behavioral Scenario: Price Approaches Your Stop-Loss', hinglish: 'Scenario: Price Stop-Loss Ke Paas Aa Raha Hai' },
        conceptId: 'c-10-revenge',
        type: 'scenario_decision',
        prompt: {
          en: 'Your long trade in BANKNIFTY is ₹4 away from your predefined stop-loss. You feel tempted to drag the stop-loss ₹40 lower "to give it room." What do you do?',
          hinglish: 'Price aapke stop-loss se ₹4 door hai aur aapka mann stop-loss neeche khiskane ka kar raha hai. Aap kya karenge?',
        },
        hint: { en: 'Never widen a stop-loss once a trade is live.', hinglish: 'Live trade mein stop-loss kabhi wide na karein.' },
        options: [
          { en: 'Honor the predefined stop-loss without touching it; accept the -1R planned risk', hinglish: 'Predefined stop-loss ko bilkul na chhedें aur -1R planned risk accept karein' },
          { en: 'Cancel the stop-loss completely and average down', hinglish: 'Stop-loss cancel kar dein' },
        ],
        correctOptionIndex: 0,
        explanation: {
          en: 'Widening stops violates your invalidation thesis and turns a -1R loss into a -3R/-5R loss.',
          hinglish: 'Stop-loss hatane se -1R ka chota loss bade disaster mein badal jata hai.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-10-1',
        conceptId: 'c-10-revenge',
        isCriticalConcept: true,
        questionType: 'scenario',
        prompt: {
          en: 'Which metric defines a successful trading day in a professional academy?',
          hinglish: 'Professional trading mein ek successful din ka sabse sahi paimana kya hai?',
        },
        options: [
          { en: '100% adherence to entry, stop-loss, and position sizing rules regardless of single-trade outcome', hinglish: 'Entry, stop-loss aur position sizing rules ka 100% palan karna' },
          { en: 'Making money after breaking your stop-loss rule', hinglish: 'Stop-loss tod kar tukke se paisa banana' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Process compliance over 100 trades drives long-term profitability; single outcomes are noisy.',
          hinglish: 'Long term mein process discipline hi paisa banata hai.',
        },
      },
    ],
  },
  {
    id: 'ch-11',
    chapterNumber: 11,
    stageCategory: 'Strategy',
    title: { en: 'Strategy Building', hinglish: 'Strategy Building (Objective Rules & Regime Filters)' },
    description: {
      en: 'Document objective entry, exit, regime filter, and risk rules with zero ambiguity.',
      hinglish: 'Entry, exit, market regime filter aur risk rules ko bina kisi confusion ke likhna seekhein.',
    },
    iconName: 'FileText',
    estimatedMinutes: 22,
    prerequisiteChapterIds: ['ch-09', 'ch-10'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-11-rules', title: { en: 'Complete Strategy Rule Specification', hinglish: 'Complete Strategy Rule Specification' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-11-1',
        title: { en: 'Turning Vague Ideas Into Testable Strategy Rules', hinglish: 'Vague Ideas Ko Testable Strategy Rules Mein Badalna' },
        durationMinutes: 8,
        conceptId: 'c-11-rules',
        conceptSummary: {
          en: '"Buy when stock looks strong" is untestable. "Buy when 15m Close > Opening Range High with Volume > 1.5× 20-bar avg, Stop = OR Low, Risk = 1%" is an objective strategy.',
          hinglish: '"Jab chart accha lage tab buy karein" कोई rule nahi hai. Exact timeframe, trigger, volume filter, stop aur 1% risk likhna zaroori hai.',
        },
        visualExample: {
          en: 'Every strategy document must specify: Instrument, Timeframe, Regime Filter, Entry Trigger, Stop-Loss, Target/Trailing Rule, and Max Daily Trades.',
          hinglish: 'Strategy mein Instrument, Timeframe, Entry, Stop, Target aur Max Trades clear hone chahiye.',
        },
        quickCheck: {
          question: {
            en: 'Which of the following is an objective, backtestable entry rule?',
            hinglish: 'Inmein se kaunsa rule objective aur backtestable hai?',
          },
          options: [
            { en: '15m candle closes above 20 EMA + prior swing high with Volume > 1.5x 20-bar average', hinglish: '15m candle closes above 20 EMA + prior high with Volume > 1.5x avg' },
            { en: 'Buy whenever I feel confident about market news', hinglish: 'Jab news acchi lage tab buy karein' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Objective rules can be verified identically by two independent traders or a computer.',
            hinglish: 'Objective rule mein koi guesswork nahi hota.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-11-1',
        title: { en: 'Audit a Flawed Strategy Specification', hinglish: 'Adhuri Strategy Mein Kami Pehchanein' },
        conceptId: 'c-11-rules',
        type: 'scenario_decision',
        prompt: {
          en: 'A user writes: "Strategy: Buy NIFTY Call when RSI crosses 60. Target: 40 points." What critical component is completely missing?',
          hinglish: '"RSI 60 cross karne par Buy karein, Target 40 pts." Is strategy mein sabse badi kami kya hai?',
        },
        hint: { en: 'What happens if price moves against the trade?', hinglish: 'Agar trade ulta gaya toh kahan nikalenge?' },
        options: [
          { en: 'Missing Stop-Loss / Invalidation rule and Position Sizing % rule', hinglish: 'Stop-Loss (Invalidation) aur Position Sizing % rule gayab hai' },
          { en: 'Nothing is missing', hinglish: 'Sab kuch sahi hai' },
        ],
        correctOptionIndex: 0,
        explanation: {
          en: 'A strategy without a stop-loss and position size rule has undefined risk of ruin.',
          hinglish: 'Bina stop-loss aur position sizing ke koi strategy complete nahi hoti.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-11-1',
        conceptId: 'c-11-rules',
        isCriticalConcept: true,
        questionType: 'mcq',
        prompt: {
          en: 'Why must a trend-following strategy include a Market Regime Filter (e.g., ADX > 20 or Higher-Timeframe HH/HL)?',
          hinglish: 'Trend-following strategy mein Market Regime Filter lagana kyun zaroori hai?',
        },
        options: [
          { en: 'To avoid taking repeated false breakout whipsaws during sideways/choppy ranges', hinglish: 'Sideways/choppy market mein bar-bar stop-loss hit hone se bachne ke liye' },
          { en: 'To increase brokerage fees', hinglish: 'Brokerage badhane ke liye' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Trend strategies bleed in choppy regimes unless filtered by volatility/trend structure.',
          hinglish: 'Sideways market mein trend strategy whipsaw deti hai, isliye regime filter zaroori hai.',
        },
      },
    ],
  },
  {
    id: 'ch-12',
    chapterNumber: 12,
    stageCategory: 'Strategy',
    title: { en: 'Backtesting', hinglish: 'Backtesting (Expectancy, Sample Size & Overfitting)' },
    description: {
      en: 'Calculate mathematical expectancy, respect sample size (N >= 30–100), and avoid curve-fitting.',
      hinglish: 'Mathematical expectancy formula, sample size (N >= 30-100) aur overfitting se bachna seekhein.',
    },
    iconName: 'Activity',
    estimatedMinutes: 24,
    prerequisiteChapterIds: ['ch-11'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-12-expectancy', title: { en: 'Expectancy Formula & Sample Size', hinglish: 'Expectancy Formula Aur Sample Size' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-12-1',
        title: { en: 'Mathematical Expectancy & The Overfitting Trap', hinglish: 'Expectancy Formula Aur Overfitting Trap' },
        durationMinutes: 8,
        conceptId: 'c-12-expectancy',
        conceptSummary: {
          en: 'Expectancy = (WinRate × AvgWinR) - (LossRate × AvgLossR). Always deduct realistic NSE brokerage, STT, and slippage, and test across >= 30–100 trades.',
          hinglish: 'Expectancy = (WinRate × AvgWinR) - (LossRate × AvgLossR). Backtest mein hamesha STT, brokerage aur slippage ghata kar net expectancy dekhein.',
        },
        visualExample: {
          en: 'Win Rate 45% (0.45), Avg Win = 2.5R, Loss Rate = 55% (0.55), Avg Loss = 1R → Expectancy = 1.125 - 0.55 = +0.575R per trade.',
          hinglish: '45% win rate aur 2.5R avg win ke saath Expectancy = (0.45×2.5) - (0.55×1) = +0.575R per trade.',
        },
        formulaOrRule: 'Expectancy (R) = (Win% × AvgWinR) - ((1 - Win%) × AvgLossR)',
        quickCheck: {
          question: {
            en: 'A system has a 40% Win Rate, Average Winner = 2.5R, and Average Loser = 1.0R. What is its Expectancy per trade?',
            hinglish: '40% Win Rate, Avg Win = 2.5R, Avg Loss = 1.0R. Expectancy kitni hai?',
          },
          options: [
            { en: '+0.40R per trade ((0.40 × 2.5) - (0.60 × 1.0) = 1.0 - 0.6 = +0.40R)', hinglish: '+0.40R per trade' },
            { en: '-0.20R per trade', hinglish: '-0.20R per trade' },
          ],
          correctIndex: 0,
          explanation: {
            en: '(0.40 × 2.5R) - (0.60 × 1.0R) = 1.0R - 0.6R = +0.40R positive expectancy.',
            hinglish: '1.0R - 0.6R = +0.40R per trade.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-12-1',
        title: { en: 'Calculate Strategy Expectancy in R', hinglish: 'Strategy Expectancy (R) Calculate Karein' },
        conceptId: 'c-12-expectancy',
        type: 'numeric_calc',
        prompt: {
          en: 'Your backtest of 50 trades shows a 50% Win Rate (0.50), Average Winner = 2.2R, and Average Loser = 1.0R (Loss Rate = 0.50). Calculate Expectancy in R.',
          hinglish: 'Win Rate 50% (0.50), Avg Win 2.2R, Loss Rate 50% (0.50), Avg Loss 1.0R. Expectancy (R) nikaliye.',
        },
        hint: { en: '(0.50 × 2.2) - (0.50 × 1.0) = 1.1 - 0.5.', hinglish: '1.1 - 0.5 karein.' },
        expectedNumeric: 0.6,
        numericTolerance: 0.02,
        numericUnit: 'R',
        explanation: {
          en: 'Expectancy = (0.50 × 2.2R) - (0.50 × 1.0R) = 1.10R - 0.50R = +0.60R per trade.',
          hinglish: '1.10R - 0.50R = +0.60R.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-12-1',
        conceptId: 'c-12-expectancy',
        isCriticalConcept: true,
        questionType: 'mcq',
        prompt: {
          en: 'Why is a backtest based on only 4 cherry-picked winning trades statistically meaningless?',
          hinglish: 'Sirf 4 winning trades par आधारित backtest bekar kyun hota hai?',
        },
        options: [
          { en: 'Sample size is far too small and suffers from selection bias / overfitting across regimes', hinglish: 'Sample size bahut chota hai aur selection bias ka shikar hai' },
          { en: '4 trades is enough to guarantee lifetime profits', hinglish: '4 trades lifetime profit ke liye kafi hain' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Statistical significance requires testing across 30–100+ trades spanning bull, bear, and range periods.',
          hinglish: 'Kam se kam 30-100 trades ka sample size zaroori hai.',
        },
      },
    ],
  },
  {
    id: 'ch-13',
    chapterNumber: 13,
    stageCategory: 'Strategy',
    title: { en: 'Journaling & Performance', hinglish: 'Journaling & Performance (Mistake & Setup Audit)' },
    description: {
      en: 'Track R-multiples, tag emotional mistakes (FOMO/Revenge), and audit setup expectancy.',
      hinglish: 'Apne trades ka R-multiple, emotional mistakes aur setup performance review karna seekhein.',
    },
    iconName: 'BookOpen',
    estimatedMinutes: 18,
    prerequisiteChapterIds: ['ch-12'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-13-journal', title: { en: 'R-Multiple & Behavioral Mistake Tagging', hinglish: 'R-Multiple Aur Mistake Tagging' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-13-1',
        title: { en: 'How a Structured Trade Journal Eliminates Recurring Leaks', hinglish: 'Trade Journal Se Apni Galtiyan Kaise Sudharein' },
        durationMinutes: 6,
        conceptId: 'c-13-journal',
        conceptSummary: {
          en: 'Logging Setup Tag, R-Multiple, Emotion, and Mistake Category reveals whether losses come from market probability or rule violations.',
          hinglish: 'Har trade ka Setup, R-Multiple aur Emotion likhne se pata chalta hai ki loss market probability se hua ya rule todne se.',
        },
        visualExample: {
          en: 'Many traders discover that removing just ONE habit (e.g., "Revenge Trades after 2 PM") turns their monthly P&L from negative to positive.',
          hinglish: 'Aksar sirf ek galti (jaise Revenge Trading) band karne se hi monthly P&L positive ho jata hai.',
        },
        quickCheck: {
          question: {
            en: 'If you risked ₹1,500 (1R) on a trade and exited with a net profit of ₹3,750, what is your realized R-Multiple?',
            hinglish: 'Agar aapne ₹1,500 (1R) risk liya aur ₹3,750 net profit banaya, toh R-Multiple kitna hai?',
          },
          options: [
            { en: '+2.5R (3750 / 1500)', hinglish: '+2.5R (3750 / 1500)' },
            { en: '+0.4R', hinglish: '+0.4R' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Realized R = Net P&L (₹3,750) / Initial Risk (₹1,500) = +2.5R.',
            hinglish: '3750 / 1500 = +2.5R.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-13-1',
        title: { en: 'Calculate Realized R-Multiple for Journal Log', hinglish: 'Journal Ke Liye Realized R-Multiple Nikalein' },
        conceptId: 'c-13-journal',
        type: 'numeric_calc',
        prompt: {
          en: 'Initial Planned Risk (1R) = ₹2,000. Net Profit after charges = ₹4,400. What is the realized R-Multiple?',
          hinglish: 'Initial Risk (1R) = ₹2,000 aur Net Profit = ₹4,400 hai. R-Multiple (4400 / 2000) batayein.',
        },
        hint: { en: '4400 / 2000.', hinglish: '4400 / 2000 karein.' },
        expectedNumeric: 2.2,
        numericTolerance: 0.05,
        numericUnit: 'R',
        explanation: {
          en: 'Realized R-Multiple = ₹4,400 / ₹2,000 = +2.2R.',
          hinglish: '4400 / 2000 = +2.2R.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-13-1',
        conceptId: 'c-13-journal',
        isCriticalConcept: true,
        questionType: 'mcq',
        prompt: {
          en: 'Why do professional traders measure performance in R-Multiples in addition to ₹ INR?',
          hinglish: 'Professional traders ₹ ke saath-saath R-Multiple mein performance kyun naapte hain?',
        },
        options: [
          { en: 'R-Multiples normalize every trade relative to the initial risk taken, making strategy edge comparable across account sizes', hinglish: 'R-Multiple har trade ko uske risk ke hisaab se normalize karta hai' },
          { en: 'To hide losses from their journal', hinglish: 'Losses chhupane ke liye' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'R-Multiples measure execution quality independent of capital changes.',
          hinglish: 'R-Multiple se strategy ki asli quality pata chalti hai.',
        },
      },
    ],
  },
  {
    id: 'ch-14',
    chapterNumber: 14,
    stageCategory: 'Advanced',
    title: { en: 'Options Foundations', hinglish: 'Options Foundations (CE/PE, Greeks, Theta & IV)' },
    description: {
      en: 'Understand Call/Put mechanics, Intrinsic vs Extrinsic value, Delta, Theta decay, and IV crush on NSE.',
      hinglish: 'Call/Put options, Intrinsic/Time value, Delta, Theta decay aur IV crush samjhein.',
    },
    iconName: 'Compass',
    estimatedMinutes: 28,
    prerequisiteChapterIds: ['ch-09', 'ch-12'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-14-greeks', title: { en: 'Option Payoffs, Theta Decay & IV Crush', hinglish: 'Option Payoffs, Theta Decay Aur IV Crush' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-14-1',
        title: { en: 'Call/Put Payoffs, Theta Decay & Why Far OTM Buyers Lose', hinglish: 'Call/Put Payoff, Theta Decay Aur OTM Risk' },
        durationMinutes: 9,
        conceptId: 'c-14-greeks',
        conceptSummary: {
          en: 'Option Premium = Intrinsic Value + Time (Extrinsic) Value. For option buyers, Theta (time decay) and post-event IV Crush erode premium even if the index stays flat.',
          hinglish: 'Option Premium = Intrinsic + Time Value. Expiry ke paas Theta decay aur event ke baad IV Crush se OTM option buyers ko tezi se loss hota hai.',
        },
        visualExample: {
          en: 'Long Call Breakeven at Expiry = Strike Price + Premium Paid.',
          hinglish: 'Long Call Breakeven = Strike Price + Premium Paid.',
        },
        formulaOrRule: 'Long Call Breakeven = Strike + Premium | Long Put Breakeven = Strike - Premium',
        quickCheck: {
          question: {
            en: 'You buy a NIFTY 22,500 Call Option (CE) for ₹120 premium. What is your exact breakeven index level at expiry?',
            hinglish: 'Aapne NIFTY 22,500 CE ₹120 premium par buy kiya. Expiry par breakeven level kya hoga?',
          },
          options: [
            { en: '22,620 (22,500 + 120)', hinglish: '22,620 (22,500 + 120)' },
            { en: '22,380', hinglish: '22,380' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Call Breakeven = Strike (22,500) + Premium (120) = 22,620.',
            hinglish: '22,500 + 120 = 22,620.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-14-1',
        title: { en: 'Calculate Long Call Breakeven Level', hinglish: 'Long Call Breakeven Level Nikalein' },
        conceptId: 'c-14-greeks',
        type: 'numeric_calc',
        prompt: {
          en: 'You buy NIFTY 22,400 CE at ₹145 premium. At what NIFTY spot level at expiry do you break even (before brokerage)?',
          hinglish: 'NIFTY 22,400 CE ₹145 premium par buy kiya. Expiry par breakeven spot level (22400 + 145) kya hoga?',
        },
        hint: { en: '22400 + 145.', hinglish: '22400 + 145 karein.' },
        expectedNumeric: 22545,
        numericTolerance: 0,
        numericUnit: 'pts',
        explanation: {
          en: 'Breakeven = 22,400 Strike + 145 Premium = 22,545.',
          hinglish: '22,400 + 145 = 22,545.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-14-1',
        conceptId: 'c-14-greeks',
        isCriticalConcept: true,
        questionType: 'scenario',
        prompt: {
          en: 'What happens to Out-of-The-Money (OTM) option premiums immediately after a major event (like RBI Policy or Earnings) when Implied Volatility (IV) collapses?',
          hinglish: 'RBI Policy ya Result ke turant baad jab Implied Volatility (IV) girti hai, toh OTM option premium ke saath kya hota hai?',
        },
        options: [
          { en: 'Premiums drop sharply due to Vega / IV Crush even if price moves slightly in your favor', hinglish: 'IV Crush ke karan premium tezi se gir jata hai' },
          { en: 'Premiums automatically double', hinglish: 'Premium double ho jata hai' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'IV Crush deflates extrinsic value across both Calls and Puts after major announcements.',
          hinglish: 'Event ke baad IV girne se option premium deflate ho jata hai.',
        },
      },
    ],
  },
  {
    id: 'ch-15',
    chapterNumber: 15,
    stageCategory: 'Advanced',
    title: { en: 'Futures Foundations', hinglish: 'Futures Foundations (Lots, Leverage & MTM Margin)' },
    description: {
      en: 'Understand NSE Futures lot sizes, SPAN + Exposure margin, Mark-to-Market (MTM) settlement, and leverage risk.',
      hinglish: 'NSE Futures lot size, SPAN + Exposure margin, MTM settlement aur leverage risk samjhein.',
    },
    iconName: 'Briefcase',
    estimatedMinutes: 24,
    prerequisiteChapterIds: ['ch-09', 'ch-12'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-15-futures', title: { en: 'Futures Leverage, Lot Notional & MTM', hinglish: 'Futures Leverage, Lot Value Aur MTM' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-15-1',
        title: { en: 'Notional Contract Value vs Margin & Daily MTM Risk', hinglish: 'Notional Value vs Margin Aur Daily MTM Risk' },
        durationMinutes: 8,
        conceptId: 'c-15-futures',
        conceptSummary: {
          en: 'Futures are leveraged contracts traded in fixed lots. Even if margin is 15%, your profit/loss is calculated on 100% of the full lot quantity (Lot Size × Price Change) every day via MTM.',
          hinglish: 'Futures mein margin 15%-20% lagta hai par profit/loss poore lot quantity (Lot Size × Points) par roz MTM settle hota hai.',
        },
        visualExample: {
          en: '1 Lot of NIFTY Futures (75 qty) at 22,500 has ₹16.87 Lakh notional exposure. A 100-point adverse move = -₹7,500 MTM loss.',
          hinglish: '75 qty lot mein 100 points ulta move aane par turant ₹7,500 ka MTM loss hota hai.',
        },
        quickCheck: {
          question: {
            en: 'If a stock future has a lot size of 250 shares and drops ₹20 against your long position, what is your MTM loss on 1 lot?',
            hinglish: 'Agar Future lot size 250 hai aur price ₹20 girta hai, toh 1 lot par MTM loss kitna hoga?',
          },
          options: [
            { en: '-₹5,000 (250 × ₹20)', hinglish: '-₹5,000 (250 × ₹20)' },
            { en: '-₹20', hinglish: '-₹20' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'MTM Loss = Lot Size (250) × Price Move (-₹20) = -₹5,000.',
            hinglish: '250 × 20 = ₹5,000 loss.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-15-1',
        title: { en: 'Calculate 1-Lot Futures Risk on a 40-Point Stop', hinglish: '1-Lot Future Par 40-Point Stop Risk Nikalein' },
        conceptId: 'c-15-futures',
        type: 'numeric_calc',
        prompt: {
          en: 'NIFTY Futures lot size is 75. If your stop-loss is 40 points away from entry, what is your rupee risk on 1 lot?',
          hinglish: 'NIFTY lot size 75 hai aur stop-loss 40 points ka hai. 1 lot par rupee risk (75 × 40) kitna hoga?',
        },
        hint: { en: '75 × 40.', hinglish: '75 × 40 karein.' },
        expectedNumeric: 3000,
        numericTolerance: 0,
        numericUnit: '₹',
        explanation: {
          en: '1 Lot Risk = 75 × 40 points = ₹3,000.',
          hinglish: '75 × 40 = ₹3,000.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-15-1',
        conceptId: 'c-15-futures',
        isCriticalConcept: true,
        questionType: 'calculation',
        prompt: {
          en: 'To safely trade 1 lot of NIFTY Futures with a ₹3,000 stop-loss while obeying the 1% max risk rule, what minimum account capital is required?',
          hinglish: '₹3,000 ke 1-lot stop-loss ko 1% risk rule ke andar rakhne ke liye minimum kitna capital chahiye?',
        },
        options: [
          { en: '₹3,00,000 (1% of ₹3,00,000 = ₹3,000)', hinglish: '₹3,00,000 (1% = ₹3,000)' },
          { en: '₹25,000', hinglish: '₹25,000' },
        ],
        correctIndex: 0,
        deterministicFormulaNote: 'Required Capital = Trade Risk / 0.01 = 3000 / 0.01 = ₹3,00,000',
        explanation: {
          en: '₹3,000 risk represents 1% of a ₹3,00,000 account.',
          hinglish: '₹3,000 risk ke liye 1% rule ke hisaab se ₹3,00,000 capital chahiye.',
        },
      },
    ],
  },
  {
    id: 'ch-16',
    chapterNumber: 16,
    stageCategory: 'Advanced',
    title: { en: 'Algorithmic Trading', hinglish: 'Algorithmic Trading (Look-Ahead Bias & Kill-Switches)' },
    description: {
      en: 'Design systematic execution pipelines, prevent look-ahead bias, and enforce automated kill-switches.',
      hinglish: 'Systematic algo rules, look-ahead bias se bachav aur automated daily kill-switch seekhein.',
    },
    iconName: 'Terminal',
    estimatedMinutes: 25,
    prerequisiteChapterIds: ['ch-11', 'ch-12'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-16-algo', title: { en: 'Look-Ahead Bias & Risk Kill-Switches', hinglish: 'Look-Ahead Bias Aur Risk Kill-Switch' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-16-1',
        title: { en: 'Eliminating Look-Ahead Bias & Building Kill-Switches', hinglish: 'Look-Ahead Bias Hatana Aur Kill-Switch Banana' },
        durationMinutes: 8,
        conceptId: 'c-16-algo',
        conceptSummary: {
          en: 'Never reference future bar data (`close[i+1]`) or intrabar High/Low before bar close. Every live algo requires a hard Daily Max Loss Kill-Switch and max orders/second throttle.',
          hinglish: 'Code mein kabhi future candle (`close[i+1]`) use na karein. Har algo mein Daily Max Loss Kill-Switch hona अनिवार्य hai.',
        },
        visualExample: {
          en: 'Buggy code: `if (close[i+1] > open[i]) buy()` leaks tomorrow’s price into today’s signal.',
          hinglish: '`close[i+1]` use karne se backtest 99% win dikhata hai par live mein fail hota hai.',
        },
        quickCheck: {
          question: {
            en: 'What bug occurs when a backtest script checks `if (high[i] > resistance) enterAt(open[i])` on the same candle?',
            hinglish: 'Jab code usi candle ka `high[i]` dekh kar `open[i]` par entry le leta hai, toh ise kaunsa bug kehte hain?',
          },
          options: [
            { en: 'Look-Ahead Bias (using information not yet known at the open of bar i)', hinglish: 'Look-Ahead Bias (bhavishya ka data pehle use karna)' },
            { en: 'Proper execution', hinglish: 'Sahi execution' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'At the open of bar i, the high of bar i has not occurred yet.',
            hinglish: 'Candle open hote waqt uska High pata nahi hota.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-16-1',
        title: { en: 'Spot the Algo Kill-Switch Threshold', hinglish: 'Algo Kill-Switch Limit Calculate Karein' },
        conceptId: 'c-16-algo',
        type: 'numeric_calc',
        prompt: {
          en: 'Your algo deploys ₹5,00,000 capital with a strict 2% Daily Loss Kill-Switch. At what cumulative daily loss in ₹ must the algo halt all new orders?',
          hinglish: '₹5,00,000 capital par 2% Daily Loss Kill-Switch kitne ₹ loss par algo ko rok dega?',
        },
        hint: { en: '2% of 5,00,000.', hinglish: '5,00,000 ka 2% nikalein.' },
        expectedNumeric: 10000,
        numericTolerance: 0,
        numericUnit: '₹',
        explanation: {
          en: '2% of ₹5,00,000 = ₹10,000 daily circuit breaker.',
          hinglish: '5,00,000 × 2% = ₹10,000.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-16-1',
        conceptId: 'c-16-algo',
        isCriticalConcept: true,
        questionType: 'mcq',
        prompt: {
          en: 'Why must an automated trading system include an API order-rate throttle and duplicate-signal check?',
          hinglish: 'Algo system mein order-rate throttle aur duplicate-signal check kyun zaroori hai?',
        },
        options: [
          { en: 'To prevent infinite loop bugs from firing hundreds of unintended orders in seconds', hinglish: 'Infinite loop bug se seconds mein saikdon galat orders jaane se rokne ke liye' },
          { en: 'To make charts colorful', hinglish: 'Chart colorful banane ke liye' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Rate limits and state locks protect capital from runaway execution loops.',
          hinglish: 'Execution guardrails runaway loops se capital bachaate hain.',
        },
      },
    ],
  },
  {
    id: 'ch-17',
    chapterNumber: 17,
    stageCategory: 'Advanced',
    title: { en: 'Quantitative Analysis', hinglish: 'Quantitative Analysis (Sharpe, Z-Score & Walk-Forward)' },
    description: {
      en: 'Evaluate risk-adjusted returns, out-of-sample walk-forward validation, and regime correlation.',
      hinglish: 'Risk-adjusted return, In-Sample vs Out-of-Sample testing aur correlation samjhein.',
    },
    iconName: 'PieChart',
    estimatedMinutes: 26,
    prerequisiteChapterIds: ['ch-12', 'ch-16'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-17-quant', title: { en: 'In-Sample vs Out-of-Sample & Risk-Adjusted Return', hinglish: 'In-Sample vs Out-of-Sample Validation' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-17-1',
        title: { en: 'In-Sample Optimization vs Out-of-Sample Walk-Forward Testing', hinglish: 'In-Sample vs Out-of-Sample Testing' },
        durationMinutes: 9,
        conceptId: 'c-17-quant',
        conceptSummary: {
          en: 'Develop rules on In-Sample data (e.g., 2020–2023) and validate untouched on Out-of-Sample data (2024–2025). If performance collapses out-of-sample, the parameters were curve-fit.',
          hinglish: 'Strategy ko purane data (In-Sample) par banayein aur bilkul naye unseen data (Out-of-Sample) par test karein.',
        },
        visualExample: {
          en: 'Return-to-Max-Drawdown (Calmar/MAR ratio) > 1.5 with stable Out-of-Sample expectancy indicates robustness.',
          hinglish: 'Out-of-sample mein stable expectancy strategy ki mazbooti dikhati hai.',
        },
        quickCheck: {
          question: {
            en: 'What does it mean if a strategy shows +180% return In-Sample but -25% Out-of-Sample?',
            hinglish: 'Agar strategy In-Sample mein +180% aur Out-of-Sample mein -25% de, toh iska kya matlab hai?',
          },
          options: [
            { en: 'The strategy was overfitted to historical noise and lacks a real predictive edge', hinglish: 'Strategy historical noise par overfit thi aur real market mein fail ho gayi' },
            { en: 'It is ready for 10x leverage', hinglish: 'Yeh 10x leverage ke liye ready hai' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Sharp degradation on unseen data is the hallmark of curve-fitting.',
            hinglish: 'Unseen data par fail hona overfitting ki pehchan hai.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-17-1',
        title: { en: 'Calculate Return-to-Max-Drawdown Ratio', hinglish: 'Return-to-Max-Drawdown Ratio Nikalein' },
        conceptId: 'c-17-quant',
        type: 'numeric_calc',
        prompt: {
          en: 'A quantitative portfolio generates a 24% annualized return with a Maximum Drawdown of 12%. What is its Return / Max Drawdown ratio?',
          hinglish: 'Annual return 24% hai aur Max Drawdown 12% hai. Return / Max Drawdown ratio (24 / 12) kitna hai?',
        },
        hint: { en: '24 / 12.', hinglish: '24 / 12 karein.' },
        expectedNumeric: 2,
        numericTolerance: 0.05,
        numericUnit: 'x',
        explanation: {
          en: 'Return (24%) / Max Drawdown (12%) = 2.0x.',
          hinglish: '24 / 12 = 2.0x.',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-17-1',
        conceptId: 'c-17-quant',
        isCriticalConcept: true,
        questionType: 'mcq',
        prompt: {
          en: 'Why is taking 5 simultaneous long trades in 5 Indian IT stocks (TCS, INFY, WIPRO, HCLTECH, TECHM) at 1% risk each actually a 5% correlated sector bet?',
          hinglish: 'Ek saath 5 IT stocks mein 1%-1% risk lena asal mein 5% correlated risk kyun ban jata hai?',
        },
        options: [
          { en: 'Because stocks in the same sector have high positive correlation (ρ > 0.8) during sector-wide news drops', hinglish: 'Kyunki ek hi sector ke stocks news aane par ek saath girte hain (High Correlation)' },
          { en: 'Because IT stocks never move', hinglish: 'Kyunki IT stocks move nahi karte' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'True diversification requires managing sector and factor correlation, not just ticker count.',
          hinglish: 'Ek hi sector mein 5 trades lene se sabka stop-loss ek saath hit ho sakta hai.',
        },
      },
    ],
  },
  {
    id: 'ch-18',
    chapterNumber: 18,
    stageCategory: 'Advanced',
    title: { en: 'Advanced Strategy Research', hinglish: 'Advanced Strategy Research (Multi-Regime Portfolio)' },
    description: {
      en: 'Synthesize multi-strategy portfolios, Monte Carlo stress testing, and institutional risk governance.',
      hinglish: 'Multi-strategy portfolio, Monte Carlo stress testing aur institutional risk governance master karein.',
    },
    iconName: 'Award',
    estimatedMinutes: 30,
    prerequisiteChapterIds: ['ch-13', 'ch-14', 'ch-15', 'ch-17'],
    masteryThreshold: 80,
    concepts: [
      { id: 'c-18-portfolio', title: { en: 'Monte Carlo Stress Testing & Multi-Regime Allocation', hinglish: 'Monte Carlo Stress Testing Aur Capital Allocation' }, isCritical: true },
    ],
    lessons: [
      {
        id: 'l-18-1',
        title: { en: 'Monte Carlo Tail-Risk & Multi-System Capital Allocation', hinglish: 'Monte Carlo Tail-Risk Aur Multi-System Allocation' },
        durationMinutes: 10,
        conceptId: 'c-18-portfolio',
        conceptSummary: {
          en: 'By shuffling trade sequences across 1,000 Monte Carlo paths, you size positions so that even the 95th-percentile worst losing streak keeps portfolio drawdown below 15%.',
          hinglish: 'Monte Carlo simulation se hum dekh sakte hain ki agar saare losses ek saath aa jayein tab bhi account safe rahe.',
        },
        visualExample: {
          en: 'Combining a Trend-Following Equity system with a Non-Correlated Mean-Reversion / Cash-Secured system smooths the equity curve.',
          hinglish: 'Trend system aur Mean-Reversion system ko combine karne se equity curve smooth rehta hai.',
        },
        quickCheck: {
          question: {
            en: 'What does Monte Carlo trade-sequence shuffling reveal that a single historical backtest curve hides?',
            hinglish: 'Single backtest curve ke muqable Monte Carlo shuffling kya dikhati hai?',
          },
          options: [
            { en: 'The distribution of worst-case drawdowns if losing trades cluster together in a different order', hinglish: 'Agar losing trades ek saath cluster ho jayein toh worst-case drawdown kitna ho sakta hai' },
            { en: 'Guaranteed tomorrow open price', hinglish: 'Kal ka guaranteed open price' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Future trade order is random; Monte Carlo tests survival under adverse clustering.',
            hinglish: 'Future mein losses kis order mein aayenge yeh random hota hai.',
          },
        },
      },
    ],
    practiceActivities: [
      {
        id: 'p-18-1',
        title: { en: 'Portfolio Heat Cap Check Across Open Positions', hinglish: 'Open Positions Par Portfolio Heat Check' },
        conceptId: 'c-18-portfolio',
        type: 'numeric_calc',
        prompt: {
          en: 'Your ₹10,00,000 portfolio has a maximum total open portfolio heat limit of 5% (₹50,000). You currently have 3 open swing trades risking 1% (₹10,000) each. How many more 1%-risk trades can you open before hitting your heat cap?',
          hinglish: 'Max portfolio heat 5% hai aur abhi 3 trades (1% each = 3% total) open hain. Heat cap tak kitne aur 1% trades le sakte hain?',
        },
        hint: { en: '5% max heat - 3% current open risk = 2% (2 trades of 1%).', hinglish: '5 - 3 = 2 trades.' },
        expectedNumeric: 2,
        numericTolerance: 0,
        numericUnit: 'trades',
        explanation: {
          en: '5% Max Portfolio Heat - 3% Active Open Risk = 2% remaining capacity (2 trades at 1% risk each).',
          hinglish: '5% - 3% = 2% remaining (2 trades).',
        },
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-18-1',
        conceptId: 'c-18-portfolio',
        isCriticalConcept: true,
        questionType: 'scenario',
        prompt: {
          en: 'Before transitioning from Paper Trading to real capital, which 4 milestones must be verified?',
          hinglish: 'Paper Trading se real money par jaane se pehle kaunse 4 milestones poore hone chahiye?',
        },
        options: [
          { en: 'Positive net expectancy after NSE taxes across 30+ trades, 100% stop-loss adherence, max risk <= 1%/trade, and zero revenge trades', hinglish: '30+ trades mein post-tax positive expectancy, 100% stop-loss palan, <=1% risk aur zero revenge trades' },
          { en: 'One lucky 50% jackpot trade without a stop-loss', hinglish: 'Bina stop-loss ke ek lucky trade' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Verified process consistency and post-cost expectancy over a meaningful sample are prerequisites for real capital.',
          hinglish: 'Bina process proof ke real money risk nahi lena chahiye.',
        },
      },
    ],
  },
];
