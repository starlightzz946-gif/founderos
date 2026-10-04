import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

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

// REST route to analyze startup ideas with Gemini-3.5-flash
app.post("/api/analyze-idea", async (req, res) => {
  try {
    const { profile, startup } = req.body;

    if (!profile || !startup) {
      res.status(400).json({ error: "Missing founder profile or startup details" });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `
      You are a world-class senior startup incubator partner (like Y Combinator), advisor, and developer.
      Analyze the following Founder Profile and Startup Idea to generate a comprehensive, highly structured report.

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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // low temperature for highly compliant JSON structure
      }
    });

    const text = response.text || "{}";
    let jsonReport;
    try {
      jsonReport = JSON.parse(text);
    } catch (e) {
      console.warn("Gemini didn't return strict clean JSON, cleaning text...", e);
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      jsonReport = JSON.parse(cleaned);
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ message: { role: "mentor", text: response.text } });
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
