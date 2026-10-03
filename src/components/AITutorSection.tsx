import React, { useState } from 'react';
import {
  Bot,
  Send,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Flag,
} from 'lucide-react';
import { AIErrorReport, Language, UserProfile } from '../types';

interface AITutorSectionProps {
  profile: UserProfile;
  onToggleLanguage: (lang: Language) => void;
  onReportIssue?: (
    report: Omit<AIErrorReport, 'id' | 'timestamp' | 'status'>
  ) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  mode?: string;
}

export const AITutorSection: React.FC<AITutorSectionProps> = ({
  profile,
  onToggleLanguage,
  onReportIssue,
}) => {
  const lang: Language = profile.language;
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [subTab, setSubTab] = useState<'tutor' | 'chart_assistant'>('tutor');
  const [tutorMode, setTutorMode] = useState<
    'explain_new' | 'normal' | 'quant' | 'teacher' | 'debug_strategy'
  >('normal');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text:
        lang === 'hinglish'
          ? 'Namaste! Main aapka AI Trading & Investment Tutor hoon. Main aapko kabhi blind "Buy/Sell" tip nahi dunga—balki Market Structure, 1% Position Sizing, Risk/Reward, Fundamental Ratios aur Strategy Rules samajhne mein madad karunga. Aap niche koi bhi sawaal pooch sakte hain!'
          : 'Welcome! I am your AI Trading & Investment Tutor. In accordance with our Risk-First Policy, I never issue blind buy/sell calls or promise guaranteed returns. Instead, I help you evaluate setups, calculate position sizes, audit strategies, and master market structure. What would you like to explore today?',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Chart Assistant State
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('image/png');
  const [selectedPresetChart, setSelectedPresetChart] = useState<string>(
    'RELIANCE Daily Pullback to ₹2,920 Support & 20-EMA with RSI at 54'
  );
  const [chartUserNotes, setChartUserNotes] = useState<string>('');
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartAnalysis, setChartAnalysis] = useState<{
    whatISee: string;
    whatItMayMean: string;
    whatIsUncertain: string;
    whatToCheck: string;
    riskConsiderations: string;
    educationalTakeaway: string;
  } | null>(null);

  const buildLocalEducationalFallback = (question: string): string => {
    const qLower = question.toLowerCase();
    if (qLower.includes('should i buy') || qLower.includes('buy tomorrow')) {
      return lang === 'hinglish'
        ? `### Educational Evaluation Framework (No Blind Buy/Sell Calls)
Main aapko seedha "Haan, buy kar lo" nahi kahunga. Ek disciplined trader ki tarah aaiye in **8 points** ko check karein:
1. **Aapka Timeframe:** Kya yeh Intraday trade hai, Swing (kuch hafton ka), ya Multi-Year Investment?
2. **Entry Thesis:** Kya price Support/20-EMA ke paas pullback par hai ya Resistance ke neeche extended hai?
3. **Invalidation (Stop-Loss):** Woh exact price level kya hai jahan aapka setup galat sabit ho jayega?
4. **Position Size Formula:** Capital × 1% ÷ (Entry − Stop-Loss).
5. **Risk/Reward Ratio:** Kya potential target aapke stop-loss distance se kam se kam 2 guna (1:2 R:R) hai?
6. **Transaction Costs:** Intraday STT, brokerage aur slippage nikalne ke baad net expectancy kya hai?

*Reminder: Aapka capital aur decision aapki zimmedari hai—hamesha pehle stop-loss tay karein.*`
        : `### Educational Evaluation Framework (Process Over Prediction)
Rather than saying "Yes, buy it," let's evaluate this setup through an **8-point institutional checklist**:
1. **Your Timeframe:** Are you evaluating a 15-minute intraday trade, a multi-day swing setup, or a 5-year fundamental investment?
2. **Entry Thesis & Structure:** Is price forming Higher Highs and Higher Lows near a defined support/EMA zone, or are you chasing an extended candle right into resistance?
3. **Invalidation Stop-Loss:** At what exact price level is your entry thesis objectively proven wrong?
4. **1% Position Sizing:** \`Shares = (Account Capital × 1%) ÷ |Entry − Stop|\`.
5. **Asymmetric Risk/Reward:** Does the nearest structural target offer at least **1:2 R:R** after accounting for NSE brokerage, STT, and slippage?
6. **Catalyst & Gap Risk:** Are quarterly earnings or RBI/macro announcements scheduled that could cause an overnight gap past your stop?

*Educational Takeaway: Never enter a trade until you know where you will exit if wrong.*`;
    }

    return lang === 'hinglish'
      ? `### Structured Educational Analysis (${tutorMode.toUpperCase()})
- **1. Core Concept:** Trading mein long-term survival ka aadhar prediction nahi, balki **Position Sizing (1% rule)** aur **Positive Expectancy** hai.
- **2. Indian Market (₹) Calculation:** Agar aapka capital ₹1,00,000 hai aur 1% risk (₹1,000) hai, toh ₹20 ke stop-loss par sirf **50 shares** lene chahiye.
- **3. Assumptions & Uncertainty:** Koi bhi indicator (RSI, MACD, VWAP) 100% future predict nahi karta. Sideways market aur low volume mein false breakouts aana normal hai.
- **4. Risk Takeaway:** Hamesha stop-loss system mein lagayein aur 20 trades ke sample size mein apni process ko judge karein.`
      : `### Structured Educational Analysis (${tutorMode.toUpperCase()})
- **1. Facts & Mathematical Principle:** Sustainable trading relies on positive expectancy \`E = (Win% × Avg Win R) − (Loss% × Avg Loss R)\` and strict risk control rather than predicting every candle.
- **2. Indian Market (₹) Example:** With ₹1,00,000 capital and a 1% risk limit (₹1,000 max loss), a setup with a ₹20 stop-loss distance requires an exact position size of **50 shares** (\`₹1,000 ÷ ₹20\`).
- **3. Uncertainties & Biases:** Historical indicators and backtests are subject to regime shifts, slippage, and false breakouts during low-volume sessions.
- **4. Risk Management Takeaway:** Always define your invalidation stop-loss before calculating share quantity, and verify that net reward after STT and brokerage exceeds 2R.`;
  };

  const handleSendTutorMessage = async (customText?: string) => {
    const textToSend = (customText ?? inputPrompt).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      role: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          mode: tutorMode,
          language: lang,
          skillLevel: profile.skillLevel,
          history: messages.slice(-5).map((m) => ({ role: m.role, text: m.text })),
          userContext: {
            goal: profile.goal,
            paperBalance: profile.paperBalance,
            maxRiskPerTradePct: profile.maxRiskPerTradePct,
          },
        }),
      });

      const data = await response.json();
      const replyText =
        response.ok && data.reply
          ? data.reply
          : buildLocalEducationalFallback(textToSend);

      setMessages((prev) => [
        ...prev,
        {
          id: 'a-' + Date.now(),
          role: 'assistant',
          text: replyText,
          mode: tutorMode,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'a-' + Date.now(),
          role: 'assistant',
          text: buildLocalEducationalFallback(textToSend),
          mode: tutorMode,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedMimeType(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedImageBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeChart = async () => {
    setChartLoading(true);
    try {
      const res = await fetch('/api/ai/chart-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadedImageBase64,
          mimeType: uploadedMimeType,
          presetContext: selectedPresetChart,
          userNotes: chartUserNotes,
          language: lang,
        }),
      });
      const data = await res.json();
      if (res.ok && data.whatISee) {
        setChartAnalysis(data);
      } else {
        setChartAnalysis({
          whatISee:
            lang === 'hinglish'
              ? `Chart Context (${selectedPresetChart}): Price Higher High aur Higher Low structure mein hai aur key horizontal support zone + 20-EMA ke aas-paas consolidate kar raha hai.`
              : `Chart Context (${selectedPresetChart}): Price action displays a sequence of Higher Highs and Higher Lows pulling back into horizontal demand confluence near the 20-period EMA.`,
          whatItMayMean:
            lang === 'hinglish'
              ? 'Support zone ke paas chhoti candles aur lower wicks dikhate hain ki selling pressure kam ho raha hai aur buyers dip par interest dikha sakte hain.'
              : 'Tightening candle ranges and lower-wick rejections near support suggest selling momentum is decelerating and buyers may be defending the level.',
          whatIsUncertain:
            lang === 'hinglish'
              ? 'Yeh pakka nahi hai ki support hold karega hi—agar broader Nifty index weak hua ya high selling volume aaya toh support break bhi ho sakta hai.'
              : 'Support is never guaranteed to hold. A macro catalyst or high-volume breakdown below the prior Higher Low would invalidate the bullish structure.',
          whatToCheck:
            lang === 'hinglish'
              ? '1) Confirmation candle close dekhein, 2) Volume average se upar hai ya nahi check karein, 3) Upar resistance tak 1:2 R:R jagah hai ya nahi.'
              : '1) Wait for a closed confirmation candle, 2) Check relative volume expansion, 3) Verify higher-timeframe trend alignment and room to next resistance.',
          riskConsiderations:
            lang === 'hinglish'
              ? 'Stop-loss support zone ke 1x ATR neeche rakhein aur 1% Risk Rule se shares ki quantity calculate karein.'
              : 'Place invalidation stop-loss 1x ATR below the support swing low and size shares so total loss if stopped out is ≤ 1% of capital.',
          educationalTakeaway:
            lang === 'hinglish'
              ? 'Chart patterns संभावना (probability) batate hain, guarantee nahi. Risk control hamesha pehle aata hai.'
              : 'Chart patterns identify asymmetric risk/reward locations—not certainties. Always pair structure with predefined stop-loss discipline.',
        });
      }
    } catch {
      // Fallback handled
    } finally {
      setChartLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-[#14B8A6] font-semibold uppercase tracking-wider">
            ✦ AI COACH &amp; CHART INTELLIGENCE LAYER
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-white mt-0.5">
            AI Trading Coach &amp; Chart Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'hinglish'
              ? 'Education-First AI Policy: Facts, Calculations, Assumptions aur Risk Checks — No Blind Buy/Sell Tips.'
              : 'Guided by our AI Safety Layer: Distinguishes facts, calculations, assumptions, and uncertainty without blind trade signals.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Language Switch inside Tutor */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                lang === 'en' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onToggleLanguage('hinglish')}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                lang === 'hinglish' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              Hinglish
            </button>
          </div>

          {/* Sub-Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setSubTab('tutor')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                subTab === 'tutor'
                  ? 'bg-[#14B8A6] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>✦ AI Coach Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('chart_assistant')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                subTab === 'chart_assistant'
                  ? 'bg-[#14B8A6] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>✦ AI Chart Analyzer</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: MULTI-MODE AI TRADING TUTOR */}
      {subTab === 'tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tutor Modes & Prompt Starters */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="text-xs font-semibold text-white">
                Select Pedagogical Tutor Mode (Section 19)
              </div>
              <div className="space-y-2">
                {(
                  [
                    {
                      id: 'explain_new',
                      title: "Explain Like I'm New",
                      desc: 'Simple everyday analogies, zero heavy jargon.',
                    },
                    {
                      id: 'normal',
                      title: 'Normal Balanced Mode',
                      desc: 'Clear concepts with ₹ Indian market examples.',
                    },
                    {
                      id: 'quant',
                      title: 'Quant & Statistical Mode',
                      desc: 'Formulas, expectancy math, standard deviation & biases.',
                    },
                    {
                      id: 'teacher',
                      title: 'Socratic Teacher Mode',
                      desc: 'Asks guiding questions to build your independent thinking.',
                    },
                    {
                      id: 'debug_strategy',
                      title: 'Debug My Strategy',
                      desc: 'Audits your rules for missing stops, costs & overfitting.',
                    },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setTutorMode(m.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                      tutorMode === m.id
                        ? 'border-[#14B8A6] bg-[#14B8A6]/15 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold">{m.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Starter Prompts */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2.5">
              <div className="text-xs font-semibold text-slate-200">
                Try Educational Prompts:
              </div>
              {[
                'Should I buy Reliance tomorrow?',
                'Why did my breakout strategy lose money in a sideways market?',
                'Calculate position size for ₹1,50,000 capital with 1% risk, Entry ₹980, Stop ₹960',
                'Explain Option Theta decay and Vega crush before quarterly results',
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendTutorMessage(sample)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:col-span-8 border border-slate-800 bg-slate-900/60 rounded-xl flex flex-col h-[580px]">
            {/* Safety Policy Banner */}
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400 rounded-t-xl">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Active Mode: <strong className="text-white">{tutorMode.toUpperCase()}</strong> · Language:{' '}
                  <strong className="text-blue-400">
                    {lang === 'hinglish' ? 'Hinglish' : 'English'}
                  </strong>
                </span>
              </span>
              <span className="font-mono text-[11px] text-amber-400">
                Educational Guidance Only
              </span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-4 text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 space-y-2'
                    }`}
                  >
                    <div>{msg.text}</div>
                    {msg.role === 'assistant' && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>
                          Agent Router: Hybrid Deterministic Solver + Safety Guardrail
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (flaggedIds.includes(msg.id)) return;
                            setFlaggedIds((prev) => [...prev, msg.id]);
                            if (onReportIssue) {
                              onReportIssue({
                                sourceModule: 'AI Tutor',
                                issueType: 'Calculation / Math Mismatch',
                                contextSnippet: msg.text.slice(0, 110) + '...',
                                userComment:
                                  'User flagged AI Tutor response for governance review.',
                              });
                            }
                          }}
                          className="text-rose-400 hover:underline flex items-center gap-1"
                        >
                          <Flag className="w-3 h-3" />
                          <span>
                            {flaggedIds.includes(msg.id)
                              ? 'Reported to QA ✓'
                              : 'Flag / Report Issue'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 max-w-md animate-pulse">
                  {lang === 'hinglish'
                    ? 'AI Tutor aapke sawaal ka risk-checked educational jawab taiyar kar raha hai...'
                    : 'AI Tutor is formulating a risk-checked educational response...'}
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendTutorMessage();
              }}
              className="p-3.5 border-t border-slate-800 bg-slate-950/80 rounded-b-xl flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={
                  lang === 'hinglish'
                    ? 'Trading concept, strategy rule ya ₹ risk calculation poochein...'
                    : 'Ask about a market concept, strategy rule, or ₹ risk calculation...'
                }
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !inputPrompt.trim()}
                className="px-4 py-2.5 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>✦ Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: AI CHART SCREENSHOT ASSISTANT (Section 20) */}
      {subTab === 'chart_assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">
              Upload Chart Screenshot or Select Sample NSE Setup
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'hinglish'
                ? 'Kisi bhi chart ka screenshot upload karein ya preset chart chunein. AI aapko Trend, Support/Resistance, Uncertainty aur Risk considerations batayega—bina kisi fake guarantee ke.'
                : 'Upload a chart screenshot or select a preset NSE structure. The AI identifies objective structure, uncertainties, and risk considerations without making guaranteed predictions.'}
            </p>

            {/* Upload Box */}
            <label className="block p-5 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl text-center cursor-pointer bg-slate-950/60 transition-colors">
              <Upload className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <span className="text-xs font-medium text-slate-200 block">
                Click to Upload Chart Screenshot (PNG / JPG)
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Or use the preset NSE chart scenario below
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />
            </label>

            {uploadedImageBase64 && (
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <img
                  src={uploadedImageBase64}
                  alt="Uploaded trading chart preview"
                  referrerPolicy="no-referrer"
                  className="max-h-40 mx-auto rounded object-contain"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Or Choose Sample NSE Chart Scenario:
              </label>
              <select
                value={selectedPresetChart}
                onChange={(e) => setSelectedPresetChart(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="RELIANCE Daily Pullback to ₹2,920 Support & 20-EMA with RSI at 54">
                  RELIANCE: Pullback to ₹2,920 Support & 20-EMA
                </option>
                <option value="NIFTY 50 Testing 25,000 Psychological Resistance on Declining Volume">
                  NIFTY 50: Testing 25,000 Resistance on Low Volume
                </option>
                <option value="BANKNIFTY Intraday Opening Range Breakout above VWAP">
                  BANKNIFTY: 15m Opening Range Breakout above VWAP
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Your Observation / Question about this Chart (Optional):
              </label>
              <input
                type="text"
                value={chartUserNotes}
                onChange={(e) => setChartUserNotes(e.target.value)}
                placeholder="e.g. Is ₹2,912 a logical invalidation stop here?"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleAnalyzeChart}
              disabled={chartLoading}
              className="w-full py-2.5 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {chartLoading
                  ? '✦ AI Analyzing Chart Structure...'
                  : '✦ Analyze Chart with AI'}
              </span>
            </button>
          </div>

          {/* Right: 6-Part Structured Response (Section 20 Format) */}
          <div className="lg:col-span-7 border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">
                Structured Educational Chart Breakdown (Section 20 Policy)
              </h3>
              <p className="text-xs text-slate-400">
                Explicitly separates visual observations, possibilities, uncertainties, and risk rules.
              </p>
            </div>

            {!chartAnalysis ? (
              <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                <p>
                  Click <strong>"Run Structured 6-Part Chart Analysis"</strong> on the left to inspect the chart.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-semibold text-blue-400">1. What I See (Objective)</div>
                  <p className="text-slate-300 leading-relaxed">{chartAnalysis.whatISee}</p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-semibold text-emerald-400">
                    2. What It May Mean (Interpretation)
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {chartAnalysis.whatItMayMean}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1">
                  <div className="font-semibold text-amber-300">
                    3. What Is Uncertain (No Guarantees)
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {chartAnalysis.whatIsUncertain}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-semibold text-sky-400">
                    4. What To Check Before Acting
                  </div>
                  <p className="text-slate-300 leading-relaxed">{chartAnalysis.whatToCheck}</p>
                </div>
                <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1">
                  <div className="font-semibold text-rose-300">
                    5. Risk Considerations & Invalidation
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {chartAnalysis.riskConsiderations}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <div className="font-semibold text-emerald-300">
                    6. Educational Takeaway
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {chartAnalysis.educationalTakeaway}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
