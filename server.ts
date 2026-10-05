import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { conductMarketResearch } from "./serpapiService";
import { buildVentureReportFromMarketResearch } from "./reportSynthesizer";

dotenv.config();

const isSerpApiConfigured = Boolean(process.env.SERPAPI_API_KEY && process.env.SERPAPI_API_KEY.trim().length > 0);
console.log(`[Startup] Environment check - GEMINI_API_KEY configured: ${Boolean(process.env.GEMINI_API_KEY)}, SERPAPI_API_KEY configured: ${isSerpApiConfigured}`);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client safely wrapped to prevent startup crashes if API Key is not set or pending
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please add it to your secrets in Settings > Secrets.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Resilient content generator that retries transient 503/429 spikes across healthy models
async function generateContentWithRetry(ai: GoogleGenAI, params: any, maxRetries = 1) {
  const models = [params.model, "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastError: any;
  for (const m of models) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await ai.models.generateContent({
          ...params,
          model: m
        });
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        const isTransient = msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand") || msg.includes("429");
        if (isTransient && attempt < maxRetries) {
          console.warn(`[Gemini] Model ${m} transient spike (${msg.slice(0, 60)}). Retrying in ${(attempt + 1) * 1000}ms...`);
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        break; // Advance to next model candidate
      }
    }
  }
  throw lastError;
}

