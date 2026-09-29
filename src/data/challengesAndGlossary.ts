import {
  BehavioralScenario,
  ChartChallenge,
  GlossaryItem,
  JournalEntry,
  LessonQuizQuestion,
  PaperPosition,
  PaperTradeRecord,
} from '../types';
import { INDIAN_MARKET_ASSETS } from './indianMarketData';

const relianceCandles = INDIAN_MARKET_ASSETS.find((a) => a.symbol === 'RELIANCE')!.candles;
const niftyCandles = INDIAN_MARKET_ASSETS.find((a) => a.symbol === 'NIFTY 50')!.candles;
const hdfcCandles = INDIAN_MARKET_ASSETS.find((a) => a.symbol === 'HDFCBANK')!.candles;

export const CHART_CHALLENGES: ChartChallenge[] = [
  {
    id: 'chal-1',
    title: {
      en: 'Challenge #1: RELIANCE Pullback to Support & 20-EMA Confluence',
      hinglish: 'Challenge #1: RELIANCE Pullback Support aur 20-EMA Confluence',
    },
    symbol: 'RELIANCE',
    timeframe: '1D (Historical Simulation)',
    level: 'beginner',
    setupContext: {
      en: 'Examine the first 34 daily candles of RELIANCE. Price has established Higher Highs and Higher Lows and is testing the ₹2,920–₹2,935 support zone near the 20-day EMA. The next 10 candles are hidden.',
      hinglish: 'RELIANCE ke pehle 34 daily candles dhyan se dekhein. Price Higher High aur Higher Low bana raha hai aur ₹2,920–₹2,935 ke support zone (20-EMA ke paas) par aaya hai. Agle 10 candles abhi hidden hain.',
    },
    visibleCandles: relianceCandles.slice(0, 34),
    hiddenCandles: relianceCandles.slice(34, 46),
    supportZone: 2920,
    resistanceZone: 3040,
    suggestedEntry: 2948,
    suggestedStop: 2912,
    suggestedTarget: 3038,
    questions: {
      trendQuestion: {
        prompt: {
          en: '1. What is the dominant market structure visible up to Candle #34?',
          hinglish: '1. Candle #34 tak chart par kaunsa primary market structure dikh raha hai?',
        },
        options: [
          {
            en: 'Uptrend (Higher Highs & Higher Lows pulling back into ₹2,920 support)',
            hinglish: 'Uptrend (Higher Highs & Higher Lows jo ₹2,920 support par pullback kar raha hai)',
          },
          {
            en: 'Severe Downtrend (Lower Highs & Lower Lows breaking all supports)',
            hinglish: 'Downtrend (Lagatar Lower Highs aur Lower Lows)',
          },
          {
            en: 'Illiquid penny-stock spike with no structure',
            hinglish: 'Bina structure ka low-volume spike',
          },
        ],
        correctIndex: 0,
      },
      actionQuestion: {
        prompt: {
          en: '2. If Entry = ₹2,948, Stop-Loss = ₹2,912 (₹36 risk/share), and Target = ₹3,038 (₹90 reward/share), what is the Risk/Reward ratio and process decision?',
          hinglish: '2. Agar Entry = ₹2,948, Stop-Loss = ₹2,912 (₹36 risk) aur Target = ₹3,038 (₹90 reward) hai, toh Risk/Reward aur sahi decision kya hoga?',
        },
        options: [
          {
            en: '1 : 2.5 R:R — Valid setup if position size keeps total risk ≤ 1% of capital',
            hinglish: '1 : 2.5 R:R — Valid setup hai basharte position size 1% risk rule ke andar ho',
          },
          {
            en: '1 : 0.4 R:R — Risk is larger than reward, avoid setup',
            hinglish: '1 : 0.4 R:R — Risk reward se bada hai, trade chhod dein',
          },
          {
            en: 'Enter with 100% of capital and no stop-loss because support never breaks',
            hinglish: 'Bina stop-loss ke poora capital laga dein kyunki support kabhi nahi toot-ta',
          },
        ],
        correctIndex: 0,
      },
    },
    outcomeExplanation: {
      en: 'Subsequent candles held above the ₹2,912 invalidation stop and rotated higher toward the ₹3,020–₹3,040 resistance zone. Remember: even a textbook 1:2.5 setup only works over a series of trades when your stop-loss is honored every time.',
      hinglish: 'Agle candles ne ₹2,912 ke stop-loss ko respect kiya aur price wapas ₹3,020–₹3,040 resistance zone ki taraf gaya. Yaad rakhein: achhe se achha setup bhi tabhi kaam aata hai jab aap har baar 1% risk aur stop-loss rule follow karein.',
    },
  },
  {
    id: 'chal-2',
    title: {
      en: 'Challenge #2: NIFTY 50 Resistance Test & Risk/Reward Evaluation',
      hinglish: 'Challenge #2: NIFTY 50 Resistance Test aur Risk/Reward Check',
    },
    symbol: 'NIFTY 50',
    timeframe: '1D (Historical Simulation)',
    level: 'intermediate',
    setupContext: {
      en: 'Nifty 50 has rallied into the 24,900–25,000 zone after several green sessions. Evaluate whether chasing right below 25,000 resistance offers asymmetric Risk/Reward or if waiting for a pullback/retest is superior.',
      hinglish: 'Nifty 50 lagatar bhaagne ke baad 24,900–25,000 resistance zone ke bilkul neeche hai. Check karein ki kya yahan top par chase karna sahi R:R deta hai ya pullback ka wait karna behtar hai.',
    },
    visibleCandles: niftyCandles.slice(0, 35),
    hiddenCandles: niftyCandles.slice(35, 47),
    supportZone: 24650,
    resistanceZone: 25000,
    suggestedEntry: 24740,
    suggestedStop: 24630,
    suggestedTarget: 24980,
    questions: {
      trendQuestion: {
        prompt: {
          en: '1. If a trader buys right at 24,950 directly beneath 25,000 resistance (+50 pts reward) with a logical stop at 24,650 (-300 pts risk), what is the R:R?',
          hinglish: '1. Agar koi trader 25,000 resistance ke bilkul neeche 24,950 par buy kare (+50 pts upside) aur stop-loss 24,650 (-300 pts risk) rakhe, toh R:R kya hoga?',
        },
        options: [
          {
            en: 'Poor R:R (6:1 risk-to-reward against you — risking 300 pts to make 50 pts)',
            hinglish: 'Kharab R:R (50 points kamane ke liye 300 points ka risk — 6:1 ulta risk)',
          },
          {
            en: '1 : 5 favorable Risk/Reward',
            hinglish: '1 : 5 ka shandar Risk/Reward',
          },
          {
            en: 'Risk/Reward does not matter in indices',
            hinglish: 'Index trading mein Risk/Reward maayne nahi rakhta',
          },
        ],
        correctIndex: 0,
      },
      actionQuestion: {
        prompt: {
          en: '2. What is the disciplined rule-based action when price is extended right into major resistance?',
          hinglish: '2. Jab price bhaag kar sidha major resistance ke neeche khada ho, toh disciplined trader kya karta hai?',
        },
        options: [
          {
            en: 'Wait patiently for either a pullback toward ~24,740 support or a confirmed breakout + retest above 25,000',
            hinglish: 'Sabar (patience) rakhein—ya toh ~24,740 support ke paas pullback aane dein ya 25,000 ke upar breakout + retest hone dein',
          },
          {
            en: 'Buy weekly OTM Call options immediately out of FOMO',
            hinglish: 'FOMO mein aakar turant OTM Call options buy kar lein',
          },
          {
            en: 'Short with 10x leverage without waiting for any breakdown candle',
            hinglish: 'Bina kisi breakdown signal ke 10x leverage par short kar dein',
          },
        ],
        correctIndex: 0,
      },
    },
    outcomeExplanation: {
      en: 'Notice how buying right below resistance compressed the reward while inflating the stop distance. Waiting for a pullback toward the 20-EMA improved the Risk/Reward from 1:0.16 to over 1:2.2.',
      hinglish: 'Resistance ke bilkul neeche buy karne se reward chhota aur stop-loss bohot bada ho jata hai. Pullback ka wait karne se Risk/Reward 1:2.2 se behtar ho gaya.',
    },
  },
  {
    id: 'chal-3',
    title: {
      en: 'Challenge #3: HDFCBANK Range Consolidation & ATR Stop Placement',
      hinglish: 'Challenge #3: HDFCBANK Range Consolidation aur ATR Stop Placement',
    },
    symbol: 'HDFCBANK',
    timeframe: '1D (Historical Simulation)',
    level: 'intermediate',
    setupContext: {
      en: 'HDFC Bank is trading inside a defined range between ₹1,680 Support and ₹1,755 Resistance with an ATR(14) of ₹24.',
      hinglish: 'HDFC Bank ₹1,680 Support aur ₹1,755 Resistance ke beech trade kar raha hai, aur iska 14-day ATR ₹24 hai.',
    },
    visibleCandles: hdfcCandles.slice(0, 34),
    hiddenCandles: hdfcCandles.slice(34, 46),
    supportZone: 1680,
    resistanceZone: 1755,
    suggestedEntry: 1692,
    suggestedStop: 1666,
    suggestedTarget: 1750,
    questions: {
      trendQuestion: {
        prompt: {
          en: '1. Why shouldn’t a swing trader set a tiny ₹3 stop-loss on HDFC Bank when its daily ATR is ₹24?',
          hinglish: '1. Jab HDFC Bank ka daily ATR ₹24 hai, toh swing trade mein sirf ₹3 ka chhota stop-loss kyun nahi lagana chahiye?',
        },
        options: [
          {
            en: 'Because ₹3 is inside normal intraday noise (1/8th of ATR) and will almost certainly get stopped out randomly.',
            hinglish: 'Kyunki ₹3 normal daily fluctuation (noise) ke andar hai aur bina trend badle hi turant hit ho jayega.',
          },
          {
            en: 'Because tighter stops always increase win rate to 99%.',
            hinglish: 'Kyunki ₹3 ka stop-loss lagane se win rate 99% ho jata hai.',
          },
          {
            en: 'Because NSE does not allow stops smaller than ₹50.',
            hinglish: 'Kyunki NSE ₹50 se chhota stop-loss allow nahi karta.',
          },
        ],
        correctIndex: 0,
      },
      actionQuestion: {
        prompt: {
          en: '2. How do you accommodate a wider ATR-based stop (e.g. ₹26 stop distance) without increasing your rupee risk?',
          hinglish: '2. Agar aap ATR ke hisaab se ₹26 ka logical stop-loss lagate hain, toh apna rupee risk badhaye bina trade kaise lenge?',
        },
        options: [
          {
            en: 'Reduce share quantity using Position Size = Max Rupee Risk ÷ ₹26',
            hinglish: 'Shares ki quantity kam karke (Position Size = Max Rupee Risk ÷ ₹26)',
          },
          {
            en: 'Keep the same large share quantity and hope the stop is not hit',
            hinglish: 'Quantity utni hi badi rakhein aur bhagwan bharose chhod dein',
          },
          {
            en: 'Trade without a stop-loss',
            hinglish: 'Stop-loss lagana hi band kar dein',
          },
        ],
        correctIndex: 0,
      },
    },
    outcomeExplanation: {
      en: 'Setting stops outside normal volatility noise (1× to 1.5× ATR beyond structure) while adjusting share quantity downward keeps both your win probability and rupee risk balanced.',
      hinglish: 'Support ke neeche ATR buffer dekar stop-loss lagana aur uske hisaab se quantity kam rakhna professional risk management ka sabse bada secret hai.',
    },
  },
];

