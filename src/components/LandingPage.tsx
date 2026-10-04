import React, { useState } from "react";
import { auth } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Sparkles, ArrowRight, Zap, Target, BookOpen, MessageSquare, Shield, Award, HelpCircle, Eye, EyeOff } from "lucide-react";
import { demoReport } from "./DemoData";
import ThreeBackground from "./ThreeBackground";

interface LandingPageProps {
  onLoginSuccess: (userId: string, email: string | null, isDemo: boolean) => void;
  onSeeDemoClick: () => void;
}

export default function LandingPage({ onLoginSuccess, onSeeDemoClick }: LandingPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [is3DInteractive, setIs3DInteractive] = useState(true);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        onLoginSuccess(result.user.uid, result.user.email, false);
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError("Sign-In popup is restricted or closed. Try utilizing 'Instant Sandbox Sign In' to test without popups!");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    onLoginSuccess("guest-sandbox-user", "guest@founderos.ai", true);
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-slate-100 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* 3D Interactive Background Scene */}
      <ThreeBackground isInteractive={is3DInteractive} />

      {/* Floating 3D Control Pill */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIs3DInteractive(!is3DInteractive)}
          className="px-3.5 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-white rounded-full shadow-2xl transition-all flex items-center space-x-2 cursor-pointer group"
          title="Toggle 3D Mouse Parallax & Motion"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping group-hover:bg-cyan-300" />
          {is3DInteractive ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
          <span>3D Parallax: {is3DInteractive ? "ON" : "PAUSED"}</span>
        </button>
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-20 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-3" id="brand-logo">
          <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">FounderOS</span>
            <span className="text-[10px] block font-mono text-sky-400 tracking-widest mt-[-2px] uppercase">Intelligence</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onSeeDemoClick}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            id="nav-demo-btn"
          >
            See Demo Report
          </button>
          <button
            onClick={handleGoogleLogin}
            className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15 text-white rounded-lg border border-white/10 transition-all flex items-center space-x-2"
            id="nav-login-google"
          >
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-6 backdrop-blur">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-300">Powered by Gemini 3.5 AI Core</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Turn Your Startup Idea <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500">
            Into a Real Business.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          FounderOS analyzes your idea, skills, market, competition, learning gaps, and execution roadmap to tell you exactly what to do next. It's like having a YC Partner, investor, and AI co-founder in one operating system.
        </p>

        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:via-indigo-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer"
            id="hero-cta-analyze"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Google Sign In & Analyze</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </>
            )}
          </button>

          <button
            onClick={handleGuestLogin}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            id="hero-cta-sandbox"
          >
            <span>Instant Sandbox Sign In</span>
          </button>
        </div>

        {/* Demo Button Link */}
        <div className="text-center">
          <button
            onClick={onSeeDemoClick}
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors underline decoration-dotted underline-offset-4"
          >
            <span>Or visual-check the example of YC-partner report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center text-white mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Complete Profile", desc: "Share your background, key skills, available weekly hours, and capital budget." },
            { step: "02", title: "Describe Startup", desc: "Submit your basic idea, target customer, problem statement, and revenue target." },
            { step: "03", title: "AI Generation", desc: "Our Gemini agent models run competitive benchmarks and validation checklists." },
            { step: "04", title: "Action Roadmaps", desc: "Get structural 30/60/90 days steps, skill modules, and the Build-vs-Learn ratio." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
              <span className="text-5xl font-mono text-slate-800/80 font-bold block mb-4 group-hover:text-blue-500/20 transition-colors">{item.step}</span>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 bg-slate-950/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">A SaaS Suite For Future Leaders</h2>
          <p className="text-slate-400 text-base">We synthesized years of product prototyping, incubations, and capital discovery models to help startup builders validate safely.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-amber-400" />, title: "Strategy Analyzer", desc: "Instant score validation matrixes detailing problem strength and market opportunity bounds." },
            { icon: <Target className="text-rose-400" />, title: "Founder-Idea Fit Gauge", desc: "Correlates skills against venture demands. Pinpoints missing experience before failure." },
            { icon: <BookOpen className="text-sky-400" />, title: "Dynamic Learning", desc: "Analyzes skills gaps and provides curated YouTube, FreeCodeCamp, Coursera, and MIT links." },
            { icon: <MessageSquare className="text-emerald-400" />, title: "AI Mentor Chat", desc: "A custom co-pilot trained on your exact background state, answering questions with context." },
            { icon: <Shield className="text-purple-400" />, title: "Competitor Benchmarking", desc: "Breaks down top competitor weaknesses and structures exact product differentiation angles." },
            { icon: <Award className="text-indigo-400" />, title: "Gamified XP Core", desc: "Tracks milestone metrics (customer calls, designs, pilots) to elevate your founder level." }
          ].map((feat, idx) => (
            <div key={idx} className="bg-white/[0.01] border border-white/5 p-8 rounded-2xl flex flex-col items-start hover:bg-white/[0.02] transition-all">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">{feat.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 text-sm">No hidden retainers. Leverage YC-caliber startup evaluations instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white/[0.01] border border-white/5 p-8 rounded-2xl flex flex-col justify-between relative">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">Sandbox</span>
              <h3 className="text-xl font-bold text-white mb-4">Guest Demo</h3>
              <div className="text-3xl font-extrabold text-white mb-6">$0 <span className="text-sm text-slate-500 font-normal">/ lifetiem</span></div>
              <ul className="space-y-3 mb-8 text-sm text-slate-400">
                <li className="flex items-center space-x-2"><span>✓ See completed Demo report</span></li>
                <li className="flex items-center space-x-2"><span>✓ Read Sarah's Case study</span></li>
                <li className="flex items-center space-x-2"><span>✓ Access UI sandbox boards</span></li>
              </ul>
            </div>
            <button onClick={handleGuestLogin} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors">
              Enter Sandbox Free
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-gradient-to-b from-sky-500/10 to-indigo-500/10 border-2 border-indigo-500 p-8 rounded-2xl flex flex-col justify-between relative shadow-lg shadow-indigo-500/5">
            <div className="absolute -top-3 right-4 px-3 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Most Popular</div>
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1 font-bold">Unlimited Access</span>
              <h3 className="text-xl font-bold text-white mb-4">Founder Pro</h3>
              <div className="text-3xl font-extrabold text-white mb-6">$49 <span className="text-sm text-slate-500 font-normal">/ lifetime</span></div>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                <li className="flex items-center space-x-2">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Analyze unlimited custom startup ideas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Generates complete 12-submodule analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Contextual AI Mentor chats with full memory</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Interactive Weekly Progress Audits</span>
                </li>
              </ul>
            </div>
            <button onClick={handleGoogleLogin} className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all">
              Unlock Pro Account
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center text-white mb-16">Accolades From Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { quote: "FounderOS completely reshaped our launching strategy. It told me to stop building code and focus on 10 customer interviews. Best $49 I've ever spent.", author: "Jameson C., SaaS Solo-founder", level: "Validator Level" },
            { quote: "I thought my idea was bulletproof. The Competitor Gap engine pointed out a critical billing flaw I missed. We pivoted inside a weekend.", author: "Aaria S., FinTech operator", level: "Builder Level" },
            { quote: "The AI Mentor is outstanding. It remembers my available hours (only 12 hours a week) and crafts highly compressed learning schedules.", author: "Daniel T., Weekend Builder", level: "Launcher Level" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/[0.01] border border-white/5 p-6 rounded-xl flex flex-col justify-between">
              <p className="text-sm text-slate-300 italic mb-6 leading-relaxed">"{item.quote}"</p>
              <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-lg border border-white/5">
                <div>
                  <h4 className="text-xs font-bold text-white">{item.author}</h4>
                  <span className="text-[10px] font-mono text-slate-500">{item.level}</span>
                </div>
                <Award className="w-4 h-4 text-sky-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center text-white mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "How deep is the analysis?", a: "FounderOS runs deep contextual Gemini instructions evaluating TAM estimation, competitor weak spots, design bottlenecks, technical folder structures, and provides direct free/paid web resources to learn skills." },
            { q: "Is my startup data secure?", a: "ABSOLUTELY. Your database entries are governed under highly secured Firebase rules. Only authenticated owners can query or access their active records." },
            { q: "Do I need technical skills to use this?", a: "No! The system is designed to identify exactly if your idea fits your skillset, suggesting whether to 'Build vs. Learn', outsource, or validate simple no-code configurations." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/[0.01] border border-white/5 p-6 rounded-xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>{item.q}</span>
              </h3>
              <p className="text-sm text-slate-400 pl-7 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-300">FounderOS platform</span>
          </div>
          <div>© 2026 FounderOS Inc. All rights reserved. Built for visionaries and startup builders.</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
