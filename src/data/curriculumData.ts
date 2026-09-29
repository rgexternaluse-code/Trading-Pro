import { CoursePath } from '../types';

export const COURSE_PATHS: CoursePath[] = [
  {
    id: 'path-fundamentals',
    code: 'PATH A',
    title: {
      en: 'Market Fundamentals & Indian Ecosystem',
      hinglish: 'Market Fundamentals aur Indian Market Ecosystem (NSE/BSE)',
    },
    subtitle: {
      en: 'Master how stocks, indices, NSE/BSE, Demat accounts, order execution, liquidity, and statutory charges work.',
      hinglish: 'Stocks, Indices, NSE/BSE, Demat account, Market vs Limit orders, liquidity aur STT/charges ko bilkul zero se samjhein.',
    },
    level: 'beginner',
    modulesCount: 13,
    lessons: [
      {
        id: 'les-fund-1',
        pathId: 'path-fundamentals',
        moduleNumber: 1,
        title: {
          en: 'Stocks, NSE/BSE Exchanges, Indices & Demat Architecture',
          hinglish: 'Stock Kya Hai? NSE/BSE, Nifty 50 aur Demat Account ka Role',
        },
        level: 'beginner',
        category: 'marketBasics',
        durationMinutes: 8,
        concept: {
          en: 'A stock (equity share) represents fractional ownership in a business. In India, shares trade on regulated exchanges (NSE & BSE) under SEBI oversight and are held electronically in a Demat account with CDSL or NSDL.',
          hinglish: 'Ek stock (share) kisi company mein aapki chhoti si hissedari (ownership) hoti hai. India mein shares NSE aur BSE exchange par trade hote hain (SEBI regulation ke under) aur aapke shares CDSL/NSDL ke Demat account mein safe rehte hain.',
        },
        simpleExplanation: {
          en: 'When a company like Reliance or TCS needs capital to grow, it divides ownership into crores of shares. Buyers and sellers meet electronically on the National Stock Exchange (NSE) or Bombay Stock Exchange (BSE). An index like Nifty 50 tracks the top 50 companies to measure overall market health.',
          hinglish: 'Jab kisi company ko grow karne ke liye capital chahiye hota hai, toh woh apni ownership ko shares mein baant deti hai. Broker app sirf ek medium hai—asli transaction NSE/BSE par hota hai aur shares aapke Demat account mein T+1 settlement par jama hote hain.',
        },
        realisticExample: {
          en: 'Suppose you buy 10 shares of TCS at ₹4,290 on NSE for long-term delivery. Your capital outlay is ₹42,900 plus statutory charges (~₹55 STT, stamp duty, GST). On T+1 day, those 10 shares are credited to your CDSL/NSDL Demat account.',
          hinglish: 'Maan lijiye aapne NSE par TCS ke 10 shares ₹4,290 ke bhav par delivery mein kharide. Total investment ₹42,900 + ~₹55 (STT aur stamp duty) hogi, aur agle trading day (T+1) woh 10 shares aapke Demat account mein aa jayenge.',
        },
        visualChartSymbol: 'NIFTY 50',
        visualChartAnnotation: {
          en: 'Nifty 50 Index: Notice how individual sector movements combine into a smoother benchmark trend.',
          hinglish: 'Nifty 50 Chart: Dekhiye kaise top 50 companies ka combined movement poore Indian market ki direction dikhata hai.',
        },
        commonMistakes: [
          {
            en: 'Confusing a stock price (e.g. ₹100 vs ₹4,000) with whether a company is cheap or expensive without checking Market Cap and P/E.',
            hinglish: 'Sirf ₹50 ka stock dekh kar use "sasta" samajhna aur ₹4,000 ke stock ko "mehenga" samajhna—bina Market Cap aur P/E dekhe.',
          },
          {
            en: 'Mixing up long-term investing (compounding business earnings over years) with intraday trading (capturing short-term price swings).',
            hinglish: 'Intraday trade mein loss hone par stop-loss katne ke bajaye use zabardasti "long-term investment" bana lena.',
          },
        ],
        quiz: [
          {
            id: 'q-fund-1',
            question: {
              en: 'Where are your purchased delivery shares actually stored in the Indian market?',
              hinglish: 'India mein jab aap delivery shares kharidte hain, toh woh kahan store hote hain?',
            },
            options: [
              {
                en: 'Inside the broker mobile app servers',
                hinglish: 'Broker ke mobile app server ke andar',
              },
              {
                en: 'In a Central Depository (CDSL / NSDL) Demat account under SEBI regulation',
                hinglish: 'SEBI regulated depository (CDSL ya NSDL) ke Demat account mein',
              },
              {
                en: 'In the Reserve Bank of India vault',
                hinglish: 'RBI ke bank locker mein',
              },
            ],
            correctIndex: 1,
            explanation: {
              en: 'Brokers only facilitate order routing; delivery shares are held in CDSL or NSDL depositories.',
              hinglish: 'Broker sirf order exchange tak pahunchata hai; aapke delivery shares CDSL ya NSDL depository mein safe rehte hain.',
            },
            category: 'marketBasics',
          },
        ],
        practicalExercise: {
          en: 'Open the Markets tab, compare NIFTY 50 and NIFTYBEES, and observe how the ETF mirrors the index movement.',
          hinglish: 'Markets tab mein jaakar NIFTY 50 aur NIFTYBEES ko compare karein aur dekhein kaise ETF index ko track karta hai.',
        },
        keyTakeaway: {
          en: 'Understand the market plumbing—exchanges, depositories, and settlement—before placing your first order.',
          hinglish: 'Pehla trade lene se pehle exchange, Demat, aur Investing vs Trading ka farq clear hona zaroori hai.',
        },
      },
      {
        id: 'les-fund-2',
        pathId: 'path-fundamentals',
        moduleNumber: 2,
        title: {
          en: 'Market Orders, Limit Orders, Bid-Ask Spread & Slippage',
          hinglish: 'Market Order vs Limit Order, Bid-Ask Spread aur Slippage',
        },
        level: 'beginner',
        category: 'marketBasics',
        durationMinutes: 10,
        concept: {
          en: 'Every trade requires a counterparty. The Bid is the highest price a buyer offers; the Ask is the lowest price a seller accepts. Market orders prioritize immediate execution; Limit orders prioritize price control.',
          hinglish: 'Har trade mein ek buyer aur ek seller hota hai. Bid sabse upar ka buying price hai aur Ask sabse neeche ka selling price. Market order turant execute hota hai, jabki Limit order aapke tay kiye hue price par hi execute hota hai.',
        },
        simpleExplanation: {
          en: 'If you place a Market Order in an illiquid stock or during a fast breakout, your order fills against available sellers at progressively higher prices—this difference between expected price and actual fill price is called Slippage.',
          hinglish: 'Agar aap kisi low-volume stock mein Market Order dalte hain, toh aapko mehange price par fill mil sakta hai. Expected price aur actual execution price ke is farq ko Slippage kehte hain.',
        },
        realisticExample: {
          en: 'RELIANCE shows Bid ₹2,984.40 and Ask ₹2,984.60 (a tight ₹0.20 spread). A small-cap stock might show Bid ₹410 and Ask ₹414 (a ₹4.00 or ~1% instant slippage cost if bought via Market Order).',
          hinglish: 'RELIANCE mein Bid ₹2,984.40 aur Ask ₹2,984.60 hota hai (sirf ₹0.20 ka spread). Wahin kisi illiquid stock mein Bid ₹410 aur Ask ₹414 ho sakta hai—wahan Market Order dalne par turant ₹4 प्रति share ka nuksan (slippage) lag jata hai.',
        },
        visualChartSymbol: 'RELIANCE',
        visualChartAnnotation: {
          en: 'High liquidity in RELIANCE keeps bid-ask spreads tight and minimizes execution slippage.',
          hinglish: 'RELIANCE mein high volume hone ki wajah se Bid-Ask spread bohot kam rehta hai aur slippage control mein rehta hai.',
        },
        commonMistakes: [
          {
            en: 'Using Market Orders during the 9:15 AM opening minute when spreads and volatility are widest.',
            hinglish: 'Subah 9:15 AM market khulte hi pehli minute mein Market Order dalna jab spread sabse zyada wide hota hai.',
          },
          {
            en: 'Ignoring STT, brokerage, and GST when scalping for tiny price moves.',
            hinglish: 'Chhote-chhote scalping trades mein Brokerage, STT aur GST ko bhool jana.',
          },
        ],
        quiz: [
          {
            id: 'q-fund-2',
            question: {
              en: 'Which order type guarantees that you will NOT pay more than ₹1,710 when buying HDFC Bank, though execution is not guaranteed if price stays above ₹1,710?',
              hinglish: 'Kaunsa order type yeh pakka karta hai ki HDFC Bank ₹1,710 ya usse kam par hi buy hoga, chahe order unfilled reh jaye?',
            },
            options: [
              {
                en: 'Market Buy Order',
                hinglish: 'Market Buy Order',
              },
              {
                en: 'Limit Buy Order at ₹1,710',
                hinglish: 'Limit Buy Order @ ₹1,710',
              },
              {
                en: 'Stop-Loss Market Order at ₹1,725',
                hinglish: 'Stop-Loss Market Order @ ₹1,725',
              },
            ],
            correctIndex: 1,
            explanation: {
              en: 'A Buy Limit order sets the maximum price you are willing to pay.',
              hinglish: 'Buy Limit order aapka maximum buying price fix kar deta hai taaki slippage na ho.',
            },
            category: 'marketBasics',
          },
        ],
        practicalExercise: {
          en: 'Go to Practice → Calculators → Brokerage & STT Calculator and inspect how much a ₹500 trade needs to move just to break even after fees.',
          hinglish: 'Practice → Calculators mein jaakar Brokerage & STT Calculator check karein ki charges nikalne ke liye kitna breakeven move chahiye.',
        },
        keyTakeaway: {
          en: 'Execution costs (Spread + Slippage + STT + Brokerage) are a guaranteed friction on every trade. Trade liquid instruments and use Limit orders.',
          hinglish: 'Spread, Slippage, STT aur Brokerage har trade ki pakki cost hai. Hamesha liquid stocks mein Limit order ka istemal karein.',
        },
      },
    ],
  },
  {
    id: 'path-risk',
    code: 'PATH B',
    title: {
      en: 'Risk Management & Capital Preservation Engine',
      hinglish: 'Risk Management aur Capital Preservation Mastery',
    },
    subtitle: {
      en: 'Why professional traders focus on Position Sizing, Stop Loss, R-Multiples, and Drawdown Math before entry signals.',
      hinglish: 'Entry signal se pehle Position Sizing, Stop Loss, 1% Risk Rule aur Drawdown Math kyun sabse zaroori hai.',
    },
    level: 'beginner',
    modulesCount: 10,
    lessons: [
      {
        id: 'les-risk-1',
        pathId: 'path-risk',
        moduleNumber: 1,
        title: {
          en: 'The 1% Rule, Stop-Loss Distance & Position Sizing Formula',
          hinglish: '1% Risk Rule, Stop-Loss Distance aur Sahi Position Sizing Formula',
        },
        level: 'beginner',
        category: 'riskManagement',
        durationMinutes: 12,
        concept: {
          en: 'Position Size = (Total Capital × Risk % per Trade) ÷ (Entry Price − Stop-Loss Price). Your quantity must shrink when your stop-loss is wider so your rupee risk stays constant.',
          hinglish: 'Position Size = (Total Capital × Risk %) ÷ (Entry Price − Stop-Loss Price). Jab stop-loss bada ho, toh quantity kam karni hoti hai taaki aapka rupee loss hamesha control mein (jaise ₹1,000) rahe.',
        },
        simpleExplanation: {
          en: 'Beginners buy a random round number of shares (like 100 or 500 shares) regardless of volatility. Professionals first decide how much money they are willing to lose if wrong (e.g., 1% of ₹1,00,000 = ₹1,000), place the stop-loss at a logical chart invalidation level, and divide ₹1,000 by the per-share stop distance.',
          hinglish: 'Beginners andaze se 100 ya 500 shares buy kar lete hain. Lekin professional trader pehle tay karta hai ki galat hone par maximum kitna rupya jayega (jaise ₹1,00,000 ka 1% = ₹1,000). Phir Entry aur Stop-Loss ke difference se ₹1,000 ko divide karke exact shares nikalta hai.',
        },
        realisticExample: {
          en: 'Capital = ₹1,00,000. Risk per trade = 1% (₹1,000 max loss). Setup A: Entry ₹500, Stop ₹490 → Risk/share = ₹10 → Buy 100 shares. Setup B: Entry ₹500, Stop ₹475 → Risk/share = ₹25 → Buy 40 shares. Both trades lose the exact same ₹1,000 if stopped out!',
          hinglish: 'Capital = ₹1,00,000. Risk = 1% (₹1,000). Setup A: Entry ₹500, Stop ₹490 → Risk/share = ₹10 → Quantity = 100 shares. Setup B: Entry ₹500, Stop ₹475 → Risk/share = ₹25 → Quantity = 40 shares. Dono cases mein stop-loss hit hone par sirf ₹1,000 ka hi loss hoga!',
        },
        visualChartSymbol: 'HDFCBANK',
        visualChartAnnotation: {
          en: 'Logical stop placement sits below structural support—never at an arbitrary rupee amount without adjusting share quantity.',
          hinglish: 'Stop-loss hamesha support level ke neeche lagta hai, aur uske hisaab se shares ki quantity calculate ki jati hai.',
        },
        commonMistakes: [
          {
            en: 'Risking 10%–25% of capital on a single trade because a setup "looks sure." Four consecutive losses wipe out half the account.',
            hinglish: 'Ek hi trade mein 10%–20% capital risk par laga dena kyunki setup "100% pakka" lag raha tha.',
          },
          {
            en: 'Widening or deleting the stop-loss when price approaches it.',
            hinglish: 'Jab price stop-loss ke paas aaye toh dar ke maare stop-loss ko hata dena ya aur neeche shift kar dena.',
          },
        ],
        quiz: [
          {
            id: 'q-risk-1',
            question: {
              en: 'Your capital is ₹2,00,000 and you risk 1% per trade (₹2,000). You buy Infosys at ₹1,880 with a stop-loss at ₹1,860. What is your correct position size?',
              hinglish: 'Aapka capital ₹2,00,000 hai aur 1% risk (₹2,000) hai. Infosys Entry ₹1,880 aur Stop-Loss ₹1,860 hai (₹20 risk/share). Sahi quantity kya hogi?',
            },
            options: [
              {
                en: '100 shares (₹2,000 ÷ ₹20 risk per share)',
                hinglish: '100 shares (₹2,000 ÷ ₹20 risk per share)',
              },
              {
                en: '250 shares',
                hinglish: '250 shares',
              },
              {
                en: '500 shares using 5x intraday margin',
                hinglish: '5x margin lekar 500 shares',
              },
            ],
            correctIndex: 0,
            explanation: {
              en: '₹2,000 max rupee risk ÷ (₹1,880 − ₹1,860) = 100 shares. Even if intraday margin allows more shares, taking more increases your actual risk beyond 1%.',
              hinglish: '₹2,000 ÷ ₹20 = 100 shares. Broker chahe 5x margin de, zyada shares lene se aapka risk 1% se badhकर 5% ho jayega.',
            },
            category: 'riskManagement',
          },
        ],
        practicalExercise: {
          en: 'Use the Position Size Calculator in the Practice tab to test how changing your stop-loss from ₹10 to ₹25 changes your allowed share quantity.',
          hinglish: 'Practice tab ke Risk Calculator mein stop-loss ₹10 se ₹25 badal kar dekhein ki quantity kaise automatically adjust hoti hai.',
        },
        keyTakeaway: {
          en: 'You cannot control whether the next trade wins or loses, but you have 100% control over how much you lose if wrong.',
          hinglish: 'Agla trade profit dega ya loss yeh aapke haath mein nahi hai, par galat hone par kitna nuksan hoga yeh 100% aapke control mein hai.',
        },
      },
      {
        id: 'les-risk-2',
        pathId: 'path-risk',
        moduleNumber: 2,
        title: {
          en: 'Asymmetric Drawdown Math & Expectancy (Why 50% Loss Needs 100% Gain)',
          hinglish: 'Drawdown ka Ganit (50% Loss Recover Karne ke Liye 100% Return Kyun Chahiye?)',
        },
        level: 'intermediate',
        category: 'riskManagement',
        durationMinutes: 10,
        concept: {
          en: 'Drawdown recovery is non-linear: Recovery % = [Drawdown % ÷ (100% − Drawdown %)]. Meanwhile, positive Expectancy = (Win Rate × Avg Win R) − (Loss Rate × Avg Loss R).',
          hinglish: 'Drawdown recovery sidhi nahi hoti: agar ₹1,00,000 ghat kar ₹50,000 reh gaya (-50% drawdown), toh wapas ₹1,00,000 par aane ke liye ₹50,000 par +100% return banana padega!',
        },
        simpleExplanation: {
          en: 'A 10% drawdown requires an 11.1% gain to recover. A 20% drawdown requires 25%. A 50% drawdown requires 100%, and an 80% drawdown requires a 400% gain! Protecting against deep drawdowns via daily loss limits (e.g., 2%–3% max daily loss) keeps you in the game.',
          hinglish: '10% loss ko recover karne mein sirf 11.1% gain lagta hai, par 50% loss ke baad +100% gain chahiye. Isliye daily loss limit (max 2 trades ya max 2% daily loss) aapko bade drawdown se bachati hai.',
        },
        realisticExample: {
          en: 'A swing trader has only a 45% Win Rate, but keeps losses strictly at 1R (₹1,000) and winners at 2.5R (₹2,500). Over 20 trades: 9 wins × ₹2,500 = +₹22,500; 11 losses × ₹1,000 = −₹11,000. Net profit = +₹11,500 (+0.575R expectancy per trade) despite losing more than half the trades!',
          hinglish: 'Ek swing trader ka Win Rate sirf 45% hai, par uska loss 1R (₹1,000) aur average win 2.5R (₹2,500) hai. 20 trades mein 9 wins (+₹22,500) aur 11 losses (-₹11,000) ke baad bhi woh +₹11,500 net profit mein rehta hai!',
        },
        visualChartSymbol: 'BANKNIFTY',
        visualChartAnnotation: {
          en: 'Volatile instruments like BankNifty demand strict daily loss cutoffs to prevent emotional drawdown spirals.',
          hinglish: 'BankNifty jaise fast index mein daily loss limit fix rakhna aapko revenge trading aur bade drawdown se bachata hai.',
        },
        commonMistakes: [
          {
            en: 'Chasing a "90% win-rate" strategy that risks ₹5,000 to make ₹500—one bad day erases weeks of tiny wins.',
            hinglish: '90% win-rate ke chakkar mein ₹500 kamane ke liye ₹5,000 ka risk lena—ek bada loss saare profits saaf kar deta hai.',
          },
        ],
        quiz: [
          {
            id: 'q-risk-2',
            question: {
              en: 'If a trader loses 50% of their ₹1,00,000 account (dropping to ₹50,000), what percentage return on the remaining ₹50,000 is needed to get back to ₹1,00,000?',
              hinglish: 'Agar ₹1,00,000 ke account mein 50% drawdown ho jaye (bache ₹50,000), toh wapas ₹1,00,000 pahunchne ke liye kitna % gain chahiye?',
            },
            options: [
              { en: '50% gain', hinglish: '50% gain' },
              { en: '75% gain', hinglish: '75% gain' },
              { en: '100% gain', hinglish: '100% gain' },
            ],
            correctIndex: 2,
            explanation: {
              en: 'Making ₹50,000 on a ₹50,000 base requires a 100% return.',
              hinglish: '₹50,000 ke bache hue capital par ₹50,000 wapas kamane ke liye poore 100% return ki zaroorat hoti hai.',
            },
            category: 'riskManagement',
          },
        ],
        practicalExercise: {
          en: 'Open the Paper Trading Simulator and verify that every order you place has a defined Stop-Loss and a Risk/Reward ratio of at least 1:2.',
          hinglish: 'Paper Trading Simulator mein ek trade setup banayein jisme Risk 1% se kam ho aur Risk/Reward kam se kam 1:2 ho.',
        },
        keyTakeaway: {
          en: 'You do not need an 80% win rate to succeed; you need positive mathematical expectancy and drawdown control.',
          hinglish: 'Kamyabi ke liye 80% win-rate nahi, balki achha Risk/Reward (Expectancy) aur chhota drawdown chahiye.',
        },
      },
    ],
  },
  {
    id: 'path-technical',
    code: 'PATH C',
    title: {
      en: 'Technical Analysis & Price Action Structure',
      hinglish: 'Technical Analysis aur Price Action Structure (HH/HL, VWAP, ATR)',
    },
    subtitle: {
      en: 'Learn market structure (HH/HL, BOS, CHOCH), Support & Resistance zones, Volume, VWAP, RSI, and ATR as probability tools—not magic crystal balls.',
      hinglish: 'Market structure (HH/HL, BOS), Support/Resistance, Volume, VWAP aur ATR ko probability tool ki tarah samjhein—koi jaadu ki chhadi nahi.',
    },
    level: 'intermediate',
    modulesCount: 18,
    lessons: [
      {
        id: 'les-ta-1',
        pathId: 'path-technical',
        moduleNumber: 1,
        title: {
          en: 'Market Structure: Higher Highs (HH), Higher Lows (HL), BOS & False Breakouts',
          hinglish: 'Market Structure: Higher High (HH), Higher Low (HL), BOS aur False Breakouts',
        },
        level: 'intermediate',
        category: 'technicalAnalysis',
        durationMinutes: 14,
        concept: {
          en: 'An uptrend is a sequence of Higher Highs (HH) and Higher Lows (HL). A Break of Structure (BOS) occurs when price closes decisively past the prior swing high with volume. A Change of Character (CHOCH) occurs when price breaks the most recent Higher Low.',
          hinglish: 'Uptrend ka matlab hai price lagatar Higher High (HH) aur Higher Low (HL) bana raha hai. Jab pichla swing high strong candle aur volume ke saath toot-ta hai toh use Break of Structure (BOS) kehte hain, aur jab pichla Higher Low toot jaye toh trend weak (CHOCH) माना jata hai.',
        },
        simpleExplanation: {
          en: 'Indicators lag behind price because they are calculated from past candles. Reading raw price structure tells you where institutional demand (support) and supply (resistance) sit, and where your trade thesis is objectively invalidated.',
          hinglish: 'Indicators past price se bante hain isliye thoda late signal dete hain. Price Action structure aapko sidha batata hai ki buyers kahan active hain (Support/Demand) aur sellers kahan roke hue hain (Resistance/Supply).',
        },
        realisticExample: {
          en: 'RELIANCE forms Higher Lows at ₹2,910 and ₹2,945 while testing resistance at ₹2,980 three times. Instead of FOMO-buying right into ₹2,980 resistance, a disciplined trader either waits for a confirmed breakout + retest of ₹2,980 or buys near the Higher Low support with a tight stop below ₹2,940.',
          hinglish: 'RELIANCE ₹2,910 aur ₹2,945 par Higher Low bana raha hai aur ₹2,980 par resistance face kar raha hai. Resistance ke bilkul neeche FOMO mein buy karne ke bajaye ya toh ₹2,980 ke breakout + retest ka wait karein, ya pullback par ₹2,940 ke neeche stop-loss rakh kar plan karein.',
        },
        visualChartSymbol: 'RELIANCE',
        visualChartAnnotation: {
          en: 'Observe how Support and Resistance act as zones (not exact single-paisa lines) and how volume confirms structural breakouts.',
          hinglish: 'Support aur Resistance ek single line nahi balki ek "Zone" hote hain. Breakout ke waqt volume bar zaroor check karein.',
        },
        commonMistakes: [
          {
            en: 'Stacking 6 indicators (RSI + MACD + Stochastic + CCI) that all measure the same momentum and create analysis paralysis.',
            hinglish: 'Chart par 6–7 indicators laga lena jisse chart hi dikhna band ho jaye aur confusion badhe.',
          },
          {
            en: 'Buying extended breakout candles far away from EMA20/VWAP where the logical stop-loss is too wide.',
            hinglish: 'Badi green candle dekh kar FOMO mein top par buy kar lena jahan se stop-loss bohot door ho chuka ho.',
          },
        ],
        quiz: [
          {
            id: 'q-ta-1',
            question: {
              en: 'Why do many breakouts above a visible resistance level fail (creating a "bull trap")?',
              hinglish: 'Resistance ke upar kai breakouts fail hokar wapas neeche ("Bull Trap") kyun aa jate hain?',
            },
            options: [
              {
                en: 'Because late retail buyers chase an already-extended move without institutional volume, allowing large sellers to fill orders at resistance.',
                hinglish: 'Kyunki price pehle hi bina rest kiye door se bhaag kar aata hai, volume kam hota hai, aur late buyers top par trap ho jate hain.',
              },
              {
                en: 'Because technical analysis never works on equities.',
                hinglish: 'Kyunki charts kabhi kaam nahi karte.',
              },
              {
                en: 'Because the trader did not use enough indicators.',
                hinglish: 'Kyunki chart par 10 indicators nahi lage the.',
              },
            ],
            correctIndex: 0,
            explanation: {
              en: 'Breakouts after tighter consolidation near resistance with strong relative volume have higher follow-through than exhausted vertical spikes.',
              hinglish: 'Resistance ke paas consolidation (tight range) aur high volume ke baad aane wale breakouts zyada reliable hote hain.',
            },
            category: 'technicalAnalysis',
          },
        ],
        practicalExercise: {
          en: 'Launch Chart Challenge Mode in the Learn tab and test your ability to identify trend, support, resistance, and R:R on historical candles.',
          hinglish: 'Learn tab mein "Chart Challenge Mode" kholein aur chhupe hue candles ko reveal karne se pehle support, resistance aur R:R pehchanein.',
        },
        keyTakeaway: {
          en: 'Indicators are secondary context filters; Price Structure, Volume, and Risk/Reward Location are primary.',
          hinglish: 'Indicators sirf madad ke liye hain; asli decision Price Structure, Volume aur Risk/Reward location se aata hai.',
        },
      },
    ],
  },
  {
    id: 'path-investing',
    code: 'PATH D',
    title: {
      en: 'Long-Term Investing, Fundamentals & Portfolio Construction',
      hinglish: 'Long-Term Investing, Fundamental Ratios aur Portfolio Construction',
    },
    subtitle: {
      en: 'Evaluate P/E, P/B, ROE, ROCE, Free Cash Flow, Debt-to-Equity, SIP compounding, and asset allocation across Indian market cycles.',
      hinglish: 'P/E, P/B, ROE, ROCE, Cash Flow, Debt, SIP Compounding aur Asset Allocation se long-term wealth process seekhein.',
    },
    level: 'beginner',
    modulesCount: 22,
    lessons: [
      {
        id: 'les-inv-1',
        pathId: 'path-investing',
        moduleNumber: 1,
        title: {
          en: 'Fundamental Quality Metrics: ROE, ROCE, P/E, P/B & Debt Discipline',
          hinglish: 'Fundamental Analysis: ROE, ROCE, P/E, P/B aur Debt-to-Equity Samjhein',
        },
        level: 'beginner',
        category: 'fundamentalAnalysis',
        durationMinutes: 12,
        concept: {
          en: 'Return on Equity (ROE) and Return on Capital Employed (ROCE) measure how efficiently a company generates profit from capital. Price-to-Earnings (P/E) shows how much the market pays for ₹1 of annual earnings.',
          hinglish: 'ROE aur ROCE batate hain ki company apne lagaye hue paise par kitna % munafa kama rahi hai. P/E ratio batata hai ki ₹1 ki kamai ke badle market kitna daam de raha hai.',
        },
        simpleExplanation: {
          en: 'A low P/E ratio alone does not make a stock a bargain—sometimes a company has a low P/E because its debt is high or earnings are shrinking ("value trap"). Combining consistent ROCE (>15%), manageable Debt-to-Equity (<0.5 for non-financials), and positive operating cash flow filters out weak balance sheets.',
          hinglish: 'Sirf kam P/E dekh kar stock mat kharidein—kai baar bhari karz (high debt) ya girte hue business ki wajah se P/E kam hota hai (Value Trap). Achha ROCE (>15%), kam Debt (<0.5) aur asli Cash Flow dekhna zaroori hai.',
        },
        realisticExample: {
          en: 'Compare TCS (ROE ~51%, Debt/Equity 0.08, P/E ~31) with a cyclical auto company like Tata Motors (P/E ~11.8, Debt/Equity 1.12). Different sectors have different capital structures; always compare a company’s P/E against its own sector peers and historical median.',
          hinglish: 'TCS (ROE ~51%, Debt 0.08, P/E ~31) ko kisi auto ya banking stock se sidha compare nahi kar sakte. Hamesha IT stock ko IT sector se aur Bank ko Price-to-Book (P/B) ke basis par doosre banks se compare karein.',
        },
        visualChartSymbol: 'TCS',
        visualChartAnnotation: {
          en: 'High-ROCE businesses with low debt compound steadily over multi-year horizons.',
          hinglish: 'High ROCE aur zero debt wali companies long-term mein steady compounding karti hain.',
        },
        commonMistakes: [
          {
            en: 'Using P/E ratio to value banks/NBFCs instead of Price-to-Book (P/B), ROA, and Net NPA.',
            hinglish: 'Banks aur NBFCs ke liye P/B aur NPA dekhne ke bajaye sirf P/E dekhna.',
          },
          {
            en: 'Stopping SIP contributions during market corrections when index valuations actually become more attractive.',
            hinglish: 'Jab market 10%–15% girta hai aur units sasti milti hain, tab dar kar apni SIP band kar dena.',
          },
        ],
        quiz: [
          {
            id: 'q-inv-1',
            question: {
              en: 'Which metric is most appropriate for evaluating a bank like HDFC Bank alongside its asset quality?',
              hinglish: 'HDFC Bank jaise banking stock ko evaluate karne ke liye Debt-to-Equity ke bajaye kaunsa valuation ratio sabse upyogi hai?',
            },
            options: [
              {
                en: 'Price-to-Book (P/B) Ratio & Return on Equity (ROE)',
                hinglish: 'Price-to-Book (P/B) Ratio aur Return on Equity (ROE)',
              },
              {
                en: 'Inventory Turnover Ratio',
                hinglish: 'Inventory Turnover Ratio',
              },
              {
                en: '5-minute Stochastic Oscillator',
                hinglish: '5-minute Stochastic Indicator',
              },
            ],
            correctIndex: 0,
            explanation: {
              en: 'Because a bank’s raw material is money/deposits, Price-to-Book (P/B), ROE, NIM, and NPA levels are the primary fundamental metrics.',
              hinglish: 'Banks ka business hi deposits aur loans hai, isliye unhe Price-to-Book (P/B), ROE aur Net NPA se parakha jata hai.',
            },
            category: 'fundamentalAnalysis',
          },
        ],
        practicalExercise: {
          en: 'Go to Markets → Portfolio Simulator and compare the volatility and historical drawdown of Conservative, Balanced, and Growth allocations.',
          hinglish: 'Markets → Portfolio Simulator mein jaakar Conservative, Balanced aur Growth portfolios ka allocation aur drawdown compare karein.',
        },
        keyTakeaway: {
          en: 'Asset allocation and balance-sheet quality drive 90% of long-term investing outcomes.',
          hinglish: 'Long-term investing mein sahi Asset Allocation aur strong Balance Sheet sabse bada role nibhate hain.',
        },
      },
    ],
  },
  {
    id: 'path-psychology',
    code: 'PATH E',
    title: {
      en: 'Trading Psychology & Behavioral Biases',
      hinglish: 'Trading Psychology, FOMO, Revenge Trading aur Discipline',
    },
    subtitle: {
      en: 'Overcome FOMO, Revenge Trading, Loss Aversion, Confirmation Bias, and Overtrading using structured checklists.',
      hinglish: 'FOMO, Revenge Trading, Loss Aversion aur Overtrading ko rules aur journal checklist se kaise control karein.',
    },
    level: 'intermediate',
    modulesCount: 12,
    lessons: [
      {
        id: 'les-psy-1',
        pathId: 'path-psychology',
        moduleNumber: 1,
        title: {
          en: 'Loss Aversion, Revenge Trading & Thinking in Sample Sizes of 20 Trades',
          hinglish: 'Revenge Trading, Loss Aversion aur 20-Trade Sample Size Mindset',
        },
        level: 'intermediate',
        category: 'tradingPsychology',
        durationMinutes: 10,
        concept: {
          en: 'Loss aversion causes traders to cut winning trades prematurely ("lock in ₹400 profit") while holding losing trades past their stop-loss ("hope it comes back"). Thinking in 20-trade sample sizes detaches ego from any single outcome.',
          hinglish: 'Loss aversion ki wajah se trader profit me ₹400 dekhte hi dar kar nikal jata hai, lekin loss me ₹2,500 hone par bhi "wapas upar aayega" soch kar baitha rehta hai. Har trade ko 20-trade ke sample size ka ek hissa manna iska ilaj hai.',
        },
        simpleExplanation: {
          en: 'Even a strategy with a 60% win rate has a high statistical probability of experiencing 3 to 4 losses in a row over a 50-trade sample. If you double your lot size after 2 losses to "win back money fast" (revenge trading), you turn a normal statistical cluster into an account blowout.',
          hinglish: '60% win-rate wali acchi strategy mein bhi 50 trades ke dauran lagatar 3–4 stop-loss hit hona bilkul normal math hai. Agar aap 2 loss ke baad gussa hokar double quantity se "paisa wapas nikalne" (Revenge Trading) lagte hain, toh chhota loss bade disaster mein badal jata hai.',
        },
        realisticExample: {
          en: 'At 10:30 AM you take two valid setups and lose −₹1,000 each (−2R total). Your written rule states: "Maximum 2 losses per day." Closing the terminal saves your remaining ₹98,000 capital and preserves mental clarity for tomorrow.',
          hinglish: 'Subah 10:30 baje tak aapke 2 valid trades mein ₹1,000-₹1,000 ka stop-loss hit ho gaya (-2R). Aapka written rule kehta hai: "Din mein max 2 losses." Wahin terminal band karna aapke ₹98,000 capital aur dimag dono ko safe rakhta hai.',
        },
        visualChartSymbol: 'TATAMOTORS',
        visualChartAnnotation: {
          en: 'Choppy midday ranges frequently trigger revenge trades when traders refuse to step away after hitting their daily loss limit.',
          hinglish: 'Dopahar ke sideways market mein aksar woh traders overtrading karte hain jo subah ka loss cover karna chahte hain.',
        },
        commonMistakes: [
          {
            en: 'Judging a trade as "bad" just because it hit a valid stop-loss, or judging a reckless FOMO trade as "good" just because it got lucky.',
            hinglish: 'Rule follow karke stop-loss hit ho toh khud ko galat manna, aur bina stop-loss ke tukke se paisa ban jaye toh khud ko expert samajhna.',
          },
        ],
        quiz: [
          {
            id: 'q-psy-1',
            question: {
              en: 'You have lost 3 trades in a row following your plan. A 4th setup appears. What is the disciplined process response?',
              hinglish: 'Aapke lagatar 3 trades mein stop-loss hit ho chuka hai. Ab chautha (4th) setup dikh raha hai. Sahi process kya hona chahiye?',
            },
            options: [
              {
                en: 'Double your position size on the 4th trade so one win recovers all 3 losses immediately.',
                hinglish: 'Quantity double kar dein taaki ek hi trade mein teeno loss cover ho jayein.',
              },
              {
                en: 'Check if your daily max-loss limit is already reached; if not, verify whether the setup objectively meets 100% of your written checklist at normal (or reduced) risk.',
                hinglish: 'Pehle check karein ki daily loss limit cross toh nahi hui; agar nahi, toh dekhein kya setup 100% written rules match karta hai aur normal/chhote risk ke saath hi lein.',
              },
              {
                en: 'Remove the stop-loss on the 4th trade so it cannot get stopped out.',
                hinglish: 'Chauthe trade mein stop-loss hi na lagayein.',
              },
            ],
            correctIndex: 1,
            explanation: {
              en: 'Respect your daily loss circuit breaker first, and never increase size to chase losses.',
              hinglish: 'Sabse pehle daily loss limit check karein, aur loss cover karne ke liye kabhi bhi lot size bada na karein.',
            },
            category: 'tradingPsychology',
          },
        ],
        practicalExercise: {
          en: 'Complete the Behavioral Psychology Scenarios in the Learn tab and review the AI Behavioral Pattern Detector in the Journal tab.',
          hinglish: 'Learn tab mein Behavioral Scenarios solve karein aur Journal tab mein AI Pattern Analysis dekhein.',
        },
        keyTakeaway: {
          en: 'A good trade is one that follows your tested rules and risk limits—regardless of the single-trade result.',
          hinglish: 'Accha trade woh hai jisme aapne apne rules aur risk limit ko 100% follow kiya—chahe us ek trade ka result profit ho ya stop-loss.',
        },
      },
    ],
  },
  {
    id: 'path-quant-options',
    code: 'PATH F',
    title: {
      en: 'Options Greeks, Systematic Backtesting & Quant Lab',
      hinglish: 'Options Greeks, Backtesting Biases aur Algorithmic Quant Lab',
    },
    subtitle: {
      en: 'Understand Options payoffs, Implied Volatility, Theta decay, Backtest biases (Overfitting & Look-Ahead), and Python rule design.',
      hinglish: 'Options Payoff, Theta Decay, Implied Volatility, Backtest Biases (Overfitting/Look-Ahead) aur Python Algo rules seekhein.',
    },
    level: 'advanced',
    modulesCount: 16,
    lessons: [
      {
        id: 'les-quant-1',
        pathId: 'path-quant-options',
        moduleNumber: 1,
        title: {
          en: 'Options Greeks (Delta, Gamma, Theta, Vega) & Backtest Bias Auditing',
          hinglish: 'Options Greeks (Delta, Theta, Vega) aur Backtest Overfitting se Bachav',
        },
        level: 'advanced',
        category: 'derivatives',
        durationMinutes: 15,
        concept: {
          en: 'Option premium = Intrinsic Value + Extrinsic (Time + Volatility) Value. Delta measures sensitivity to price; Theta measures daily time decay; Vega measures sensitivity to Implied Volatility (IV). In backtesting, parameter curve-fitting creates an illusion of past perfection that fails out-of-sample.',
          hinglish: 'Option Premium = Intrinsic Value + Time/Volatility Value. Delta price movement ka asar batata hai, Theta har din galne wali time value batata hai, aur Vega Implied Volatility (IV) ka asar batata hai. Backtesting mein zyada filter lagane se "Overfitting" hoti hai jo live market mein fail ho jati hai.',
        },
        simpleExplanation: {
          en: 'If you buy an out-of-the-money (OTM) Nifty Call option before an event when IV is high, even if Nifty moves up slightly, a drop in IV (Vega crush) plus Theta decay can make the option lose value! Similarly, in systematic trading, always include realistic brokerage/STT/slippage and test across out-of-sample periods.',
          hinglish: 'Agar aap event se pehle mehenge IV par OTM Call option buy karte hain, toh Nifty thoda upar jane par bhi IV girne (Vega Crush) aur Theta decay ki wajah se option premium gir sakta hai! Isi tarah backtesting mein hamesha STT, brokerage aur slippage jod kar check karein.',
        },
        realisticExample: {
          en: 'Nifty 50 is at 24,850. A 25,000 CE expiring in 3 days trades at ₹85 with Delta 0.35 and Theta −₹22/day. If Nifty stays flat for 2 days, the option loses ~₹44 (>50% of its value) purely from time decay.',
          hinglish: 'Nifty 24,850 par hai aur 3 din baad expire hone wala 25,000 CE ₹85 par trade kar raha hai (Delta 0.35, Theta −₹22/day). Agar Nifty 2 din wahin ruka raha, toh sirf Theta decay se premium ₹85 se ghat kar ~₹41 reh jayega.',
        },
        visualChartSymbol: 'NIFTY 50',
        visualChartAnnotation: {
          en: 'Options payoffs at expiration differ from pre-expiration P&L due to Time Value (Theta) and Implied Volatility (Vega).',
          hinglish: 'Expiry ke din ka payoff aur expiry se pehle ka P&L alag hota hai kyunki beech mein Theta aur IV ka asar rehta hai.',
        },
        commonMistakes: [
          {
            en: 'Treating historical backtest CAGR as a guaranteed future return while ignoring look-ahead bias and transaction costs.',
            hinglish: 'Historical backtest ke return ko future ki guarantee maan lena aur slippage/charges ko ignore karna.',
          },
          {
            en: 'Buying far OTM options on expiry day without understanding probability of expiring worthless.',
            hinglish: 'Expiry ke din saste OTM options ko lottery ki tarah buy karna jinke zero hone ki probability sabse zyada hoti hai.',
          },
        ],
        quiz: [
          {
            id: 'q-quant-1',
            question: {
              en: 'What is "Overfitting" (Curve-Fitting) when building a backtested trading strategy?',
              hinglish: 'Strategy backtesting mein "Overfitting" ka kya matlab hota hai?',
            },
            options: [
              {
                en: 'Tuning too many specific parameters (e.g., RSI between 53.4 and 61.2 only on Tuesdays) to fit past noise rather than genuine market structure.',
                hinglish: 'Past data par achha profit dikhane ke liye bohot saare ajeeb parameters set kar dena jo future market mein kaam nahi karte.',
              },
              {
                en: 'Including brokerage and STT in the simulation.',
                hinglish: 'Backtest mein brokerage aur STT jodna.',
              },
              {
                en: 'Testing a strategy across multiple market regimes.',
                hinglish: 'Strategy ko bull aur bear dono market mein test karna.',
              },
            ],
            correctIndex: 0,
            explanation: {
              en: 'Overfitted strategies memorize historical noise and typically fail immediately in forward paper trading.',
              hinglish: 'Overfitted strategy past data ko rat leti hai par naye market data (out-of-sample) mein fail ho jati hai.',
            },
            category: 'algoTrading',
          },
        ],
        practicalExercise: {
          en: 'Go to Practice → Strategy & Backtest Lab, build a rule-based strategy, toggle Indian Brokerage/STT on and off, and observe the impact on Net Return.',
          hinglish: 'Practice → Strategy & Backtest Lab mein jaakar ek strategy test karein aur dekhein ki Brokerage/STT on-off karne se Net Return par kitna farq padta hai.',
        },
        keyTakeaway: {
          en: 'Backtests are for falsifying weak ideas and understanding drawdowns—never for claiming guaranteed future profits.',
          hinglish: 'Backtesting ka kaam kamzor ideas ko pehchanna aur maximum drawdown samajhna hai—future profit ki guarantee dena nahi.',
        },
      },
    ],
  },
];
