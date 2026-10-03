import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- SERVER-SIDE AUTHENTICATION & ROLE-BASED ACCESS CONTROL (SECTION 40) ---
const AUTH_SALT = 'ai_trading_academy_v1_salt';
function hashCredential(secret: string): string {
  return crypto.createHmac('sha256', AUTH_SALT).update(secret).digest('hex');
}

// Precomputed salted HMAC-SHA256 digests for default dev accounts (or env overrides)
// Admin: UserName = Master, Pass = Master@trading_pro1
// User:  UserName = User,   Pass = User@trading1
const ADMIN_EXPECTED_USER = (process.env.ADMIN_USERNAME || 'Master').trim();
const ADMIN_EXPECTED_PASS_HASH = process.env.ADMIN_PASSWORD
  ? hashCredential(process.env.ADMIN_PASSWORD)
  : hashCredential('Master@trading_pro1');

const LEARNER_EXPECTED_USER = (process.env.USER_USERNAME || 'User').trim();
const LEARNER_EXPECTED_PASS_HASH = process.env.USER_PASSWORD
  ? hashCredential(process.env.USER_PASSWORD)
  : hashCredential('User@trading1');

interface ServerSessionRecord {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  token: string;
  createdAt: string;
  expiresAt: number;
}

const activeSessions = new Map<string, ServerSessionRecord>();
const userProgressStore = new Map<string, Record<string, any>>();
const adminAuditLog: Array<{ id: string; timestamp: string; actor: string; action: string }> = [
  {
    id: 'audit-init',
    timestamp: new Date().toISOString(),
    actor: 'system',
    action: 'Initialized 18-Chapter Mastery Curriculum & RBAC Security Layer',
  },
];

