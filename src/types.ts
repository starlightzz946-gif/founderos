export interface UserProfile {
  uid?: string;
  name: string;
  age: string;
  country: string;
  education: string;
  skills: string[];
  experience: string;
  previousProjects: string;
  budget: string;
  timeAvailable: string;
  interests: string[];
  industryExperience: string;
  archetype?: string;
  strengths?: string[];
  weaknesses?: string[];
  founderScore?: number;
  xp: number;
  level: string;
}

export interface StartupIdea {
  startupName: string;
  idea: string;
  targetUsers: string;
  revenueModel: string;
  problemSolved: string;
}

export interface Competitor {
  name: string;
  strengths: string;
  weaknesses: string;
  marketGap: string;
  differentiationOpportunity: string;
}

export interface AlternativeIdea {
  title: string;
  description: string;
  marketOpportunity: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  fitScore: number;
  revenuePotential: string;
}

export interface MatchAnalysis {
  whySuitable: string[];
  whyUnsuitable: string[];
  missingExperience: string[];
  missingSkills: string[];
  reasoning: string;
}

export interface IdeaImprovements {
  improvedVersion: string;
  nicheVersion: string;
  premiumVersion: string;
  aiEnhancedVersion: string;
  easierToLaunchVersion: string;
  explanations: {
    improved: string;
    niche: string;
    premium: string;
    ai: string;
    easy: string;
  };
}

export interface SkillGapAnalysis {
  skillGapScore: number;
  criticalMissingSkills: string[];
  recommendedLearningPriority: {
    learnImmediately: string[];
    learnSoon: string[];
    learnLater: string[];
  };
}

export interface LearningResource {
  skill: string;
  free: { name: string; url: string; description: string }[];
  paid: { name: string; url: string; description: string }[];
  estLearningTime: string;
  difficulty: string;
  order: number;
}

export interface Roadmap30_60_90 {
  plan30Day: string[];
  plan60Day: string[];
  plan90Day: string[];
  buildVsLearnAdvice: string;
}

export interface MVPPlan {
  features: string[];
  userFlows: string[];
  dbSchema: string;
  apiStructure: string;
  folderStructure: string;
  techArchitecture: string;
  recommendations: string[];
}

export interface ExecutionWeeks {
  week1: string[];
  week2: string[];
  week3: string[];
  week4: string[];
  month1: string[];
  month2: string[];
  month3: string[];
}

export interface RevenuePlan {
  first100: string;
  first1000: string;
  first10000: string;
  first100000: string;
}

export interface InvestorQuestion {
  question: string;
  sampleAnswer: string;
  explanation: string;
}

export interface InvestorMode {
  questionsWithAnswers: InvestorQuestion[];
  investorReadinessScore: number;
  investorConcerns: string[];
  fundingReadiness: string;
}

export interface StartupReport {
  id: string;
  userId: string;
  startupName: string;
  idea: string;
  targetUsers: string;
  revenueModel: string;
  problemSolved: string;
  startupScore: number;
  fitScore: number;
  readinessScore: number;
  archetype: string;
  strengths: string[];
  weaknesses: string[];
  founderScore: number;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  validation: {
    problemValidation: string;
    marketOpportunity: string;
    marketSize: string;
    marketDemand: string;
    competitiveLandscape: string;
    monetizationPotential: string;
    recommendations: string[];
  };
  competitors: Competitor[];
  fitAnalysis: MatchAnalysis;
  improvements: IdeaImprovements;
  alternativeIdeas: AlternativeIdea[];
  skillGaps: SkillGapAnalysis;
  learningResources: LearningResource[];
  roadmap30_60_90: Roadmap30_60_90;
  mvpPlan: MVPPlan;
  executionRoadmap: ExecutionWeeks;
  revenuePlan: RevenuePlan;
  aiInvestorMode: InvestorMode;
  marketResearch?: MarketResearchData;
  createdAt: string;
}

export interface MarketCompetitor {
  name: string;
  link?: string;
  domain?: string;
  snippet?: string;
  sourceType?: string;
}

export interface MarketNewsItem {
  title: string;
  source: string;
  link: string;
  date?: string;
  snippet?: string;
}

export interface MarketPricingSignal {
  title: string;
  price?: string;
  merchant?: string;
  link?: string;
}

export interface MarketLocalCompetitor {
  name: string;
  address?: string;
  rating?: number;
  reviews?: number;
  link?: string;
}

export interface MarketSourceItem {
  title: string;
  link: string;
  domain: string;
  snippet?: string;
  type: "search" | "news" | "shopping" | "local";
}

export interface MarketResearchData {
  enabled: boolean;
  searchedAt?: string;
  queries?: string[];
  competitors?: MarketCompetitor[];
  alternatives?: Array<{ title: string; link?: string; snippet?: string }>;
  news?: MarketNewsItem[];
  pricingSignals?: MarketPricingSignal[];
  localCompetitors?: MarketLocalCompetitor[];
  sources?: MarketSourceItem[];
  keySignals?: string[];
  limitations?: string[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
}

export interface WeeklyAudit {
  id: string;
  userId: string;
  weekStartDate: string;
  completedTasks: string;
  skillsLearned: string;
  progressMade: string;
  biggestWin: string;
  biggestMistake: string;
  biggestBottleneck: string;
  nextWeekPriority: string;
  aiFeedback?: string;
  createdAt: string;
}