export const BEHAVIORAL_SCENARIOS: BehavioralScenario[] = [
  {
    id: 'beh-1',
    title: {
      en: 'Scenario 1: Three Consecutive Stop-Losses in a Row',
      hinglish: 'Scenario 1: Lagatar 3 Trades mein Stop-Loss Hit Hona',
    },
    situation: {
      en: 'You followed your rules on your first 3 trades of the week, risking 1% (₹1,000) each, and all 3 hit their stop-loss (-₹3,000 total). Now a 4th setup appears on your screen. What should you do?',
      hinglish: 'Aapne is hafte apne pehle 3 trades mein rules follow kiye (har trade mein 1% yaani ₹1,000 risk), par teeno mein stop-loss hit ho gaya (-₹3,000). Ab 4th setup samne aaya hai. Aap kya karenge?',
    },
    biasTested: 'Revenge Trading & Gambler’s Fallacy',
    options: [
      {
        label: {
          en: 'Pause for 2 minutes: check if your daily loss limit is breached, verify if the 4th setup meets 100% of your written rules, and if valid, trade it with standard (or 0.5%) risk—never double size.',
          hinglish: '2 minute rukein: pehle daily loss limit check karein, phir dekhein kya setup 100% written rules par khara utarta hai. Agar haan, toh normal (ya 0.5%) risk par hi trade lein—size double bilkul na karein.',
        },
        isProcessDisciplined: true,
        feedback: {
          en: 'Correct! Even a 60% win-rate system has losing streaks of 3–4 trades. Process discipline means evaluating the setup objectively and keeping risk constant.',
          hinglish: 'Bilkul sahi! 60% win-rate wali strategy mein bhi lagatar 3–4 losses aana normal math hai. Rules check karna aur risk control mein rakhna hi asli discipline hai.',
        },
      },
      {
        label: {
          en: 'Triple your position size on the 4th trade because "after 3 losses, the 4th trade is guaranteed to win" and you want your ₹3,000 back immediately.',
          hinglish: 'Chauthe trade mein 3 guna (3x) quantity le lein kyunki "3 loss ke baad chautha toh pakka chalega" aur ₹3,000 aaj hi wapas nikalna hai.',
        },
        isProcessDisciplined: false,
        feedback: {
          en: 'Trap Alert (Gambler’s Fallacy + Revenge Trading): Independent trades do not "owe" you a win. Tripling size turns a normal -3% dip into a -6% emotional spiral.',
          hinglish: 'Khatra (Revenge Trading): Market ko yaad nahi hai ki aapke pichle 3 trades loss mein gaye hain. Size 3x karne se ek aur loss aapka bada drawdown kara dega.',
        },
      },
    ],
  },
  {
    id: 'beh-2',
    title: {
      en: 'Scenario 2: Price Approaches Your Stop-Loss Level',
      hinglish: 'Scenario 2: Price Aapke Stop-Loss ke Bilkul Paas Aa Raha Hai',
    },
    situation: {
      en: 'You bought TATAMOTORS at ₹985 with a logical stop-loss at ₹970 below support. Price drops to ₹971.50. You feel tempted to drag your stop-loss down to ₹945 so it doesn’t trigger.',
      hinglish: 'Aapne TATAMOTORS ₹985 par buy kiya aur support ke neeche ₹970 par stop-loss lagaya. Ab price gir kar ₹971.50 par aa gaya hai aur aapka mann kar raha hai ki stop-loss khiska kar ₹945 kar dein.',
    },
    biasTested: 'Loss Aversion & Moving Stops',
    options: [
      {
        label: {
          en: 'Leave the stop-loss untouched at ₹970. If ₹970 breaks, your original entry thesis is invalidated—accept the planned 1R loss and protect capital.',
          hinglish: 'Stop-loss ko ₹970 par hi rehne dein. Agar ₹970 toot gaya toh aapka trade logic galat sabit ho chuka hai—planned 1R loss accept karein aur bada capital bachayein.',
        },
        isProcessDisciplined: true,
        feedback: {
          en: 'Spot on. A stop-loss is the exact price where your idea is proven wrong. Honoring it keeps every loss small and predictable.',
          hinglish: 'Shandar! Stop-loss woh level hai jahan aapka setup invalid ho jata hai. Use respect karne se koi bhi ek trade aapka account kharab nahi kar sakta.',
        },
      },
      {
        label: {
          en: 'Cancel the stop-loss order and convert the intraday trade into an unplanned long-term holding.',
          hinglish: 'Stop-loss cancel kar dein aur intraday trade ko zabardasti "long-term investment" bana lein.',
        },
        isProcessDisciplined: false,
        feedback: {
          en: 'Trap Alert (Loss Aversion): Refusing to take a planned ₹1,000 loss is the #1 reason traders end up stuck with ₹15,000 unplanned drawdowns.',
          hinglish: 'Yeh sabse aam galti hai! ₹1,000 ka chhota planned stop-loss na lene ki zid aksar ₹15,000 ke bade loss mein badal jati hai.',
        },
      },
    ],
  },
];

