import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAFETY_POLICY_INSTRUCTION = `
CRITICAL FINANCIAL EDUCATION SAFETY & ACCURACY POLICY (MANDATORY):
1. You are the AI Trading & Investment Academy Tutor focused on Indian Markets (NSE/BSE, INR ₹, SEBI rules, Nifty 50, BankNifty, Equities, F&O).
2. Education Before Execution: Prioritize risk management, position sizing, stop-loss discipline, and rules-based processes.
3. No Guaranteed-Profit Messaging: NEVER promise guaranteed returns, 100% accurate signals, risk-free trading, or certain future price predictions.
4. Never blindly tell a user "Yes, buy this stock" or "Sell now." Instead, guide them through evaluating timeframe, entry thesis, fundamental factors, technical structure, risk/reward, stop-loss level, position size, and invalidation criteria.
5. Clearly distinguish between:
   - Facts & Formulas
   - Historical / Simulated Context
   - Assumptions & Scenario Analysis
   - Uncertain Outcomes & Risks
6. Always remind the learner that they remain responsible for their own financial decisions.
`;

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '12mb' }));

  // 1. Conversational AI Trading Tutor Endpoint
  app.post('/api/ai/tutor', async (req, res) => {
    try {
      const {
        message,
        mode = 'normal',
        language = 'en',
        skillLevel = 'beginner',
        history = [],
        userContext = {},
      } = req.body;

      const modeInstructions: Record<string, string> = {
        explain_new:
          'Mode: Explain Like I Am New. Use everyday analogies, avoid jargon or define every term simply, and use step-by-step Indian market (₹) examples.',
        normal:
          'Mode: Normal Balanced Tutor. Provide clear, structured educational explanations with practical NSE/BSE examples and risk checks.',
        quant:
          'Mode: Quant & Statistical Mode. Include mathematical formulas, expectancy equations, standard deviation/ATR concepts, sample size considerations, and bias checks.',
        teacher:
          'Mode: Socratic Teacher Mode. Explain the core framework briefly, then ask 2-3 targeted diagnostic questions to help the user think through their own setup and risk rules.',
        debug_strategy:
          'Mode: Debug My Strategy. Audit the user query or strategy for logical weaknesses: entry precision, exit rules, stop-loss placement, transaction costs (brokerage/STT/slippage), market regime vulnerability, and overfitting.',
      };

      const langInstruction =
        language === 'hinglish'
          ? 'Respond in natural, conversational Hinglish (Hindi written in Roman/English script mixed with standard English financial terms like Stop Loss, Support, Resistance, Position Size, Risk/Reward). Example style: "Dekhiye, jab aap intraday trade lete hain toh sabse pehle stop-loss aur risk per trade (1%) decide karna zaroori hai..."'
          : 'Respond in clear, professional, accessible English using Indian market examples (INR ₹, NSE/BSE).';

      const ai = getGenAIClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API key is not configured on the server.',
        });
      }

      const conversationHistory = Array.isArray(history)
        ? history
            .slice(-6)
            .map((h: { role: string; text: string }) => `${h.role.toUpperCase()}: ${h.text}`)
            .join('\n\n')
        : '';

      const prompt = `
User Skill Level: ${skillLevel}
Selected Tutor Mode: ${mode}
User Context: ${JSON.stringify(userContext)}

${conversationHistory ? `Recent Conversation:\n${conversationHistory}\n\n` : ''}
Current User Question: ${message}

Structure your answer clearly with markdown headings or bullet points covering:
1. Core Concept / Direct Educational Analysis
2. Step-by-Step Calculation or Indian Market (₹) Example
3. Assumptions, Uncertainties & What Could Invalidate This
4. Risk Management Takeaway
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `${SAFETY_POLICY_INSTRUCTION}\n${modeInstructions[mode] || modeInstructions.normal}\n${langInstruction}`,
        },
      });

      res.json({
        reply: response.text || 'Unable to generate response right now.',
        mode,
        language,
      });
    } catch (error: any) {
      console.error('AI Tutor error:', error?.message || error);
      res.status(500).json({
        error:
          error?.message ||
          'We could not reach the AI Tutor service right now. Please try again shortly.',
      });
    }
  });

  // 2. AI Chart Assistant (Multimodal Image + Structured Educational Analysis)
  app.post('/api/ai/chart-analyze', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/png', userNotes = '', language = 'en', presetContext = '' } = req.body;
      const ai = getGenAIClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API key is not configured on the server.',
        });
      }

      const langInstruction =
        language === 'hinglish'
          ? 'Write all field values in natural Hinglish (Roman Hindi + English trading terminology).'
          : 'Write all field values in clear, educational English.';

      const parts: any[] = [];
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        });
      }

      parts.push({
        text: `Analyze this trading chart educationally. ${presetContext ? `Chart Context: ${presetContext}.` : ''} ${userNotes ? `User Notes/Question: ${userNotes}` : ''}