function extractSession(req: express.Request): ServerSessionRecord | null {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

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

  // 5. AI Chart Drawing & Geometry Annotation Coach (Master Spec v2)
  app.post('/api/ai/grade-annotation', async (req, res) => {
    try {
      const {
        symbol,
        drawings = [],
        expectedSupport,
        expectedResistance,
        toleranceInr,
        deterministicGrade,
        language = 'en',
      } = req.body;

      const ai = getGenAIClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API key is not configured on the server.',
        });
      }

      const langInstruction =
        language === 'hinglish'
          ? 'Respond in supportive, educational Hinglish (Roman Hindi + English technical terms).'
          : 'Respond in clear, concise, educational English.';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Evaluate the user's drawn chart annotations on ${symbol}.
User Drawings: ${JSON.stringify(drawings)}
Ground Truth Support: ₹${expectedSupport} (±₹${toleranceInr})
Ground Truth Resistance: ₹${expectedResistance} (±₹${toleranceInr})
Deterministic Geometry Result: ${JSON.stringify(deterministicGrade)}
${langInstruction}`,
        config: {
          systemInstruction: SAFETY_POLICY_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              coachingFeedback: {
                type: Type.STRING,
                description:
                  'Educational coaching explaining how close the user drawings are to structural support/resistance zones and why ±0.5x ATR zone tolerance matters.',
              },
            },
            required: ['coachingFeedback'],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      res.status(500).json({
        error: error?.message || 'Could not grade chart annotations right now.',
      });
    }
  });

  // --- 6. AUTHENTICATION & ROLE-BASED ACCESS ENDPOINTS (SECTION 40) ---
  app.post('/api/auth/login', (req, res) => {
    const { username = '', password = '' } = req.body || {};
    const cleanUser = String(username).trim();
    const inputPassHash = hashCredential(String(password));

    let matchedAccount: Omit<ServerSessionRecord, 'token' | 'expiresAt'> | null = null;

    if (
      (cleanUser.toLowerCase() === ADMIN_EXPECTED_USER.toLowerCase() ||
        cleanUser.toLowerCase() === 'master@tradingacademy.in') &&
      inputPassHash === ADMIN_EXPECTED_PASS_HASH
    ) {
      matchedAccount = {
        id: 'usr-admin-master',
        username: 'Master',
        email: 'master@tradingacademy.in',
        displayName: 'Master (Academy Admin)',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z',
      };
    } else if (
      (cleanUser.toLowerCase() === LEARNER_EXPECTED_USER.toLowerCase() ||
        cleanUser.toLowerCase() === 'user@tradingacademy.in') &&
      inputPassHash === LEARNER_EXPECTED_PASS_HASH
    ) {
      matchedAccount = {
        id: 'usr-learner-01',
        username: 'User',
        email: 'user@tradingacademy.in',
        displayName: 'User (Learner Account)',
        role: 'user',
        createdAt: '2026-01-15T00:00:00Z',
      };
    }

    if (!matchedAccount) {
      return res.status(401).json({
        error: 'Invalid Username or Password. Please verify your credentials.',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const sessionRecord: ServerSessionRecord = {
      ...matchedAccount,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24h session
    };
    activeSessions.set(token, sessionRecord);

    adminAuditLog.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${sessionRecord.username} (${sessionRecord.role})`,
      action: `Authenticated via /api/auth/login (Role: ${sessionRecord.role.toUpperCase()})`,
    });

    return res.json({
      user: {
        id: sessionRecord.id,
        username: sessionRecord.username,
        email: sessionRecord.email,
        displayName: sessionRecord.displayName,
        role: sessionRecord.role,
        token: sessionRecord.token,
        createdAt: sessionRecord.createdAt,
      },
    });
  });

  app.get('/api/auth/session', (req, res) => {
    const session = extractSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Session expired or unauthenticated.' });
    }
    return res.json({
      user: {
        id: session.id,
        username: session.username,
        email: session.email,
        displayName: session.displayName,
        role: session.role,
        token: session.token,
        createdAt: session.createdAt,
      },
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    const session = extractSession(req);
    if (session) {
      activeSessions.delete(session.token);
    }
    return res.json({ ok: true });
  });

  // User-Isolated Mastery Progress Endpoints (Section 40.9 & 40.16)
  app.get('/api/user/progress', (req, res) => {
    const session = extractSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    const progress = userProgressStore.get(session.id) || {};
    return res.json({ userId: session.id, role: session.role, progress });
  });

  app.post('/api/user/progress', (req, res) => {
    const session = extractSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    const { progress } = req.body || {};
    if (progress && typeof progress === 'object') {
      userProgressStore.set(session.id, progress);
    }
    return res.json({ ok: true, userId: session.id });
  });

  // Admin-Protected Endpoints (Section 40.10: Enforced on Backend)
  app.post('/api/admin/chapters/update', (req, res) => {
    const session = extractSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthenticated request rejected.' });
    }
    if (session.role !== 'admin') {
      return res.status(403).json({
        error: '403 Forbidden: Normal User role cannot mutate curriculum, prerequisites, or mastery thresholds.',
      });
    }
    const { chapterId, masteryThreshold, prerequisiteChapterIds } = req.body || {};
    adminAuditLog.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${session.username} (admin)`,
      action: `Updated Chapter ${chapterId} rules (Mastery Threshold: ${masteryThreshold}%, Prerequisites: ${JSON.stringify(prerequisiteChapterIds)})`,
    });
    return res.json({
      ok: true,
      message: `Chapter ${chapterId} mastery configuration updated by Admin.`,
      auditLog: adminAuditLog.slice(0, 15),
    });
  });

  app.get('/api/admin/overview', (req, res) => {
    const session = extractSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthenticated request rejected.' });
    }
    if (session.role !== 'admin') {
      return res.status(403).json({
        error: '403 Forbidden: Admin role required to view system analytics and all users.',
      });
    }
    return res.json({
      metrics: {
        totalUsers: 2,
        totalChapters: 18,
        totalExercises: 54,
        auditEventsCount: adminAuditLog.length,
      },
      users: [
        {
          id: 'usr-admin-master',
          username: 'Master',
          email: 'master@tradingacademy.in',
          role: 'admin',
          chaptersMastered: 18,
          status: 'Active · Full Access',
        },
        {
          id: 'usr-learner-01',
          username: 'User',
          email: 'user@tradingacademy.in',
          role: 'user',
          chaptersMastered: Object.values(userProgressStore.get('usr-learner-01') || {}).filter(
            (p: any) => p?.status === 'mastered'
          ).length,
          status: 'Active · Mastery-Gated Path',
        },
      ],
      auditLog: adminAuditLog.slice(0, 15),
    });
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