// REST route to analyze startup ideas with Gemini-3.8-flash and SerpApi Market Intelligence
app.post("/api/analyze-idea", async (req, res) => {
  try {
    const { profile, startup } = req.body;

    if (!profile || !startup) {
      res.status(400).json({ error: "Missing founder profile or startup details" });
      return;
    }

    const hasSerpApiKey = Boolean(process.env.SERPAPI_API_KEY && process.env.SERPAPI_API_KEY.trim().length > 0);
    console.log(`[Server] POST /api/analyze-idea received - SERPAPI_API_KEY configured: ${hasSerpApiKey}`);

    // 1. Conduct Server-side SerpApi Market Research
    const marketResearch = await conductMarketResearch(profile, startup);

    let researchContext = "";
    if (marketResearch.enabled) {
      const cleanSnippet = (s?: string) => (s || "").replace(/["\\]/g, "'").replace(/\s+/g, " ").trim();
      researchContext = `
      REAL-WORLD MARKET RESEARCH FROM SERPAPI (LIVE WEB EVIDENCE):
      - Discovered Incumbent Competitors & Search Results:
${(marketResearch.competitors || []).map(c => `        * ${c.name} (${c.domain || "web"}): '${cleanSnippet(c.snippet) || "Active market player"}'`).join("\n") || "        None detected"}

      - Recent Industry Developments & News:
${(marketResearch.news || []).map(n => `        * ${n.title} (Source: ${n.source}${n.date ? `, Date: ${n.date}` : ""}): '${cleanSnippet(n.snippet)}'`).join("\n") || "        No breaking industry headlines"}

      - Market Signals & Customer Pain Points:
${(marketResearch.keySignals || []).map(s => `        * ${cleanSnippet(s)}`).join("\n") || "        Standard category dynamics"}
${(marketResearch.pricingSignals && marketResearch.pricingSignals.length > 0) ? `
      - Pricing & Product Benchmarks:
${marketResearch.pricingSignals.map(p => `        * ${p.title}: ${p.price || "Custom"} (Merchant: ${p.merchant || "Online"})`).join("\n")}
` : ""}
${(marketResearch.localCompetitors && marketResearch.localCompetitors.length > 0) ? `
      - Local/Geographic Competitors:
${marketResearch.localCompetitors.map(l => `        * ${l.name} - ${l.address || "Local"} (Rating: ${l.rating || "N/A"}, Reviews: ${l.reviews || 0})`).join("\n")}
` : ""}

      CRITICAL GROUNDING GUIDELINES:
      - Treat retrieved search evidence as real-world evidence, not absolute truth.
      - Do NOT invent fictional competitors. Anchor your competitor analysis and competitor gaps around the real companies discovered above whenever relevant.
      - Do NOT invent pricing.
      - Do NOT invent news or claim a source said something it did not say.
      - Clearly distinguish factual evidence from strategic inference.
      - If evidence is insufficient for any dimension, state so realistically.
      - Do not manufacture statistically rigorous TAM/SAM/SOM figures from search snippets; provide rational estimates based on market sizing logic.
      `;
    }

    const prompt = `
      You are a world-class senior startup incubator partner (like Y Combinator), advisor, and developer.
      Analyze the following Founder Profile and Startup Idea to generate a comprehensive, highly structured report.
${researchContext}

      FOUNDER PROFILE:
      - Name: ${profile.name || "Anonymous"}
      - Age: ${profile.age || "Unspecified"}
      - Country: ${profile.country || "Unspecified"}
      - Education: ${profile.education || "Unspecified"}
      - Skills: ${(profile.skills || []).join(", ") || "None specified"}
      - Experience: ${profile.experience || "Unspecified"}
      - Previous Projects: ${profile.previousProjects || "Unspecified"}
      - Budget: ${profile.budget || "Unspecified"}
      - Time Available/Week: ${profile.timeAvailable || "Unspecified"}
      - Interests: ${(profile.interests || []).join(", ") || "None specified"}
      - Industry Experience: ${profile.industryExperience || "Unspecified"}

      STARTUP DETAILS:
      - Startup Name: ${startup.startupName || "Unspecified"}
      - Startup Idea Proposal: ${startup.idea || "Unspecified"}
      - Target Users: ${startup.targetUsers || "Unspecified"}
      - Revenue Model: ${startup.revenueModel || "Unspecified"}
      - Problem Being Solved: ${startup.problemSolved || "Unspecified"}

      Provide a strict, clean JSON object response matching the requested schema. No Markdown wrapper like \`\`\`json (only raw JSON).
      JSON Structure:
      {
        "archetype": "string (e.g. Builder Founder, Product Founder, Technical Founder, Marketing Founder, Sales Founder, Visionary Founder)",
        "strengths": ["array of founder strengths"],
        "weaknesses": ["array of founder weaknesses"],
        "founderScore": 75, // integer 0-100 indicating founder readiness
        "startupScore": 82, // integer 0-100 indicating idea viability
        "fitScore": 78, // integer 0-100 indicating founder-idea fit
        "readinessScore": 80, // integer 0-100 execution readiness
        "swot": {
          "strengths": ["string"],
          "weaknesses": ["string"],
          "opportunities": ["string"],
          "threats": ["string"]
        },
        "validation": {
          "problemValidation": "Detailed validation analysis",
          "marketOpportunity": "Detailed market opportunity",
          "marketSize": "TAM, SAM, SOM estimates",
          "marketDemand": "Analysis of existing demand indices",
          "competitiveLandscape": "Overview of landscape",
          "monetizationPotential": "Quality of the monetization strategy",
          "recommendations": ["Recommendation strings"]
        },
        "competitors": [
          {
            "name": "string",
            "strengths": "string",
            "weaknesses": "string",
            "marketGap": "string",
            "differentiationOpportunity": "string"
          }
        ],
        "fitAnalysis": {
          "whySuitable": ["string"],
          "whyUnsuitable": ["string"],
          "missingExperience": ["string"],
          "missingSkills": ["string"],
          "reasoning": "Detailed comparative analysis"
        },
        "improvements": {
          "improvedVersion": "string",
          "nicheVersion": "string",
          "premiumVersion": "string",
          "aiEnhancedVersion": "string",
          "easierToLaunchVersion": "string",
          "explanations": {
            "improved": "string",
            "niche": "string",
            "premium": "string",
            "ai": "string",
            "easy": "string"
          }
        },
        "alternativeIdeas": [
          {
            "title": "Alternative Idea 1",
            "description": "string",
            "marketOpportunity": "string",
            "difficulty": "Easy/Medium/Hard",
            "fitScore": 85,
            "revenuePotential": "string"
          } // exactly 5 alternative ideas
        ],
        "skillGaps": {
          "skillGapScore": 70, // 0-100
          "criticalMissingSkills": ["string"],
          "recommendedLearningPriority": {
            "learnImmediately": ["string"],
            "learnSoon": ["string"],
            "learnLater": ["string"]
          }
        },
        "learningResources": [
          {
            "skill": "string",
            "free": [
              { "name": "Free Resource Name (e.g. YouTube, freeCodeCamp, docs)", "url": "string url", "description": "brief review" }
            ],
            "paid": [
              { "name": "Paid Resource Name (e.g. Coursera, Udemy)", "url": "string url", "description": "brief review" }
            ],
            "estLearningTime": "e.g. 10 hours",
            "difficulty": "Easy/Medium/Hard",
            "order": 1
          }
        ],
        "roadmap30_60_90": {
          "plan30Day": ["Action item strings for first thirty days"],
          "plan60Day": ["Action item strings for month two"],
          "plan90Day": ["Action item strings for month three"],
          "buildVsLearnAdvice": "Strategic advice regarding Build VS Learn constraint"
        },
        "mvpPlan": {
          "features": ["string"],
          "userFlows": ["string"],
          "dbSchema": "A conceptual Firestore and custom SQL database layout structured clearly",
          "apiStructure": "Expected REST endpoints diagrammed and listed",
          "folderStructure": "Structured list of files/directories for client and server module layout",
          "techArchitecture": "List of technologies and deployment flow recommendation",
          "recommendations": ["Core deployment checklist items"]
        },
        "executionRoadmap": {
          "week1": ["Validation tasks"],
          "week2": ["Landing page / MVP setup"],
          "week3": ["Customer feedback / test marketing"],
          "week4": ["Initial launch / validation benchmark"],
          "month1": ["Validation + Launch goals"],
          "month2": ["Initial scaling + User acquisitions"],
          "month3": ["Revenue capture + optimization"]
        },
        "revenuePlan": {
          "first100": "Strategy to generate first $100",
          "first1000": "Strategy to scale to first $1,000",
          "first10000": "Strategy to gain first $10,000",
          "first100000": "Strategy to reach first $100,000"
        },
        "aiInvestorMode": {
          "questionsWithAnswers": [
            { "question": "Why now?", "sampleAnswer": "Recommended expert dynamic answer", "explanation": "Strategic context explanation" },
            { "question": "Why this market?", "sampleAnswer": "Recommended answer", "explanation": "Strategic context" },
            { "question": "Why you?", "sampleAnswer": "Recommended answer", "explanation": "Strategic context" },
            { "question": "What is your moat?", "sampleAnswer": "Recommended answer", "explanation": "Strategic context" },
            { "question": "Why will users pay?", "sampleAnswer": "Recommended answer", "explanation": "Strategic context" }
          ],
          "investorReadinessScore": 75,
          "investorConcerns": ["Concern 1", "Concern 2"],
          "fundingReadiness": "Current evaluation of venture funding readiness"
        }
      }
    `;

    let jsonReport: any = null;
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);

    if (hasGeminiKey) {
      try {
        const ai = getGeminiClient();
        const response = await generateContentWithRetry(ai, {
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.1, // low temperature for deterministic JSON output
            maxOutputTokens: 8192
          }
        });

        const text = response.text || "{}";
        try {
          jsonReport = JSON.parse(text);
        } catch (e) {
          console.warn("Gemini JSON parse failed on raw text, attempting repair...", e);
          let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/\s*```/g, "").trim();
          cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");
          try {
            jsonReport = JSON.parse(cleaned);
          } catch (err2) {
            let openBraces = (cleaned.match(/\{/g) || []).length;
            let closeBraces = (cleaned.match(/\}/g) || []).length;
            while (openBraces > closeBraces) {
              cleaned += "}";
              closeBraces++;
            }
            jsonReport = JSON.parse(cleaned);
          }
        }
      } catch (geminiErr: any) {
        console.warn("[Server] Gemini model call failed, falling back to expert venture synthesizer grounded in SerpApi:", geminiErr?.message || geminiErr);
      }
    } else {
      console.log("[Server] GEMINI_API_KEY not configured. Generating venture intelligence report grounded directly in SerpApi live evidence.");
    }

    // Resilient fallback: build complete report from SerpApi market research evidence
    if (!jsonReport || typeof jsonReport !== "object") {
      jsonReport = buildVentureReportFromMarketResearch(profile, startup, marketResearch);
    }

    // Attach ground truth market research evidence to report
    if (jsonReport && typeof jsonReport === "object") {
      jsonReport.marketResearch = marketResearch;
    }

    res.json({ report: jsonReport });
  } catch (err: any) {
    console.error("API Error in /api/analyze-idea:", err);
    res.status(500).json({ error: err.message || "Failed to analyze startup idea" });
  }
});

// Contextual AI Mentor Chat endpoint
app.post("/api/chat-mentor", async (req, res) => {
  try {
    const { messages, profile, startup, report } = req.body;

    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
    if (hasGeminiKey) {
      const ai = getGeminiClient();

      const systemPrompt = `
        You are an expert Y Combinator partner, SaaS architect, startup strategist, and AI co-founder.
        You are mentoring the following founder closely in a real-time chat interface. Always be encouraging, direct, highly tactical, realistic, and expert. Avoid fluff. Give specific templates, links, examples, or strategies.

        Founder Profile:
        - Name: ${profile?.name || "Anonymous"}
        - Skills: ${(profile?.skills || []).join(", ") || "None listed"}
        - Experience: ${profile?.experience || "None listed"}
        - Previous Projects: ${profile?.previousProjects || "None listed"}

        Startup Venture:
        - Name: ${startup?.startupName || "Unspecified"}
        - Idea: ${startup?.idea || "Unspecified"}
        - Revenue Model: ${startup?.revenueModel || "Unspecified"}

        Current Report Scores:
        - Founder-Idea Fit: ${report?.fitScore || "Not calculated yet"}
        - Viability Score: ${report?.startupScore || "Not calculated yet"}
        - Ready Score: ${report?.readinessScore || "Not calculated yet"}

        Converse as a YC partner holding high standards, yet highly helpful. Keep replies scannable, clear, and actionable.
      `;

      // Map message history to Gemini contents structure
      const contents = messages.map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction: systemPrompt
        }
      });

      res.json({ message: { role: "mentor", text: response.text } });
    } else {
      const lastMsg = messages[messages.length - 1]?.text || "";
      const reply = `As a YC partner advising on **${startup?.startupName || "your venture"}**: Your top priority right now is validating user demand for *"${startup?.problemSolved || "your core value proposition"}"*. Focus on speaking with 10 potential users this week, tracking where current alternatives fall short, and shipping a lightweight prototype within 14 days. What specific distribution channel are you testing first?`;
      res.json({ message: { role: "mentor", text: reply } });
    }
  } catch (err: any) {
    console.error("Mentor chat error:", err);
    res.status(500).json({ error: err.message || "Failed to contact mentor" });
  }
});

// Configure Vite integration for React frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FounderOS Express server started on port ${PORT}`);
  });
}

startServer();
