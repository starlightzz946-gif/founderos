import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

import { UserProfile, StartupReport, StartupIdea, WeeklyAudit } from "./types";
import { demoProfile, demoReport } from "./components/DemoData";

// Modular UI Components
import LandingPage from "./components/LandingPage";
import DashboardView from "./components/DashboardView";
import ReportView from "./components/ReportView";
import MentorChat from "./components/MentorChat";
import { ProfileForm, IdeaForm, AuditForm } from "./components/FormModules";
import ThreeBackground from "./components/ThreeBackground";

// Lucide icons
import {
  Sparkles,
  LayoutDashboard,
  User,
  Rocket,
  FileText,
  MessageSquare,
  Milestone,
  LogOut,
  ChevronRight,
  TrendingUp,
  Brain,
  Award
} from "lucide-react";

// Initialize Firebase safely
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// Firestore Error handler schema matching the eight-pillar diagnostics requirement
enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error("Firestore error captured:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [startupIdea, setStartupIdea] = useState<StartupIdea | null>(null);
  const [startupReport, setStartupReport] = useState<StartupReport | null>(null);
  const [weeklyAudits, setWeeklyAudits] = useState<WeeklyAudit[]>([]);

  // Sandbox/demo flags to allow restricted popups bypass and visual-check onboarding
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const [analyzingIdea, setAnalyzingIdea] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Dashboard");

  // Track Firebase connection test
  useEffect(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        setIsDemoUser(false);
        await loadUserData(firebaseUser.uid);
      } else {
        setCurrentUser(null);
        if (!isDemoUser) {
          setUserProfile(null);
          setStartupIdea(null);
          setStartupReport(null);
          setWeeklyAudits([]);
        }
      }
    });
  }, [isDemoUser]);

  // Load persistence data from Firestore
  const loadUserData = async (uid: string) => {
    setLoadingProfile(true);
    try {
      // 1. Load Profile
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const pData = userSnap.data() as UserProfile;
        setUserProfile({ ...pData, uid });
      } else {
        // Create initial placeholder profile
        const newProfile: UserProfile = {
          uid,
          name: auth.currentUser?.displayName || "Founder",
          age: "",
          country: "",
          education: "",
          skills: [],
          experience: "",
          previousProjects: "",
          budget: "",
          timeAvailable: "",
          interests: [],
          industryExperience: "",
          xp: 100,
          level: "Explorer"
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }

      // 2. Load Reports
      const reportsRef = collection(db, "startup_reports");
      const reportsSnap = await getDocs(query(reportsRef, where("userId", "==", uid)));
      if (!reportsSnap.empty) {
        const reportsList = reportsSnap.docs.map(d => d.data() as StartupReport);
        reportsList.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        const rData = reportsList[0];
        setStartupReport(rData);
        setStartupIdea({
          startupName: rData.startupName,
          idea: rData.idea,
          targetUsers: rData.targetUsers,
          revenueModel: rData.revenueModel,
          problemSolved: rData.problemSolved
        });
      }

      // 3. Load Audits
      const auditsRef = collection(db, "weekly_audits");
      const auditsSnap = await getDocs(query(auditsRef, where("userId", "==", uid)));
      const loadedAudits: WeeklyAudit[] = [];
      auditsSnap.forEach((doc) => {
        loadedAudits.push(doc.data() as WeeklyAudit);
      });
      setWeeklyAudits(loadedAudits.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));

    } catch (err) {
      console.error("Error retrieving Firestore records on login:", err);
      // Fallback gracefully to initialize template profile locally
      setUserProfile({
        name: auth.currentUser?.displayName || "Founder",
        age: "",
        country: "",
        education: "",
        skills: [],
        experience: "",
        previousProjects: "",
        budget: "",
        timeAvailable: "",
        interests: [],
        industryExperience: "",
        xp: 100,
        level: "Explorer"
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  // Google Login / Guest entry success
  const handleOnboardingLogin = async (userId: string, email: string | null, isDemo: boolean) => {
    if (isDemo) {
      setIsDemoUser(true);
      setUserProfile(demoProfile);
      setStartupReport(demoReport);
      setStartupIdea({
        startupName: demoReport.startupName,
        idea: demoReport.idea,
        targetUsers: demoReport.targetUsers,
        revenueModel: demoReport.revenueModel,
        problemSolved: demoReport.problemSolved
      });
      setWeeklyAudits([]);
      setActiveTab("Dashboard");
    } else {
      await loadUserData(userId);
      setActiveTab("Dashboard");
    }
  };

  // See demo report shortcut from Landing Page
  const handleSeeDemoOnboarding = () => {
    setIsDemoUser(true);
    setUserProfile(demoProfile);
    setStartupReport(demoReport);
    setStartupIdea({
      startupName: demoReport.startupName,
      idea: demoReport.idea,
      targetUsers: demoReport.targetUsers,
      revenueModel: demoReport.revenueModel,
      problemSolved: demoReport.problemSolved
    });
    setWeeklyAudits([]);
    setActiveTab("YC Partner Report");
  };

  // Save modified user profile
  const handleSaveProfile = async (updated: UserProfile) => {
    const profileToSave = currentUser ? { ...updated, uid: currentUser.uid } : updated;
    setUserProfile(profileToSave);
    if (!isDemoUser && currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, profileToSave);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
      }
    }
  };

  // Save changes to startup details inputs
  const handleSaveStartupIdea = (idea: StartupIdea) => {
    setStartupIdea(idea);
  };

  // Execute Gemini-3.5-flash AI evaluations
  const handleTriggerAIAnalysis = async () => {
    if (!userProfile || !startupIdea) return;
    setAnalyzingIdea(true);
    try {
      const response = await fetch("/api/analyze-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: userProfile,
          startup: startupIdea
        })
      });

      if (!response.ok) {
        throw new Error("Server returned an error status");
      }

      const data = await response.json();
      if (data.report) {
        const fullReport: StartupReport = {
          ...data.report,
          id: `report-${Date.now()}`,
          userId: isDemoUser ? "demo-user" : currentUser?.uid || "unknown",
          createdAt: new Date().toISOString()
        };

        setStartupReport(fullReport);

        // Update levels
        const incXp = 350;
        const finalXp = (userProfile.xp || 0) + incXp;
        const updatedProf = {
          ...userProfile,
          xp: finalXp,
          level: calculateNewLevel(finalXp)
        };
        setUserProfile(updatedProf);

        if (!isDemoUser && currentUser) {
          // Persist report
          try {
            const reportRef = doc(db, "startup_reports", fullReport.id);
            await setDoc(reportRef, fullReport);

            // Save parent profile updates
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, updatedProf);
          } catch (dbErr) {
            console.error("Failed saving report in firestore:", dbErr);
          }
        }

        setActiveTab("YC Partner Report");
      }
    } catch (err: any) {
      console.error("Failed to run full-stack idea analysis:", err);
      alert("AI analysis call completed, but experienced a model API error. We are activating Sarah Jenkins' vertical SaaS demo report sandbox as a backup to showcase the design interface!");
      // Fallback
      setStartupReport(demoReport);
      setStartupIdea({
        startupName: demoReport.startupName,
        idea: demoReport.idea,
        targetUsers: demoReport.targetUsers,
        revenueModel: demoReport.revenueModel,
        problemSolved: demoReport.problemSolved
      });
      setActiveTab("YC Partner Report");
    } finally {
      setAnalyzingIdea(false);
    }
  };

  // Game XP incremental addition helper
  const handleIncrementXP = async (xpInc: number) => {
    if (!userProfile) return;
    const finalXp = Math.max(0, (userProfile.xp || 0) + xpInc);
    const updatedProf = {
      ...userProfile,
      xp: finalXp,
      level: calculateNewLevel(finalXp)
    };
    setUserProfile(updatedProf);

    if (!isDemoUser && currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, updatedProf);
      } catch (e) {
        console.error("Failed persisting XP increment:", e);
      }
    }
  };

  const calculateNewLevel = (xp: number) => {
    if (xp < 500) return "Explorer";
    if (xp < 1000) return "Builder";
    if (xp < 2000) return "Validator";
    if (xp < 3500) return "Launcher";
    if (xp < 5000) return "Revenue Founder";
    return "Growth Founder";
  };

  // Add new weekly audit record
  const handleAddWeeklyAudit = async (newAudit: WeeklyAudit) => {
    const updatedAudits = [newAudit, ...weeklyAudits];
    setWeeklyAudits(updatedAudits);
    if (!isDemoUser && currentUser) {
      try {
        const auditRef = doc(db, "weekly_audits", newAudit.id);
        await setDoc(auditRef, { ...newAudit, userId: currentUser.uid });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `weekly_audits/${newAudit.id}`);
      }
    }
  };

  const handleSignOut = () => {
    auth.signOut();
    setIsDemoUser(false);
    setUserProfile(null);
    setStartupIdea(null);
    setStartupReport(null);
    setWeeklyAudits([]);
  };

  // If no user context and not demo, show Landing Page
  if (!currentUser && !isDemoUser) {
    return (
      <LandingPage
        onLoginSuccess={handleOnboardingLogin}
        onSeeDemoClick={handleSeeDemoOnboarding}
      />
    );
  }

  // If loading or profile not yet loaded, render futuristic loading screen
  if (loadingProfile || !userProfile) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center relative font-sans overflow-hidden">
        <ThreeBackground isInteractive={true} />
        <div className="relative z-10 flex flex-col items-center space-y-4 bg-black/60 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-300 tracking-wider uppercase">Loading FounderOS Workspace...</p>
        </div>
      </div>
    );
  }

  // Active user menu categories
  const menuItems = [
    { id: "Dashboard", name: "Dashboard Core", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "Founder Profile", name: "Venture Profile", icon: <User className="w-4 h-4" /> },
    { id: "Idea Analyzer", name: "Viability Lab", icon: <Rocket className="w-4 h-4" /> },
    ...(startupReport ? [{ id: "YC Partner Report", name: "YC Partner Report", icon: <FileText className="w-4 h-4" /> }] : []),
    { id: "Interactive AI Mentor", name: "Context AI Mentor", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "Weekly Operational Audit", name: "Founder Weekly Audit", icon: <Milestone className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row relative font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* 3D Interactive Background */}
      <ThreeBackground isInteractive={true} />
      
      {/* Sidebar Command Rail */}
      <aside className="relative z-20 w-full md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between shrink-0 h-auto md:h-screen sticky top-0" id="sidebar-rail">
        
        {/* Top brand */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight block">FounderOS</span>
              <span className="text-[9px] text-blue-400 font-mono tracking-widest uppercase block mt-[-2px]">Workspace</span>
            </div>
          </div>

          {isDemoUser && (
            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-mono rounded">
              Demo
            </span>
          )}
        </div>

        {/* Navigation Categories */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all cursor-pointer ${
                activeTab === item.id
                  ? "bg-white/5 border border-white/10 text-blue-400 shadow-md"
                  : "text-white/60 hover:text-blue-400 hover:bg-white/[0.02]"
              }`}
            >
              <span className={activeTab === item.id ? "text-blue-400" : "text-white/40"}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Profile controls */}
        <div className="p-4 border-t border-white/10 space-y-3 shrink-0">
          <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10">
            <div className="truncate pr-2">
              <span className="text-xs font-extrabold text-white block truncate">{userProfile?.name || "Founder"}</span>
              <span className="text-[10px] text-white/40 block truncate">{userProfile?.level || "Explorer"}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg border border-white/10 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Dynamic View Area */}
      <main className="flex-grow min-h-screen flex flex-col justify-between bg-[#050505]/40 backdrop-blur-sm overflow-y-auto relative z-10" id="main-interface">
        
        {/* Top Header Rail */}
        <header className="h-16 border-b border-white/10 px-6 sm:px-8 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-white/60 font-semibold">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-bold">{activeTab}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-mono text-white font-bold">{userProfile?.xp || 100} XP</span>
            </div>
          </div>
        </header>

        {/* View content container */}
        <div className="flex-grow pb-12">
          {activeTab === "Dashboard" && (
            <DashboardView
              profile={userProfile!}
              report={startupReport}
              onUpdateXP={handleIncrementXP}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === "Founder Profile" && (
            <ProfileForm
              profile={userProfile!}
              onSaveProfile={handleSaveProfile}
              onUpdateXP={handleIncrementXP}
            />
          )}

          {activeTab === "Idea Analyzer" && (
            <div className="space-y-6">
              <IdeaForm
                startup={{
                  startupName: startupIdea?.startupName ?? "",
                  idea: startupIdea?.idea ?? "",
                  targetUsers: startupIdea?.targetUsers ?? "",
                  revenueModel: startupIdea?.revenueModel ?? "",
                  problemSolved: startupIdea?.problemSolved ?? ""
                }}
                onChangeStartup={handleSaveStartupIdea}
                onAnalyze={handleTriggerAIAnalysis}
                analyzing={analyzingIdea}
              />
            </div>
          )}

          {activeTab === "YC Partner Report" && startupReport && (
            <ReportView
              report={startupReport}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "Interactive AI Mentor" && (
            <MentorChat
              profile={userProfile!}
              startup={startupIdea}
              report={startupReport}
            />
          )}

          {activeTab === "Weekly Operational Audit" && (
            <AuditForm
              onAddAudit={handleAddWeeklyAudit}
              audits={weeklyAudits}
              onUpdateXP={handleIncrementXP}
            />
          )}
        </div>

      </main>

    </div>
  );
}
