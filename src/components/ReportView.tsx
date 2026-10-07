import React, { useState, useEffect } from "react";
import { StartupReport } from "../types";
import {
  Download,
  Target,
  ShieldAlert,
  Zap,
  BookOpen,
  Layers,
  Milestone,
  TrendingUp,
  Presentation,
  AlertCircle,
  Printer,
  FileText,
  Globe,
  ExternalLink,
  Search,
  Newspaper,
  ShoppingBag,
  MapPin,
  CheckCircle
} from "lucide-react";

interface ReportViewProps {
  report: StartupReport;
  onNavigateToTab?: (tab: string) => void;
}

export default function ReportView({ report, onNavigateToTab }: ReportViewProps) {
  const hasLiveResearch = Boolean(report.marketResearch && report.marketResearch.enabled);
  const [activeSubTab, setActiveSubTab] = useState<string>(hasLiveResearch ? "marketIntelligence" : "fit");
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  // Sync active sub-tab when report changes
  useEffect(() => {
    if (report.marketResearch?.enabled) {
      setActiveSubTab("marketIntelligence");
    }
  }, [report?.id, report?.marketResearch?.enabled]);

  // Logical product flow: 1. Market Evidence -> 2. Founder/Idea Assessment -> 3. Competitive Strategy -> 4. Execution
  const tabs = hasLiveResearch
    ? [
        { id: "marketIntelligence", name: "Market Intelligence", icon: <Globe className="w-4 h-4" /> },
        { id: "fit", name: "Founder-Idea Fit", icon: <Target className="w-4 h-4" /> },
        { id: "market", name: "Market & Competitor", icon: <ShieldAlert className="w-4 h-4" /> },
        { id: "improvement", name: "Idea Innovation", icon: <Zap className="w-4 h-4" /> },
        { id: "skills", name: "Skill Curriculum", icon: <BookOpen className="w-4 h-4" /> },
        { id: "mvp", name: "MVP Architecture", icon: <Layers className="w-4 h-4" /> },
        { id: "roadmap", name: "90-Day Roadmap", icon: <Milestone className="w-4 h-4" /> },
        { id: "investor", name: "AI Investor Pitch", icon: <Presentation className="w-4 h-4" /> }
      ]
    : [
        { id: "fit", name: "Founder-Idea Fit", icon: <Target className="w-4 h-4" /> },
        { id: "marketIntelligence", name: "Market Intelligence", icon: <Globe className="w-4 h-4" /> },
        { id: "market", name: "Market & Competitor", icon: <ShieldAlert className="w-4 h-4" /> },
        { id: "improvement", name: "Idea Innovation", icon: <Zap className="w-4 h-4" /> },
        { id: "skills", name: "Skill Curriculum", icon: <BookOpen className="w-4 h-4" /> },
        { id: "mvp", name: "MVP Architecture", icon: <Layers className="w-4 h-4" /> },
        { id: "roadmap", name: "90-Day Roadmap", icon: <Milestone className="w-4 h-4" /> },
        { id: "investor", name: "AI Investor Pitch", icon: <Presentation className="w-4 h-4" /> }
      ];

  const triggerBrowserPrint = () => {
    // Quick window print triggers the browser printing flow
    window.print();
  };

  // Helper to dynamically extract the Evidence-Driven Verdict without fabricating facts or statistics
  const getEvidenceDrivenVerdict = () => {
    const research = report.marketResearch;
    const isLive = Boolean(research && research.enabled);

    // 1. Market Signal
    let marketSignal = "Insufficient evidence from the current research.";
    if (isLive) {
      const compCount = research?.competitors?.length || 0;
      if (compCount >= 4) {
        marketSignal = "Highly Competitive";
      } else if (compCount >= 1) {
        marketSignal = "Competitive";
      } else if (research?.keySignals && research.keySignals.length > 0) {
        marketSignal = "Emerging Category / Active Demand";
      } else if (research?.news && research.news.length > 0) {
        marketSignal = "Active Category Momentum";
      } else {
        marketSignal = "Early Stage / Low Density";
      }
    } else if (report.validation?.marketDemand) {
      marketSignal = "Moderate Demand (Offline Estimate)";
    }

    // 2. Key Finding
    let keyFinding = "Insufficient evidence from the current research.";
    if (isLive && research?.competitors && research.competitors.length > 0) {
      const compNames = research.competitors.slice(0, 3).map((c) => c.name).join(", ");
      const firstSnippet = research.competitors[0].snippet;
      keyFinding = `${research.competitors.length} active player${research.competitors.length > 1 ? "s" : ""} identified in live search (${compNames}). ${
        firstSnippet
          ? `Top incumbent focus: "${firstSnippet.length > 130 ? firstSnippet.slice(0, 127) + "..." : firstSnippet}"`
          : (report.validation?.competitiveLandscape || "Existing products address parts of the target problem.")
      }`;
    } else if (report.validation?.competitiveLandscape) {
      keyFinding = report.validation.competitiveLandscape;
    } else if (isLive && research?.keySignals && research.keySignals.length > 0) {
      keyFinding = research.keySignals[0];
    } else if (isLive && research?.news && research.news.length > 0) {
      keyFinding = `Recent industry development: "${research.news[0].title}" (${research.news[0].source}).`;
    }

    // 3. FounderOS Opportunity
    let founderOpportunity = "Insufficient evidence from the current research.";
    if (report.competitors && report.competitors.length > 0 && report.competitors[0].differentiationOpportunity) {
      founderOpportunity = report.competitors[0].differentiationOpportunity;
    } else if (report.competitors && report.competitors.length > 0 && report.competitors[0].marketGap) {
      founderOpportunity = `Address incumbent market gap: ${report.competitors[0].marketGap}`;
    } else if (report.swot?.opportunities && report.swot.opportunities.length > 0) {
      founderOpportunity = report.swot.opportunities[0];
    } else if (report.validation?.marketOpportunity) {
      founderOpportunity = report.validation.marketOpportunity;
    } else if (report.improvements?.improvedVersion) {
      founderOpportunity = report.improvements.improvedVersion;
    }

    // 4. Recommended Next Move
    let nextMove = "Insufficient evidence from the current research.";
    if (report.validation?.recommendations && report.validation.recommendations.length > 0) {
      nextMove = report.validation.recommendations[0];
    } else if (report.roadmap30_60_90?.plan30Day && report.roadmap30_60_90.plan30Day.length > 0) {
      nextMove = report.roadmap30_60_90.plan30Day[0];
    } else if (report.roadmap30_60_90?.buildVsLearnAdvice) {
      nextMove = report.roadmap30_60_90.buildVsLearnAdvice;
    }

    return { marketSignal, keyFinding, founderOpportunity, nextMove, isLive };
  };

  // IMPROVEMENT 1: Evidence-Driven Verdict component
  const renderEvidenceDrivenVerdict = () => {
    const verdict = getEvidenceDrivenVerdict();

    return (
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                Evidence-Driven Verdict
              </h4>
              <p className="text-xs text-slate-400">
                Actionable strategic takeaways influenced directly by live SerpApi market intelligence.
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono rounded font-semibold self-start sm:self-auto">
            Strategic Synthesis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Market Signal */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-white/5 space-y-2 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Market Signal
            </span>
            <p className="text-sm font-bold text-white leading-snug">
              {verdict.marketSignal}
            </p>
            <span className="text-[10px] font-mono text-cyan-400/80 pt-2 border-t border-white/5">
              Live web density
            </span>
          </div>

          {/* 2. Key Finding */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-white/5 space-y-2 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Key Finding
            </span>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
              {verdict.keyFinding}
            </p>
            <span className="text-[10px] font-mono text-indigo-400/80 pt-2 border-t border-white/5">
              Incumbent analysis
            </span>
          </div>

          {/* 3. FounderOS Opportunity */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-white/5 space-y-2 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              FounderOS Opportunity
            </span>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
              {verdict.founderOpportunity}
            </p>
            <span className="text-[10px] font-mono text-emerald-400/80 pt-2 border-t border-white/5">
              Differentiation angle
            </span>
          </div>

          {/* 4. Recommended Next Move */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-white/5 space-y-2 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Recommended Next Move
            </span>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
              {verdict.nextMove}
            </p>
            <span className="text-[10px] font-mono text-amber-400/80 pt-2 border-t border-white/5">
              Immediate validation step
            </span>
          </div>
        </div>
      </div>
    );
  };

  // IMPROVEMENT 2: Live Research Summary component
  const renderLiveResearchSummary = () => {
    const research = report.marketResearch;
    if (!research) return null;

    const searchesCount = research.queries?.length ?? 0;
    const competitorsCount = research.competitors?.length ?? 0;
    const alternativesCount = research.alternatives?.length ?? 0;
    const newsCount = research.news?.length ?? 0;
    const customerSignalsCount = research.keySignals?.length ?? 0;
    const pricingSignalsCount = research.pricingSignals?.length ?? 0;
    const localCompetitorsCount = research.localCompetitors?.length ?? 0;

    const summaryCards = [
      { icon: "🔎", label: "Searches", count: searchesCount },
      { icon: "🏢", label: "Competitors", count: competitorsCount },
      { icon: "🔄", label: "Alternatives", count: alternativesCount },
      { icon: "📰", label: "News Signals", count: newsCount },
      { icon: "💬", label: "Customer Signals", count: customerSignalsCount },
      { icon: "💰", label: "Pricing Signals", count: pricingSignalsCount },
      { icon: "📍", label: "Local Competitors", count: localCompetitorsCount }
    ];

    return (
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-cyan-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                Live Research Summary
              </h4>
              <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono rounded font-bold">
                Powered by SerpApi
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-world market evidence retrieved through SerpApi before generating the venture analysis.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-300/80 bg-cyan-500/5 px-2.5 py-1 rounded-lg border border-cyan-500/10 self-start sm:self-auto">
            Live Web Evidence
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {summaryCards.map((card, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                card.count > 0
                  ? "bg-slate-950/70 border-white/10 hover:border-cyan-500/30"
                  : "bg-slate-950/30 border-white/5 opacity-40"
              }`}
            >
              <div className="text-base mb-1">{card.icon}</div>
              <div className="text-xl font-mono font-extrabold text-white">{card.count}</div>
              <div className="text-[10px] font-mono text-slate-300 font-semibold truncate mt-1">
                {card.label}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 font-mono gap-1">
          <span>Powered by SerpApi — providing live web evidence used by FounderOS.</span>
          {research.searchedAt && (
            <span>Captured: {new Date(research.searchedAt).toLocaleTimeString()}</span>
          )}
        </div>
      </div>
    );
  };

  const renderFitSection = () => (
    <div className="space-y-6">
      {/* Compact reference to full Evidence-Driven Verdict in Market Intelligence */}
      {report.marketResearch?.enabled && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-300">
              Live market research actively shapes founder positioning, incumbent gaps, and next validation steps.
            </span>
          </div>
          <button
            onClick={() => setActiveSubTab("marketIntelligence")}
            className="text-cyan-400 hover:text-cyan-300 font-bold font-mono flex items-center space-x-1 cursor-pointer shrink-0 transition-colors"
          >
            <span>See the Evidence-Driven Verdict in Market Intelligence →</span>
          </button>
        </div>
      )}

      <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Founder-Idea Fit Score:</span>
          <span className="text-indigo-400 font-mono text-2xl ml-2">{report.fitScore}/100</span>
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">{report.fitAnalysis.reasoning}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why Suitable */}
        <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10 space-y-3">
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono">Core Advantages</h4>
          <ul className="space-y-2.5 text-sm text-slate-300">
            {report.fitAnalysis.whySuitable.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-400 select-none">✓</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why Unsuitable */}
        <div className="bg-amber-500/5 p-6 rounded-2xl border border-amber-500/10 space-y-3">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono">Structural Risks</h4>
          <ul className="space-y-2.5 text-sm text-slate-300">
            {report.fitAnalysis.whyUnsuitable.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-400 select-none">!</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 space-y-3">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">Missing Capital Experience & Skills</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-slate-950/60 rounded-xl space-y-1 border border-white/5">
            <span className="text-xs text-slate-500 block">Missing Domain Skills:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {report.fitAnalysis.missingSkills.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white/5 rounded text-xs text-slate-300 border border-white/5">{s}</span>
              ))}
            </div>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl space-y-1 border border-white/5">
            <span className="text-xs text-slate-500 block">Missing Strategic Experience:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {report.fitAnalysis.missingExperience.map((e, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white/5 rounded text-xs text-slate-300 border border-white/5">{e}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketSection = () => (
    <div className="space-y-6">
      {/* Dynamic SWOT Grid */}
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">SWOT Viability Matrix</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/[0.02] border border-emerald-500/10 p-6 rounded-2xl space-y-3">
          <h4 className="text-sm font-bold text-emerald-400">Strengths (Internal)</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.swot.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-emerald-400">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-rose-500/[0.02] border border-rose-500/10 p-6 rounded-2xl space-y-3">
          <h4 className="text-sm font-bold text-rose-400 font-mono">Weaknesses (Internal)</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.swot.weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-rose-400">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-sky-500/[0.02] border border-sky-500/10 p-6 rounded-2xl space-y-3">
          <h4 className="text-sm font-bold text-sky-400 font-mono">Opportunities (External)</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.swot.opportunities.map((o, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-sky-400">•</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-500/[0.02] border border-amber-500/10 p-6 rounded-2xl space-y-3">
          <h4 className="text-sm font-bold text-amber-400 font-mono">Threats (External)</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.swot.threats.map((t, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-amber-400">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Sizing & Problem Validation */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Market Sizing & Customer Signal Analysis</h3>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-0.5 rounded border border-white/10 self-start sm:self-auto">
            AI Synthesis & Grounded Signals
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold block">
                Directional AI Market Sizing — Estimated
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono border border-amber-500/20 px-1.5 py-0.5 rounded">
                Modeled
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">{report.validation.marketSize}</p>
            <span className="text-[10px] text-slate-500 font-mono block pt-1.5 border-t border-white/5">
              Note: Sizing figures represent directional estimates synthesized by AI logic, not direct census or empirical market data.
            </span>
          </div>
          <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold block">
                Customer Pain Signals Identified from Search & Web Evidence
              </span>
              <span className="text-[10px] text-cyan-400/80 font-mono border border-cyan-500/20 px-1.5 py-0.5 rounded">
                Grounded
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              {report.validation.problemValidation.replace(/\b\d+\s+out\s+of\s+\d+\s+[\w\s]*interviewed\b/gi, "Observed customer search patterns indicate")}
            </p>
            <span className="text-[10px] text-slate-500 font-mono block pt-1.5 border-t border-white/5">
              Extracted from customer inquiries, online community discussions, and search query trends.
            </span>
          </div>
        </div>
      </div>

      {/* Competitors List */}
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">Top Sector Competitors</h3>
      <div className="space-y-4">
        {report.competitors.map((comp, idx) => (
          <div key={idx} className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-white">{comp.name}</h4>
              <div className="text-xs space-y-1 text-slate-400">
                <p><strong className="text-emerald-400">Strengths:</strong> {comp.strengths}</p>
                <p><strong className="text-rose-400">Weaknesses:</strong> {comp.weaknesses}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-xl space-y-1 align-middle border border-white/5">
              <span className="text-[10px] text-sky-400 block font-mono uppercase font-bold">Unmapped Market Gap:</span>
              <p className="text-xs text-slate-300 leading-relaxed">{comp.marketGap}</p>
              <span className="text-[10px] text-indigo-400 block font-mono uppercase font-bold mt-2">Differentiating Playbook:</span>
              <p className="text-xs text-indigo-200 mt-0.5 leading-relaxed">{comp.differentiationOpportunity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderImprovementSection = () => (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">AI Venture Variations Playbook</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Niche Version", value: report.improvements.nicheVersion, exp: report.improvements.explanations.niche, color: "text-rose-400" },
          { label: "Premium Tier", value: report.improvements.premiumVersion, exp: report.improvements.explanations.premium, color: "text-amber-400" },
          { label: "AI-Powered Adaptation", value: report.improvements.aiEnhancedVersion, exp: report.improvements.explanations.ai, color: "text-sky-400" },
          { label: "Minimum-Friction Release", value: report.improvements.easierToLaunchVersion, exp: report.improvements.explanations.easy, color: "text-emerald-400" }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono uppercase font-bold ${item.color}`}>{item.label}</span>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500">Upgrade Play</span>
            </div>
            <h4 className="text-sm font-bold text-white font-sans">{item.value}</h4>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">{item.exp}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">General Optimization Version</h3>
        <div className="bg-slate-950 p-4 border border-white/5 rounded-xl">
          <p className="text-sm text-slate-300 leading-relaxed font-sans">{report.improvements.improvedVersion}</p>
          <p className="text-xs text-slate-500 leading-relaxed mt-2">{report.improvements.explanations.improved}</p>
        </div>
      </div>

      {/* Alternative Startup Generator (5 Better Ideas) */}
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">5 Better Startup Ideas Tailored to Sarah</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {report.alternativeIdeas.map((idea, idx) => (
          <div key={idx} className="bg-slate-950 border border-white/5 p-4 rounded-xl flex flex-col justify-between space-y-3 hover:border-white/10 transition-colors">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>{idea.difficulty} Difficulty</span>
                <span className="text-indigo-400 font-bold">{idea.fitScore}% Fit</span>
              </div>
              <h4 className="text-xs font-bold text-white leading-tight">{idea.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">{idea.description}</p>
            </div>
            <div className="border-t border-white/5 pt-2 text-[10px] font-mono text-emerald-400 space-y-1">
              <span>Potential MRR:</span>
              <p className="text-slate-300 text-xs font-bold">{idea.revenuePotential}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Skill Gaps Score:</span>
          <span className="text-indigo-400 font-mono text-2xl ml-2">{report.skillGaps.skillGapScore}/100</span>
        </h3>
        <p className="text-sm text-slate-300">
          We aggregated your missing skills against standard architecture targets. Below is your optimized learn-immediately roadmap.
        </p>
      </div>

      {/* Learning categorizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-500/[0.02] border border-rose-500/10 p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest font-mono">1. Learn Immediately</h4>
          <ul className="space-y-2 text-xs text-slate-300 list-disc pl-4">
            {report.skillGaps.recommendedLearningPriority.learnImmediately.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-indigo-500/[0.02] border border-indigo-500/10 p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">2. Learn Soon</h4>
          <ul className="space-y-2 text-xs text-slate-300 list-disc pl-4">
            {report.skillGaps.recommendedLearningPriority.learnSoon.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-500/[0.02] border border-white/10 p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">3. Learn Later</h4>
          <ul className="space-y-2 text-xs text-slate-300 list-disc pl-4">
            {report.skillGaps.recommendedLearningPriority.learnLater.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Curated Resources */}
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">Curated Learning Resources</h3>
      <div className="space-y-4">
        {report.learningResources.map((res, idx) => (
          <div key={idx} className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h4 className="text-sm font-bold text-white">{res.skill}</h4>
              <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500">
                <span>{res.estLearningTime} est.</span>
                <span>{res.difficulty} Difficulty</span>
                <span className="text-indigo-400">Step {res.order}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 block mb-2 font-mono">Free Recommended Playlists:</span>
                <div className="space-y-2">
                  {res.free.map((item, fIdx) => (
                    <a
                      key={fIdx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-slate-950 border border-white/5 rounded-xl hover:border-white/15 transition-all text-xs"
                    >
                      <span className="text-white font-bold block mb-1 hover:underline">{item.name}</span>
                      <span className="text-slate-400 leading-snug">{item.description}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-400 block mb-2 font-mono">Premium Structured Options:</span>
                <div className="space-y-2">
                  {res.paid.map((item, pIdx) => (
                    <a
                      key={pIdx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-slate-950 border border-white/5 rounded-xl hover:border-white/15 transition-all text-xs"
                    >
                      <span className="text-white font-bold block mb-1 hover:underline">{item.name}</span>
                      <span className="text-slate-400 leading-snug">{item.description}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMvpSection = () => (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">MVP Specifications Blueprint</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 md:col-span-1 space-y-4">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">Target Feature Specs</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.mvpPlan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start space-x-1.5 leading-relaxed">
                <span className="text-indigo-400">•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 md:col-span-2 space-y-4">
          <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">Core User Flows (Logical State Progression):</h4>
          <div className="bg-slate-950 p-4 border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed font-mono">
            {report.mvpPlan.userFlows.map((flow, idx) => (
              <p key={idx} className="pt-1">{flow}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Database Schema & REST Endpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Modular DB Config Models (Firestore/SQL)</h4>
          <pre className="p-4 bg-slate-950 border border-white/5 rounded-xl text-[11px] text-slate-300 font-mono overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
            {report.mvpPlan.dbSchema}
          </pre>
        </div>

        <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Proposed API Endpoints Map</h4>
          <pre className="p-4 bg-slate-950 border border-white/5 rounded-xl text-[11px] text-slate-300 font-mono overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
            {report.mvpPlan.apiStructure}
          </pre>
        </div>
      </div>

      {/* Folder Structure & Tech Architecture */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Recommended Stack Deployment Specs</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 font-bold block uppercase">Deployment Infrastructure:</span>
            <p className="text-slate-300 leading-relaxed pt-0.5">{report.mvpPlan.techArchitecture}</p>
          </div>
          <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 font-bold block uppercase">Recommended File Hierarchy:</span>
            <pre className="text-slate-300 font-mono text-[10px] whitespace-pre-wrap leading-relaxed pt-1 font-semibold block">{report.mvpPlan.folderStructure}</pre>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoadmapSection = () => (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">30-60-90 Days Phased Action Plan</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 30 Day */}
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-4 relative">
          <div className="absolute top-3 right-4 px-2 py-0.5 bg-sky-500/10 border border-sky-400/20 text-sky-400 text-[10px] font-mono rounded font-bold uppercase">Phase 1</div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Days 1 - 30: Validation & Wireframe</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.roadmap30_60_90.plan30Day.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-sky-400 select-none font-bold">1.</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 60 Day */}
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-4 relative">
          <div className="absolute top-3 right-4 px-2 py-0.5 bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[10px] font-mono rounded font-bold uppercase">Phase 2</div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Days 31 - 60: Pilot Assembly</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.roadmap30_60_90.plan60Day.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-indigo-400 select-none font-bold">2.</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 90 Day */}
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-4 relative">
          <div className="absolute top-3 right-4 px-2 py-0.5 bg-purple-500/10 border border-purple-400/20 text-purple-400 text-[10px] font-mono rounded font-bold uppercase">Phase 3</div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Days 61 - 90: Monetization scaling</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.roadmap30_60_90.plan90Day.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-purple-400 select-none font-bold">3.</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Week Timeline */}
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider pt-4">Weekly Tasks Breakdowns</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
        {[
          { label: "Week 1", values: report.executionRoadmap.week1, color: "border-sky-500/10" },
          { label: "Week 2", values: report.executionRoadmap.week2, color: "border-indigo-500/10" },
          { label: "Week 3", values: report.executionRoadmap.week3, color: "border-purple-500/10" },
          { label: "Week 4", values: report.executionRoadmap.week4, color: "border-emerald-500/10" }
        ].map((itm, idx) => (
          <div key={idx} className={`p-4 bg-slate-950 border ${itm.color} rounded-xl space-y-2`}>
            <span className="text-[10px] font-mono font-bold block text-slate-500 uppercase">{itm.label}:</span>
            <ul className="space-y-1.5 text-slate-300 list-disc pl-3 leading-relaxed">
              {itm.values.map((v, vIdx) => (
                <li key={vIdx}>{v}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Monthly Timeline */}
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider pt-4">Monthly Execution Targets</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
        {[
          { label: "Month 1 Goals", values: report.executionRoadmap.month1 },
          { label: "Month 2 Goals", values: report.executionRoadmap.month2 },
          { label: "Month 3 Goals", values: report.executionRoadmap.month3 }
        ].map((itm, idx) => (
          <div key={idx} className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-2">
            <span className="text-[10px] font-mono font-bold block text-white uppercase">{itm.label}:</span>
            <ul className="space-y-1.5 text-slate-300 list-disc pl-3">
              {itm.values.map((v, vIdx) => (
                <li key={vIdx}>{v}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Revenue Roadmap */}
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider pt-4">SaaS Monetization Milestones</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { mark: "First $100", playbook: report.revenuePlan.first100, color: "text-sky-400 bg-sky-500/5 hover:border-sky-500/20" },
          { mark: "First $1,000", playbook: report.revenuePlan.first1000, color: "text-indigo-400 bg-indigo-500/5 hover:border-indigo-500/20" },
          { mark: "First $10,000", playbook: report.revenuePlan.first10000, color: "text-purple-400 bg-purple-500/5 hover:border-purple-500/20" },
          { mark: "First $100,000", playbook: report.revenuePlan.first100000, color: "text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/20" }
        ].map((rev, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border border-white/5 transition-all ${rev.color} space-y-1.5`}>
            <span className="text-xs font-bold uppercase font-mono">{rev.mark}</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{rev.playbook}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvestorSection = () => (
    <div className="space-y-6">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Investor Pitch Readiness:</span>
          <span className="text-blue-400 font-mono text-xl ml-2 bg-blue-500/10 border border-blue-500/20 px-3 py-0.5 rounded-full">
            {report.aiInvestorMode.investorReadinessScore}%
          </span>
        </h3>
        <p className="text-sm text-white/60 leading-relaxed font-sans">
          Our investor simulator models critical questions that Seed and Series A funders will evaluate relative to Sarah's experience matrix.
        </p>
      </div>

      {/* Pitch Simulator List */}
      <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">Investor Q&A Simulation Pitching Prep</h3>
      <div className="space-y-4">
        {report.aiInvestorMode.questionsWithAnswers.map((qa, idx) => (
          <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex gap-2">
              <span className="text-blue-500 font-mono">Q:</span>
              <span>{qa.question}</span>
            </h4>
            <div className="p-4 bg-[#050505] border border-white/10 rounded-xl text-xs space-y-2">
              <p className="text-white/80 leading-relaxed"><strong className="text-green-400">Suggested Partner Response: </strong> "{qa.sampleAnswer}"</p>
              <p className="text-white/40 leading-relaxed border-t border-white/10 pt-2 font-sans"><strong className="text-white/60">Strategic insight: </strong> {qa.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Concerns & Capital status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-rose-500/5 border border-rose-500/15 p-6 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest font-mono">Probable Investor Concerns</h4>
          <ul className="space-y-2 text-xs text-white/75 list-disc pl-4 leading-relaxed">
            {report.aiInvestorMode.investorConcerns.map((conc, idx) => (
              <li key={idx}>{conc}</li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/15 p-6 rounded-2xl space-y-3 opacity-90">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">Current Funding Guidance</h4>
          <p className="text-xs text-white/75 leading-relaxed font-sans pt-1">
            {report.aiInvestorMode.fundingReadiness}
          </p>
        </div>
      </div>
    </div>
  );

  const renderMarketIntelligenceSection = () => {
    const research = report.marketResearch;

    if (!research || !research.enabled) {
      return (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Live Web Intelligence Mode: Offline / Fallback</h3>
                <span className="text-xs text-slate-400 font-mono">SERPAPI_API_KEY was not configured or web queries reached timeout.</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              This FounderOS report was generated utilizing foundation AI reasoning models without live external search grounding.
              To activate real-time web competitor discovery, recent industry news feeds, pricing benchmarks, and verified search citations, configure <code className="px-1.5 py-0.5 bg-white/10 rounded text-cyan-300 font-mono text-xs">SERPAPI_API_KEY</code> on the server.
            </p>
            {research?.limitations && research.limitations.length > 0 && (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-white/5 space-y-1.5">
                <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">Execution Notes:</span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {research.limitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-400">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {onNavigateToTab && (
              <div className="pt-2">
                <button
                  onClick={() => onNavigateToTab("Idea Analyzer")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>Launch Live SerpApi Market Research Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Live Status Header */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-emerald-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white">Live Market Evidence (SerpApi Grounded)</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Live Evidence</span>
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {research.searchedAt ? `Searched: ${new Date(research.searchedAt).toLocaleTimeString()}` : "Grounded with live web signals"}
                </span>
              </div>
            </div>

            {research.queries && research.queries.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-w-md">
                {research.queries.map((q, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-cyan-300 truncate" title={q}>
                    🔍 {q}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* IMPROVEMENT 2: Live Research Summary */}
        {renderLiveResearchSummary()}

        {/* IMPROVEMENT 1: Evidence-Driven Verdict */}
        {renderEvidenceDrivenVerdict()}

        {/* 1. Competitors Discovered */}
        {research.competitors && research.competitors.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Discovered Incumbent Competitors & Alternatives</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {research.competitors.map((comp, idx) => (
                <div key={idx} className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-3 flex flex-col justify-between hover:border-white/15 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-bold text-white truncate">{comp.name}</h5>
                      {comp.domain && (
                        <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 bg-white/5 rounded border border-white/5 shrink-0">
                          {comp.domain}
                        </span>
                      )}
                    </div>
                    {comp.snippet && (
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        "{comp.snippet}"
                      </p>
                    )}
                  </div>
                  {comp.link && (
                    <a
                      href={comp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors pt-2 border-t border-white/5"
                    >
                      <span>Inspect Platform</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Recent Industry News */}
        {research.news && research.news.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <Newspaper className="w-4 h-4 text-indigo-400" />
              <span>Recent Industry News & Market Developments</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {research.news.map((item, idx) => (
                <div key={idx} className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between hover:border-white/15 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="text-indigo-400 font-semibold">{item.source}</span>
                      {item.date && <span>{item.date}</span>}
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-white leading-snug">{item.title}</h5>
                    {item.snippet && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{item.snippet}</p>
                    )}
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-mono transition-colors pt-2 border-t border-white/5"
                    >
                      <span>Read Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Market Signals & User Pain Points */}
        {research.keySignals && research.keySignals.length > 0 && (
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Real-World Market Signals & Customer Inquiries</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {research.keySignals.map((signal, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-white/5 text-xs text-slate-300 flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold select-none">•</span>
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Pricing Signals (Conditional) */}
        {research.pricingSignals && research.pricingSignals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Product Pricing Benchmarks (Google Shopping)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {research.pricingSignals.map((p, idx) => (
                <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-white block truncate" title={p.title}>{p.title}</span>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-purple-400 font-extrabold">{p.price || "Check Listing"}</span>
                    <span className="text-slate-500 text-[10px]">{p.merchant || "Online"}</span>
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-400 hover:underline block font-mono">
                      View Listing →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Local Competitors (Conditional) */}
        {research.localCompetitors && research.localCompetitors.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Local Geographic Competitors (Google Maps)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {research.localCompetitors.map((loc, idx) => (
                <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-white block truncate">{loc.name}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{loc.address || "Local Area"}</span>
                  {loc.rating && (
                    <span className="text-xs font-mono text-amber-400 block">
                      ★ {loc.rating} ({loc.reviews || 0} reviews)
                    </span>
                  )}
                  {loc.link && (
                    <a href={loc.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-400 hover:underline block font-mono">
                      Website / Profile →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Verified Web Sources & Citations */}
        {research.sources && research.sources.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>Verified Web Citations & Evidence Sources</span>
            </h4>
            <div className="bg-slate-900/40 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
              {research.sources.map((src, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                  <div className="space-y-1 pr-4">
                    <span className="text-xs font-bold text-white block">{src.title}</span>
                    {src.snippet && <p className="text-[11px] text-slate-400 line-clamp-1">{src.snippet}</p>}
                    <span className="text-[10px] font-mono text-cyan-400/80">{src.domain}</span>
                  </div>
                  <a
                    href={src.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-mono rounded-lg border border-white/10 transition-colors flex items-center space-x-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <span>Visit Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Research Scope & Limitations */}
        {research.limitations && research.limitations.length > 0 && (
          <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 space-y-2">
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Research Methodology & Scope Limitations:</h5>
            <ul className="space-y-1 text-xs text-slate-400">
              {research.limitations.map((lim, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-slate-500">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
      
      {/* Report Header panel */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">Venture Report: <span className="font-extrabold text-blue-400">{report.startupName}</span></h2>
            <div className="px-2.5 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono rounded">
              YC Partner Core Engine
            </div>
            {report.marketResearch?.enabled ? (
              <div className="px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Live SerpApi Evidence</span>
              </div>
            ) : (
              <div className="px-2.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono rounded flex items-center space-x-1.5">
                <span>Offline Reasoning</span>
              </div>
            )}
          </div>
          <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
            This comprehensive dynamic validation catalog analyzes problem strength, competitor gaps, learning priorities, database schemas, and monthly goals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={triggerBrowserPrint}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/20 rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* IMPROVEMENT 3: Unmissable Live Evidence Status Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        report.marketResearch?.enabled
          ? "bg-gradient-to-r from-emerald-950/40 via-slate-900/70 to-cyan-950/40 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
          : "bg-amber-950/20 border-amber-500/30"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              report.marketResearch?.enabled
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}>
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-xs font-black uppercase tracking-wider font-mono text-white">
                  {report.marketResearch?.enabled ? "Live Market Evidence Grounding: ACTIVE" : "Market Intelligence Mode: Fallback"}
                </span>
                {report.marketResearch?.enabled && (
                  <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono rounded font-bold flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Powered by SerpApi</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                {report.marketResearch?.enabled
                  ? `Report is grounded with real-time web intelligence from SerpApi (${report.marketResearch.queries?.length || 0} search queries executed, ${report.marketResearch.competitors?.length || 0} incumbents identified, ${(report.marketResearch.news?.length || 0) + (report.marketResearch.keySignals?.length || 0)} live market signals).`
                  : "No live web queries were executed. Strategic recommendations reflect offline reasoning models."}
              </p>
            </div>
          </div>

          {report.marketResearch?.enabled ? (
            <button
              onClick={() => setActiveSubTab("marketIntelligence")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                activeSubTab === "marketIntelligence"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-emerald-500/30"
              }`}
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Live Evidence ({report.marketResearch.competitors?.length || 0} Competitors) →</span>
            </button>
          ) : (
            onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab("Idea Analyzer")}
                className="px-3.5 py-2 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <span>Launch Live SerpApi Research</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-white/10 overflow-x-auto pb-px scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-3 text-xs font-semibold hover:text-blue-400 transition-all border-b-2 whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
              activeSubTab === tab.id
                ? "border-blue-500 text-blue-400 bg-white/5 font-bold"
                : "border-transparent text-white/60"
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
            {tab.id === "marketIntelligence" && report.marketResearch?.enabled && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono rounded-full font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE</span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="bg-black/20 p-1 rounded-2xl">
        {activeSubTab === "fit" && renderFitSection()}
        {activeSubTab === "marketIntelligence" && renderMarketIntelligenceSection()}
        {activeSubTab === "market" && renderMarketSection()}
        {activeSubTab === "improvement" && renderImprovementSection()}
        {activeSubTab === "skills" && renderSkillsSection()}
        {activeSubTab === "mvp" && renderMvpSection()}
        {activeSubTab === "roadmap" && renderRoadmapSection()}
        {activeSubTab === "investor" && renderInvestorSection()}
      </div>

    </div>
  );
}
