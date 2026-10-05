import React, { useState, useEffect } from "react";
import { UserProfile, StartupIdea, WeeklyAudit } from "../types";
import { User, Award, Brain, Rocket, Plus, Trash2, Milestone, Sparkles, PlusCircle, Globe } from "lucide-react";

// --- PROFILE FORM COMPONENT ---
interface ProfileFormProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onUpdateXP: (xpIncrement: number) => void;
}

export function ProfileForm({ profile, onSaveProfile, onUpdateXP }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name || "");
  const [age, setAge] = useState(profile?.age || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [education, setEducation] = useState(profile?.education || "");
  const [experience, setExperience] = useState(profile?.experience || "");
  const [previousProjects, setPreviousProjects] = useState(profile?.previousProjects || "");
  const [budget, setBudget] = useState(profile?.budget || "");
  const [timeAvailable, setTimeAvailable] = useState(profile?.timeAvailable || "");
  const [industryExperience, setIndustryExperience] = useState(profile?.industryExperience || "");

  // Skills Tag management
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  // Sync state if profile prop changes
  useEffect(() => {
    setName(profile?.name || "");
    setAge(profile?.age || "");
    setCountry(profile?.country || "");
    setEducation(profile?.education || "");
    setExperience(profile?.experience || "");
    setPreviousProjects(profile?.previousProjects || "");
    setBudget(profile?.budget || "");
    setTimeAvailable(profile?.timeAvailable || "");
    setIndustryExperience(profile?.industryExperience || "");
    setSkills(profile?.skills || []);
    setInterests(profile?.interests || []);
  }, [profile]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      onUpdateXP(10);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  // Interests Tag management
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [newInterest, setNewInterest] = useState("");

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
      onUpdateXP(10);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      ...profile,
      name,
      age,
      country,
      education,
      experience,
      previousProjects,
      budget,
      timeAvailable,
      industryExperience,
      skills,
      interests
    };

    // Auto-calculate structural archetype if matching keywords
    const lowerSkills = skills.join(" ").toLowerCase();
    let archetype = "Builder Founder";
    let strengths = ["Execution speeds", "Resourcefulness"];
    let weaknesses = ["Enterprise marketing"];

    if (lowerSkills.includes("marketing") || lowerSkills.includes("growth") || lowerSkills.includes("seo")) {
      archetype = "Marketing Founder";
      strengths = ["Content loops", "Low customer acquisition cost", "Copywriting hook generation"];
      weaknesses = ["Proprietary coding structures"];
    } else if (lowerSkills.includes("code") || lowerSkills.includes("react") || lowerSkills.includes("typescript") || lowerSkills.includes("python")) {
      archetype = "Technical Founder";
      strengths = ["Engineering rapid product releases", "Automations configuration", "Robust scalability"];
      weaknesses = ["Sales discovery calls", "Marketing distributions"];
    } else if (lowerSkills.includes("design") || lowerSkills.includes("figma") || lowerSkills.includes("ux") || lowerSkills.includes("ui")) {
      archetype = "Product Founder";
      strengths = ["User empathy mapping", "Highly aesthetic positioning", "Wireframes fidelity"];
      weaknesses = ["Relational SQL setups"];
    } else if (lowerSkills.includes("sales") || lowerSkills.includes("cold") || lowerSkills.includes("enterprise")) {
      archetype = "Sales Founder";
      strengths = ["B2B deal validation", "Lead qualifications", "Cold email pipelines"];
      weaknesses = ["Figma prototyping"];
    }

    updatedProfile.archetype = archetype;
    updatedProfile.strengths = strengths;
    updatedProfile.weaknesses = weaknesses;
    updatedProfile.founderScore = Math.min(100, 60 + Math.min(40, skills.length * 6 + interests.length * 4));

    onSaveProfile(updatedProfile);
    onUpdateXP(150); // Big structural milestone!
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-slate-900/40 border border-white/5 rounded-3xl space-y-8 animate-fade-in font-sans">
      
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Founder Profile Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Submit your profile variables, aligning your archetypes before analyzing your ideas.</p>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-sm rounded-xl cursor-pointer active:scale-95 transition-all hover:opacity-90 shadow-lg shadow-blue-500/20"
        >
          Save Profile Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core demographic grids */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
          <input
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            placeholder="Sarah Jenkins"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Age</label>
          <input
            type="text"
            value={age || ""}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            placeholder="29"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Country / Region</label>
          <input
            type="text"
            value={country || ""}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            placeholder="United States"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-sans">Education & Credentials</label>
          <textarea
            value={education || ""}
            onChange={(e) => setEducation(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
            placeholder="E.g. B.S. in Economics, Self-taught Designer..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-sans">Core Industrial Expertise</label>
          <textarea
            value={industryExperience || ""}
            onChange={(e) => setIndustryExperience(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
            placeholder="E.g. FinTech PM, E-commerce marketing..."
          />
        </div>
      </div>

      {/* Skills Matrix Tag Box */}
      <div className="space-y-3 p-5 bg-slate-950/40 rounded-2xl border border-white/5">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center space-x-1">
            <Brain className="w-4 h-4 text-sky-400" />
            <span>Skills Inventory Matrix</span>
          </label>
          <span className="text-[10px] text-slate-500">Adding tags identifies your archetype. Press + to commit.</span>
        </div>

        <div className="flex flex-wrap gap-2 min-h-10 p-3 bg-slate-950 rounded-xl border border-white/5">
          {skills.length === 0 ? (
            <span className="text-xs text-slate-600 italic">No skills specified yet.</span>
          ) : (
            skills.map((skill) => (
              <span key={skill} className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg">
                <span>{skill}</span>
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-indigo-400 hover:text-white font-bold ml-1">×</button>
              </span>
            ))
          )}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="e.g. React Programming, Project Management, Growth Hacking"
            value={newSkill || ""}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs flex items-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Career Experience Details</label>
          <textarea
            value={experience || ""}
            onChange={(e) => setExperience(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            placeholder="Describe previous jobs, team roles, or domain focus..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Previous Startup / Protolife launches</label>
          <textarea
            value={previousProjects || ""}
            onChange={(e) => setPreviousProjects(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            placeholder="Landed sales? Coded MVPs? Sold newsletter lists..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Venture Budget Target</label>
          <input
            type="text"
            value={budget || ""}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            placeholder="E.g. $2,000"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Weekly Time budget</label>
          <input
            type="text"
            value={timeAvailable || ""}
            onChange={(e) => setTimeAvailable(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            placeholder="E.g. 20 hours / week"
          />
        </div>
      </div>

      {/* Interests list Tag box */}
      <div className="space-y-3 p-5 bg-slate-950/40 rounded-2xl border border-white/5">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center space-x-1">
            <Rocket className="w-4 h-4 text-indigo-400" />
            <span>Founder Interests & Market Niches</span>
          </label>
          <span className="text-[10px] text-slate-500">Adding your favorite sub-sectors alerts the alternative engine list.</span>
        </div>

        <div className="flex flex-wrap gap-2 min-h-10 p-3 bg-slate-950 rounded-xl border border-white/5">
          {interests.length === 0 ? (
            <span className="text-xs text-slate-600 italic">No interests logged yet.</span>
          ) : (
            interests.map((interest) => (
              <span key={interest} className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-lg">
                <span>{interest}</span>
                <button type="button" onClick={() => handleRemoveInterest(interest)} className="text-purple-400 hover:text-white font-bold ml-1">×</button>
              </span>
            ))
          )}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="e.g. Web Automation, local service businesses, AI integrations"
            value={newInterest || ""}
            onChange={(e) => setNewInterest(e.target.value)}
            className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs flex items-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/5">
        <button
          type="submit"
          className="px-8 py-3.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Save Details & Calculate Archetype
        </button>
      </div>

    </form>
  );
}


// --- STARTUP IDEA FORM ---
interface IdeaFormProps {
  startup: StartupIdea;
  onChangeStartup: (startup: StartupIdea) => void;
  onAnalyze: () => void;
  analyzing: boolean;
}

export function IdeaForm({ startup, onChangeStartup, onAnalyze, analyzing }: IdeaFormProps) {
  const [name, setName] = useState(startup?.startupName || "");
  const [idea, setIdea] = useState(startup?.idea || "");
  const [users, setUsers] = useState(startup?.targetUsers || "");
  const [model, setModel] = useState(startup?.revenueModel || "");
  const [problem, setProblem] = useState(startup?.problemSolved || "");
  const [researchStage, setResearchStage] = useState(0);

  // Sync state if startup prop changes
  useEffect(() => {
    setName(startup?.startupName || "");
    setIdea(startup?.idea || "");
    setUsers(startup?.targetUsers || "");
    setModel(startup?.revenueModel || "");
    setProblem(startup?.problemSolved || "");
  }, [startup]);

  useEffect(() => {
    if (!analyzing) {
      setResearchStage(0);
      return;
    }
    const timer = setInterval(() => {
      setResearchStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2400);
    return () => clearInterval(timer);
  }, [analyzing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeStartup({
      startupName: name,
      idea,
      targetUsers: users,
      revenueModel: model,
      problemSolved: problem
    });
    // Call analysis trigger
    onAnalyze();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-slate-900/40 border border-white/5 rounded-3xl space-y-6 animate-fade-in font-sans">
      
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Rocket className="w-5 h-5 text-indigo-400" />
          <span>Venture Submission Unit</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Submit your specific SaaS or micro-business parameters to activate Gemini Intelligence evaluations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Venture Name / Title</label>
          <input
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            placeholder="e.g. Servely"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Revenue Structure / Pricing</label>
          <input
            type="text"
            value={model || ""}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            placeholder="e.g. $49/mo SaaS + 1.5% transaction commission"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-sans">Venture Idea / Solution Concept</label>
        <textarea
          value={idea || ""}
          onChange={(e) => setIdea(e.target.value)}
          required
          rows={3}
          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-sans"
          placeholder="Be as descriptive as possible. E.g. A vertical software suite for neighborhood landscapers to schedule dynamically..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target User Archetype</label>
          <textarea
            value={users || ""}
            onChange={(e) => setUsers(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            placeholder="Describe who will pay. E.g. Pool cleaning agencies, small boutique lawn mowing service crews..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Problem Being Solved</label>
          <textarea
            value={problem || ""}
            onChange={(e) => setProblem(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none font-sans"
            placeholder="E.g. Contractors suffer massive scheduling SMS coordinate lags and invoicing delays affecting liquid collections..."
          />
        </div>
      </div>

      {analyzing ? (
        <div className="p-8 bg-white/5 border border-white/10 text-center rounded-2xl space-y-4 font-sans backdrop-blur-md">
          <div className="relative w-12 h-12 mx-auto">
            <span className="animate-spin w-12 h-12 border-3 border-blue-500/30 border-t-blue-400 rounded-full block" />
            <Globe className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white tracking-wide transition-all">
              {researchStage === 0 && "Analyzing founder profile & venture hypothesis..."}
              {researchStage === 1 && "Researching live market evidence via SerpApi..."}
              {researchStage === 2 && "Analyzing competitors, news & customer search signals..."}
              {researchStage === 3 && "Synthesizing FounderOS intelligence report with Gemini..."}
            </h4>
            <p className="text-xs text-cyan-300/80 font-mono">
              Stage {researchStage + 1} of 4 • Grounding intelligence in live web signals
            </p>
          </div>
          <div className="w-full max-w-md mx-auto bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 h-full transition-all duration-700 rounded-full"
              style={{ width: `${(researchStage + 1) * 25}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 max-w-md mx-auto">
            Targeted queries are dispatched concurrently across Google Search and Google News to substantiate competitor matrices and market signals.
          </p>
        </div>
      ) : (
        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            Submit Research & Analyze Strategy
          </button>
        </div>
      )}

    </form>
  );
}


// --- WEEKLY AUDIT MODULE ---
interface AuditFormProps {
  onAddAudit: (audit: WeeklyAudit) => void;
  audits: WeeklyAudit[];
  onUpdateXP: (xpIncrement: number) => void;
}

export function AuditForm({ onAddAudit, audits, onUpdateXP }: AuditFormProps) {
  const [completedTasks, setCompletedTasks] = useState("");
  const [skillsLearned, setSkillsLearned] = useState("");
  const [progressMade, setProgressMade] = useState("");
  const [biggestWin, setBiggestWin] = useState("");
  const [biggestMistake, setBiggestMistake] = useState("");
  const [biggestBottleneck, setBiggestBottleneck] = useState("");
  const [nextWeekPriority, setNextWeekPriority] = useState("");
  
  const [auditing, setAuditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuditing(true);

    // Simulate AI mentorship callback loop
    setTimeout(() => {
      const answersList = ["Great job focus in customer discovery.", "Prioritize stripe setup soon to guarantee client revenue."];
      const feedback = `AI MENTOR FEEDBACK REVIEW:
      - Biggest Win Assessment: Exceptional traction! Gaining direct user consensus early bypasses expensive engineering mistakes.
      - Optimization Advice: Your top bottleneck ("${biggestBottleneck || "scheduling"}") should be tackled first next week. Do not add complex dashboard codes until payment links flow cleanly.
      - Next Priority Recommendation: Set up immediate SMS triggers. You have earned +200 XP for keeping operational high standards!`;

      const newAudit: WeeklyAudit = {
        id: Date.now().toString(),
        userId: "authenticated-user",
        weekStartDate: new Date().toLocaleDateString(),
        completedTasks,
        skillsLearned,
        progressMade,
        biggestWin,
        biggestMistake,
        biggestBottleneck,
        nextWeekPriority,
        aiFeedback: feedback,
        createdAt: new Date().toISOString()
      };

      onAddAudit(newAudit);
      onUpdateXP(200); // Massive XP for maintaining systematic reviews!
      setAuditing(false);

      // Reset
      setCompletedTasks("");
      setSkillsLearned("");
      setProgressMade("");
      setBiggestWin("");
      setBiggestMistake("");
      setBiggestBottleneck("");
      setNextWeekPriority("");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in font-sans">
      
      {/* Submitter Box */}
      <form onSubmit={handleSubmit} className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Milestone className="w-5 h-5 text-indigo-400" />
            <span>Weekly Founder Operational Audit</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Audit your weekly outputs. Our AI systems will analyze mistakes, and prescribe your highest priority next week.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed Actions This Week</label>
            <input
              type="text"
              value={completedTasks || ""}
              onChange={(e) => setCompletedTasks(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              placeholder="e.g. Conducted 3 Mom-Test contractor interviews"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Skills Acquired / Practiced</label>
            <input
              type="text"
              value={skillsLearned || ""}
              onChange={(e) => setSkillsLearned(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              placeholder="e.g. Stripe checkout Connect API configs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Biggest Launch Win</label>
            <input
              type="text"
              value={biggestWin || ""}
              onChange={(e) => setBiggestWin(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              placeholder="Grandfathered first trade for $49/mo"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Biggest Validation Mistake</label>
            <input
              type="text"
              value={biggestMistake || ""}
              onChange={(e) => setBiggestMistake(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              placeholder="Bought domain names before talks"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Highest Friction Bottleneck</label>
            <input
              type="text"
              value={biggestBottleneck || ""}
              onChange={(e) => setBiggestBottleneck(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              placeholder="Finding landscapers around local areas"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Proposed High Priority Next Week</label>
          <input
            type="text"
            value={nextWeekPriority || ""}
            onChange={(e) => setNextWeekPriority(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            placeholder="Draft simple high-fidelity payment link template screen in standard React"
          />
        </div>

        {auditing ? (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-center rounded-xl text-xs text-slate-400 font-mono">
            Partner AI is auditing week records...
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Log Week Audit & Receive Feedback</span>
            </button>
          </div>
        )}
      </form>

      {/* Historic Audits List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">Historic Operational logs</h3>
        {audits.length === 0 ? (
          <span className="text-xs text-slate-600 italic block">No previous weekly audits registered. Submit your first to see history logs here.</span>
        ) : (
          audits.map((aud, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="text-sm font-bold text-white">Log Week of {aud.weekStartDate}</h4>
                <div className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/10">
                  Audited
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Biggest Win:</span>
                  <p className="text-slate-200 mt-0.5">{aud.biggestWin || "N/A"}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">Mistake Logged:</span>
                  <p className="text-slate-200 mt-0.5 text-amber-300">{aud.biggestMistake || "N/A"}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">Next Week Target:</span>
                  <p className="text-slate-200 mt-0.5">{aud.nextWeekPriority || "N/A"}</p>
                </div>
              </div>

              {aud.aiFeedback && (
                <div className="p-4 bg-slate-950 border border-white/5 rounded-xl text-xs space-y-1 font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed select-text">
                  {aud.aiFeedback}
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
