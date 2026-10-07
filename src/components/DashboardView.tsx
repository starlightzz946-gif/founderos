import React, { useState } from "react";
import { UserProfile, StartupReport } from "../types";
import { Award, CheckCircle2, Circle, Plus, Trash2, ArrowRight, BookOpen, Star, HelpCircle } from "lucide-react";

interface DashboardViewProps {
  profile: UserProfile;
  report: StartupReport | null;
  onUpdateXP: (xpIncrement: number) => void;
  onNavigateToTab: (tabName: string) => void;
}

interface Achievement {
  id: string;
  title: string;
  xpReward: number;
  completed: boolean;
  category: "validation" | "product" | "marketing" | "revenue";
}

export default function DashboardView({ profile, report, onUpdateXP, onNavigateToTab }: DashboardViewProps) {
  // Local Weekly Focus tasks
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: "1", text: "Validate problem core with at least 5 potential users", completed: false },
    { id: "2", text: "Draft core user flow layouts in Figma or paper notebooks", completed: true },
    { id: "3", text: "Outline required landing page messaging and offer terms", completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText, completed: false }]);
    setNewTaskText("");
    onUpdateXP(15); // Small XP reward for planning!
  };

  const handleToggleTask = (id: string, currentlyCompleted: boolean) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (!currentlyCompleted) {
      onUpdateXP(50); // XP reward for completing a task!
    } else {
      onUpdateXP(-50);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Interactive achievements to gamify progress
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "a1", title: "Conduct 10 'Mom Test' user discover interviews", xpReward: 300, completed: false, category: "validation" },
    { id: "a2", title: "Generate responsive mockups & flow blueprints", xpReward: 250, completed: false, category: "product" },
    { id: "a3", title: "Launch micro-SaaS pricing test landing page", xpReward: 300, completed: false, category: "marketing" },
    { id: "a4", title: "Onboard 3 active pilot participants", xpReward: 400, completed: false, category: "validation" },
    { id: "a5", title: "Incur first paying subscriber conversion ($100 volume)", xpReward: 500, completed: false, category: "revenue" },
  ]);

  const handleCompleteAchievement = (id: string) => {
    setAchievements(achievements.map(a => {
      if (a.id === id && !a.completed) {
        onUpdateXP(a.xpReward);
        return { ...a, completed: true };
      }
      return a;
    }));
  };

  // Helper to render circle progress gauges
  const renderScoreGauge = (score: number, label: string, colorClass: string, bgGlowClass: string) => {
    const strokeDashoffset = 251 - (251 * score) / 100;
    return (
      <div className="flex flex-col items-center bg-white/5 border border-white/10 backdrop-blur-sm p-5 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
        <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-20 transition-all group-hover:scale-125 ${bgGlowClass}`} />
        <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" className="stroke-white/10" strokeWidth="6" fill="transparent" />
            <circle
              cx="48"
              cy="48"
              r="40"
              className={colorClass}
              strokeWidth="7"
              fill="transparent"
              strokeDasharray="251"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xl font-bold font-mono text-white">{score || "0"}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-white/60 mb-1 font-semibold font-mono text-center">{label}</span>
      </div>
    );
  };

  // Total XP calculation targets
  const getXpThreshold = () => {
    const level = profile?.level || "Explorer";
    if (level === "Explorer") return 500;
    if (level === "Builder") return 1000;
    if (level === "Validator") return 2000;
    if (level === "Launcher") return 3500;
    if (level === "Revenue Founder") return 5000;
    return 8000;
  };

  const getLevelProgressPercentage = () => {
    const threshold = getXpThreshold();
    const currentXp = profile?.xp || 0;
    return Math.min(100, Math.floor((currentXp / threshold) * 100));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
      
      {/* Top Welcome & Gamified XP Card */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">Welcome, <span className="font-extrabold text-blue-400">{profile?.name || "Founder"}</span>!</h1>
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
              {profile?.level || "Explorer"}
            </div>
          </div>
          <p className="text-sm text-white/60">
            {report ? `Operating Venture: ${report.startupName} — ${profile?.archetype || "SaaS Operator"}` : "Update your profile and specify a startup idea to generate YC Partner Analysis."}
          </p>
        </div>

        {/* Dynamic Level Progress Bar */}
        <div className="w-full lg:w-96 bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 shrink-0">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-white/60">XP Account: {profile?.xp || 0} XP</span>
            <span className="font-bold text-blue-400">{profile?.level || "Explorer"} Level</span>
          </div>
          <div className="w-full h-2.5 bg-[#050505] rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
              style={{ width: `${getLevelProgressPercentage()}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/40">
            <span>Next milestone: {getXpThreshold()} XP</span>
            <span>{getLevelProgressPercentage()}% Completed</span>
          </div>
        </div>
      </div>

      {/* Prominent First-Screen Live Market Intelligence CTA Card */}
      {report && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/40 border border-emerald-500/30 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-emerald-500/5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                Live Market Intelligence Report Ready
              </h3>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded font-bold">
                Powered by SerpApi
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Venture <strong className="text-white">{report.startupName}</strong> is actively grounded in real-time web research, verified competitors, and market evidence.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("YC Partner Report")}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all cursor-pointer shrink-0"
          >
            <span>View Live Market Intelligence Report →</span>
          </button>
        </div>
      )}

      {/* Main Core Scores Section */}
      {report ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase font-mono flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Startup Intelligence Metrics</span>
            </h2>
            {report.marketResearch?.enabled && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Live SerpApi Grounding Active</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {renderScoreGauge(report.founderScore, "Founder Score", "stroke-blue-500 animate-pulse", "bg-blue-500")}
            {renderScoreGauge(report.startupScore, "Startup Viability", "stroke-purple-500", "bg-purple-500")}
            {renderScoreGauge(report.fitScore, "Founder-Idea Fit", "stroke-green-500", "bg-green-500")}
            {renderScoreGauge(report.readinessScore, "Execution Readiness", "stroke-orange-500", "bg-orange-500")}
          </div>
        </div>
      ) : (
        <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-orange-400 font-bold">Startups Report is pending!</h3>
            <p className="text-sm text-white/60">Complete the Profile and submit an Idea to trigger our advanced Gemini Startup Intelligence evaluation engines.</p>
          </div>
          <button
            onClick={() => onNavigateToTab("Idea Analyzer")}
            className="px-5 py-2.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-bold text-sm rounded-xl border border-orange-500/30 flex items-center space-x-2 shrink-0 transition-all cursor-pointer"
          >
            <span>Analyze Startup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Middle Layout Grid: Weekly Focus (ToDo) VS Build advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly Focus Tasks List */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Weekly Focus</h3>
              <p className="text-xs text-white/40 font-medium">Plan tasks. Completing tasks awards +50 XP!</p>
            </div>
            <span className="text-xs bg-white/5 border border-white/10 text-white/60 px-2.5 py-1 rounded-full font-mono">
              {tasks.filter(t => t.completed).length}/{tasks.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                <button
                  onClick={() => handleToggleTask(task.id, task.completed)}
                  className="flex items-center space-x-3 text-left focus:outline-none flex-grow cursor-pointer"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/30 hover:text-blue-400 shrink-0" />
                  )}
                  <span className={`text-sm ${task.completed ? "line-through text-white/40" : "text-white/85"}`}>{task.text}</span>
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="text-white/40 hover:text-red-400 transition-colors cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* New task input */}
          <div className="flex space-x-2 pt-2">
            <input
              type="text"
              placeholder="e.g. Set up booking form pre-authorizations..."
              value={newTaskText || ""}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="flex-grow bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-sans"
            />
            <button
              onClick={handleAddTask}
              className="p-3 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/20 rounded-xl flex items-center justify-center transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Build-VS-Learn Strategic Advisory */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-3xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Build vs. Learn Intelligence</h3>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-4 font-medium">
              Our analyzer checks whether you possess immediate product-assembly capability, advising whether you should write code, leverage template layouts, or focus solely on user engagement.
            </p>

            <div className="bg-[#050505]/40 border border-white/10 p-4 rounded-2xl relative overflow-hidden">
              <div className="absolute right-3 top-3 px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono rounded font-semibold uppercase tracking-tight">
                AI Inference
              </div>
              <p className="text-sm text-white/80 leading-relaxed font-sans italic pt-2">
                {report
                  ? `"${report.roadmap30_60_90.buildVsLearnAdvice}"`
                  : `"Please submit your startup idea, and we will formulate an exact optimization layout detailing if you should allocate hours to building vs learning."`}
              </p>
            </div>
          </div>

          {report && (
            <div className="flex justify-end">
              <button
                onClick={() => onNavigateToTab("YC Partner Report")}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <span>View Full Learning Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gamified Achievements Progress Matrix */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-3xl space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Founder Milestone Board</h3>
          <p className="text-xs text-white/40 font-medium">Earn mega XP rewards as you progress through critical startup validation steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                ach.completed
                  ? "bg-green-500/10 border-green-500/20 opacity-80"
                  : "bg-[#050505]/40 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                    ach.category === "validation" ? "bg-orange-400/15 text-orange-400 border border-orange-400/20" :
                    ach.category === "product" ? "bg-purple-400/15 text-purple-400 border border-purple-400/20" :
                    ach.category === "marketing" ? "bg-blue-400/15 text-blue-400 border border-blue-400/20" : "bg-green-400/15 text-green-400 border border-green-400/20"
                  }`}>
                    {ach.category}
                  </span>
                  <span className="text-xs text-white/50 font-semibold">+{ach.xpReward} XP</span>
                </div>
                <h4 className={`text-sm font-semibold ${ach.completed ? "text-white/40 line-through" : "text-white"}`}>{ach.title}</h4>
              </div>

              <button
                disabled={ach.completed}
                onClick={() => handleCompleteAchievement(ach.id)}
                className={`p-2 rounded-xl transition-all ${
                  ach.completed
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-95 border border-blue-500/20"
                }`}
              >
                {ach.completed ? <CheckCircle2 className="w-5 h-5" /> : <Star className="w-5 h-5 fill-blue-400/20" />}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