Remember: Do NOT present uncertain chart interpretations as guaranteed predictions. Never say a breakout or reversal is 100% certain. ${langInstruction}`,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction: SAFETY_POLICY_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              whatISee: {
                type: Type.STRING,
                description: 'Objective visual features: trend structure (HH/HL or LH/LL), visible support/resistance zones, candlestick behavior, and indicators.',
              },
              whatItMayMean: {
                type: Type.STRING,
                description: 'Educational interpretation of the price action and buyer/seller balance.',
              },
              whatIsUncertain: {
                type: Type.STRING,
                description: 'Key uncertainties, false breakout risks, or missing timeframe/volume context.',
              },
              whatToCheck: {
                type: Type.STRING,
                description: 'Checklist of confirmations to inspect before considering any hypothetical setup.',
              },
              riskConsiderations: {
                type: Type.STRING,
                description: 'Where invalidation/stop-loss logically sits, position sizing rules, and R:R check.',
              },
              educationalTakeaway: {
                type: Type.STRING,
                description: 'One concise process-focused lesson from this chart.',
              },
            },
            required: [
              'whatISee',
              'whatItMayMean',
              'whatIsUncertain',
              'whatToCheck',
              'riskConsiderations',
              'educationalTakeaway',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('AI Chart Analyze error:', error?.message || error);
      res.status(500).json({
        error: error?.message || 'Could not analyze chart at this moment.',
      });
    }
  });

  // 3. AI Strategy Validator & Quant Auditor
  app.post('/api/ai/strategy-validate', async (req, res) => {
    try {
      const { strategy, language = 'en' } = req.body;
      const ai = getGenAIClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API key is not configured on the server.',
        });
      }

      const langInstruction =
        language === 'hinglish'
          ? 'Write all analysis in clear Hinglish (Roman Hindi + English technical terms).'
          : 'Write all analysis in clear, professional English.';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Audit the following trading strategy rules for completeness, testability, biases, and risk controls:\n${JSON.stringify(strategy, null, 2)}\n${langInstruction}`,
        config: {
          systemInstruction: SAFETY_POLICY_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategySpecification: {
                type: Type.STRING,
                description: 'Clear summary of how the entry, exit, filter, and sizing rules interact.',
              },
              missingRules: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Ambiguous or missing parameters (e.g. session cutoff, slippage, gap handling, max daily loss).',
              },
              potentialBiases: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Risks of look-ahead bias, overfitting, survivorship bias, or regime dependence.',
              },
              backtestChecklist: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Steps required to validate this strategy across bull, bear, and sideways Indian market regimes.',
              },
              riskChecklist: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Position sizing, brokerage/STT impact, and drawdown controls.',
              },
            },
            required: [
              'strategySpecification',
              'missingRules',
              'potentialBiases',
              'backtestChecklist',
              'riskChecklist',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('AI Strategy Validate error:', error?.message || error);
      res.status(500).json({
        error: error?.message || 'Could not validate strategy right now.',
      });
    }
  });

  // 4. AI Trading Journal Behavioral Pattern Analyzer
  app.post('/api/ai/journal-analyze', async (req, res) => {
    try {
      const { entries, language = 'en' } = req.body;
      const ai = getGenAIClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API key is not configured on the server.',
        });
      }

      const langInstruction =
        language === 'hinglish'
          ? 'Write all observations and action steps in supportive, objective Hinglish.'
          : 'Write all observations and action steps in supportive, objective English.';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analyze these user-recorded trading journal entries for behavioral and execution patterns. Present strictly as objective observations from recorded data, not psychological diagnoses:\n${JSON.stringify(entries, null, 2)}\n${langInstruction}`,
        config: {
          systemInstruction: SAFETY_POLICY_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryObservation: {
                type: Type.STRING,
                description: 'Overall process and discipline summary based on the recorded trades.',
              },
              detectedPatterns: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Specific data-backed observations (e.g., moving stops, revenge trading after a loss, FOMO entries).',
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Positive habits observed in the journal.',
              },
              recommendedLessons: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Specific process adjustments and academy modules to review next.',
              },
            },
            required: ['summaryObservation', 'detectedPatterns', 'strengths', 'recommendedLessons'],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('AI Journal Analyze error:', error?.message || error);
      res.status(500).json({
        error: error?.message || 'Could not analyze journal entries right now.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Trading & Investment Academy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