export const SKILL_ASSESSMENT_QUESTIONS: LessonQuizQuestion[] = [
  {
    id: 'ass-1',
    category: 'marketBasics',
    question: {
      en: 'When you place a Limit Buy order at ₹2,950 while a stock trades at ₹2,965, what happens?',
      hinglish: 'Agar stock ₹2,965 par chal raha hai aur aap ₹2,950 ka Limit Buy order lagate hain, toh kya hoga?',
    },
    options: [
      {
        en: 'It executes only if price drops to ₹2,950 or lower during the session',
        hinglish: 'Yeh tabhi execute hoga jab price gir kar ₹2,950 ya usse neeche aayega',
      },
      {
        en: 'It executes immediately at ₹2,965',
        hinglish: 'Yeh turant ₹2,965 par buy ho jayega',
      },
      {
        en: 'It cancels all your Demat holdings',
        hinglish: 'Yeh aapke Demat shares bech dega',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'A Buy Limit order waits in the order book until sellers match your ₹2,950 limit price or better.',
      hinglish: 'Buy Limit order tab tak wait karta hai jab tak price aapke ₹2,950 limit level tak na aaye.',
    },
  },
  {
    id: 'ass-2',
    category: 'riskManagement',
    question: {
      en: 'Capital = ₹1,00,000. Max Risk = 1% (₹1,000). Entry = ₹400, Stop-Loss = ₹380. How many shares should you buy?',
      hinglish: 'Capital = ₹1,00,000. Max Risk = 1% (₹1,000). Entry = ₹400, Stop-Loss = ₹380 (₹20 risk/share). Kitne shares buy karne chahiye?',
    },
    options: [
      { en: '50 shares (₹1,000 ÷ ₹20)', hinglish: '50 shares (₹1,000 ÷ ₹20)' },
      { en: '250 shares (₹1,00,000 ÷ ₹400)', hinglish: '250 shares (₹1,00,000 ÷ ₹400)' },
      { en: '500 shares with margin', hinglish: 'Margin lekar 500 shares' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Position Size = Max Rupee Risk (₹1,000) ÷ Stop Distance (₹20) = 50 shares.',
      hinglish: 'Position Size = ₹1,000 Max Risk ÷ ₹20 Stop Distance = 50 shares.',
    },
  },
  {
    id: 'ass-3',
    category: 'technicalAnalysis',
    question: {
      en: 'What defines an intact Uptrend in price action analysis?',
      hinglish: 'Price Action ke mutabiq ek healthy Uptrend ki pehchan kya hai?',
    },
    options: [
      {
        en: 'A sequence of Higher Highs (HH) and Higher Lows (HL)',
        hinglish: 'Lagatar Higher Highs (HH) aur Higher Lows (HL) ka banna',
      },
      {
        en: 'RSI staying above 90 forever',
        hinglish: 'RSI ka hamesha 90 ke upar rehna',
      },
      {
        en: 'Lower Highs (LH) and Lower Lows (LL)',
        hinglish: 'Lower Highs (LH) aur Lower Lows (LL) banna',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Higher Highs and Higher Lows confirm buyers are stepping in at progressively higher support levels.',
      hinglish: 'Higher Highs aur Higher Lows dikhate hain ki buyers har dip par upar ke levels par active hain.',
    },
  },
  {
    id: 'ass-4',
    category: 'fundamentalAnalysis',
    question: {
      en: 'What does Return on Equity (ROE) measure for a long-term investor?',
      hinglish: 'Long-term investing mein Return on Equity (ROE) kya batata hai?',
    },
    options: [
      {
        en: 'How efficiently a company generates net profit from shareholders’ equity',
        hinglish: 'Shareholders ke capital par company kitni efficiency se net profit kama rahi hai',
      },
      {
        en: 'Today’s 5-minute intraday volume spike',
        hinglish: 'Aaj ka 5-minute intraday volume spike',
      },
      {
        en: 'The brokerage fee charged by the exchange',
        hinglish: 'Exchange dwara liya jane wala brokerage charge',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'ROE = Net Profit ÷ Shareholders’ Equity.',
      hinglish: 'ROE = Net Profit ÷ Shareholders’ Equity.',
    },
  },
  {
    id: 'ass-5',
    category: 'derivatives',
    question: {
      en: 'In Options trading, which Greek measures the daily loss of option premium due to the passage of time?',
      hinglish: 'Options trading mein waqt beetne (Time Decay) ke saath har din option premium kam hone ko kaunsa Greek maapta hai?',
    },
    options: [
      { en: 'Theta (Θ)', hinglish: 'Theta (Θ)' },
      { en: 'Delta (Δ)', hinglish: 'Delta (Δ)' },
      { en: 'Rho (ρ)', hinglish: 'Rho (ρ)' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Theta measures time decay—how much value an option loses each day as expiration approaches, all else equal.',
      hinglish: 'Theta (Θ) time decay batata hai—expiry paas aane par har din option ka kitna time-value kam hoga.',
    },
  },
];

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: 'g-vwap',
    term: 'VWAP (Volume Weighted Average Price)',
    category: 'Technical Analysis',
    definition: {
      en: 'The average price an asset has traded at throughout the day, weighted by both volume and price. Widely used by institutions and intraday traders to gauge fair intraday value.',
      hinglish: 'Din bhar mein kisi stock ka volume aur price dono ko mila kar banne wala average price. Intraday traders aur institutions fair value dekhne ke liye iska use karte hain.',
    },
    indianMarketExample: {
      en: 'If RELIANCE trades at ₹2,990 while its intraday VWAP is ₹2,972, buyers are in control above the volume-weighted average cost.',
      hinglish: 'Agar RELIANCE ₹2,990 par hai aur VWAP ₹2,972 par hai, toh price din ke average volume price ke upar strong hai.',
    },
    formula: 'VWAP = ∑(Typical Price × Volume) ÷ ∑(Volume)',
    relatedTab: 'markets',
  },
  {
    id: 'g-stoploss',
    term: 'Stop Loss & Position Sizing',
    category: 'Risk Management',
    definition: {
      en: 'A predefined exit order placed at the price level where your trade setup is invalidated, paired with a calculated share quantity so total rupee loss never exceeds 1%–2% of capital.',
      hinglish: 'Woh pehle se tay kiya gaya price level jahan aapka trade idea galat sabit ho jata hai. Iske saath quantity aise calculate ki jati hai ki loss aapke capital ke 1% se zyada na ho.',
    },
    indianMarketExample: {
      en: 'On a ₹1,00,000 account with 1% risk (₹1,000), if Entry is ₹500 and Stop is ₹490 (₹10 risk/share), you buy 100 shares.',
      hinglish: '₹1,00,000 capital par 1% risk (₹1,000) ke saath agar Entry ₹500 aur Stop ₹490 (₹10 diff) hai, toh 100 shares buy honge.',
    },
    formula: 'Shares = (Capital × Risk%) ÷ |Entry − Stop|',
    relatedTab: 'practice',
  },
  {
    id: 'g-drawdown',
    term: 'Maximum Drawdown (MDD)',
    category: 'Risk & Performance',
    definition: {
      en: 'The largest percentage drop in account equity from a peak to a subsequent trough before a new peak is achieved.',
      hinglish: 'Account ke sabse upar ke peak level se neeche ke low level tak ki sabse badi girawat (% mein).',
    },
    indianMarketExample: {
      en: 'If a portfolio grows from ₹1,00,000 to ₹1,20,000 and then falls to ₹96,000, the drawdown from the peak is (24,000 ÷ 1,20,000) = 20%.',
      hinglish: 'Agar portfolio ₹1,20,000 ke peak se gir kar ₹96,000 par aata hai, toh drawdown ₹24,000 ÷ ₹1,20,000 = 20% kehlayega.',
    },
    formula: 'MDD % = [(Peak Equity − Trough Equity) ÷ Peak Equity] × 100',
    relatedTab: 'journal',
  },
  {
    id: 'g-cagr',
    term: 'CAGR (Compound Annual Growth Rate)',
    category: 'Investing & Calculators',
    definition: {
      en: 'The annualized rate of return at which an investment would have grown if it compounded at a steady rate every year.',
      hinglish: 'Kisi investment ki har saal ki average compounding growth rate.',
    },
    indianMarketExample: {
      en: 'Growing ₹1,00,000 to ₹2,00,000 over 5 years in a Nifty 50 portfolio equals a CAGR of 14.87% per year.',
      hinglish: '5 saal mein ₹1,00,000 ka ₹2,00,000 banna 14.87% सालाना CAGR ke barabar hota hai.',
    },
    formula: 'CAGR = [(Ending Value ÷ Beginning Value)^(1 / Years)] − 1',
    relatedTab: 'practice',
  },
  {
    id: 'g-greeks',
    term: 'Options Greeks (Delta, Gamma, Theta, Vega)',
    category: 'Options Academy',
    definition: {
      en: 'Mathematical sensitivities of an option premium: Delta (price change), Gamma (rate of Delta change), Theta (daily time decay), and Vega (implied volatility change).',
      hinglish: 'Option premium kis cheez se kitna badlega uska ganit: Delta (price), Gamma (Delta ki speed), Theta (har din time galna), aur Vega (volatility ka asar).',
    },
    indianMarketExample: {
      en: 'A Nifty 25,000 Call with Delta 0.40 and Theta −₹18 gains ~₹40 if Nifty rises 100 points today, but loses ₹18 per day from time decay.',
      hinglish: 'Nifty 25,000 CE jiska Delta 0.40 aur Theta −₹18 hai, Nifty 100 pts badhne par ₹40 badhega par har din ₹18 time decay se ghatega.',
    },
    formula: 'ΔPremium ≈ (Delta × ΔPrice) + (Theta × ΔTime) + (Vega × ΔIV)',
    relatedTab: 'practice',
  },
  {
    id: 'g-stt',
    term: 'STT, SEBI Fees & Breakeven Friction',
    category: 'Indian Market Rules',
    definition: {
      en: 'Securities Transaction Tax (STT), Exchange Transaction Charges, Stamp Duty, SEBI Turnover Fees, and 18% GST are statutory deductions on every Indian market trade.',
      hinglish: 'Indian market mein har trade par lagne wale sarkari aur exchange charges (STT, Stamp Duty, SEBI fee, GST aur Brokerage).',
    },
    indianMarketExample: {
      en: 'Overtrading 15 scalping trades a day can generate ₹900+ in statutory taxes and brokerage even if your gross price P&L is flat.',
      hinglish: 'Din mein 15 baar overtrading karne se bina loss ke bhi ₹900+ sirf STT, GST aur brokerage mein kat sakte hain.',
    },
    relatedTab: 'practice',
  },
];

export const INITIAL_PAPER_POSITIONS: PaperPosition[] = [
  {
    id: 'pos-1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    direction: 'LONG',
    orderType: 'LIMIT',
    quantity: 25,
    entryPrice: 2956.0,
    currentPrice: 2984.5,
    stopLoss: 2920.0,
    targetPrice: 3040.0,
    riskAmount: 900,
    riskPctOfCapital: 0.9,
    estimatedCharges: 64.5,
    openedAt: '2026-09-28 09:45',
    strategyTag: 'Pullback to 20-EMA',
  },
];

export const INITIAL_PAPER_TRADES: PaperTradeRecord[] = [
  {
    id: 'trd-1',
    symbol: 'TCS',
    direction: 'LONG',
    quantity: 15,
    entryPrice: 4220.0,
    exitPrice: 4295.0,
    stopLoss: 4185.0,
    targetPrice: 4300.0,
    grossPnl: 1125.0,
    charges: 78.4,
    netPnl: 1046.6,
    rMultiple: 2.0,
    exitReason: 'TARGET_HIT',
    closedAt: '2026-09-25 14:20',
    strategyTag: 'Pullback to 20-EMA',
    followedStopRule: true,
  },
  {
    id: 'trd-2',
    symbol: 'HDFCBANK',
    direction: 'LONG',
    quantity: 40,
    entryPrice: 1728.0,
    exitPrice: 1708.0,
    stopLoss: 1708.0,
    targetPrice: 1768.0,
    grossPnl: -800.0,
    charges: 61.2,
    netPnl: -861.2,
    rMultiple: -1.0,
    exitReason: 'STOP_HIT',
    closedAt: '2026-09-26 11:10',
    strategyTag: 'Breakout',
    followedStopRule: true,
  },
  {
    id: 'trd-3',
    symbol: 'INFY',
    direction: 'LONG',
    quantity: 30,
    entryPrice: 1842.0,
    exitPrice: 1884.0,
    stopLoss: 1822.0,
    targetPrice: 1885.0,
    grossPnl: 1260.0,
    charges: 58.9,
    netPnl: 1201.1,
    rMultiple: 2.0,
    exitReason: 'TARGET_HIT',
    closedAt: '2026-09-27 15:05',
    strategyTag: 'Support Bounce',
    followedStopRule: true,
  },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'jrn-1',
    date: '2026-09-25',
    timeOfDay: 'Opening (9:15-10:30)',
    symbol: 'TCS',
    setup: 'Pullback to EMA/VWAP',
    direction: 'LONG',
    entryPrice: 4220,
    stopLoss: 4185,
    targetPrice: 4300,
    exitPrice: 4295,
    quantity: 15,
    netPnl: 1046.6,
    rMultiple: 2.0,
    reasonForTrade: 'Higher low bounce near 20-EMA with steady IT sector strength and 1:2.2 R:R.',
    emotion: 'Calm & Disciplined',
    mistake: 'None — Followed Plan',
    lessonLearned: 'Waiting for the pullback near ₹4,220 allowed a tight ₹35 stop and clean 2R execution.',
  },
  {
    id: 'jrn-2',
    date: '2026-09-26',
    timeOfDay: 'Midday (10:30-13:30)',
    symbol: 'HDFCBANK',
    setup: 'Breakout',
    direction: 'LONG',
    entryPrice: 1728,
    stopLoss: 1708,
    targetPrice: 1768,
    exitPrice: 1708,
    quantity: 40,
    netPnl: -861.2,
    rMultiple: -1.0,
    reasonForTrade: 'Attempted midday range breakout without strong relative volume.',
    emotion: 'FOMO (Chasing)',
    mistake: 'Traded Outside Rules',
    lessonLearned: 'Midday breakouts on low volume often fail. Honored the ₹1,708 stop-loss strictly for a controlled -1R loss.',
  },
  {
    id: 'jrn-3',
    date: '2026-09-27',
    timeOfDay: 'Closing (13:30-15:30)',
    symbol: 'INFY',
    setup: 'Support Bounce',
    direction: 'LONG',
    entryPrice: 1842,
    stopLoss: 1822,
    targetPrice: 1885,
    exitPrice: 1884,
    quantity: 30,
    netPnl: 1201.1,
    rMultiple: 2.0,
    reasonForTrade: 'Retest of ₹1,835–₹1,840 demand zone with bullish engulfing candle and rising volume.',
    emotion: 'Calm & Disciplined',
    mistake: 'None — Followed Plan',
    lessonLearned: 'Sizing at 30 shares kept max risk at ₹600 (0.6% of capital) and allowed holding calmly to target.',
  },
];
