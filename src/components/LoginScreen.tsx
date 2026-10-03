import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
  BarChart2,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AuthSessionUser } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthSessionUser) => void;
  sessionExpiredMessage?: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  sessionExpiredMessage,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    sessionExpiredMessage || null
  );
  const [resetNotice, setResetNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Please enter both your Username and Password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.user) {
        setErrorMsg(
          data.error || 'Authentication failed. Please check your credentials.'
        );
        return;
      }

      onLoginSuccess(data.user as AuthSessionUser);
    } catch (err: any) {
      setErrorMsg(
        err?.message || 'Unable to reach authentication server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D19] text-[#F8FAFC] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Ambient radial background glows matching reference */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[360px] rounded-full bg-[#6366F1]/15 blur-[110px]" />
      <div className="pointer-events-none absolute top-40 left-1/3 w-[380px] h-[280px] rounded-full bg-[#14B8A6]/12 blur-[100px]" />

      <div className="w-full max-w-[980px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* LEFT COLUMN (OR TOP ON MOBILE): TRADELEARN HERO & 3 PILLAR CARDS (Screen 1 Reference) */}
        <div className="lg:col-span-7 bg-[#0B1325]/90 border border-[#1E2D4A] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14B8A6]/25 to-[#6366F1]/25 border border-[#14B8A6]/40 flex items-center justify-center text-[#14B8A6] shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-white leading-none">
                TradeLearn
              </div>
              <div className="text-[11px] text-[#94A3B8] font-medium tracking-wide mt-0.5">
                Learn • Practice • Grow
              </div>
            </div>
          </div>

          {/* Custom Candlestick & Trader Hero Illustration */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#0E1A32] to-[#091122] border border-[#1C2C4C] p-5 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_40%,rgba(20,184,166,0.16),transparent_65%)]" />
            <svg
              viewBox="0 0 480 185"
              className="w-full h-40 md:h-44 overflow-visible"
              aria-label="Learn Trading Step by Step Illustration"
            >
              {/* Subtle horizontal grid lines */}
              {[35, 75, 115, 155].map((y) => (
                <line
                  key={y}
                  x1="16"
                  y1={y}
                  x2="464"
                  y2={y}
                  stroke="#1B2A47"
                  strokeDasharray="3 4"
                  strokeWidth="1"
                />
              ))}

              {/* Glowing Upward Trend Curve */}
              <path
                d="M 28 148 Q 115 130, 185 95 T 355 58 L 445 24"
                fill="none"
                stroke="#22C55E"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <polygon points="452,18 436,20 444,33" fill="#22C55E" />

              {/* Background Candlesticks (Bullish #22C55E & Bearish #EF4444) */}
              {[
                { x: 40, h: 112, l: 158, o: 145, c: 122, bull: true },
                { x: 72, h: 104, l: 148, o: 122, c: 136, bull: false },
                { x: 104, h: 85, l: 138, o: 132, c: 96, bull: true },
                { x: 136, h: 64, l: 118, o: 96, c: 74, bull: true },
                { x: 168, h: 72, l: 122, o: 78, c: 106, bull: false },
                { x: 200, h: 48, l: 105, o: 98, c: 58, bull: true },
                { x: 232, h: 38, l: 88, o: 58, c: 46, bull: true },
                { x: 376, h: 46, l: 98, o: 84, c: 56, bull: true },
                { x: 410, h: 28, l: 78, o: 56, c: 34, bull: true },
              ].map((cd, i) => {
                const col = cd.bull ? '#22C55E' : '#EF4444';
                const top = Math.min(cd.o, cd.c);
                const height = Math.max(8, Math.abs(cd.c - cd.o));
                return (
                  <g key={i}>
                    <line
                      x1={cd.x}
                      y1={cd.h}
                      x2={cd.x}
                      y2={cd.l}
                      stroke={col}
                      strokeWidth="2.2"
                    />
                    <rect
                      x={cd.x - 8}
                      y={top}
                      width="16"
                      height={height}
                      rx="3"
                      fill={col}
                    />
                  </g>
                );
              })}

              {/* Stylized Learner with Laptop */}
              <g transform="translate(245, 42)">
                {/* Hoodie / Torso */}
                <path
                  d="M 28 84 C 28 58, 92 58, 92 84 L 102 128 L 18 128 Z"
                  fill="#4F46E5"
                />
                {/* Head */}
                <circle cx="60" cy="36" r="21" fill="#FDBA74" />
                {/* Hair */}
                <path
                  d="M 39 32 C 38 14, 82 12, 81 32 C 74 22, 48 22, 39 32 Z"
                  fill="#1E1B4B"
                />
                {/* Smile & Eyes */}
                <circle cx="52" cy="35" r="2" fill="#0F172A" />
                <circle cx="66" cy="35" r="2" fill="#0F172A" />
                <path
                  d="M 54 44 Q 59 48, 65 44"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Laptop Screen */}
                <rect
                  x="62"
                  y="78"
                  width="64"
                  height="44"
                  rx="6"
                  fill="#CBD5E1"
                  stroke="#94A3B8"
                  strokeWidth="2"
                />
                <circle cx="94" cy="100" r="5" fill="#64748B" />
                <rect
                  x="46"
                  y="122"
                  width="90"
                  height="6"
                  rx="3"
                  fill="#94A3B8"
                />
              </g>
            </svg>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              <span className="block text-white">Learn Trading</span>
              <span className="block bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#6366F1] bg-clip-text text-transparent">
                Step by Step
              </span>
            </h1>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-lg">
              Build your skills, gain confidence and master the markets — at
              your own pace.
            </p>
          </div>

          {/* 3 Feature Pillar Cards (Easy Lessons · Hands-on Practice · AI Tutor) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#101C34] border border-[#223254] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#60A5FA] flex items-center justify-center mx-auto">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white leading-snug">
                Easy Lessons
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-tight">
                Simple, clear and visual.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#101C34] border border-[#223254] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center mx-auto">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white leading-snug">
                Hands-on Practice
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-tight">
                Apply what you learn.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#101C34] border border-[#223254] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#C084FC] flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white leading-snug">
                AI Tutor
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-tight">
                Get personal guidance anytime.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SLEEK AUTHENTICATION CARD */}
        <div className="lg:col-span-5 bg-[#0B1325]/95 border border-[#1E2D4A] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] font-semibold">
              Account Sign In
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-xs text-[#94A3B8]">
              Log in to continue your 18-chapter trading mastery path.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-xs text-[#EF4444] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>✕ {errorMsg}</span>
            </div>
          )}

          {resetNotice && (
            <div className="p-3 rounded-2xl border border-[#F59E0B]/40 bg-[#F59E0B]/10 text-xs text-[#F59E0B]">
              ⚠ Password reset is managed by the Academy Administrator during
              private testing.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-username"
                className="block text-xs font-medium text-[#CBD5E1] mb-1.5"
              >
                Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username / Email"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#070D19] border border-[#223254] focus:border-[#6366F1] focus:outline-none text-sm text-[#F8FAFC] placeholder-[#64748B]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-[#CBD5E1]"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setResetNotice((prev) => !prev)}
                  className="text-xs text-[#60A5FA] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#070D19] border border-[#223254] focus:border-[#6366F1] focus:outline-none text-sm text-[#F8FAFC] placeholder-[#64748B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#5B5FEF] to-[#6366F1] hover:from-[#4F46E5] hover:to-[#5B5FEF] disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-[#6366F1]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{loading ? 'Signing In...' : 'Start Learning'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* SIGN UP SECTION — DISABLED AS REQUESTED ("Sign Up" only) */}
          <div className="pt-4 border-t border-[#1E2D4A] text-center space-y-2.5">
            <div className="text-xs text-[#94A3B8]">
              Don&apos;t have an account?
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full py-2.5 px-4 rounded-full border border-[#223254] bg-[#101C34]/60 text-[#64748B] text-xs font-semibold cursor-not-allowed flex items-center justify-center"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
