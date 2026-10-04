import { StartupReport, UserProfile } from "../types";

export const demoProfile: UserProfile = {
  name: "Sarah Jenkins",
  age: "29",
  country: "United States",
  education: "B.S. in Economics, Self-taught UI/UX Designer",
  skills: ["Product Management", "Figma", "Growth Marketing", "No-code Development (Bubble)", "Copywriting"],
  experience: "4 years as an associate product manager in FinTech; managed an email newsletter list of 5,000 subscribers.",
  previousProjects: "Launched a local newsletter that helped small shops promote sales (reached $300 MRR, sold it).",
  budget: "$2,000",
  timeAvailable: "20 hours / week",
  interests: ["Local Commerce", "SaaS Automation", "Micro-SaaS", "Sustainable Businesses", "Productivity Tools"],
  industryExperience: "Product Management, Local marketing solutions",
  archetype: "Product Founder",
  strengths: ["User Empathy", "Visual Positioning", "No-code Assembly speeds", "Organic Growth loops"],
  weaknesses: ["No advanced backend programming", "Limited enterprise sales background"],
  founderScore: 84,
  xp: 1250,
  level: "Validator"
};

export const demoReport: StartupReport = {
  id: "demo-report-123",
  userId: "demo-user",
  startupName: "Servely",
  idea: "A vertical software suite for neighborhood landscaping and pool maintenance agencies to book packages, schedule crews dynamically, and process tips without friction.",
  targetUsers: "Independent local service trade owners (landscapers, cleaning crews, pool repair companies).",
  revenueModel: "$49/month Base SaaS subscription + 1.5% transaction processing volume fee.",
  problemSolved: "Local trades suffer from chaotic schedule coordination, phone tag with clients, and delayed invoice collection resulting in poor cashflow.",
  startupScore: 81,
  fitScore: 88,
  readinessScore: 85,
  founderScore: 84,
  archetype: "Product Founder",
  strengths: ["Excellent UX insight", "Proven history of engaging local businesses", "High adaptability with Bubble and Stripe-integrations"],
  weaknesses: ["Lacks direct relational database querying skillset", "Does not have native app packaging background"],
  swot: {
    strengths: [
      "Low capital intensity (utilizing No-code/serverless)",
      "Highly specific target market with well-defined pain points",
      "Saves trade owners average 8 hours a week on administration"
    ],
    weaknesses: [
      "Low initial barrier to copy unless strong network effects are established",
      "High initial customer contact friction (requires door-to-door or local cold-calls)"
    ],
    opportunities: [
      "Direct integration with regional local trade associations",
      "Expanding to include white-labeled booking pages for the trade business owners"
    ],
    threats: [
      "Incumbents like Jobber or Housecall Pro moving downmarket",
      "Platform risk of Bubble hosting costs scaling non-linearly"
    ]
  },
  validation: {
    problemValidation: "High friction verified: 8 out of 10 trade owners interviewed list collection lag and SMS scheduling fatigue in their top 3 operations headaches.",
    marketOpportunity: "Service trade platforms are growing 14% annually post-pandemic; small local sole proprietors make up 60% of the services segment.",
    marketSize: "TAM: $12 Billion (US Local home services SaaS), SAM: $850 Million (Pool/Landscaping sole-proprietor niche), SOM: $4.2 Million (Sarah's first 3 targeted metro areas).",
    marketDemand: "Google search trends for 'simple booking tool for contractors' have spiked 45% year-over-year.",
    competitiveLandscape: "Jobber & Housecall Pro are heavily feature-bloated, priced at over $120/mo, and overwhelmed with multi-layered controls. Servely wins on extreme simplicity and mobile-optimal crew actions.",
    monetizationPotential: "High base SaaS retention. A contractor onboarding 10 recurring homeowners will readily maintain a $49 retainer to save administrative billing hours.",
    recommendations: [
      "Verify pricing acceptance with 5 local landscaping micro-businesses before building full schedules.",
      "Launch with credit card pre-authorizations to prevent cash deficits."
    ]
  },
  competitors: [
    {
      name: "Jobber",
      strengths: "Deep features, massive integration library, highly stable brand cache.",
      weaknesses: "Steep learning curve, higher price tiers ($120-$250/mo), complex settings discourage non-technical crews.",
      marketGap: "Mobile field workforce app is secondary to heavy desktop portal.",
      differentiationOpportunity: "Create an index-card style interface that requires exactly two taps on mobile to approve a scheduled route."
    },
    {
      name: "Housecall Pro",
      strengths: "Excellent dispatch and invoice syncing with QuickBooks.",
      weaknesses: "Rigid database layouts, custom forms cost extra, lacks simple tip-processing module.",
      marketGap: "No focused tip or crew referral gamification tools.",
      differentiationOpportunity: "Incorporate automatic crew tip suggestions which increases landscaper retention by 15%."
    }
  ],
  fitAnalysis: {
    whySuitable: [
      "Sarah's economics and growth-marketing backgrounds align perfectly with low-cost local lead acquisition",
      "Her previous local newsletter experience ensures direct paths for high-trust business networking"
    ],
    whyUnsuitable: [
      "Lack of traditional database administration experience (SQL/Postgres) could challenge complex custom integrations",
      "No direct door-to-door sales experience which is core to regional onboarding"
    ],
    missingExperience: [
      "Enterprise field logistics scaling",
      "High-security financial card tokenization configurations"
    ],
    missingSkills: [
      "SQL database structuring",
      "API payload routing validation"
    ],
    reasoning: "Sarah is a stellar product-centric founder. She possesses 80% of what is needed to assemble and validate a highly aesthetic front-end booking experience. By partnering with a local technical helper or utilizing hardened boilerplate stacks, she can mitigate backend knowledge gaps."
  },
  improvements: {
    improvedVersion: "Servely: Landscaping CRM focusing on immediate invoice collection and high-visibility crew tipping.",
    nicheVersion: "TurfFlow: Exclusively for residential irrigation & turf care teams with built-in regional water-usage tracking.",
    premiumVersion: "EstateCrew: Premium white-labeled concierge scheduling software for luxury landscape architects.",
    aiEnhancedVersion: "Servely AI: Smart auto-routing and landscape image-analysis which suggests material estimates based on customer uploads of yard photos.",
    easierToLaunchVersion: "Landscaper Tip: A simple QR-based collection portal allowing landscaping clients to pay instantly, bypassing the need for a full CRM.",
    explanations: {
      improved: "Focusing heavily on tipping matches standard landscaper expectations, improving crew morale with zero onboarding cost.",
      niche: "Focusing on irrigation allows compliance with local drought codes which builds high authority.",
      premium: "Vastly increases software pricing margins to $299/mo to secure premium customer care integrations.",
      ai: "Drastically cuts down site-visit estimating times, saving project managers 3 hours per estimate.",
      easy: "Can be constructed in a weekend with Stripe payment links and zero database architecture."
    }
  },
  alternativeIdeas: [
    {
      title: "Local AdMail Engine",
      description: "Automated local direct mail marketing targeting new home movers on behalf of neighborhood dental & spa clinics.",
      marketOpportunity: "Movers spend $10,000 on local services within 90 days. High merchant premium demand.",
      difficulty: "Easy",
      fitScore: 92,
      revenuePotential: "$5,000 MRR in 90 days"
    },
    {
      title: "Contractor Portfolio AI",
      description: "Embeddable photo gallery that auto-tags prior work locations, generates project summaries, and pushes optimization to Local Google Listings.",
      marketOpportunity: "Home contractors have terrible websites lacking SEO signals; search queries are entirely location-driven.",
      difficulty: "Medium",
      fitScore: 87,
      revenuePotential: "$4,000 MRR"
    },
    {
      title: "GymCRM for Micro-Studios",
      description: "Class scheduling and attendance tracker tailored specifically for independent yoga and pilates trainers booking outdoor parks.",
      marketOpportunity: "Park permits are expensive and trainers lack simple tools to organize client waiver-signatures.",
      difficulty: "Easy",
      fitScore: 84,
      revenuePotential: "$2,500 MRR"
    },
    {
      title: "B2B Cleaning Agency Router",
      description: "Matching portal connecting high-end office buildings with reliable local commercial cleaning crews.",
      marketOpportunity: "Large commercial contracts are high ticket; current agencies take 35% fees.",
      difficulty: "Hard",
      fitScore: 80,
      revenuePotential: "$12,000 MRR"
    },
    {
      title: "Real Estate Flyer Generator",
      description: "Automated generation of print booklets + virtual tour pages based purely on Zillow MLS links for local listing agents.",
      marketOpportunity: "Real estate agents are non-technical and spend $400 per active listing on promotional assets.",
      difficulty: "Easy",
      fitScore: 89,
      revenuePotential: "$6,000 MRR"
    }
  ],
  skillGaps: {
    skillGapScore: 78,
    criticalMissingSkills: [
      "Stripe Connect custom charge accounts logic",
      "Relational DB Normalization for multi-tenant isolation",
      "Customer Development and consultative local B2B sales"
    ],
    recommendedLearningPriority: {
      learnImmediately: ["B2B Customer Discovery Interviews", "Figma Auto-Layout & UI Design Standards"],
      learnSoon: ["Bubble Database Normalization", "Stripe API Integration Basics"],
      learnLater: ["Native iOS wrappers", "Advanced PostgreSQL analytics querying"]
    }
  },
  learningResources: [
    {
      skill: "B2B Customer Discovery",
      free: [
        { name: "Y Combinator's How to Talk to Users", url: "https://www.youtube.com/watch?v=z1iF1c8y5vA", description: "The gold standard video for customer interview tactics." },
        { name: "The Mom Test (Summary)", url: "https://www.google.com/search?q=the+mom+test+summary", description: "Learn how to ask questions that reveal honest market demand." }
      ],
      paid: [
        { name: "Coursera: Startup validation strategies", url: "https://www.coursera.org", description: "Comprehensive validation methodology structure." }
      ],
      estLearningTime: "4 hours",
      difficulty: "Easy",
      order: 1
    },
    {
      skill: "Multi-tenant Database Normalization",
      free: [
        { name: "freeCodeCamp's Database Design Tutorial", url: "https://www.freecodecamp.org", description: "Full structured video walking through structural safety." }
      ],
      paid: [
        { name: "Udemy No-Code Database Course", url: "https://www.udemy.com", description: "Design scalable SaaS systems with no-code." }
      ],
      estLearningTime: "12 hours",
      difficulty: "Medium",
      order: 2
    }
  ],
  roadmap30_60_90: {
    plan30Day: [
      "Perform interviews with 10 local landscaping business owners using strict 'Mom Test' rules.",
      "Create high-fidelity Figma mockups showing Servely's 2-tap dispatch and tipping interface.",
      "Build a simple vertical-focused landing page (e.g. servely.co) detailing the concrete $49/mo offer."
    ],
    plan60Day: [
      "Assemble MVP version using No-code platform (Bubble), configuring basic scheduling calendar and tip collection cards.",
      "Get 3 local crews to pilot the software for free on 3 of their routes to capture direct UX bugs.",
      "Deploy basic email notifications alerting homeowners when a landscaper enters their lot."
    ],
    plan90Day: [
      "Transition pilot crews to paying $49/mo base subscription upon successful tip additions proof.",
      "Onboard 5 additional service trade companies through door-to-door regional visits.",
      "Automate localized payout transfers via integrated Stripe Connect express routing."
    ],
    buildVsLearnAdvice: "VALUABLE INSIGHT: Stop researching database architecture or server management. Build is simple; validation rules. Leverage Sarah's PM experience to configure custom templates in Bubble. Focus entire effort on local door-to-door user discovery so you don't build software that contractors ignore."
  },
  mvpPlan: {
    features: [
      "Single-page mobile scheduling dashboard for landscapers.",
      "SMS Dispatch alerts utilizing Stripe/Twilio.",
      "Static customer terminal for contactless tip selections & reviews.",
      "Weekly transaction ledger indicating outstanding billing totals."
    ],
    userFlows: [
      "User registers business -> Configures profile -> Connects Stripe -> Adds crew names -> Schedules first job -> Crew completes work -> Client receives tip-processing link."
    ],
    dbSchema: "Firestore collection 'businesses' contains: businessName, ownerUid, stripeAccountId. Subcollection 'crew' contains: name, email, rating. Subcollection 'appointments' contains: customerName, date, address, status, tipAmount, totalAmount.",
    apiStructure: "GET /api/appointments?businessId=X, POST /api/appointments/new, POST /api/stripe/webhook",
    folderStructure: "/src/components: SchedulingCanvas, PaymentTerminal \n/src/hooks: useStripeConnect \n/functions (Firebase Serverless): processWebhook, sendSMSAlert",
    techArchitecture: "Bubble.io OR React hosted on Cloud Run, backing Firestore as immediate real-time database, paired with GCP Twilio serverless function gateways.",
    recommendations: [
      "Set your database rules properly to prevent competitor cross-viewing.",
      "Utilize template elements to bypass canvas styling from scratch."
    ]
  },
  executionRoadmap: {
    week1: [
      "Call or visit 5 local landscape companies; offer to buy lunch in return for 15 minutes of scheduling reviews.",
      "Draft paper-prototype screens of the worker route view."
    ],
    week2: [
      "Construct beautiful landing page detailing the invoice-processing issue.",
      "Drive traffic using local Facebook groups and classified ads targeting home improvement trades."
    ],
    week3: [
      "Set up Stripe payment links directly behind the landing page CTA.",
      "Capture card-authorization of 3 trade partners committing to free pilot."
    ],
    week4: [
      "Onboard crews into the digital schedule boards.",
      "Deploy the automated sms booking notification template manually using simple tools to test comfort."
    ],
    month1: [
      "Track scheduled jobs of first 3 active test trades.",
      "Solve critical manual errors during tip payouts."
    ],
    month2: [
      "Acquire 5-10 additional trades via referral programs ('Introduce a contractor, get 1 month software credit')."
    ],
    month3: [
      "Process total transactions worth $10,000; demonstrate average of $350 in additional monthly earnings per crew via tipping."
    ]
  },
  revenuePlan: {
    first100: "Charge your first 2 friendly trial landscape groups a grandfathered fee of $49/mo.",
    first1000: "Onboard 20 local crews onto the base subscription tier. Introduce standard 1.5% tip fee splits.",
    first10000: "Sell an annual Servely Enterprise license package for $1,200/yr to 8 regional commercial cleaning networks.",
    first100000: "Integrate premium lead generation triggers, charging contractors $10/lead for regional pool installation tickets."
  },
  aiInvestorMode: {
    questionsWithAnswers: [
      {
        question: "Why now?",
        sampleAnswer: "Post-pandemic home services boom has overwhelmed local micro-businesses with client inquiries, while labor costs require crews to find alternative channels (like tipping) to reward workers.",
        explanation: "Addresses temporal urgency, utilizing rising labor spikes as structural tailwinds."
      },
      {
        question: "Why this market?",
        sampleAnswer: "Sole-proprietor contractors are completely ignored by enterprise CRMs. They represent high-volume transactions ($100k+ annually per crew) that can be easily captured via Stripe.",
        explanation: "Highlights untapped high-frequency sub-sectors with immediate margin leverage."
      },
      {
        question: "Why you?",
        sampleAnswer: "Sarah Jenkins' unique combination of FinTech PM acumen and direct regional growth execution ensures we launch highly aesthetic, incredibly simple, low-CAC systems.",
        explanation: "Demonstrates founder-market alignment, neutralizing coding gaps with high product experience."
      },
      {
        question: "What is your moat?",
        sampleAnswer: "Our scheduling data, worker productivity metrics, and exclusive localized integration into Stripe billing channels create absolute workflow stickiness that trades won't leave.",
        explanation: "Pitches structural workflow locking as deep defensibility."
      },
      {
        question: "Why will users pay?",
        sampleAnswer: "We don't sell 'software'; we sell billing speed. Homeowners pay landscapers instantly upon SMS, increasing trade cashflow and crew compensation via automatic tipping panels.",
        explanation: "Frames the product as high ROI value-generator, rather than static SaaS administrative bills."
      }
    ],
    investorReadinessScore: 78,
    investorConcerns: [
      "Founder lack of proprietary coding architecture (might rely on generic structures initially)",
      "Vulnerability to hyper-local churn if regional economic factors slow down home luxury improvements"
    ],
    fundingReadiness: "Pre-seed ready. High validation margins. Once Sarah demonstrates $1,000 in monthly platform transactions with her pilot group, she holds perfect metrics for an angel round."
  },
  createdAt: "2026-06-10T08:35:44Z"
};
