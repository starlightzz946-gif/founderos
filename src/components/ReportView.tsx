import React, { useState } from "react";
import { StartupReport } from "../types";
import { Download, Target, ShieldAlert, Zap, BookOpen, Layers, Milestone, TrendingUp, Presentation, AlertCircle, Printer, FileText } from "lucide-react";

interface ReportViewProps {
  report: StartupReport;
}

export default function ReportView({ report }: ReportViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("fit");
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  // Define tabs configuration
  const tabs = [
    { id: "fit", name: "Founder-Idea Fit", icon: <Target className="w-4 h-4" /> },
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

  const renderFitSection = () => (
    <div className="space-y-6">
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
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Core Sector Sizing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-slate-950 border border-white/5 rounded-xl">
            <span className="text-xs text-slate-500 block mb-1">Target Market Sizing (TAM/SAM/SOM):</span>
            <p className="text-slate-300 leading-relaxed font-sans">{report.validation.marketSize}</p>
          </div>
          <div className="p-4 bg-slate-950 border border-white/5 rounded-xl">
            <span className="text-xs text-slate-500 block mb-1">Problem Validation Core:</span>
            <p className="text-slate-300 leading-relaxed font-sans">{report.validation.problemValidation}</p>
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
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="bg-black/20 p-1 rounded-2xl">
        {activeSubTab === "fit" && renderFitSection()}
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
